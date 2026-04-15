#!/usr/bin/env python3
"""Import INVOX CSV data into CrmCall table (upsert)."""

import csv
import sys
import uuid
from datetime import datetime

import psycopg2
from psycopg2.extras import execute_values, Json

DB_URL = "postgresql://neondb_owner:npg_ALF9r8lJZjgS@ep-bitter-bonus-amlnius9.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
CSV_PATH = r"C:\Users\sebas\Downloads\raport_invox_rocerealro_2023_01_01_2026_04_15.csv"


def make_invox_id(date_str, caller):
    safe_date = date_str.replace(" ", "_").replace(":", "-")
    return f"csv_{safe_date}_{caller}"


def find_header_row(reader):
    for row in reader:
        if row and row[0].strip() == "Date":
            return [h.strip() for h in row]
    return None


def main():
    rows_by_id = {}  # keyed by invoxId to deduplicate

    with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        header = find_header_row(reader)
        if not header:
            print("ERROR: Could not find 'Date' header row in CSV.")
            sys.exit(1)

        print(f"Headers: {header}")

        for row in reader:
            if not row or not row[0].strip():
                continue

            d = dict(zip(header, [c.strip() for c in row]))

            date_str = d.get("Date", "").strip()
            if not date_str or date_str == "Date":
                continue

            try:
                call_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                print(f"Skipping bad date: {date_str!r}")
                continue

            caller = d.get("Contact", "").strip()
            status = d.get("Call Status", "").strip() or None
            receiving_number = d.get("Receiving Number", "").strip() or None
            account = d.get("Label", "").strip() or None
            duration_raw = d.get("Duration", "").strip()
            duration = duration_raw if duration_raw else None
            channel = d.get("Channel", "").strip() or None

            utm_source = d.get("utm_source", "").strip()
            utm_source = None if utm_source in ("", "-") else utm_source
            utm_medium = d.get("utm_medium", "").strip()
            utm_medium = None if utm_medium in ("", "-") else utm_medium

            invox_id = make_invox_id(date_str, caller)

            # First occurrence wins on duplicates
            if invox_id not in rows_by_id:
                rows_by_id[invox_id] = (
                    str(uuid.uuid4()),
                    invox_id,
                    caller,
                    account,
                    call_date,
                    duration,
                    status,
                    channel,       # source
                    channel,       # campaign
                    utm_source,
                    utm_medium,
                    receiving_number,
                    None,          # recordingUri
                    None,          # reason
                    None,          # summary
                    Json({}),      # rawPayload
                )

    rows_to_upsert = list(rows_by_id.values())
    print(f"Parsed {len(rows_to_upsert)} unique rows from CSV.")

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    upsert_sql = """
        INSERT INTO "CrmCall" (
            "id", "invoxId", "caller", "account", "date", "duration", "status",
            "source", "campaign", "utmSource", "medium",
            "receivingNumber", "recordingUri", "reason", "summary", "rawPayload"
        ) VALUES %s
        ON CONFLICT ("invoxId") DO UPDATE SET
            "account"  = EXCLUDED."account",
            "status"   = EXCLUDED."status",
            "duration" = EXCLUDED."duration"
    """

    template = "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    execute_values(cur, upsert_sql, rows_to_upsert, template=template, page_size=200)
    conn.commit()

    cur.execute('SELECT COUNT(*) FROM "CrmCall"')
    total = cur.fetchone()[0]
    cur.close()
    conn.close()

    print(f"Done. Total rows in CrmCall table: {total}")


if __name__ == "__main__":
    main()
