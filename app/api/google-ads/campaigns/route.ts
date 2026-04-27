import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLIENT_ID       = process.env.GOOGLE_ADS_CLIENT_ID!;
const CLIENT_SECRET   = process.env.GOOGLE_ADS_CLIENT_SECRET!;
const REFRESH_TOKEN   = process.env.GOOGLE_ADS_REFRESH_TOKEN!;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!;
const MANAGER_ID      = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID!; // MCC
const CUSTOMER_ID     = process.env.GOOGLE_ADS_CUSTOMER_ID!;         // client account

const API_VERSION = "v24";

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type:    "refresh_token",
    }),
    cache: "no-store",
  });
  const data = await res.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function gaqlQuery(accessToken: string, query: string) {
  const url = `https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`;
  const headers: Record<string, string> = {
    "Authorization":     `Bearer ${accessToken}`,
    "developer-token":   DEVELOPER_TOKEN,
    "Content-Type":      "application/json",
  };
  if (MANAGER_ID) headers["login-customer-id"] = MANAGER_ID;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    const err = await res.text();
    if (contentType.includes("text/html")) {
      throw new Error(`[${res.status}] Google Ads API not enabled or wrong endpoint. Enable "Google Ads API" at console.cloud.google.com/apis/library for your project. URL: ${url}`);
    }
    throw new Error(`[${res.status}] ${url} → ${err.slice(0, 800)}`);
  }
  return res.json() as Promise<{ results?: Record<string, unknown>[] }>;
}

export async function GET(req: NextRequest) {
  if (!REFRESH_TOKEN) {
    return NextResponse.json({ error: "not_connected", message: "GOOGLE_ADS_REFRESH_TOKEN not set" }, { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from") ?? formatDate(startOfMonth());
  const to   = searchParams.get("to")   ?? formatDate(new Date());

  try {
    const accessToken = await getAccessToken();

    // Run queries in parallel
    const [campaignsRes, overviewRes] = await Promise.all([
      // Campaigns with metrics
      gaqlQuery(accessToken, `
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          campaign.bidding_strategy_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions,
          metrics.cost_per_conversion,
          metrics.interaction_rate,
          metrics.video_views
        FROM campaign
        WHERE segments.date BETWEEN '${from}' AND '${to}'
          AND campaign.status != 'REMOVED'
        ORDER BY metrics.cost_micros DESC
        LIMIT 50
      `),
      // Account overview totals
      gaqlQuery(accessToken, `
        SELECT
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions,
          metrics.cost_per_conversion,
          metrics.interaction_rate
        FROM customer
        WHERE segments.date BETWEEN '${from}' AND '${to}'
      `),
    ]);

    // Parse campaigns
    const campaigns = (campaignsRes.results ?? []).map((r) => {
      const c = r.campaign as Record<string, unknown>;
      const m = r.metrics  as Record<string, unknown>;
      return {
        id:             c.id as string,
        name:           c.name as string,
        status:         c.status as string,
        channelType:    c.advertisingChannelType as string,
        biddingStrategy: c.biddingStrategyType as string,
        impressions:    Number(m.impressions  ?? 0),
        clicks:         Number(m.clicks       ?? 0),
        spend:          Math.round(Number(m.costMicros ?? 0) / 10000) / 100,
        ctr:            Math.round(Number(m.ctr ?? 0) * 10000) / 100,
        avgCpc:         Math.round(Number(m.averageCpc ?? 0) / 10000) / 100,
        conversions:    Math.round(Number(m.conversions ?? 0)),
        costPerConversion: Math.round(Number(m.costPerConversion ?? 0) / 10000) / 100,
        videoViews:     Number(m.videoViews ?? 0),
      };
    });

    // Parse overview
    const ov = (overviewRes.results ?? [])[0];
    const om = ov ? (ov.metrics as Record<string, unknown>) : {};
    const overview = {
      impressions:       Number(om.impressions       ?? 0),
      clicks:            Number(om.clicks            ?? 0),
      spend:             Math.round(Number(om.costMicros ?? 0) / 10000) / 100,
      ctr:               Math.round(Number(om.ctr ?? 0) * 10000) / 100,
      avgCpc:            Math.round(Number(om.averageCpc ?? 0) / 10000) / 100,
      conversions:       Math.round(Number(om.conversions ?? 0)),
      costPerConversion: Math.round(Number(om.costPerConversion ?? 0) / 10000) / 100,
    };

    return NextResponse.json({ overview, campaigns });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
