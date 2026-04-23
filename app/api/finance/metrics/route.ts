/**
 * GET /api/finance/metrics?from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Returns three KPI groups for the requested period and the equivalent
 * previous period (same duration, ending the day before `from`):
 *   - incasate  : net revenue = paid(>0) + storno(<0), regardless of paid flag
 *   - stornate  : credit notes (totalAmount < 0)
 *   - emise     : issued but unpaid (paid=false, totalAmount > 0)
 */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface PeriodMetrics {
  count: number;
  total: number;
}

async function getMetrics(from: Date, to: Date): Promise<{
  incasate: PeriodMetrics;
  stornate: PeriodMetrics;
  emise: PeriodMetrics;
}> {
  const where = { issuedAt: { gte: from, lte: to } };

  const [incasatePoz, stornate, emise] = await Promise.all([
    // Paid invoices with positive amount
    prisma.smartbillInvoice.aggregate({
      where: { ...where, paid: true, totalAmount: { gt: 0 } },
      _count: { _all: true },
      _sum: { totalAmount: true },
    }),
    // Credit notes (storno) — negative totalAmount, regardless of paid flag
    prisma.smartbillInvoice.aggregate({
      where: { ...where, totalAmount: { lt: 0 } },
      _count: { _all: true },
      _sum: { totalAmount: true },
    }),
    // Issued but unpaid
    prisma.smartbillInvoice.aggregate({
      where: { ...where, paid: false, totalAmount: { gt: 0 } },
      _count: { _all: true },
      _sum: { totalAmount: true },
    }),
  ]);

  // Net revenue = paid positives + storno negatives (matches Evoluția Vânzărilor "Total")
  const netTotal = (incasatePoz._sum.totalAmount ?? 0) + (stornate._sum.totalAmount ?? 0);
  const netCount = incasatePoz._count._all + stornate._count._all;

  return {
    incasate: { count: netCount,             total: netTotal },
    stornate: { count: stornate._count._all, total: Math.abs(stornate._sum.totalAmount ?? 0) },
    emise:    { count: emise._count._all,    total: emise._sum.totalAmount ?? 0 },
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fromParam = searchParams.get("from");
  const toParam   = searchParams.get("to");

  // Current period
  const now = new Date();
  const from = fromParam ? new Date(fromParam + "T00:00:00") : new Date(now.getFullYear(), now.getMonth(), 1);
  const to   = toParam   ? new Date(toParam   + "T23:59:59") : now;

  // Previous period — same duration, ending the day before `from`
  const durationMs = to.getTime() - from.getTime();
  const prevTo   = new Date(from.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - durationMs);

  const [current, previous] = await Promise.all([
    getMetrics(from, to),
    getMetrics(prevFrom, prevTo),
  ]);

  const pct = (curr: number, prev: number): number | null => {
    if (prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
  };

  return NextResponse.json({
    period:     { from: from.toISOString(), to: to.toISOString() },
    prevPeriod: { from: prevFrom.toISOString(), to: prevTo.toISOString() },
    incasate: {
      ...current.incasate,
      prevCount: previous.incasate.count,
      prevTotal: previous.incasate.total,
      pctCount: pct(current.incasate.count, previous.incasate.count),
      pctTotal: pct(current.incasate.total, previous.incasate.total),
    },
    stornate: {
      ...current.stornate,
      prevCount: previous.stornate.count,
      prevTotal: previous.stornate.total,
      pctCount: pct(current.stornate.count, previous.stornate.count),
      pctTotal: pct(current.stornate.total, previous.stornate.total),
    },
    emise: {
      ...current.emise,
      prevCount: previous.emise.count,
      prevTotal: previous.emise.total,
      pctCount: pct(current.emise.count, previous.emise.count),
      pctTotal: pct(current.emise.total, previous.emise.total),
    },
  });
}
