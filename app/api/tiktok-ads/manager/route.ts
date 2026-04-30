import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN  = process.env.TIKTOK_ACCESS_TOKEN!;
const ADVERTISER_ID = process.env.TIKTOK_ADVERTISER_ID!;
const API_BASE      = "https://business-api.tiktok.com/open_api/v1.3";

type TikTokResponse = { code: number; message: string; data?: Record<string, unknown> };

async function safeJson(res: Response): Promise<TikTokResponse> {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`[TikTok HTTP ${res.status}] ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<TikTokResponse>;
}

async function ttGet(endpoint: string, params: Record<string, string>): Promise<TikTokResponse> {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { "Access-Token": ACCESS_TOKEN },
    cache: "no-store",
  });
  return safeJson(res);
}

function normalizeStatus(s: string | undefined): string {
  if (!s) return "UNKNOWN";
  if (s.includes("ENABLE")) return "ACTIVE";
  if (s.includes("DISABLE")) return "PAUSED";
  if (s.includes("DELETE")) return "DELETED";
  return s;
}

function fmtDate(d: Date) { return d.toISOString().slice(0, 10); }
function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function GET(req: NextRequest) {
  if (!ACCESS_TOKEN)  return NextResponse.json({ error: "not_connected" });
  if (!ADVERTISER_ID) return NextResponse.json({ error: "not_connected" });

  const { searchParams } = req.nextUrl;
  const level       = searchParams.get("level")       ?? "campaign";
  const from        = searchParams.get("from")        ?? fmtDate(startOfMonth());
  const to          = searchParams.get("to")          ?? fmtDate(new Date());
  const campaignIds = searchParams.get("campaignIds") ?? "";
  const adgroupIds  = searchParams.get("adgroupIds")  ?? "";

  try {
    let entities: Record<string, unknown>[] = [];
    let dataLevel: string;
    let dimKey: string;

    // ── 1. Fetch entity list ────────────────────────────────────────────────────
    if (level === "campaign") {
      dataLevel = "AUCTION_CAMPAIGN";
      dimKey    = "campaign_id";
      const r   = await ttGet("/campaign/get/", {
        advertiser_id: ADVERTISER_ID,
        fields:        JSON.stringify(["campaign_id", "campaign_name", "secondary_status", "objective_type", "budget", "budget_mode"]),
        page_size:     "100",
      });
      if (r.code !== 0) return NextResponse.json({ error: `[TikTok ${r.code}] ${r.message}` });
      entities = (r.data?.list ?? []) as Record<string, unknown>[];

    } else if (level === "adgroup") {
      dataLevel = "AUCTION_ADGROUP";
      dimKey    = "adgroup_id";
      const params: Record<string, string> = {
        advertiser_id: ADVERTISER_ID,
        fields:        JSON.stringify(["adgroup_id", "adgroup_name", "campaign_id", "secondary_status", "budget", "budget_mode"]),
        page_size:     "100",
      };
      if (campaignIds) params.campaign_ids = JSON.stringify(campaignIds.split(","));
      const r = await ttGet("/adgroup/get/", params);
      if (r.code !== 0) return NextResponse.json({ error: `[TikTok ${r.code}] ${r.message}` });
      entities = (r.data?.list ?? []) as Record<string, unknown>[];

    } else {
      dataLevel = "AUCTION_AD";
      dimKey    = "ad_id";
      const params: Record<string, string> = {
        advertiser_id: ADVERTISER_ID,
        fields:        JSON.stringify(["ad_id", "ad_name", "adgroup_id", "campaign_id", "secondary_status"]),
        page_size:     "100",
      };
      if (adgroupIds)       params.adgroup_ids  = JSON.stringify(adgroupIds.split(","));
      else if (campaignIds) params.campaign_ids = JSON.stringify(campaignIds.split(","));
      const r = await ttGet("/ad/get/", params);
      if (r.code !== 0) return NextResponse.json({ error: `[TikTok ${r.code}] ${r.message}` });
      entities = (r.data?.list ?? []) as Record<string, unknown>[];
    }

    // ── 2. Fetch report metrics (optional) ─────────────────────────────────────
    const metricsMap = new Map<string, Record<string, unknown>>();
    try {
      const rRes = await ttGet("/report/integrated/get/", {
        advertiser_id: ADVERTISER_ID,
        report_type:   "BASIC",
        data_level:    dataLevel,
        dimensions:    JSON.stringify([dimKey]),
        metrics:       JSON.stringify(["spend", "impressions", "clicks", "ctr", "cpc", "cpm"]),
        start_date:    from,
        end_date:      to,
        page:          "1",
        page_size:     "1000",
      });
      if (rRes.code === 0) {
        const rows = (rRes.data?.list ?? []) as Record<string, unknown>[];
        for (const row of rows) {
          const dim = row.dimensions as Record<string, string>;
          const met = row.metrics    as Record<string, unknown>;
          metricsMap.set(dim[dimKey], met);
        }
      }
    } catch { /* metrics optional */ }

    // ── 3. Build rows ──────────────────────────────────────────────────────────
    const rows = entities.map((e) => {
      const id =
        level === "campaign" ? (e.campaign_id as string) :
        level === "adgroup"  ? (e.adgroup_id  as string) :
                               (e.ad_id       as string);
      const name =
        level === "campaign" ? (e.campaign_name as string) :
        level === "adgroup"  ? (e.adgroup_name  as string) :
                               (e.ad_name       as string);
      const m = metricsMap.get(id) ?? {};

      const budget = e.budget ? parseFloat(e.budget as string) : null;
      const budgetMode = (e.budget_mode as string | null) ?? "";
      const budgetType = budgetMode.includes("DAY") ? "daily" : budgetMode.includes("INFINITE") ? null : "total";

      return {
        entityId:      id,
        entityName:    name ?? "—",
        campaignId:    (e.campaign_id  as string | null) ?? null,
        campaignName:  null,
        adsetId:       (e.adgroup_id   as string | null) ?? null,
        adsetName:     null,
        status:        normalizeStatus(e.secondary_status as string),
        objective:     (e.objective_type as string | null) ?? null,
        budget:        budget,
        budgetType:    budgetType,
        impressions:   parseInt(m.impressions as string) || 0,
        clicks:        parseInt(m.clicks      as string) || 0,
        spend:         parseFloat(m.spend     as string) || 0,
        reach:         0,
        conversions:   0,
        resultType:    "",
        ctr:           parseFloat(m.ctr       as string) || 0,
        cpc:           parseFloat(m.cpc       as string) || 0,
        cpm:           parseFloat(m.cpm       as string) || 0,
        purchaseRoas:  null,
        costPerResult: 0,
        frequency:     0,
      };
    });

    // ── 4. Ghost rows — campaigns in the report but missing from the entity list ─
    // Deleted campaigns are excluded from /campaign/get/ by default but still appear
    // in the integrated report. Add them so the table total matches the KPI.
    if (level === "campaign") {
      const knownIds = new Set(rows.map((r) => r.entityId));
      for (const [id, m] of metricsMap.entries()) {
        if (knownIds.has(id)) continue;
        rows.push({
          entityId:      id,
          entityName:    "Campanie ștearsă",
          campaignId:    id,
          campaignName:  null,
          adsetId:       null,
          adsetName:     null,
          status:        "DELETED",
          objective:     null,
          budget:        null,
          budgetType:    null,
          impressions:   parseInt(m.impressions as string) || 0,
          clicks:        parseInt(m.clicks      as string) || 0,
          spend:         parseFloat(m.spend     as string) || 0,
          reach:         0,
          conversions:   0,
          resultType:    "",
          ctr:           parseFloat(m.ctr       as string) || 0,
          cpc:           parseFloat(m.cpc       as string) || 0,
          cpm:           parseFloat(m.cpm       as string) || 0,
          purchaseRoas:  null,
          costPerResult: 0,
          frequency:     0,
        });
      }
    }

    rows.sort((a, b) => b.spend - a.spend);

    return NextResponse.json(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message });
  }
}
