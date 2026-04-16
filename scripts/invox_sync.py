#!/usr/bin/env python3
"""Sync INVOX calls via API into CrmCall table (upsert)."""

import json
import os
import sys
import uuid

import psycopg2
import requests
from psycopg2.extras import execute_values, Json

INVOX_API_KEY = os.environ["INVOX_API_KEY"]
DATABASE_URL  = os.environ.get("DATABASE_URL_UNPOOLED") or os.environ.get("DATABASE_URL") or ""
API_URL       = "https://app.invox.eu/api/v2/calls"


def fetch_calls(last_call_id: int | None = None) -> list[dict]:
    params = {}
    if last_call_id:
        params["last_call_id"] = last_call_id
    resp = requests.get(API_URL, headers={"X-API-Key": INVOX_API_KEY}, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    if not isinstance(data, list):
        print("Unexpected response:", str(data)[:200])
        sys.exit(1)
    return data


def get_last_synced_id(cur) -> int | None:
    """Return the highest numeric invoxId already in DB (ignores csv_... legacy IDs)."""
    cur.execute("""
        SELECT MAX("invoxId"::bigint)
        FROM "CrmCall"
        WHERE "invoxId" ~ '^[0-9]+$'
    """)
    row = cur.fetchone()
    return int(row[0]) if row and row[0] else None


def to_row(c: dict) -> tuple:
    raw_date = c.get("date") or ""
    try:
        from datetime import datetime, timezone
        # Handle ISO 8601 with timezone offset
        call_date = datetime.fromisoformat(raw_date)
    except Exception:
        from datetime import datetime, timezone
        call_date = datetime.now(timezone.utc)

    duration = c.get("duration")
    duration_str = str(duration) if duration is not None else None

    def val(key):
        v = c.get(key, "")
        return v if v else None

    return (
        str(uuid.uuid4()),          # id
        str(c["id"]),               # invoxId
        val("caller") or "",        # caller
        val("account"),             # account
        call_date,                  # date
        duration_str,               # duration
        val("status"),              # status
        val("source"),              # source
        val("campaign"),            # campaign
        val("utm_source"),          # utmSource
        val("medium"),              # medium
        val("receivingnumber"),     # receivingNumber
        val("recording_uri"),       # recordingUri
        val("reason"),              # reason
        val("summary"),             # summary
        Json(c),                    # rawPayload
    )


def main():
    full_sync = "--full" in sys.argv
    conn = psycopg2.connect(DATABASE_URL)
    cur  = conn.cursor()

    if full_sync:
        print("Full sync requested — fetching all calls from INVOX")
        last_id = None
    else:
        last_id = get_last_synced_id(cur)
        print(f"Last synced invoxId in DB: {last_id}")

    calls = fetch_calls(last_call_id=last_id)
    print(f"Fetched {len(calls)} calls from INVOX API")

    if not calls:
        print("Nothing to sync.")
        cur.close(); conn.close()
        return

    rows = [to_row(c) for c in calls]

    upsert_sql = """
        INSERT INTO "CrmCall" (
            "id", "invoxId", "caller", "account", "date", "duration", "status",
            "source", "campaign", "utmSource", "medium",
            "receivingNumber", "recordingUri", "reason", "summary", "rawPayload"
        ) VALUES %s
        ON CONFLICT ("invoxId") DO UPDATE SET
            "status"       = EXCLUDED."status",
            "duration"     = EXCLUDED."duration",
            "reason"       = EXCLUDED."reason",
            "summary"      = EXCLUDED."summary",
            "rawPayload"   = EXCLUDED."rawPayload"
    """
    template = "(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    execute_values(cur, upsert_sql, rows, template=template, page_size=200)
    conn.commit()

    cur.execute('SELECT COUNT(*) FROM "CrmCall"')
    total = cur.fetchone()[0]
    cur.close(); conn.close()

    print(f"Synced {len(rows)} calls. Total in DB: {total}")


if __name__ == "__main__":
    main()
