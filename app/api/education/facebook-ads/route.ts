import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FB_TOKEN   = process.env.FB_ACCESS_TOKEN!;
const AD_ACCOUNT = "act_680994874576116";
const API_BASE   = "https://graph.facebook.com/v21.0";

async function fbGet(url: string, params: Record<string, string>) {
  const results: Record<string, unknown>[] = [];
  let nextUrl: string | null = url;
  let nextParams: Record<string, string> | null = { ...params, access_token: FB_TOKEN, limit: "500" };

  while (nextUrl) {
    const reqUrl = new URL(nextUrl);
    if (nextParams) {
      Object.entries(nextParams).forEach(([k, v]) => reqUrl.searchParams.set(k, v));
    }
    const resp = await fetch(reqUrl.toString(), { cache: "no-store" });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(`FB API error: ${JSON.stringify(err)}`);
    }
    const json = await resp.json() as { data?: Record<string, unknown>[]; paging?: { next?: string } };
    results.push(...(json.data ?? []));
    nextUrl = json.paging?.next ?? null;
    nextParams = null;
  }
  return results;
}

async function fetchMeta(level: string): Promise<Map<string, Record<string, unknown>>> {
  const endpoint =
    level === "campaign" ? "campaigns" :
    level === "adset"    ? "adsets"    : "ads";
  const fields =
    level === "campaign" ? "id,name,effective_status,objective,daily_budget,lifetime_budget" :
    level === "adset"    ? "id,name,effective_status,daily_budget,lifetime_budget,campaign_id" :
                           "id,name,effective_status,adset_id,campaign_id";

  const rows = await fbGet(`${API_BASE}/${AD_ACCOUNT}/${endpoint}`, { fields });
  return new Map(rows.map((r) => [r.id as string, r]));
}

async function fetchInsights(
  level: string,
  dateStart: string,
  dateStop: string,
  campaignIds?: string,
  adsetIds?: string,
) {
  const baseFields = "impressions,clicks,spend,reach,frequency,ctr,cpc,cpm,purchase_roas,actions,cost_per_action_type";
  const levelFields =
    level === "campaign" ? `campaign_id,campaign_name,${baseFields}` :
    level === "adset"    ? `campaign_id,campaign_name,adset_id,adset_name,${baseFields}` :
                           `campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,${baseFields}`;

  const params: Record<string, string> = {
    level,
    fields: levelFields,
    time_range: JSON.stringify({ since: dateStart, until: dateStop }),
  };

  // Drill-down filtering via breakdowns not supported in insights — we filter client-side below
  const rows = await fbGet(`${API_BASE}/${AD_ACCOUNT}/insights`, params);

  // Filter for drill-down
  if (level === "adset" && campaignIds) {
    const ids = new Set(campaignIds.split(","));
    return rows.filter((r) => ids.has(r.campaign_id as string));
  }
  if (level === "ad" && adsetIds) {
    const ids = new Set(adsetIds.split(","));
    return rows.filter((r) => ids.has(r.adset_id as string));
  }
  return rows;
}

function extractResults(ins: Record<string, unknown>): { conversions: number; costPerResult: number } {
  const actionsList = ins.actions;
  const costPerActionList = ins.cost_per_action_type;
  let totalActions = 0;

  if (Array.isArray(costPerActionList) && costPerActionList.length > 0) {
    const primaryType = (costPerActionList[0] as Record<string, string>).action_type;
    totalActions = Array.isArray(actionsList)
      ? actionsList
          .filter((a) => (a as Record<string, string>).action_type === primaryType)
          .reduce((sum, a) => sum + Math.round(parseFloat((a as Record<string, string>).value ?? "0")), 0)
      : 0;
  } else if (Array.isArray(actionsList)) {
    totalActions = actionsList.reduce(
      (sum, a) => sum + Math.round(parseFloat((a as Record<string, string>).value ?? "0")), 0
    );
  }

  const spend = parseFloat(ins.spend as string) || 0;
  const costPerResult = totalActions > 0 ? Math.round((spend / totalActions) * 100) / 100 : 0;
  return { conversions: totalActions, costPerResult };
}

function safeFloat(d: Record<string, unknown>, key: string): number {
  const v = d[key];
  if (v == null) return 0;
  if (Array.isArray(v) && v.length > 0) return parseFloat((v[0] as Record<string, string>).value ?? "0") || 0;
  return parseFloat(v as string) || 0;
}

