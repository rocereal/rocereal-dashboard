import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const level     = (searchParams.get("level") || "campaign") as string;
  const from      = searchParams.get("from");   // YYYY-MM-DD
  const to        = searchParams.get("to");     // YYYY-MM-DD

  const campaignId = searchParams.get("campaignId");
  const adsetId    = searchParams.get("adsetId");

  const dateFilter = from && to ? {
    dateStart: { gte: new Date(from) },
    dateStop:  { lte: new Date(to + "T23:59:59Z") },
  } : {};

  const drillFilter = level === "adset" && campaignId ? { campaignId } :
                      level === "ad"    && adsetId    ? { adsetId }    : {};

  // Aggregate by entityId across the date range
  const rows = await prisma.facebookAdInsight.groupBy({
    by: ["entityId", "entityName", "campaignId", "campaignName", "adsetId", "adsetName", "status", "objective", "budget", "budgetType", "accountId"],
    where: { level, ...dateFilter, ...drillFilter },
    _sum: {
      impressions: true,
      clicks: true,
      spend: true,
      reach: true,
      conversions: true,
    },
    _avg: {
      ctr: true,
      cpc: true,
      cpm: true,
      purchaseRoas: true,
      costPerConversion: true,
      frequency: true,
    },
    orderBy: { _sum: { spend: "desc" } },
  });

  const mapped = rows.map((r: typeof rows[0]) => ({
    entityId:          r.entityId,
    entityName:        r.entityName,
    campaignId:        r.campaignId,
    campaignName:      r.campaignName,
    adsetId:           r.adsetId,
    adsetName:         r.adsetName,
    status:            r.status,
    objective:         r.objective,
    budget:            r.budget,
    budgetType:        r.budgetType,
    impressions:       r._sum.impressions ?? 0,
    clicks:            r._sum.clicks ?? 0,
    spend:             r._sum.spend ?? 0,
    reach:             r._sum.reach ?? 0,
    conversions:       r._sum.conversions ?? 0,
    ctr:               r._avg.ctr ?? 0,
    cpc:               r._avg.cpc ?? 0,
    cpm:               r._avg.cpm ?? 0,
    purchaseRoas:      r._avg.purchaseRoas ?? null,
    costPerResult:     r._avg.costPerConversion ?? 0,
    frequency:         r._avg.frequency ?? 0,
  }));

  return NextResponse.json(mapped);
}
