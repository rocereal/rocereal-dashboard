#!/usr/bin/env python3
"""
SmartBill automated export via Playwright.
Logs in, selects company + branch, goes to Facturi, exports CSV, imports to DB.
"""

import csv
import io
import os
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path

import psycopg2
from psycopg2.extras import Json, execute_values
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# ── Config ────────────────────────────────────────────────────────────────────
EMAIL    = os.environ.get("SMARTBILL_EMAIL", "contact@rocereal.ro")
PASSWORD = os.environ.get("SMARTBILL_PASSWORD", "")
DB_URL   = os.environ.get("DATABASE_URL_UNPOOLED", os.environ.get("DATABASE_URL", ""))
COMPANY  = "RO CEREAL"        # partial match — avoids diacritic issues
BRANCH   = "SUCURSALA SIBIU"
HEADLESS = os.environ.get("HEADLESS", "true").lower() != "false"
SCREENSHOT_DIR = Path("screenshots")

# ── Helpers ───────────────────────────────────────────────────────────────────
def screenshot(page, name: str):
    SCREENSHOT_DIR.mkdir(exist_ok=True)
    page.screenshot(path=str(SCREENSHOT_DIR / f"{name}.png"))
    print(f"  📸 screenshot: {name}.png")


def parse_ron(value: str) -> float:
    """Parse Romanian number format: '1.234,56' → 1234.56"""
    if not value or value.strip() in ("-", ""):
        return 0.0
    cleaned = value.strip().replace(".", "").replace(",", ".")
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def parse_date(value: str) -> datetime | None:
    """Parse DD/MM/YYYY or YYYY-MM-DD"""
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d.%m.%Y"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            continue
    return None


def parse_invoice_key(raw: str):
    """
    Convert SmartBill invoice string to (series, number, key).
    e.g. 'SSB/442' → ('SSB', 442, 'SSB-442')
         'SSB442'  → ('SSB', 442, 'SSB-442')
    """
    raw = raw.strip()
    m = re.match(r"^([A-Z ]+)[/ ]?(\d+)$", raw.replace(".", ""))
    if m:
        series = m.group(1).strip()
        number = int(m.group(2))
        return series, number, f"{series}-{number}"
    return None, None, raw


