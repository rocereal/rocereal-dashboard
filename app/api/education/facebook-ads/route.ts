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
    level === "adset"    ? "id,name,effective_status,daily_budget,lifetime_budget,campaign_id" :
                           "id,name,effective_status,adset_id,campaign_id";

  let rows: Record<string, unknown>[] = [];

  if (level === "campaign") {
    // Facebook API by default returns only ACTIVE/PAUSED campaigns.
    // To get COMPLETED ones we need to pass each status as a separate
    // effective_status[] query param — NOT a JSON array string.
    const url = new URL(`${API_BASE}/${AD_ACCOUNT}/${endpoint}`);
    url.searchParams.set("fields", fields);
    url.searchParams.set("access_token", FB_TOKEN);
    url.searchParams.set("limit", "500");
    for (const s of ["ACTIVE", "PAUSED", "ARCHIVED", "DELETED", "COMPLETED", "IN_PROCESS", "WITH_ISSUES"]) {
      url.searchParams.append("effective_status[]", s);
    }
    let nextUrl: string | null = url.toString();
    while (nextUrl) {
      const resp = await fetch(nextUrl, { cache: "no-store" });
      if (!resp.ok) {
        // If multi-status filter fails, fall back to default (ACTIVE/PAUSED only)
        const fallback = await fbGet(`${API_BASE}/${AD_ACCOUNT}/${endpoint}`, { fields });
        rows = fallback;
        nextUrl = null;
        break;
      }
      const json = await resp.json() as { data?: Record<string, unknown>[]; paging?: { next?: string } };
      rows.push(...(json.data ?? []));
      nextUrl = json.paging?.next ?? null;
    }
  } else {
    rows = await fbGet(`${API_BASE}/${AD_ACCOUNT}/${endpoint}`, { fields });
  }

  // Filter for drill-down: adsets by campaignId, ads by adsetId
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

  const rows = await fbGet(`${API_BASE}/${AD_ACCOUNT}/insights`, {
    level,
    fields: levelFields,
    time_range: JSON.stringify({ since: dateStart, until: dateStop }),
  });

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

// Map FB action_type keys to human-readable labels (same as Ads Manager)
const ACTION_LABELS: Record<string, string> = {
  "call":                                  "Calls placed",
  "onsite_conversion.flow_complete":       "On-Facebook leads",
  "lead":                                  "Leads",
  "offsite_conversion.fb_pixel_lead":      "Leads",
  "offsite_conversion.fb_pixel_purchase":  "Purchases",
  "offsite_conversion.fb_pixel_complete_registration": "Registrations",
  "link_click":                            "Link clicks",
  "post_engagement":                       "Post engagement",
  "page_engagement":                       "Page engagement",
  "video_view":                            "Video views",
  "omni_purchase":                         "Purchases",
  "contact":                               "Contacts",
  "contact_total":                         "Contacts",
  "contact_website":                       "Website contacts",
};

