#!/usr/bin/env python3
"""Sync Facebook Ads insights into FacebookAdInsight table."""

import os
import sys
import uuid
from datetime import datetime, timedelta, timezone

import psycopg2
import requests
from psycopg2.extras import execute_values

FB_TOKEN     = os.environ["FB_ACCESS_TOKEN"]
DATABASE_URL = os.environ.get("DATABASE_URL_UNPOOLED") or os.environ.get("DATABASE_URL") or ""
AD_ACCOUNT   = "act_680994874576116"  # rocereal sibiu
API_BASE     = "https://graph.facebook.com/v21.0"

# How many days back to sync (default 90, --full = all time)
DAYS_BACK = 3650 if "--full" in sys.argv else 90

COMMON_FIELDS = "impressions,clicks,spend,reach,frequency,ctr,cpc,cpm,cpp"
CONVERSION_FIELDS = "purchase_roas,conversions,cost_per_conversion"


def fb_get(url, params):
    params["access_token"] = FB_TOKEN
    params["limit"] = 500
    results = []
    while url:
        r = requests.get(url, params=params, timeout=30)
        r.raise_for_status()
        data = r.json()
        results.extend(data.get("data", []))
        url = data.get("paging", {}).get("next")
        params = {}  # next URL already has params
    return results


def fetch_insights(level: str, date_start: str, date_stop: str) -> list[dict]:
    fields = f"campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,{COMMON_FIELDS},{CONVERSION_FIELDS}"
    if level == "campaign":
        fields = f"campaign_id,campaign_name,{COMMON_FIELDS},{CONVERSION_FIELDS}"
    elif level == "adset":
        fields = f"campaign_id,campaign_name,adset_id,adset_name,{COMMON_FIELDS},{CONVERSION_FIELDS}"

    return fb_get(f"{API_BASE}/{AD_ACCOUNT}/insights", {
        "level": level,
        "fields": fields,
        "time_range": f'{{"since":"{date_start}","until":"{date_stop}"}}',
        "time_increment": 1,  # daily breakdown
    })


def fetch_entity_meta(level: str) -> dict:
    """Fetch status/objective/budget per entity."""
    meta = {}
    if level == "campaign":
        rows = fb_get(f"{API_BASE}/{AD_ACCOUNT}/campaigns", {
            "fields": "id,name,status,objective,daily_budget,lifetime_budget",
        })
        for r in rows:
            meta[r["id"]] = r
    elif level == "adset":
        rows = fb_get(f"{API_BASE}/{AD_ACCOUNT}/adsets", {
            "fields": "id,name,status,daily_budget,lifetime_budget,campaign_id",
        })
        for r in rows:
            meta[r["id"]] = r
    elif level == "ad":
        rows = fb_get(f"{API_BASE}/{AD_ACCOUNT}/ads", {
            "fields": "id,name,status,adset_id,campaign_id",
        })
        for r in rows:
            meta[r["id"]] = r
    return meta


def safe_float(d, key, default=0.0):
    v = d.get(key)
    if v is None:
        return default
    if isinstance(v, list) and v:
        # purchase_roas comes as [{"action_type":"...", "value":"1.23"}]
        return float(v[0].get("value", 0))
    try:
        return float(v)
    except (ValueError, TypeError):
        return default


def safe_int(d, key, default=0):
    v = d.get(key)
    if v is None:
        return default
    if isinstance(v, list) and v:
        return int(float(v[0].get("value", 0)))
    try:
        return int(float(v))
    except (ValueError, TypeError):
        return default


