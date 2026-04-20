import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

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

  // Step 1: Get latest metadata per entityId (most recently synced record)
  // Using distinct on entityId ordered by syncedAt desc to get current status/name/budget
  const latestRecords = await prisma.facebookAdInsight.findMany({
    where: baseWhere,
    distinct: ["entityId"],
    orderBy: { syncedAt: "desc" },
    select: {
      entityId: true,
      entityName: true,
      campaignId: true,
      campaignName: true,
      adsetId: true,
      adsetName: true,
      status: true,
      objective: true,
      budget: true,
      budgetType: true,
    },
  });

  // Step 2: Get aggregated metrics grouped only by entityId
  // Use date range if provided, otherwise aggregate all time
  const metricsWhere: Prisma.FacebookAdInsightWhereInput = from && to
    ? {
        ...baseWhere,
        dateStart: { gte: new Date(from) },
        dateStop:  { lte: new Date(to + "T23:59:59Z") },
      }
    : baseWhere;

  const metricsRows = await prisma.facebookAdInsight.groupBy({
    by: ["entityId"],
    where: metricsWhere,
    _sum: { impressions: true, clicks: true, spend: true, reach: true, conversions: true },
    _avg: { ctr: true, cpc: true, cpm: true, purchaseRoas: true, costPerConversion: true, frequency: true },
  });

  const metricsMap = new Map(metricsRows.map((r) => [r.entityId, r]));

  // Step 3: Merge metadata + metrics
  const mapped = latestRecords.map((r) => {
    const m = metricsMap.get(r.entityId);
    const sum = m?._sum;
    const avg = m?._avg;
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
      impressions:   sum?.impressions  ?? 0,
      clicks:        sum?.clicks       ?? 0,
      spend:         Number(sum?.spend ?? 0),
      reach:         sum?.reach        ?? 0,
      conversions:   sum?.conversions  ?? 0,
      ctr:           avg?.ctr          ?? 0,
      cpc:           avg?.cpc          ?? 0,
      cpm:           avg?.cpm          ?? 0,
      purchaseRoas:  avg?.purchaseRoas ?? null,
      costPerResult: avg?.costPerConversion ?? 0,
      frequency:     avg?.frequency    ?? 0,
    };
  });

  // Sort by spend descending
  mapped.sort((a, b) => b.spend - a.spend);

  return NextResponse.json(mapped);
}
