#!/usr/bin/env python3
"""
SmartBill sync via internal web API.
Playwright is used ONLY for login + company/branch selection (to get session cookies).
All invoice data is fetched via direct HTTP POST — no browser navigation needed.

Supports multi-branch sync: each branch gets its own Playwright session so that
series belonging to different sedii (e.g. M-SSB on Sediu principal, SSB on
Sediu secundar) all receive correct issue dates.
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

# Branch subtitle to sync — must match the subtitle text in the SmartBill "Alege sediul" modal.
# "Sediu secundar" = SUCURSALA SIBIU (all series: SSB, M-SSB, etc.)
# Override via env: SMARTBILL_BRANCHES="Sediu secundar"
_branches_raw = os.environ.get("SMARTBILL_BRANCHES", "Sediu secundar")
BRANCHES: list[str] = [b.strip() for b in _branches_raw.split(",") if b.strip()]

BASE_URL  = "https://cloud.smartbill.ro"
AJAX_URL         = f"{BASE_URL}/raport/facturi/ajax/"
CLIENTS_AJAX_URL = f"{BASE_URL}/nomenclator/clienti/ajax/"
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
    """
    Parses an invoice display string into (series, number, invoiceKey).
    Series contains only letters and hyphens (no digits); number is the trailing digits.
      'SSB476'   → ('SSB',   476, 'SSB-476')
      'M-SSB476' → ('M-SSB', 476, 'M-SSB-476')
    """
    m = re.match(r"^([A-Z][A-Z\-]*)(\d+)$", raw.strip())
    if m:
        series, number = m.group(1), int(m.group(2))
        series = series.rstrip("-")
        return series, number, f"{series}-{number}"
    return None, None, raw.strip()


# ── Step 1: Auth via Playwright ───────────────────────────────────────────────
def get_session_cookies(branch_subtitle: str) -> dict:
    """
    Performs login + company + branch selection via Playwright.
    branch_subtitle: the subtitle text of the branch shown in the "Alege sediul" modal,
                     e.g. "Sediu principal" or "Sediu secundar".
    Returns the session cookies needed for direct API calls.
    """
    slug = branch_subtitle.replace(" ", "_")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        context = browser.new_context()
        page    = context.new_page()
        page.set_default_timeout(30_000)

        # 1. Load login page
        print(f"  → Login SmartBill ({branch_subtitle})...")
        response = page.goto(f"{BASE_URL}/auth/login/")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2_000)  # allow page JS to settle
        screenshot(page, f"{slug}_01_login_page")

        # Check for server errors (502, 503, etc.)
        if response and response.status >= 500:
            raise RuntimeError(f"SmartBill returned HTTP {response.status} — serverul este down. Retry maine.")
        # Also check page title for nginx error pages
        title = page.title()
        if "502" in title or "503" in title or "Bad Gateway" in title or "nginx" in title.lower():
            raise RuntimeError(f"SmartBill inaccesibil (pagina: '{title}'). Retry maine.")

        # Accept cookie popup and wait for it to disappear
        try:
            cookie_btn = page.get_by_text("Accept toate cookie-urile", exact=False)
            cookie_btn.wait_for(timeout=8_000)
            cookie_btn.click()
            cookie_btn.wait_for(state="hidden", timeout=8_000)
            page.wait_for_timeout(500)
            print("    ✓ Cookie popup acceptat")
        except PlaywrightTimeout:
            print("    (cookie popup nu a aparut sau deja inchis)")

        screenshot(page, f"{slug}_02_before_login")

        # Fill credentials
        email_input = page.locator('input[placeholder="Email utilizator"]')
        email_input.wait_for(state="visible", timeout=15_000)
        email_input.fill(EMAIL)
        page.locator('input[placeholder="Parola"]').fill(PASSWORD)
        page.get_by_text("Intra in cont", exact=True).click()
        page.wait_for_load_state("networkidle")
        screenshot(page, f"{slug}_03_after_login")
        print("    ✓ Credentiale trimise")

        # 2. Select company: click by CIF (unique identifier, no diacritic issues)
        print("    → Selectare companie RO CEREAL SA...")
        try:
            page.get_by_text("Alege compania", exact=False).wait_for(timeout=10_000)
            page.wait_for_timeout(800)
            screenshot(page, f"{slug}_04_company_modal")
            page.get_by_text("RO18533200", exact=False).click(timeout=5_000)
            page.wait_for_load_state("networkidle")
            screenshot(page, f"{slug}_05_company_selected")
            print("    ✓ RO CEREAL SA selectata (via CIF)")
        except PlaywrightTimeout:
            screenshot(page, f"{slug}_04_no_company_modal")
            print("    (modal companie nu a aparut — posibil deja selectata)")

        # 3. Select branch by subtitle text
        print(f"    → Selectare sediu: {branch_subtitle!r}...")
        try:
            page.get_by_text("Alege sediul", exact=False).wait_for(timeout=10_000)
            page.wait_for_timeout(800)
            screenshot(page, f"{slug}_06_branch_modal")
            page.get_by_text(branch_subtitle, exact=False).click(timeout=5_000)
            page.wait_for_load_state("networkidle")
            screenshot(page, f"{slug}_07_branch_selected")
            print(f"    ✓ Sediu selectat: {branch_subtitle!r}")
        except PlaywrightTimeout:
            screenshot(page, f"{slug}_06_no_branch_modal")
            print(f"    (modal sediu nu a aparut sau {branch_subtitle!r} nu gasit — continuam)")

        # 4. Dismiss security/info popups
        for popup_text in ["Activeaza mai tarziu", "Am inteles", "Am înțeles", "OK"]:
            try:
                btn = page.get_by_text(popup_text, exact=True).first
                btn.wait_for(timeout=3_000)
                btn.click()
                page.wait_for_load_state("networkidle")
                print(f"    ✓ Popup inchis: '{popup_text}'")
                break
            except PlaywrightTimeout:
                continue

        screenshot(page, f"{slug}_08_dashboard")

        # Extract and return cookies
        cookies = {c["name"]: c["value"] for c in context.cookies()}
        sid = cookies.get("sessionid", "N/A")[:8]
        print(f"    ✓ Sesiune obtinuta (sessionid: {sid}...)")
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


# ── Step 2b: Fetch clients ────────────────────────────────────────────────────
def build_clients_payload(start: int = 0) -> dict:
    payload = {
        "sEcho": "1", "iColumns": "8", "sColumns": "",
        "iDisplayStart": str(start), "iDisplayLength": str(PAGE_SIZE),
        "sSearch": "", "bRegex": "false",
        "iSortingCols": "0", "displayCodes": "true",
    }
    for i in range(8):
        payload[f"mDataProp_{i}"] = str(i)
        payload[f"sSearch_{i}"] = ""
        payload[f"bRegex_{i}"] = "false"
        payload[f"bSearchable_{i}"] = "true"
        payload[f"bSortable_{i}"] = "false" if i in (0, 7) else "true"
    return payload


def fetch_all_clients(cookies: dict) -> list:
    sess = requests.Session()
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
    start = 0
    while True:
        resp = sess.post(CLIENTS_AJAX_URL, headers=headers, data=build_clients_payload(start), timeout=30)
        resp.raise_for_status()
        data  = resp.json()
        batch = data.get("aaData", [])
        total = int(data.get("iTotalRecords", 0))
        all_rows.extend(batch)
        print(f"  Clienti fetch {start}–{start + len(batch)} din {total}")
        start += len(batch)
        if start >= total or not batch:
            break

    print(f"  ✓ Total clienti: {len(all_rows)}")
    return all_rows


def import_clients_to_db(rows: list):
    """
    aaData column mapping for /nomenclator/clienti/ajax/:
      [1] = denumire client
      [2] = CIF
      [3] = cod client
      [4] = telefon
      [5] = email
      [6] = persoana contact
    """
    records = []
    for row in rows:
        try:
            name = str(row[1]).strip() if row[1] else ""
            if not name:
                continue
            records.append({
                "name":    name,
                "cif":     str(row[2]).strip() if row[2] else "",
                "code":    str(row[3]).strip() if row[3] else "",
                "phone":   str(row[4]).strip() if row[4] else "",
                "email":   str(row[5]).strip() if row[5] else "",
                "contact": str(row[6]).strip() if row[6] else "",
            })
        except Exception as e:
            print(f"  ⚠ Eroare client row: {e}")

    # Deduplicate by name — keep last occurrence
    deduped: dict[str, dict] = {}
    for r in records:
        deduped[r["name"]] = r
    records = list(deduped.values())

    print(f"  Clienti parsati (dupa deduplicare): {len(records)}")
    if not records:
        return

    conn = psycopg2.connect(DB_URL)
    cur  = conn.cursor()

    upsert_sql = """
        INSERT INTO "SmartbillClient" ("id", "name", "cif", "clientCode", "phone", "email", "contact")
        VALUES %s
        ON CONFLICT ("name") DO UPDATE SET
            "cif"        = EXCLUDED."cif",
            "clientCode" = EXCLUDED."clientCode",
            "phone"      = EXCLUDED."phone",
            "email"      = EXCLUDED."email",
            "contact"    = EXCLUDED."contact"
    """
    data = [(str(uuid.uuid4()), r["name"], r["cif"], r["code"], r["phone"], r["email"], r["contact"]) for r in records]
    execute_values(cur, upsert_sql, data, template="(%s,%s,%s,%s,%s,%s,%s)", page_size=200)
    conn.commit()

    cur.execute('SELECT COUNT(*) FROM "SmartbillClient"')
    total_db = cur.fetchone()[0]
    cur.close()
    conn.close()
    print(f"  ✓ Importat {len(records)} clienti. Total in DB: {total_db}")


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

    # Dedup by invoice_key — last occurrence wins.
    # Needed because the same invoice can appear in multiple branch fetches.
    deduped: dict[str, dict] = {}
    for r in records:
        deduped[r["invoice_key"]] = r
    if len(deduped) < len(records):
        print(f"  (deduplicat: {len(records) - len(deduped)} duplicate eliminate)")
    records = list(deduped.values())

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
    print(f"Sucursale de sincronizat: {BRANCHES}")

    all_invoices: list = []
    all_clients: list  = []

    for idx, branch in enumerate(BRANCHES, 1):
        print(f"\n[Branch {idx}/{len(BRANCHES)}] {branch}")

        print(f"  [{idx}.1] Autentificare (Playwright)...")
        cookies = get_session_cookies(branch)

        print(f"  [{idx}.2] Fetch facturi {DATE_FROM} → {DATE_TO}...")
        invoices = fetch_all_invoices(cookies)
        all_invoices.extend(invoices)

        print(f"  [{idx}.3] Fetch clienti...")
        clients = fetch_all_clients(cookies)
        all_clients.extend(clients)

    print(f"\n[Final] Import in DB ({len(all_invoices)} facturi, {len(all_clients)} clienti)...")
    import_to_db(all_invoices)
    import_clients_to_db(all_clients)

    print("\n✅ Gata!")
