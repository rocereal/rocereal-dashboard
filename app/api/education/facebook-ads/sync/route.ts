import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FB_TOKEN    = process.env.FB_ACCESS_TOKEN!;
const AD_ACCOUNT  = "act_680994874576116";
const API_BASE    = "https://graph.facebook.com/v21.0";
const DAYS_BACK   = 90; // sync last 90 days on each live refresh

async function fbGet(url: string, params: Record<string, string>) {
  const results: Record<string, unknown>[] = [];
  let nextUrl: string | null = url;
  let nextParams: Record<string, string> | null = { ...params, access_token: FB_TOKEN, limit: "500" };

  while (nextUrl) {
    const reqUrl = new URL(nextUrl);
    if (nextParams) {
      Object.entries(nextParams).forEach(([k, v]) => reqUrl.searchParams.set(k, v));
    }
    const resp = await fetch(reqUrl.toString());
    if (!resp.ok) {
      const err: unknown = await resp.json();
      throw new Error(`FB API error: ${JSON.stringify(err)}`);
    }
    const json = await resp.json() as { data?: Record<string, unknown>[]; paging?: { next?: string } };
    results.push(...(json.data ?? []));
    nextUrl = json.paging?.next ?? null;
    nextParams = null;
  }
  return results;
}

async function fetchInsights(level: string, dateStart: string, dateStop: string) {
  const baseFields = "impressions,clicks,spend,reach,frequency,ctr,cpc,cpm,cpp,purchase_roas,actions,cost_per_action_type";
  const levelFields =
    level === "campaign" ? `campaign_id,campaign_name,${baseFields}` :
    level === "adset"    ? `campaign_id,campaign_name,adset_id,adset_name,${baseFields}` :
                           `campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,${baseFields}`;

  return fbGet(`${API_BASE}/${AD_ACCOUNT}/insights`, {
    level,
    fields: levelFields,
    time_range: JSON.stringify({ since: dateStart, until: dateStop }),
    time_increment: "1",
  });
}

async function fetchMeta(level: string) {
  const meta: Record<string, Record<string, unknown>> = {};
  const endpoint =
    level === "campaign" ? "campaigns" :
    level === "adset"    ? "adsets" : "ads";
  const fields =
    level === "campaign" ? "id,name,status,effective_status,objective,daily_budget,lifetime_budget" :
    level === "adset"    ? "id,name,status,effective_status,daily_budget,lifetime_budget,campaign_id" :
                           "id,name,status,effective_status,adset_id,campaign_id";

  const rows = await fbGet(`${API_BASE}/${AD_ACCOUNT}/${endpoint}`, { fields });
  for (const r of rows) meta[r.id as string] = r;
  return meta;
}

function safeFloat(d: Record<string, unknown>, key: string): number {
  const v = d[key];
  if (v == null) return 0;
  if (Array.isArray(v) && v.length > 0) return parseFloat((v[0] as Record<string, string>).value ?? "0") || 0;
  return parseFloat(v as string) || 0;
}

function safeInt(d: Record<string, unknown>, key: string): number {
  const v = d[key];
  if (v == null) return 0;
  if (Array.isArray(v) && v.length > 0) return Math.round(parseFloat((v[0] as Record<string, string>).value ?? "0")) || 0;
  return Math.round(parseFloat(v as string)) || 0;
}

export async function POST() {
  if (!FB_TOKEN) return NextResponse.json({ error: "FB_ACCESS_TOKEN not set" }, { status: 500 });

  const today     = new Date();
  const dateStop  = today.toISOString().slice(0, 10);
  const dateStart = new Date(today.getTime() - DAYS_BACK * 86400000).toISOString().slice(0, 10);

  let total = 0;

  for (const level of ["campaign", "adset", "ad"] as const) {
    const [insights, meta] = await Promise.all([
      fetchInsights(level, dateStart, dateStop),
      fetchMeta(level),
    ]);

    for (const i of insights) {
      const ins = i as Record<string, unknown>;
      const entityId   = (ins[`${level === "ad" ? "ad" : level}_id`] ?? ins.campaign_id) as string;
      const entityName = (ins[`${level === "ad" ? "ad" : level}_name`] ?? ins.campaign_name) as string;
      const m = meta[entityId] ?? {};

      const budget     = m.daily_budget ? parseFloat(m.daily_budget as string) / 100 :
                         m.lifetime_budget ? parseFloat(m.lifetime_budget as string) / 100 : null;
      const budgetType = m.daily_budget ? "daily" : m.lifetime_budget ? "lifetime" : null;

      // Use primary action type (matches Facebook Ads Manager "Results" column)
      // cost_per_action_type[0] identifies the campaign's optimization goal action
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
        // fallback: sum all actions
        totalActions = actionsList.reduce((sum, a) => sum + Math.round(parseFloat((a as Record<string, string>).value ?? "0")), 0);
      }
      const spendVal = safeFloat(ins, "spend");
      const costPerResult = totalActions > 0 ? Math.round((spendVal / totalActions) * 100) / 100 : 0;

      const ds = new Date((ins.date_start as string) + "T00:00:00Z");
      const de = new Date((ins.date_stop  as string) + "T00:00:00Z");

      await prisma.facebookAdInsight.upsert({
        where: { level_entityId_dateStart_dateStop: { level, entityId, dateStart: ds, dateStop: de } },
        create: {
          level, entityId, entityName,
          campaignId:   (ins.campaign_id   as string) ?? null,
          campaignName: (ins.campaign_name as string) ?? null,
          adsetId:      (ins.adset_id      as string) ?? null,
          adsetName:    (ins.adset_name    as string) ?? null,
          status:       ((m.effective_status ?? m.status) as string) ?? null,
          objective:    (m.objective       as string) ?? null,
          dateStart: ds, dateStop: de,
          impressions: safeInt(ins,   "impressions"),
          clicks:      safeInt(ins,   "clicks"),
          spend:       spendVal,
          reach:       safeInt(ins,   "reach"),
          frequency:   safeFloat(ins, "frequency"),
          ctr:         safeFloat(ins, "ctr"),
          cpc:         safeFloat(ins, "cpc"),
          cpm:         safeFloat(ins, "cpm"),
          cpp:         safeFloat(ins, "cpp"),
          purchaseRoas:      safeFloat(ins, "purchase_roas") || null,
          conversions:       totalActions,
          costPerConversion: costPerResult,
          budget, budgetType,
          accountId: AD_ACCOUNT,
        },
        update: {
          entityName,
          status:      ((m.effective_status ?? m.status) as string) ?? null,
          impressions: safeInt(ins,   "impressions"),
          clicks:      safeInt(ins,   "clicks"),
          spend:       spendVal,
          reach:       safeInt(ins,   "reach"),
          frequency:   safeFloat(ins, "frequency"),
          ctr:         safeFloat(ins, "ctr"),
          cpc:         safeFloat(ins, "cpc"),
          cpm:         safeFloat(ins, "cpm"),
          cpp:         safeFloat(ins, "cpp"),
          purchaseRoas:      safeFloat(ins, "purchase_roas") || null,
          conversions:       totalActions,
          costPerConversion: costPerResult,
          budget, budgetType,
          syncedAt: new Date(),
        },
      });
      total++;
    }
  }

  return NextResponse.json({ success: true, synced: total });
}
