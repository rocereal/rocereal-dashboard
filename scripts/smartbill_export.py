#!/usr/bin/env python3
"""
SmartBill sync via internal web API.
Playwright is used ONLY for login + company/branch selection (to get session cookies).
All invoice data is fetched via direct HTTP POST — no browser navigation needed.
"""

import json
import os
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path

import psycopg2
import requests
from psycopg2.extras import execute_values
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# ── Config ────────────────────────────────────────────────────────────────────
EMAIL    = os.environ.get("SMARTBILL_EMAIL", "contact@rocereal.ro")
PASSWORD = os.environ.get("SMARTBILL_PASSWORD", "")
DB_URL   = os.environ.get("DATABASE_URL_UNPOOLED", os.environ.get("DATABASE_URL", ""))
HEADLESS = os.environ.get("HEADLESS", "true").lower() != "false"
SCREENSHOT_DIR = Path("screenshots")

BASE_URL  = "https://cloud.smartbill.ro"
AJAX_URL  = f"{BASE_URL}/raport/facturi/ajax/"
DATE_FROM = "01/01/2020"                          # acoperim tot istoricul
DATE_TO   = datetime.now().strftime("%d/%m/%Y")   # pana azi
PAGE_SIZE = 5000                                  # max per request


# ── Helpers ───────────────────────────────────────────────────────────────────
def screenshot(page, name: str):
    SCREENSHOT_DIR.mkdir(exist_ok=True)
    page.screenshot(path=str(SCREENSHOT_DIR / f"{name}.png"))
    print(f"  📸 {name}.png")


def parse_date(value: str) -> datetime | None:
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d.%m.%Y"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            continue
    return None


def parse_invoice_number(raw: str):
    """'SSB476' → ('SSB', 476, 'SSB-476')"""
    m = re.match(r"^([A-Z]+)(\d+)$", raw.strip())
    if m:
        series, number = m.group(1), int(m.group(2))
        return series, number, f"{series}-{number}"
    return None, None, raw.strip()