# ── Playwright export ─────────────────────────────────────────────────────────
def export_csv_from_smartbill() -> str:
    """Returns the raw CSV content as a string."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        page.set_default_timeout(30_000)

        # 1. Login
        print("→ Login SmartBill...")
        page.goto("https://cloud.smartbill.ro/auth/login/")
        page.wait_for_load_state("networkidle")
        screenshot(page, "01_homepage")

        # Email field — try multiple selectors
        email_selectors = [
            'input[type="email"]',
            'input[name="email"]',
            'input[name="username"]',
            'input[placeholder*="email" i]',
            'input[placeholder*="Email" i]',
        ]
        for sel in email_selectors:
            if page.locator(sel).count() > 0:
                page.locator(sel).first.fill(EMAIL)
                print(f"  email selector: {sel}")
                break

        # Password field
        pass_selectors = [
            'input[type="password"]',
            'input[name="password"]',
            'input[name="parola"]',
            'input[placeholder*="parol" i]',
        ]
        for sel in pass_selectors:
            if page.locator(sel).count() > 0:
                page.locator(sel).first.fill(PASSWORD)
                print(f"  password selector: {sel}")
                break

        # Submit button
        submit_selectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:has-text("Intra")',
            'button:has-text("Intră")',
            'button:has-text("Login")',
            'button:has-text("Conectare")',
            'button:has-text("Autentificare")',
        ]
        for sel in submit_selectors:
            if page.locator(sel).count() > 0:
                page.locator(sel).first.click()
                print(f"  submit selector: {sel}")
                break

        page.wait_for_load_state("networkidle")
        screenshot(page, "02_after_login")

        # 2. Select company
        print(f"→ Selectare companie: {COMPANY}...")
        try:
            page.get_by_text(COMPANY, exact=False).first.click()
            page.wait_for_load_state("networkidle")
            screenshot(page, "03_company_selected")
        except PlaywrightTimeout:
            print("  (nu a aparut selectia de companie — posibil deja selectata)")

        # 3. Select branch
        print(f"→ Selectare sediu: {BRANCH}...")
        try:
            page.get_by_text(BRANCH, exact=False).first.click()
            page.wait_for_load_state("networkidle")
            screenshot(page, "04_branch_selected")
        except PlaywrightTimeout:
            print("  (nu a aparut selectia de sediu — posibil deja selectat)")

        # 4. Navigate: Documente emise → Facturi
        print("→ Navigare la Documente emise → Facturi...")
        page.get_by_text("Documente emise", exact=False).click()
        page.wait_for_load_state("networkidle")
        page.get_by_text("Facturi", exact=False).first.click()
        page.wait_for_load_state("networkidle")
        screenshot(page, "05_facturi_page")

        # 5. Set "Toate" filter (all invoices, not just current month)
        print("→ Setare filtru 'Toate'...")
        try:
            # SmartBill has a period dropdown — try to select "Toate" or widest range
            period_btn = page.get_by_text("Luna curenta", exact=False).first
            period_btn.click()
            page.get_by_text("Toate", exact=False).first.click()
            page.wait_for_load_state("networkidle")
            screenshot(page, "06_filter_all")
        except PlaywrightTimeout:
            print("  (filtru 'Toate' nu gasit — continuam cu ce e setat)")

        # 6. Export
        print("→ Export CSV/Excel...")
        try:
            with page.expect_download(timeout=30_000) as dl_info:
                # Try common export button labels
                for label in ["Export", "Exporta", "Descarca", "Excel", "CSV"]:
                    try:
                        page.get_by_text(label, exact=False).first.click(timeout=5_000)
                        break
                    except PlaywrightTimeout:
                        continue
            download = dl_info.value
            path = download.path()
            content = Path(path).read_bytes()
            print(f"  ✓ Descarcat: {download.suggested_filename} ({len(content)} bytes)")
        except PlaywrightTimeout:
            screenshot(page, "07_export_failed")
            # Fallback: try to find any download link
            print("  ⚠ Export button not found — checking page content...")
            raise RuntimeError("Nu am gasit butonul de export. Verifica screenshot-ul 07_export_failed.png")

        screenshot(page, "08_done")
        browser.close()

    # Detect encoding
    try:
        return content.decode("utf-8-sig")
    except UnicodeDecodeError:
        return content.decode("latin-1")


# ── CSV → DB import ───────────────────────────────────────────────────────────
def import_csv_to_db(csv_content: str):
    reader = csv.DictReader(io.StringIO(csv_content))
    headers = reader.fieldnames or []
    print(f"  Coloane CSV: {headers}")

    rows = []
    for row in reader:
        # Find invoice number column (varies by SmartBill version)
        invoice_raw = (
            row.get("Factură") or row.get("Factura") or row.get("Nr. Factură") or
            row.get("Nr. factura") or row.get("Numărul facturii") or
            row.get("Numar") or ""
        ).strip()
        if not invoice_raw:
            continue

        series, number, invoice_key = parse_invoice_key(invoice_raw)
        if number is None:
            print(f"  ⚠ Nu pot parsa numarul facturii: {invoice_raw!r}")
            continue

        # Date columns
        date_str = (
            row.get("Data creării") or row.get("Data creare") or
            row.get("Data emiterii") or row.get("Data") or ""
        )
        due_date_str = (
            row.get("Data scadenței") or row.get("Data scadenta") or ""
        )
        issued_at = parse_date(date_str) or datetime.now()

        # Amount columns
        total    = parse_ron(row.get("Total") or row.get("Valoare totala") or "0")
        net      = parse_ron(row.get("Valoare fără TVA") or row.get("Valoare fara TVA") or row.get("Net") or "0")
        tax      = parse_ron(row.get("TVA") or "0")
        discount = parse_ron(row.get("Discount") or row.get("Reducere") or "0")

        # If net/tax not in CSV, calculate at 19%
        if net == 0 and total > 0:
            net = round(total / 1.19, 2)
            tax = round(total - net, 2)

        # Client
        client = (
            row.get("Client") or row.get("Denumire client") or row.get("Partener") or ""
        ).strip()

        # Status
        status_raw = (
            row.get("Status") or row.get("Stare") or ""
        ).strip().lower()
        if "anulat" in status_raw:
            status = "Anulata"
        elif "incasat" in status_raw or "platit" in status_raw:
            status = "Incasata"
        elif "partial" in status_raw:
            status = "Partial"
        else:
            status = "Emisa"

        rows.append({
            "invoice_key": invoice_key,
            "series": series or "",
            "number": number,
            "total": total,
            "net": net,
            "tax": tax,
            "client": client,
            "issued_at": issued_at,
            "status": status,
        })

    print(f"  Randuri parsate: {len(rows)}")
    if not rows:
        print("  ⚠ Nu am gasit randuri valide in CSV!")
        return

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    upsert_sql = """
        INSERT INTO "SmartbillInvoice" (
            "id", "invoiceKey", "series", "number",
            "totalAmount", "netAmount", "taxAmount",
            "paidAmount", "unpaidAmount", "paid",
            "issuedAt", "syncedAt"
        ) VALUES %s
        ON CONFLICT ("invoiceKey") DO UPDATE SET
            "totalAmount"  = EXCLUDED."totalAmount",
            "netAmount"    = EXCLUDED."netAmount",
            "taxAmount"    = EXCLUDED."taxAmount",
            "syncedAt"     = EXCLUDED."syncedAt"
    """

    # Note: status and client are not in the current schema — we update issuedAt
    # which is the most important fix (real date instead of sync date)
    data = [
        (
            str(uuid.uuid4()),
            r["invoice_key"],
            r["series"],
            r["number"],
            r["total"],
            r["net"],
            r["tax"],
            0.0,        # paidAmount — will be corrected by API sync
            r["total"], # unpaidAmount — will be corrected by API sync
            r["status"] == "Incasata",
            r["issued_at"],
            datetime.now(),
        )
        for r in rows
    ]

    template = "(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    execute_values(cur, upsert_sql, data, template=template, page_size=100)
    conn.commit()

    cur.execute('SELECT COUNT(*) FROM "SmartbillInvoice"')
    total_in_db = cur.fetchone()[0]
    cur.close()
    conn.close()

    print(f"  ✓ Importat {len(rows)} facturi. Total in DB: {total_in_db}")


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if not PASSWORD:
        print("ERROR: SMARTBILL_PASSWORD env var not set")
        sys.exit(1)
    if not DB_URL:
        print("ERROR: DATABASE_URL env var not set")
        sys.exit(1)

    print("=== SmartBill Export ===")
    csv_content = export_csv_from_smartbill()
    print("\n=== Import in DB ===")
    import_csv_to_db(csv_content)
    print("\n✅ Gata!")
