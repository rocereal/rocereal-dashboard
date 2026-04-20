import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const BY_FIELDS: Prisma.FacebookAdInsightScalarFieldEnum[] = [
  "entityId", "entityName", "campaignId", "campaignName",
  "adsetId", "adsetName", "status", "objective",
  "budget", "budgetType", "accountId",
];

async function groupInsights(where: Prisma.FacebookAdInsightWhereInput) {
  return prisma.facebookAdInsight.groupBy({
    by: BY_FIELDS,
    where,
    _sum: { impressions: true, clicks: true, spend: true, reach: true, conversions: true },
    _avg: { ctr: true, cpc: true, cpm: true, purchaseRoas: true, costPerConversion: true, frequency: true },
    orderBy: { _sum: { spend: "desc" } },
  });
}

type GroupRow = Awaited<ReturnType<typeof groupInsights>>[0];

function extractMetrics(m: GroupRow | null | undefined) {
  const sum = m?._sum;
  const avg = m?._avg;
  return {
    impressions:   sum?.impressions  ?? 0,
    clicks:        sum?.clicks       ?? 0,
    spend:         sum?.spend        ?? 0,
    reach:         sum?.reach        ?? 0,
    conversions:   sum?.conversions  ?? 0,
    ctr:           avg?.ctr          ?? 0,
    cpc:           avg?.cpc          ?? 0,
    cpm:           avg?.cpm          ?? 0,
    purchaseRoas:  avg?.purchaseRoas ?? null,
    costPerResult: avg?.costPerConversion ?? 0,
    frequency:     avg?.frequency    ?? 0,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const level       = searchParams.get("level") || "campaign";
  const from        = searchParams.get("from");
  const to          = searchParams.get("to");
  const campaignIds = searchParams.get("campaignIds");
  const adsetIds    = searchParams.get("adsetIds");

  const drillFilter: Prisma.FacebookAdInsightWhereInput =
    level === "adset" && campaignIds ? { campaignId: { in: campaignIds.split(",") } } :
    level === "ad"    && adsetIds    ? { adsetId:    { in: adsetIds.split(",")    } } :
    {};

  const baseWhere: Prisma.FacebookAdInsightWhereInput = { level, ...drillFilter };

  // All entities — gives full list + latest metadata regardless of date
  const allEntities = await groupInsights(baseWhere);

  // Date-range metrics (only if range provided)
  let metricsMap: Map<string, GroupRow> | null = null;
  if (from && to) {
    const rangeRows = await groupInsights({
      ...baseWhere,
      dateStart: { gte: new Date(from) },
      dateStop:  { lte: new Date(to + "T23:59:59Z") },
    });
    metricsMap = new Map(rangeRows.map((r) => [r.entityId, r]));
  }

  const mapped = allEntities.map((r) => {
    const m = metricsMap ? (metricsMap.get(r.entityId) ?? null) : r;
    return {
      entityId:     r.entityId,
      entityName:   r.entityName,
      campaignId:   r.campaignId,
      campaignName: r.campaignName,
      adsetId:      r.adsetId,
      adsetName:    r.adsetName,
      status:       r.status,
      objective:    r.objective,
      budget:       r.budget,
      budgetType:   r.budgetType,
      ...extractMetrics(m),
    };
  });

  if (metricsMap) mapped.sort((a, b) => b.spend - a.spend);

  return NextResponse.json(mapped);
}