# ── Step 1: Auth via Playwright ───────────────────────────────────────────────
def get_session_cookies() -> dict:
    """
    Performs login + company + branch selection via Playwright.
    Returns the session cookies needed for direct API calls.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        context = browser.new_context()
        page    = context.new_page()
        page.set_default_timeout(30_000)

        # 1. Load login page
        print("→ Login SmartBill...")
        page.goto(f"{BASE_URL}/auth/login/")
        page.wait_for_load_state("networkidle")

        # Accept cookie popup
        try:
            page.get_by_text("Accept toate cookie-urile", exact=False).wait_for(timeout=5_000)
            page.get_by_text("Accept toate cookie-urile", exact=False).click()
            page.wait_for_load_state("networkidle")
            print("  ✓ Cookie popup acceptat")
        except PlaywrightTimeout:
            pass

        # Fill credentials and login
        page.locator('input[placeholder="Email utilizator"]').fill(EMAIL)
        page.locator('input[placeholder="Parola"]').fill(PASSWORD)
        page.get_by_text("Intra in cont", exact=True).click()
        page.wait_for_load_state("networkidle")
        screenshot(page, "01_after_login")
        print("  ✓ Credentiale trimise")

        # 2. Select company: click by CIF (unique identifier, no diacritic issues)
        print("→ Selectare companie RO CEREAL SA...")
        try:
            page.get_by_text("Alege compania", exact=False).wait_for(timeout=10_000)
            page.wait_for_timeout(800)
            screenshot(page, "02_company_modal")
            # CIF-ul RO18533200 apare doar in randul RO CEREAL SA
            page.get_by_text("RO18533200", exact=False).click(timeout=5_000)
            page.wait_for_load_state("networkidle")
            screenshot(page, "03_company_selected")
            print("  ✓ RO CEREAL SA selectata (via CIF)")
        except PlaywrightTimeout:
            screenshot(page, "02_no_company_modal")
            print("  (modal companie nu a aparut — posibil deja selectata)")

        # 3. Select branch: SUCURSALA SIBIU
        print("→ Selectare sediu SUCURSALA SIBIU...")
        try:
            page.get_by_text("Alege sediul", exact=False).wait_for(timeout=10_000)
            page.wait_for_timeout(800)
            screenshot(page, "04_branch_modal")
            # "Sediu secundar" este subtitlul unic al SUCURSALA SIBIU
            page.get_by_text("Sediu secundar", exact=False).click(timeout=5_000)
            page.wait_for_load_state("networkidle")
            screenshot(page, "05_branch_selected")
            print("  ✓ SUCURSALA SIBIU selectata (via 'Sediu secundar')")
        except PlaywrightTimeout:
            screenshot(page, "04_no_branch_modal")
            print("  (modal sediu nu a aparut — posibil deja in cont)")

        # 4. Dismiss security/info popups
        for popup_text in ["Activeaza mai tarziu", "Am inteles", "Am înțeles", "OK"]:
            try:
                btn = page.get_by_text(popup_text, exact=True).first
                btn.wait_for(timeout=3_000)
                btn.click()
                page.wait_for_load_state("networkidle")
                print(f"  ✓ Popup inchis: '{popup_text}'")
                break
            except PlaywrightTimeout:
                continue

        screenshot(page, "06_dashboard")

        # Extract and return cookies
        cookies = {c["name"]: c["value"] for c in context.cookies()}
        sid = cookies.get("sessionid", "N/A")[:8]
        print(f"  ✓ Sesiune obtinuta (sessionid: {sid}...)")
        browser.close()

    return cookies


# ── Step 2: Fetch invoices via direct HTTP ────────────────────────────────────
def build_payload(date_from: str, date_to: str, start: int = 0) -> dict:
    payload = {
        "sEcho":           "1",
        "iColumns":        "15",
        "sColumns":        "",
        "iDisplayStart":   str(start),
        "iDisplayLength":  str(PAGE_SIZE),
        "sSearch":         json.dumps({"from": date_from, "to": date_to, "currency": "0"}),
        "bRegex":          "",
        "iSortingCols":    "0",
        "last_documents_ids": "[]",
        "aaSorting":       "[]",
    }
    for i in range(15):
        payload[f"mDataProp_{i}"]  = str(i)
        payload[f"sSearch_{i}"]    = ""
        payload[f"bRegex_{i}"]     = "false"
        payload[f"bSearchable_{i}"] = "true"
        payload[f"bSortable_{i}"]  = "true" if 2 <= i <= 9 else "false"
    return payload


def fetch_all_invoices(cookies: dict) -> list:
    """Calls /raport/facturi/ajax/ directly with session cookies."""
    sess = requests.Session()

    # Only the essential cookies for server-side auth + company/branch context
    for name in ["sessionid", "csrftoken", "dsc", "srvid", "sip", "sblsd"]:
        if name in cookies:
            sess.cookies.set(name, cookies[name], domain="cloud.smartbill.ro")

    headers = {
        "accept":           "application/json, text/javascript, */*; q=0.01",
        "content-type":     "application/x-www-form-urlencoded; charset=UTF-8",
        "origin":           BASE_URL,
        "referer":          f"{BASE_URL}/",
        "x-csrftoken":      cookies.get("csrftoken", ""),
        "x-requested-with": "XMLHttpRequest",
        "user-agent":       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }

    all_rows = []
    start    = 0

    while True:
        resp = sess.post(AJAX_URL, headers=headers, data=build_payload(DATE_FROM, DATE_TO, start), timeout=30)
        resp.raise_for_status()
        data  = resp.json()
        batch = data.get("aaData", [])
        total = int(data.get("iTotalRecords", 0))

        all_rows.extend(batch)
        print(f"  Fetch {start}–{start + len(batch)} din {total}")

        start += len(batch)
        if start >= total or not batch:
            break

    print(f"  ✓ Total randuri: {len(all_rows)}")
    return all_rows


# ── Step 3: Parse + upsert into DB ───────────────────────────────────────────
def import_to_db(rows: list):
    """
    aaData column mapping (from network investigation):
      [2]  = invoice number (e.g. "SSB476")
      [3]  = client name
      [4]  = issue date  DD/MM/YYYY
      [5]  = due date    DD/MM/YYYY
      [6]  = net (without VAT)
      [7]  = VAT
      [8]  = total
      [9]  = currency
      [11] = JSON string: {"is_paid":"y"/"n", "is_annulled":bool, ...}
    """
    records = []
    for row in rows:
        try:
            invoice_raw = str(row[2]).strip()
            series, number, invoice_key = parse_invoice_number(invoice_raw)
            if number is None:
                print(f"  ⚠ Skip: {invoice_raw!r}")
                continue

            client    = str(row[3]).strip() if row[3] else ""
            issued_at = parse_date(str(row[4])) or datetime.now()
            due_date  = parse_date(str(row[5])) if row[5] else None
            net   = float(str(row[6]).replace(",", ".") or 0)
            tax   = float(str(row[7]).replace(",", ".") or 0)
            total = float(str(row[8]).replace(",", ".") or 0)

            status_data: dict = {}
            try:
                raw11 = row[11]
                status_data = json.loads(raw11) if isinstance(raw11, str) else (raw11 or {})
            except Exception:
                pass

            is_paid     = status_data.get("is_paid", "n") == "y"
            is_annulled = bool(status_data.get("is_annulled", False))

            records.append({
                "invoice_key": invoice_key,
                "series":      series or "",
                "number":      number,
                "client":      client,
                "total":       total,
                "net":         net,
                "tax":         tax,
                "issued_at":   issued_at,
                "due_date":    due_date,
                "paid":        is_paid,
                "annulled":    is_annulled,
            })
        except Exception as e:
            label = row[2] if len(row) > 2 else "?"
            print(f"  ⚠ Eroare la {label}: {e}")

    print(f"  Randuri parsate: {len(records)}")
    if not records:
        print("  ⚠ Nicio factura valida!")
        return

    conn = psycopg2.connect(DB_URL)
    cur  = conn.cursor()

    upsert_sql = """
        INSERT INTO "SmartbillInvoice" (
            "id", "invoiceKey", "series", "number", "client",
            "totalAmount", "netAmount", "taxAmount",
            "paidAmount", "unpaidAmount", "paid",
            "issuedAt", "dueDate", "syncedAt"
        ) VALUES %s
        ON CONFLICT ("invoiceKey") DO UPDATE SET
            "client"       = EXCLUDED."client",
            "totalAmount"  = EXCLUDED."totalAmount",
            "netAmount"    = EXCLUDED."netAmount",
            "taxAmount"    = EXCLUDED."taxAmount",
            "issuedAt"     = EXCLUDED."issuedAt",
            "dueDate"      = EXCLUDED."dueDate",
            "paid"         = EXCLUDED."paid",
            "paidAmount"   = CASE WHEN EXCLUDED."paid" THEN EXCLUDED."totalAmount" ELSE 0 END,
            "unpaidAmount" = CASE WHEN EXCLUDED."paid" THEN 0 ELSE EXCLUDED."totalAmount" END,
            "syncedAt"     = EXCLUDED."syncedAt"
    """

    data = [
        (
            str(uuid.uuid4()),
            r["invoice_key"],
            r["series"],
            r["number"],
            r["client"],
            r["total"],
            r["net"],
            r["tax"],
            r["total"] if r["paid"] else 0.0,
            0.0 if r["paid"] else r["total"],
            r["paid"],
            r["issued_at"],
            r["due_date"],
            datetime.now(),
        )
        for r in records
    ]

    execute_values(cur, upsert_sql, data, template="(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", page_size=200)
    conn.commit()

    cur.execute('SELECT COUNT(*) FROM "SmartbillInvoice"')
    total_db = cur.fetchone()[0]
    cur.close()
    conn.close()
    print(f"  ✓ Importat {len(records)} facturi. Total in DB: {total_db}")


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if not PASSWORD:
        print("ERROR: SMARTBILL_PASSWORD not set")
        sys.exit(1)
    if not DB_URL:
        print("ERROR: DATABASE_URL not set")
        sys.exit(1)

    print("=== SmartBill Sync ===")

    print("\n[1/3] Autentificare (Playwright)...")
    cookies = get_session_cookies()

    print(f"\n[2/3] Fetch facturi {DATE_FROM} → {DATE_TO} (HTTP direct)...")
    invoices = fetch_all_invoices(cookies)

    print("\n[3/3] Import in DB...")
    import_to_db(invoices)

    print("\n✅ Gata!")
