import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN   = process.env.TIKTOK_ACCESS_TOKEN!;
const ADVERTISER_ID  = process.env.TIKTOK_ADVERTISER_ID!;
const API_BASE       = "https://business-api.tiktok.com/open_api/v1.3";

type TikTokResponse = { code: number; message: string; data?: Record<string, unknown> };

async function safeJson(res: Response): Promise<TikTokResponse> {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`[TikTok HTTP ${res.status}] Non-JSON response: ${text.slice(0, 300)}`);
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


function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function GET(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: "not_connected", message: "TIKTOK_ACCESS_TOKEN not set" });
  }
  if (!ADVERTISER_ID) {
    return NextResponse.json({ error: "not_connected", message: "TIKTOK_ADVERTISER_ID not set" });
  }

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from") ?? fmt(startOfMonth());
  const to   = searchParams.get("to")   ?? fmt(new Date());

  try {
    // ── 1. Campaign list ────────────────────────────────────────────────────────
    const campaignsRes = await ttGet("/campaign/get/", {
      advertiser_id: ADVERTISER_ID,
      fields:        JSON.stringify(["campaign_id", "campaign_name", "secondary_status", "objective_type"]),
      page_size:     "100",
    });

    if (campaignsRes.code !== 0) {
      return NextResponse.json({ error: `[TikTok ${campaignsRes.code}] ${campaignsRes.message}` });
    }

    const campaignList = (campaignsRes.data?.list ?? []) as Record<string, unknown>[];

    // ── 2. Integrated report + account-level reach (parallel) ─────────────────
    let metricsMap = new Map<string, Record<string, unknown>>();
    let reportWarning: string | null = null;
    let accountReach = 0;

    const [campaignReportResult, accountReachResult] = await Promise.allSettled([
      ttGet("/report/integrated/get/", {
        advertiser_id: ADVERTISER_ID,
        report_type:   "BASIC",
        data_level:    "AUCTION_CAMPAIGN",
        dimensions:    JSON.stringify(["campaign_id"]),
        metrics:       JSON.stringify(["spend", "impressions", "reach", "clicks", "ctr", "cpc", "cpm"]),
        start_date:    from,
        end_date:      to,
        page:          "1",
        page_size:     "100",
      }),
      // Account-level reach — deduplicated across all campaigns (avoids summing per-campaign reaches)
      ttGet("/report/integrated/get/", {
        advertiser_id: ADVERTISER_ID,
        report_type:   "BASIC",
        data_level:    "AUCTION_ADVERTISER",
        dimensions:    JSON.stringify(["advertiser_id"]),
        metrics:       JSON.stringify(["reach"]),
        start_date:    from,
        end_date:      to,
        page:          "1",
        page_size:     "1",
      }),
    ]);

    if (campaignReportResult.status === "fulfilled") {
      const reportRes = campaignReportResult.value;
      if (reportRes.code === 0) {
        const reportRows = (reportRes.data?.list ?? []) as Record<string, unknown>[];
        for (const row of reportRows) {
          const dim = row.dimensions as Record<string, string>;
          const met = row.metrics    as Record<string, unknown>;
          metricsMap.set(dim.campaign_id, met);
        }
      } else {
        reportWarning = `[TikTok raport ${reportRes.code}] ${reportRes.message}`;
      }
    } else {
      reportWarning = campaignReportResult.reason instanceof Error
        ? campaignReportResult.reason.message
        : String(campaignReportResult.reason);
    }

    if (accountReachResult.status === "fulfilled") {
      const r = accountReachResult.value;
      if (r.code === 0) {
        const rows = (r.data?.list ?? []) as Record<string, unknown>[];
        if (rows.length > 0) {
          const met = rows[0].metrics as Record<string, unknown>;
          accountReach = parseInt(met.reach as string) || 0;
        }
      }
    }

    // ── 3. Merge campaigns + metrics ─────────────────────────────────────────────
    const campaigns = campaignList.map((c) => {
      const m = metricsMap.get(c.campaign_id as string) ?? {};
      const spend       = parseFloat(m.spend       as string) || 0;
      const impressions = parseInt  (m.impressions as string) || 0;
      const reach       = parseInt  (m.reach       as string) || 0;
      const clicks      = parseInt  (m.clicks      as string) || 0;
      const conversions = parseInt  (m.conversion  as string) || 0;
      const ctr         = parseFloat(m.ctr         as string) || 0;
      const cpc         = parseFloat(m.cpc         as string) || 0;
      const cpm         = parseFloat(m.cpm         as string) || 0;
      const costPerConv = parseFloat(m.cost_per_conversion as string) || 0;

      return {
        id:          c.campaign_id      as string,
        name:        c.campaign_name    as string,
        status:      (c.secondary_status ?? c.campaign_status ?? "UNKNOWN") as string,
        objective:   c.objective_type   as string,
        spend:       Math.round(spend * 100) / 100,
        impressions,
        reach,
        clicks,
        conversions,
        ctr:         Math.round(ctr * 10000) / 100,
        cpc:         Math.round(cpc * 100) / 100,
        cpm:         Math.round(cpm * 100) / 100,
        costPerConversion: Math.round(costPerConv * 100) / 100,
      };
    }).sort((a, b) => b.spend - a.spend);

    // ── 4. Overview totals — derived from report (includes deleted campaigns) ─────
    const rawOverview = Array.from(metricsMap.values()).reduce<{
      spend: number; impressions: number; clicks: number; conversions: number;
    }>(
      (acc, m) => ({
        spend:       acc.spend       + (parseFloat(m.spend       as string) || 0),
        impressions: acc.impressions + (parseInt  (m.impressions as string) || 0),
        clicks:      acc.clicks      + (parseInt  (m.clicks      as string) || 0),
        conversions: acc.conversions + (parseInt  (m.conversion  as string) || 0),
      }),
      { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
    );
    // Fall back to summing the campaign list if the report was unavailable (metricsMap empty)
    const overview = metricsMap.size > 0
      ? { ...rawOverview, spend: Math.round(rawOverview.spend * 100) / 100, reach: accountReach }
      : campaigns.reduce(
          (acc, c) => ({
            spend:       Math.round((acc.spend + c.spend) * 100) / 100,
            impressions: acc.impressions + c.impressions,
            reach:       acc.reach       + c.reach,
            clicks:      acc.clicks      + c.clicks,
            conversions: acc.conversions + c.conversions,
          }),
          { spend: 0, impressions: 0, reach: 0, clicks: 0, conversions: 0 }
        );

    const totalCtr = overview.impressions > 0
      ? Math.round((overview.clicks / overview.impressions) * 10000) / 100
      : 0;
    const avgCpc = overview.clicks > 0
      ? Math.round((overview.spend / overview.clicks) * 100) / 100
      : 0;
    const costPerConversion = overview.conversions > 0
      ? Math.round((overview.spend / overview.conversions) * 100) / 100
      : 0;

    return NextResponse.json({
      overview: { ...overview, ctr: totalCtr, avgCpc, costPerConversion },
      campaigns,
      ...(reportWarning ? { reportWarning } : {}),
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message });
  }
}