export async function GET(req: NextRequest) {
  if (!FB_TOKEN) return NextResponse.json({ error: "FB_ACCESS_TOKEN not set" }, { status: 500 });

  const { searchParams } = req.nextUrl;
  const level       = searchParams.get("level") || "campaign";
  const from        = searchParams.get("from");
  const to          = searchParams.get("to");
  const campaignIds = searchParams.get("campaignIds") ?? undefined;
  const adsetIds    = searchParams.get("adsetIds") ?? undefined;

  // Default to today if no date range provided
  const today = new Date().toISOString().slice(0, 10);
  const dateStart = from ?? today;
  const dateStop  = to   ?? today;

  // Fetch metadata (all entities with current effective_status) and insights in parallel
  const [meta, insightRows] = await Promise.all([
    fetchMeta(level),
    fetchInsights(level, dateStart, dateStop, campaignIds, adsetIds),
  ]);

  // Build a map of insights aggregated by entityId (sum over the date range)
  const insightsMap = new Map<string, Record<string, unknown>>();
  for (const ins of insightRows) {
    const entityId =
      level === "campaign" ? ins.campaign_id as string :
      level === "adset"    ? ins.adset_id    as string :
                             ins.ad_id       as string;
    if (!insightsMap.has(entityId)) {
      insightsMap.set(entityId, { ...ins });
    } else {
      // Aggregate numerics
      const existing = insightsMap.get(entityId)!;
      for (const key of ["impressions", "clicks", "reach"] as const) {
        existing[key] = (parseInt(existing[key] as string) || 0) + (parseInt(ins[key] as string) || 0);
      }
      existing.spend = ((parseFloat(existing.spend as string) || 0) + (parseFloat(ins.spend as string) || 0)).toFixed(2);
      // For actions, merge arrays
      if (Array.isArray(ins.actions)) {
        const existingActions = (existing.actions as Record<string, string>[]) ?? [];
        for (const a of ins.actions as Record<string, string>[]) {
          const found = existingActions.find((e) => e.action_type === a.action_type);
          if (found) {
            found.value = String((parseInt(found.value) || 0) + (parseInt(a.value) || 0));
          } else {
            existingActions.push({ ...a });
          }
        }
        existing.actions = existingActions;
      }
      // Keep cost_per_action_type from first row (identifies the primary action type)
    }
  }

  // Build final rows: one per entity in meta
  const rows = Array.from(meta.entries()).map(([entityId, m]) => {
    const ins = insightsMap.get(entityId) ?? {};
    const { conversions, costPerResult } = extractResults(ins);

    const budget = m.daily_budget
      ? parseFloat(m.daily_budget as string) / 100
      : m.lifetime_budget
      ? parseFloat(m.lifetime_budget as string) / 100
      : null;
    const budgetType = m.daily_budget ? "daily" : m.lifetime_budget ? "lifetime" : null;

    return {
      entityId,
      entityName:   (ins.campaign_name ?? ins.adset_name ?? ins.ad_name ?? m.name) as string,
      campaignId:   (ins.campaign_id   ?? null) as string | null,
      campaignName: (ins.campaign_name ?? null) as string | null,
      adsetId:      (ins.adset_id      ?? null) as string | null,
      adsetName:    (ins.adset_name    ?? null) as string | null,
      status:       m.effective_status as string,
      objective:    (m.objective       ?? null) as string | null,
      budget,
      budgetType,
      impressions: parseInt(ins.impressions as string) || 0,
      clicks:      parseInt(ins.clicks      as string) || 0,
      spend:       parseFloat(ins.spend     as string) || 0,
      reach:       parseInt(ins.reach       as string) || 0,
      conversions,
      ctr:         safeFloat(ins, "ctr"),
      cpc:         safeFloat(ins, "cpc"),
      cpm:         safeFloat(ins, "cpm"),
      purchaseRoas: safeFloat(ins, "purchase_roas") || null,
      costPerResult,
      frequency:   safeFloat(ins, "frequency"),
    };
  });

  // Sort: entities with spend first, then by spend desc
  rows.sort((a, b) => b.spend - a.spend);

  return NextResponse.json(rows);
}
