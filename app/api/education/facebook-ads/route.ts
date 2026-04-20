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

async function fetchMeta(
  level: string,
  campaignIds?: string,
  adsetIds?: string,
): Promise<Map<string, Record<string, unknown>>> {
  const endpoint =
    level === "campaign" ? "campaigns" :
    level === "adset"    ? "adsets"    : "ads";
  const fields =
    level === "campaign" ? "id,name,effective_status,objective,daily_budget,lifetime_budget" :
    level === "adset"    ? "id,name,effective_status,optimization_goal,daily_budget,lifetime_budget,campaign_id" :
                           "id,name,effective_status,optimization_goal,adset_id,campaign_id";

  const rows = await fbGet(`${API_BASE}/${AD_ACCOUNT}/${endpoint}`, { fields });

  // Filter for drill-down
  let filtered = rows;
  if (level === "adset" && campaignIds) {
    const ids = new Set(campaignIds.split(","));
    filtered = rows.filter((r) => ids.has(r.campaign_id as string));
  } else if (level === "ad" && adsetIds) {
    const ids = new Set(adsetIds.split(","));
    filtered = rows.filter((r) => ids.has(r.adset_id as string));
  }

  return new Map(filtered.map((r) => [r.id as string, r]));
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

// Maps FB action_type / objective / optimization_goal to human-readable labels
const ACTION_TYPE_LABELS: Record<string, string> = {
  "call":                                          "Calls placed",
  "onsite_conversion.flow_complete":               "On-Facebook leads",
  "lead":                                          "Leads",
  "offsite_conversion.fb_pixel_lead":              "Leads",
  "offsite_conversion.fb_pixel_purchase":          "Purchases",
  "offsite_conversion.fb_pixel_complete_registration": "Registrations",
  "link_click":                                    "Link clicks",
  "omni_purchase":                                 "Purchases",
  "contact_total":                                 "Contacts",
  "contact":                                       "Contacts",
  "video_view":                                    "Video views",
  "post_engagement":                               "Post engagement",
};

const OBJECTIVE_LABELS: Record<string, string> = {
  "OUTCOME_LEADS":         "Leads",
  "OUTCOME_SALES":         "Purchases",
  "OUTCOME_TRAFFIC":       "Link clicks",
  "OUTCOME_ENGAGEMENT":    "Post engagement",
  "OUTCOME_AWARENESS":     "Reach",
  "OUTCOME_APP_PROMOTION": "App installs",
  "LEAD_GENERATION":       "Leads",
  "CONVERSIONS":           "Purchases",
  "LINK_CLICKS":           "Link clicks",
  "VIDEO_VIEWS":           "Video views",
  "PAGE_LIKES":            "Page likes",
  "REACH":                 "Reach",
  "BRAND_AWARENESS":       "Reach",
  "MESSAGES":              "Messages",
  "CALLS":                 "Calls placed",
  "STORE_VISITS":          "Store visits",
};

const OPTIMIZATION_GOAL_LABELS: Record<string, string> = {
  "CALL_CLICKS":           "Calls placed",
  "LEAD_GENERATION":       "Leads",
  "OFFSITE_CONVERSIONS":   "Conversions",
  "LINK_CLICKS":           "Link clicks",
  "LANDING_PAGE_VIEWS":    "Landing page views",
  "REACH":                 "Reach",
  "IMPRESSIONS":           "Impressions",
  "VIDEO_VIEWS":           "Video views",
  "ENGAGED_USERS":         "Post engagement",
  "REPLIES":               "Messages",
  "THRUPLAY":              "ThruPlay views",
  "QUALITY_CALL":          "Calls placed",
  "VALUE":                 "Value",
};

function getResultTypeLabel(
  ins: Record<string, unknown>,
  objective: string | null | undefined,
  optimizationGoal: string | null | undefined,
): string {
  // 1. Best: use actual primary action type from insights
  const costPerActionList = ins.cost_per_action_type as Record<string, string>[] | undefined;
  if (Array.isArray(costPerActionList) && costPerActionList.length > 0) {
    const t = costPerActionList[0].action_type;
    if (ACTION_TYPE_LABELS[t]) return ACTION_TYPE_LABELS[t];
    return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  // 2. Fall back to optimization_goal (adset/ad level)
  if (optimizationGoal && OPTIMIZATION_GOAL_LABELS[optimizationGoal]) {
    return OPTIMIZATION_GOAL_LABELS[optimizationGoal];
  }
  // 3. Fall back to campaign objective
  if (objective && OBJECTIVE_LABELS[objective]) {
    return OBJECTIVE_LABELS[objective];
  }
  return "";
}

// Maps optimization_goal → the exact action_type Facebook Ads Manager counts as "Results"
const GOAL_TO_ACTION: Record<string, string> = {
  "CALL_CLICKS":           "click_to_call_native_call_placed",
  "QUALITY_CALL":          "click_to_call_native_call_placed",
  "LEAD_GENERATION":       "lead",
  "OFFSITE_CONVERSIONS":   "offsite_conversion.fb_pixel_purchase",
  "LINK_CLICKS":           "link_click",
  "LANDING_PAGE_VIEWS":    "landing_page_view",
  "REACH":                 "reach",
  "IMPRESSIONS":           "impressions",
  "VIDEO_VIEWS":           "video_view",
  "THRUPLAY":              "video_view",
  "ENGAGED_USERS":         "post_engagement",
  "REPLIES":               "onsite_conversion.messaging_conversation_started_7d",
  "VALUE":                 "offsite_conversion.fb_pixel_purchase",
};

// Priority order: when optimization_goal is unknown (campaign level),
// pick the first action_type from this list that exists in the data.
// Order mirrors what Ads Manager shows as the primary "Results" metric.
const ACTION_PRIORITY = [
  "click_to_call_native_call_placed",
  "lead",
  "offsite_conversion.fb_pixel_purchase",
  "offsite_conversion.fb_pixel_lead",
  "landing_page_view",
  "onsite_conversion.lead_grouped",
  "link_click",
  "video_view",
  "post_engagement",
  "page_engagement",
];

function extractResults(
  ins: Record<string, unknown>,
  objective: string | null | undefined,
  optimizationGoal: string | null | undefined,
): { conversions: number; costPerResult: number; resultType: string } {
  const actionsList = ins.actions as Record<string, string>[] | undefined;
  const costPerActionList = ins.cost_per_action_type as Record<string, string>[] | undefined;

  let primaryActionType: string | null = null;

  // 1. Best: optimization_goal → exact mapping (adset/ad level)
  if (optimizationGoal && GOAL_TO_ACTION[optimizationGoal]) {
    primaryActionType = GOAL_TO_ACTION[optimizationGoal];
  }

  // 2. Campaign level: no optimization_goal — pick from priority list
  //    using only action types that also appear in cost_per_action_type
  //    (those are the ones FB considers "optimizable" results)
  if (!primaryActionType && Array.isArray(costPerActionList)) {
    const costTypes = new Set(costPerActionList.map((c) => c.action_type));
    primaryActionType = ACTION_PRIORITY.find((t) => costTypes.has(t)) ?? null;
  }

  // 3. Last resort: first entry of cost_per_action_type
  if (!primaryActionType && Array.isArray(costPerActionList) && costPerActionList.length > 0) {
    primaryActionType = costPerActionList[0].action_type;
  }

  let totalActions = 0;
  if (primaryActionType && Array.isArray(actionsList)) {
    totalActions = actionsList
      .filter((a) => a.action_type === primaryActionType)
      .reduce((sum, a) => sum + Math.round(parseFloat(a.value ?? "0")), 0);
  }

  const spend = parseFloat(ins.spend as string) || 0;
  const costPerResult = totalActions > 0 ? Math.round((spend / totalActions) * 100) / 100 : 0;
  const resultType = getResultTypeLabel(ins, objective, optimizationGoal);
  return { conversions: totalActions, costPerResult, resultType };
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
  const adsetIds    = searchParams.get("adsetIds")    ?? undefined;

  // Default to today if no date range provided
  const today = new Date().toISOString().slice(0, 10);
  const dateStart = from ?? today;
  const dateStop  = to   ?? today;

  // Fetch metadata (filtered by drill-down) and insights in parallel
  const [meta, insightRows] = await Promise.all([
    fetchMeta(level, campaignIds, adsetIds),
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
    const objective       = (m.objective        ?? null) as string | null;
    const optimizationGoal = (m.optimization_goal ?? null) as string | null;
    const { conversions, costPerResult, resultType } = extractResults(ins, objective, optimizationGoal);

    const budget = m.daily_budget
      ? parseFloat(m.daily_budget as string) / 100
      : m.lifetime_budget
      ? parseFloat(m.lifetime_budget as string) / 100
      : null;
    const budgetType = m.daily_budget ? "daily" : m.lifetime_budget ? "lifetime" : null;

    return {
      entityId,
      entityName:   m.name as string,
      campaignId:   (ins.campaign_id   ?? null) as string | null,
      campaignName: (ins.campaign_name ?? null) as string | null,
      adsetId:      (ins.adset_id      ?? null) as string | null,
      adsetName:    (ins.adset_name    ?? null) as string | null,
      status:       m.effective_status as string,
      objective,
      budget,
      budgetType,
      impressions: parseInt(ins.impressions as string) || 0,
      clicks:      parseInt(ins.clicks      as string) || 0,
      spend:       parseFloat(ins.spend     as string) || 0,
      reach:       parseInt(ins.reach       as string) || 0,
      conversions,
      resultType,
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

  // ?debug=1 returns raw actions arrays to diagnose Results discrepancies
  if (searchParams.get("debug") === "1") {
    return NextResponse.json(
      Array.from(insightsMap.entries()).map(([id, ins]) => ({
        entityId: id,
        entityName: ins.campaign_name ?? ins.adset_name ?? ins.ad_name,
        spend: ins.spend,
        actions: ins.actions,
        cost_per_action_type: ins.cost_per_action_type,
      }))
    );
  }

  return NextResponse.json(rows);
}
