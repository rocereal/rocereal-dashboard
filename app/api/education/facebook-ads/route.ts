import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type MetaRow = {
  entityId: string;
  entityName: string;
  campaignId: string | null;
  campaignName: string | null;
  adsetId: string | null;
  adsetName: string | null;
  status: string | null;
  objective: string | null;
  budget: number | null;
  budgetType: string | null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const level       = searchParams.get("level") || "campaign";
  const from        = searchParams.get("from");
  const to          = searchParams.get("to");
  const campaignIds = searchParams.get("campaignIds");
  const adsetIds    = searchParams.get("adsetIds");

  // Build WHERE fragments for raw query
  const drillSql =
    level === "adset" && campaignIds
      ? Prisma.sql`AND "campaignId" = ANY(${campaignIds.split(",")}) `
      : level === "ad" && adsetIds
      ? Prisma.sql`AND "adsetId" = ANY(${adsetIds.split(",")}) `
      : Prisma.sql``;

  // Step 1: Latest metadata per entityId using proper DISTINCT ON
  // Orders by dateStop DESC so we get the most recent row (= current status/name/budget)
  const latestRecords = await prisma.$queryRaw<MetaRow[]>`
    SELECT DISTINCT ON ("entityId")
      "entityId", "entityName", "campaignId", "campaignName",
      "adsetId", "adsetName", "status", "objective",
      "budget"::float8, "budgetType"
    FROM "FacebookAdInsight"
    WHERE "level" = ${level}
    ${drillSql}
    ORDER BY "entityId", "dateStop" DESC, "syncedAt" DESC
  `;

  // Filter out stale campaigns no longer in Facebook (null status = never returned by FB meta)
  const activeEntities = latestRecords.filter((r) => r.status !== null);
  const entityIds = activeEntities.map((r) => r.entityId);

  if (entityIds.length === 0) return NextResponse.json([]);

  // Step 2: Aggregate metrics, filtered by date range if provided
  const metricsWhere: Prisma.FacebookAdInsightWhereInput = {
    level,
    entityId: { in: entityIds },
    ...(from && to ? {
      dateStart: { gte: new Date(from) },
      dateStop:  { lte: new Date(to + "T23:59:59Z") },
    } : {}),
    ...(level === "adset" && campaignIds ? { campaignId: { in: campaignIds.split(",") } } : {}),
    ...(level === "ad"    && adsetIds    ? { adsetId:    { in: adsetIds.split(",")    } } : {}),
  };

  const metricsRows = await prisma.facebookAdInsight.groupBy({
    by: ["entityId"],
    where: metricsWhere,
    _sum: { impressions: true, clicks: true, spend: true, reach: true, conversions: true },
    _avg: { ctr: true, cpc: true, cpm: true, purchaseRoas: true, costPerConversion: true, frequency: true },
  });

  const metricsMap = new Map(metricsRows.map((r) => [r.entityId, r]));

  // Step 3: Merge metadata + metrics
  const mapped = activeEntities.map((r) => {
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