def build_rows(level: str, insights: list[dict], meta: dict) -> list[tuple]:
    rows = []
    for i in insights:
        if level == "campaign":
            entity_id   = i.get("campaign_id", "")
            entity_name = i.get("campaign_name", "")
            campaign_id = entity_id
            campaign_name = entity_name
            adset_id = adset_name = None
        elif level == "adset":
            entity_id   = i.get("adset_id", "")
            entity_name = i.get("adset_name", "")
            campaign_id = i.get("campaign_id")
            campaign_name = i.get("campaign_name")
            adset_id = entity_id
            adset_name = entity_name
        else:  # ad
            entity_id   = i.get("ad_id", "")
            entity_name = i.get("ad_name", "")
            campaign_id = i.get("campaign_id")
            campaign_name = i.get("campaign_name")
            adset_id = i.get("adset_id")
            adset_name = i.get("adset_name")

        m = meta.get(entity_id, {})
        status    = m.get("status")
        objective = m.get("objective")

        # Budget
        if m.get("daily_budget"):
            budget      = float(m["daily_budget"]) / 100
            budget_type = "daily"
        elif m.get("lifetime_budget"):
            budget      = float(m["lifetime_budget"]) / 100
            budget_type = "lifetime"
        else:
            budget = budget_type = None

        date_start = datetime.strptime(i["date_start"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
        date_stop  = datetime.strptime(i["date_stop"],  "%Y-%m-%d").replace(tzinfo=timezone.utc)

        rows.append((
            str(uuid.uuid4()),
            level,
            entity_id,
            entity_name,
            campaign_id,
            campaign_name,
            adset_id,
            adset_name,
            status,
            objective,
            date_start,
            date_stop,
            safe_int(i,   "impressions"),
            safe_int(i,   "clicks"),
            safe_float(i, "spend"),
            safe_int(i,   "reach"),
            safe_float(i, "frequency"),
            safe_float(i, "ctr"),
            safe_float(i, "cpc"),
            safe_float(i, "cpm"),
            safe_float(i, "cpp"),
            safe_float(i, "purchase_roas") or None,
            safe_int(i,   "conversions"),
            safe_float(i, "cost_per_conversion"),
            budget,
            budget_type,
            AD_ACCOUNT,
        ))
    return rows


UPSERT_SQL = """
    INSERT INTO "FacebookAdInsight" (
        "id","level","entityId","entityName",
        "campaignId","campaignName","adsetId","adsetName",
        "status","objective",
        "dateStart","dateStop",
        "impressions","clicks","spend","reach","frequency",
        "ctr","cpc","cpm","cpp",
        "purchaseRoas","conversions","costPerConversion",
        "budget","budgetType","accountId"
    ) VALUES %s
    ON CONFLICT ("level","entityId","dateStart","dateStop") DO UPDATE SET
        "entityName"          = EXCLUDED."entityName",
        "status"              = EXCLUDED."status",
        "impressions"         = EXCLUDED."impressions",
        "clicks"              = EXCLUDED."clicks",
        "spend"               = EXCLUDED."spend",
        "reach"               = EXCLUDED."reach",
        "frequency"           = EXCLUDED."frequency",
        "ctr"                 = EXCLUDED."ctr",
        "cpc"                 = EXCLUDED."cpc",
        "cpm"                 = EXCLUDED."cpm",
        "cpp"                 = EXCLUDED."cpp",
        "purchaseRoas"        = EXCLUDED."purchaseRoas",
        "conversions"         = EXCLUDED."conversions",
        "costPerConversion"   = EXCLUDED."costPerConversion",
        "budget"              = EXCLUDED."budget",
        "syncedAt"            = now()
"""

TEMPLATE = "(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"


CHUNK_DAYS = 180  # Facebook API max range per request


def date_chunks(start_str: str, end_str: str, chunk_days: int):
    """Yield (chunk_start, chunk_end) pairs covering start→end."""
    from datetime import date
    start = date.fromisoformat(start_str)
    end   = date.fromisoformat(end_str)
    cur   = start
    while cur <= end:
        chunk_end = min(cur + timedelta(days=chunk_days - 1), end)
        yield cur.strftime("%Y-%m-%d"), chunk_end.strftime("%Y-%m-%d")
        cur = chunk_end + timedelta(days=1)


def main():
    today      = datetime.now(timezone.utc).date()
    date_stop  = today.strftime("%Y-%m-%d")
    date_start = (today - timedelta(days=DAYS_BACK)).strftime("%Y-%m-%d")
    print(f"Syncing {date_start} → {date_stop}  (levels: campaign, adset, ad)")

    conn = psycopg2.connect(DATABASE_URL)
    cur  = conn.cursor()
    total = 0

    for level in ("campaign", "adset", "ad"):
        print(f"  Fetching {level} meta...")
        meta = fetch_entity_meta(level)

        chunks = list(date_chunks(date_start, date_stop, CHUNK_DAYS))
        print(f"  Fetching {level} insights in {len(chunks)} chunk(s)...")

        for chunk_start, chunk_end in chunks:
            print(f"    chunk {chunk_start} → {chunk_end}")
            insights = fetch_insights(level, chunk_start, chunk_end)
            if not insights:
                continue
            rows = build_rows(level, insights, meta)
            execute_values(cur, UPSERT_SQL, rows, template=TEMPLATE, page_size=200)
            conn.commit()
            total += len(rows)

        print(f"  ✓ {level} done")

    cur.execute('SELECT COUNT(*) FROM "FacebookAdInsight"')
    db_total = cur.fetchone()[0]
    cur.close(); conn.close()
    print(f"\nDone. Synced {total} rows. Total in DB: {db_total}")


if __name__ == "__main__":
    main()
