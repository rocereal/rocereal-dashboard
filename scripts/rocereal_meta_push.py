#!/usr/bin/env python3
"""
Push paid SmartBill invoices → Rocereal marketing-attribution WordPress plugin.

The plugin's REST endpoint resolves attribution from its phone_index reverse-
lookup (populated by the Daktela call webhook), then fires Meta CAPI + TikTok
Purchase events with full fbp/fbc/UTM payload.

This script runs AFTER smartbill_export.py (via GitHub Actions workflow_run)
so the SmartbillInvoice + SmartbillClient tables are fresh.

Env vars (required):
  DATABASE_URL_UNPOOLED       Same Neon Postgres URL as smartbill_export.py
  ROCEREAL_REPROCESS_URL      e.g. https://rocereal.ro/wp-json/rma/v1/admin/reprocess-invoice
  ROCEREAL_WEBHOOK_SECRET     Bearer token = webhook_secret from WP plugin
                              Settings → Marketing Attribution → tab General

Env vars (optional):
  PUSH_WINDOW_DAYS            Lookback window for paid invoices (default 90)
  PUSH_LIMIT_PER_RUN          Max invoices to push per run (default 200)
  DRY_RUN                     "true" → log what would be pushed, no POST
"""

import os
import sys
import time
from datetime import datetime, timedelta

import psycopg2
import requests

# ── Config ────────────────────────────────────────────────────────────────────
DB_URL  = os.environ.get("DATABASE_URL_UNPOOLED", os.environ.get("DATABASE_URL", ""))
URL     = os.environ.get("ROCEREAL_REPROCESS_URL", "")
SECRET  = os.environ.get("ROCEREAL_WEBHOOK_SECRET", "")
WINDOW  = int(os.environ.get("PUSH_WINDOW_DAYS", "90"))
LIMIT   = int(os.environ.get("PUSH_LIMIT_PER_RUN", "200"))
DRY_RUN = os.environ.get("DRY_RUN", "false").lower() == "true"

# Throttle between POSTs to avoid hammering WordPress on low-resource hosting.
SLEEP_BETWEEN_REQUESTS = 0.3  # seconds


# ── SQL ──────────────────────────────────────────────────────────────────────
ENSURE_COLUMN_SQL = '''
ALTER TABLE "SmartbillInvoice"
ADD COLUMN IF NOT EXISTS "pushedToMeta" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "metaEventId" TEXT,
ADD COLUMN IF NOT EXISTS "metaPushedAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "metaAttributionSource" TEXT,
ADD COLUMN IF NOT EXISTS "metaError" TEXT;
'''

# Case-insensitive trim match on client name → SmartbillClient.phone
SELECT_ELIGIBLE_SQL = '''
SELECT
    i."invoiceKey",
    i."series",
    i."number",
    i."client",
    i."totalAmount",
    i."issuedAt",
    c."phone",
    c."email"
FROM "SmartbillInvoice" i
LEFT JOIN "SmartbillClient" c
       ON LOWER(BTRIM(c."name")) = LOWER(BTRIM(i."client"))
WHERE i."paid" = true
  AND i."totalAmount" > 0
  AND COALESCE(i."pushedToMeta", false) = false
  AND i."issuedAt" >= %s
ORDER BY i."issuedAt" DESC
LIMIT %s
'''

MARK_PUSHED_SQL = '''
UPDATE "SmartbillInvoice"
SET "pushedToMeta"          = true,
    "metaEventId"           = %s,
    "metaPushedAt"          = NOW(),
    "metaAttributionSource" = %s,
    "metaError"             = NULL
WHERE "invoiceKey" = %s
'''

MARK_FAILED_SQL = '''
UPDATE "SmartbillInvoice"
SET "metaError"    = %s,
    "metaPushedAt" = NOW()
WHERE "invoiceKey" = %s
'''


# ── Helpers ───────────────────────────────────────────────────────────────────
def log(prefix: str, msg: str):
    print(f"{prefix} {msg}", flush=True)