function getActionLabel(actionType: string): string {
  return ACTION_LABELS[actionType] ?? actionType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractResults(ins: Record<string, unknown>): {
  conversions: number;
  costPerResult: number;
  resultType: string;
} {
  const actionsList = ins.actions as Record<string, string>[] | undefined;
  const costPerActionList = ins.cost_per_action_type as Record<string, string>[] | undefined;

  if (!Array.isArray(costPerActionList) || costPerActionList.length === 0 || !Array.isArray(actionsList)) {
    return { conversions: 0, costPerResult: 0, resultType: "" };
  }

  // cost_per_action_type[0] is the campaign's primary optimization action
  const primaryType = costPerActionList[0].action_type;
  const totalActions = actionsList
    .filter((a) => a.action_type === primaryType)
    .reduce((sum, a) => sum + Math.round(parseFloat(a.value ?? "0")), 0);

  const spend = parseFloat(ins.spend as string) || 0;
  const costPerResult = totalActions > 0 ? Math.round((spend / totalActions) * 100) / 100 : 0;

  return {
    conversions: totalActions,
    costPerResult,
    resultType: getActionLabel(primaryType),
  };
}

function safeFloat(d: Record<string, unknown>, key: string): number {
  const v = d[key];
  if (v == null) return 0;
  if (Array.isArray(v) && v.length > 0) return parseFloat((v[0] as Record<string, string>).value ?? "0") || 0;
  return parseFloat(v as string) || 0;
}

function getEntityId(level: string, ins: Record<string, unknown>): string {
  if (level === "campaign") return ins.campaign_id as string;
  if (level === "adset")    return ins.adset_id    as string;
  return ins.ad_id as string;
}

function getEntityName(level: string, ins: Record<string, unknown>): string {
  if (level === "campaign") return ins.campaign_name as string;
  if (level === "adset")    return ins.adset_name    as string;
  return ins.ad_name as string;
}

export async function GET(req: NextRequest) {
  if (!FB_TOKEN) return NextResponse.json({ error: "FB_ACCESS_TOKEN not set" }, { status: 500 });

  try {
  const { searchParams } = req.nextUrl;
  const level       = searchParams.get("level") || "campaign";
  const from        = searchParams.get("from");
  const to          = searchParams.get("to");
  const campaignIds = searchParams.get("campaignIds") ?? undefined;
  const adsetIds    = searchParams.get("adsetIds")    ?? undefined;

  const today = new Date().toISOString().slice(0, 10);
  const dateStart = from ?? today;
  const dateStop  = to   ?? today;

  const [meta, insightRows] = await Promise.all([
    fetchMeta(level, campaignIds, adsetIds),
    fetchInsights(level, dateStart, dateStop, campaignIds, adsetIds),
  ]);

  // Aggregate insights by entityId (sum across days if date range > 1 day)
  const insightsMap = new Map<string, Record<string, unknown>>();
  for (const ins of insightRows) {
    const entityId = getEntityId(level, ins);
    if (!insightsMap.has(entityId)) {
      insightsMap.set(entityId, { ...ins });
    } else {
      const existing = insightsMap.get(entityId)!;
      existing.impressions = String((parseInt(existing.impressions as string) || 0) + (parseInt(ins.impressions as string) || 0));
      existing.clicks      = String((parseInt(existing.clicks      as string) || 0) + (parseInt(ins.clicks      as string) || 0));
      existing.reach       = String((parseInt(existing.reach       as string) || 0) + (parseInt(ins.reach       as string) || 0));
      existing.spend       = ((parseFloat(existing.spend as string) || 0) + (parseFloat(ins.spend as string) || 0)).toFixed(2);
      // Merge actions array
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
      // Keep cost_per_action_type from first row (identifies primary action type)
    }
  }

  // Build final rows: one per entity from meta
  const rows = Array.from(meta.entries()).map(([entityId, m]) => {
    const ins = insightsMap.get(entityId) ?? {};
    const { conversions, costPerResult, resultType } = extractResults(ins);

    const budget = m.daily_budget
      ? parseFloat(m.daily_budget as string) / 100
      : m.lifetime_budget
      ? parseFloat(m.lifetime_budget as string) / 100
      : null;
    const budgetType = m.daily_budget ? "daily" : m.lifetime_budget ? "lifetime" : null;

    const entityName = Object.keys(ins).length > 0
      ? getEntityName(level, ins)
      : m.name as string;

    return {
      entityId,
      entityName,
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
      resultType,
      ctr:         safeFloat(ins, "ctr"),
      cpc:         safeFloat(ins, "cpc"),
      cpm:         safeFloat(ins, "cpm"),
      purchaseRoas: safeFloat(ins, "purchase_roas") || null,
      costPerResult,
      frequency:   safeFloat(ins, "frequency"),
    };
  });

  rows.sort((a, b) => b.spend - a.spend);

  return NextResponse.json(rows);
  } catch (err) {
    console.error("FB API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
