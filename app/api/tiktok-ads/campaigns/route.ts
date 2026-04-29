import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN   = process.env.TIKTOK_ACCESS_TOKEN!;
const ADVERTISER_ID  = process.env.TIKTOK_ADVERTISER_ID!;
const API_BASE       = "https://business-api.tiktok.com/open_api/v1.3";

async function ttGet(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { "Access-Token": ACCESS_TOKEN },
    cache: "no-store",
  });
  return res.json() as Promise<{ code: number; message: string; data?: Record<string, unknown> }>;
}

async function ttPost(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Access-Token":  ACCESS_TOKEN,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res.json() as Promise<{ code: number; message: string; data?: Record<string, unknown> }>;
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
    return NextResponse.json({ error: "not_connected", message: "TIKTOK_ACCESS_TOKEN not set" }, { status: 503 });
  }
  if (!ADVERTISER_ID) {
    return NextResponse.json({ error: "not_connected", message: "TIKTOK_ADVERTISER_ID not set" }, { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from") ?? fmt(startOfMonth());
  const to   = searchParams.get("to")   ?? fmt(new Date());

  try {
    // ── 1. Campaign list ────────────────────────────────────────────────────────
    const campaignsRes = await ttGet("/campaign/get/", {
      advertiser_id: ADVERTISER_ID,
      fields:        JSON.stringify(["campaign_id", "campaign_name", "status", "objective_type"]),
      page_size:     "100",
    });

    if (campaignsRes.code !== 0) {
      throw new Error(`[TikTok ${campaignsRes.code}] ${campaignsRes.message}`);
    }

    const campaignList = (campaignsRes.data?.list ?? []) as Record<string, unknown>[];

    // ── 2. Integrated report (campaign-level metrics) ────────────────────────────
    const reportRes = await ttPost("/report/integrated/get/", {
      advertiser_id: ADVERTISER_ID,
      report_type:   "BASIC",
      data_level:    "AUCTION_CAMPAIGN",
      dimensions:    ["campaign_id"],
      metrics:       [
        "spend", "impressions", "clicks", "reach",
        "conversion", "cost_per_conversion",
        "ctr", "cpc", "cpm",
        "video_play_actions", "profile_visits",
      ],
      start_date: from,
      end_date:   to,
      page_size:  100,
    });

    if (reportRes.code !== 0) {
      throw new Error(`[TikTok report ${reportRes.code}] ${reportRes.message}`);
    }

    // Build metrics map by campaign_id
    const metricsMap = new Map<string, Record<string, unknown>>();
    const reportRows = (reportRes.data?.list ?? []) as Record<string, unknown>[];
    for (const row of reportRows) {
      const dim = row.dimensions as Record<string, string>;
      const met = row.metrics    as Record<string, unknown>;
      metricsMap.set(dim.campaign_id, met);
    }

    // ── 3. Merge campaigns + metrics ─────────────────────────────────────────────
    const campaigns = campaignList.map((c) => {
      const m = metricsMap.get(c.campaign_id as string) ?? {};
      const spend       = parseFloat(m.spend       as string) || 0;
      const impressions = parseInt  (m.impressions as string) || 0;
      const clicks      = parseInt  (m.clicks      as string) || 0;
      const conversions = parseInt  (m.conversion  as string) || 0;
      const ctr         = parseFloat(m.ctr         as string) || 0;
      const cpc         = parseFloat(m.cpc         as string) || 0;
      const cpm         = parseFloat(m.cpm         as string) || 0;
      const costPerConv = parseFloat(m.cost_per_conversion as string) || 0;

      return {
        id:             c.campaign_id  as string,
        name:           c.campaign_name as string,
        status:         c.status        as string,
        objective:      c.objective_type as string,
        spend:          Math.round(spend * 100) / 100,
        impressions,
        clicks,
        conversions,
        ctr:            Math.round(ctr * 10000) / 100,   // to %
        cpc:            Math.round(cpc * 100) / 100,
        cpm:            Math.round(cpm * 100) / 100,
        costPerConversion: Math.round(costPerConv * 100) / 100,
      };
    }).sort((a, b) => b.spend - a.spend);

    // ── 4. Overview totals ───────────────────────────────────────────────────────
    const overview = campaigns.reduce(
      (acc, c) => ({
        spend:       Math.round((acc.spend + c.spend) * 100) / 100,
        impressions: acc.impressions + c.impressions,
        clicks:      acc.clicks      + c.clicks,
        conversions: acc.conversions + c.conversions,
      }),
      { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
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
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