def build_payload(row) -> dict:
    invoice_key, series, number, client, total, issued_at, phone, email = row
    payload = {
        "series":      (series or "").strip(),
        "number":      str(number),
        "phone":       (phone or "").strip(),
        "value":       float(total),
        "currency":    "RON",
        "client_name": (client or "").strip(),
    }
    if email and email.strip():
        payload["email"] = email.strip()
    if issued_at:
        payload["issued_at"] = issued_at.strftime("%Y-%m-%d")
    return payload


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    # Validate config
    missing = []
    if not DB_URL:  missing.append("DATABASE_URL_UNPOOLED")
    if not URL:     missing.append("ROCEREAL_REPROCESS_URL")
    if not SECRET:  missing.append("ROCEREAL_WEBHOOK_SECRET")
    if missing:
        log("ERROR", f"Missing env vars: {', '.join(missing)}")
        sys.exit(1)

    cutoff = datetime.now() - timedelta(days=WINDOW)

    log("=== ", "Rocereal Meta Push")
    log("    ", f"Target:        {URL}")
    log("    ", f"Cutoff date:   {cutoff.date()} (window {WINDOW} days)")
    log("    ", f"Limit per run: {LIMIT}")
    log("    ", f"Dry run:       {DRY_RUN}")

    conn = psycopg2.connect(DB_URL)
    try:
        # Ensure schema (idempotent)
        with conn.cursor() as cur:
            cur.execute(ENSURE_COLUMN_SQL)
            conn.commit()

        # Pull eligible invoices
        with conn.cursor() as cur:
            cur.execute(SELECT_ELIGIBLE_SQL, (cutoff, LIMIT))
            rows = cur.fetchall()

        log("→", f"Eligible invoices: {len(rows)}")
        if not rows:
            log("✅", "Nothing to push. Exiting clean.")
            return

        pushed = 0
        skipped_no_phone = 0
        errored = 0

        session = requests.Session()
        session.headers.update({
            "Authorization": f"Bearer {SECRET}",
            "Content-Type":  "application/json",
            "User-Agent":    "rocereal-meta-push/1.0 (+github-actions)",
        })

        for row in rows:
            invoice_key = row[0]
            client      = row[3]
            total       = row[4]
            phone       = row[6]

            if not phone or not phone.strip():
                log("  ⚠", f"{invoice_key}: no phone for '{client}' — skip")
                skipped_no_phone += 1
                continue

            payload = build_payload(row)

            if DRY_RUN:
                log("  [dry]", f"{invoice_key} ({client}, {total} RON, {phone}) → would POST")
                continue

            try:
                resp = session.post(URL, json=payload, timeout=20)
            except requests.RequestException as e:
                err = f"network: {e}"
                log("  ✗", f"{invoice_key}: {err}")
                with conn.cursor() as cur:
                    cur.execute(MARK_FAILED_SQL, (err[:500], invoice_key))
                    conn.commit()
                errored += 1
                time.sleep(SLEEP_BETWEEN_REQUESTS)
                continue

            if resp.ok:
                try:
                    body = resp.json()
                except Exception:
                    body = {}
                src     = body.get("attribution_source") or "unknown"
                camp    = body.get("campaign") or "—"
                eventid = body.get("meta_event_id") or ""
                dup     = body.get("duplicate", False)

                with conn.cursor() as cur:
                    cur.execute(MARK_PUSHED_SQL, (eventid, src, invoice_key))
                    conn.commit()

                tag = "↻ dup" if dup else "✓"
                log(f"  {tag}", f"{invoice_key} ({client}, {total} RON) → src={src} camp='{camp}'")
                pushed += 1
            else:
                err = f"HTTP {resp.status_code}: {resp.text[:300]}"
                log("  ✗", f"{invoice_key}: {err}")
                with conn.cursor() as cur:
                    cur.execute(MARK_FAILED_SQL, (err[:500], invoice_key))
                    conn.commit()
                errored += 1

            time.sleep(SLEEP_BETWEEN_REQUESTS)

        log("\n✅", f"Done. Pushed: {pushed}, No-phone: {skipped_no_phone}, Errors: {errored}")

    finally:
        conn.close()


if __name__ == "__main__":
    main()
