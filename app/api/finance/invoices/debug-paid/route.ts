/**
 * Debug: shows all paid invoices for a date range with full detail.
 * GET /api/finance/invoices/debug-paid?from=2026-04-22&to=2026-04-22
 */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fromParam = searchParams.get("from");
  const toParam   = searchParams.get("to");
  const keysParam = searchParams.get("keys"); // e.g. ?keys=SSB-425,SSB-427,SSB-445

  // Mode 1: lookup specific invoiceKeys
  if (keysParam) {
    const keys = keysParam.split(",").map(k => k.trim());
    const invoices = await prisma.smartbillInvoice.findMany({
      where: { invoiceKey: { in: keys } },
      select: {
        invoiceKey: true, series: true, number: true, client: true,
        totalAmount: true, paidAmount: true, unpaidAmount: true,
        paid: true, issuedAt: true, dueDate: true, syncedAt: true,
      },
    });
    return NextResponse.json({ keys, found: invoices.length, invoices });
  }

  // Mode 2: all invoices in date range (paid=true OR totalAmount<0)
  const from = fromParam ? new Date(fromParam) : new Date("2026-04-01");
  const to   = toParam   ? new Date(toParam + "T23:59:59Z") : new Date("2026-04-30T23:59:59Z");

  const invoices = await prisma.smartbillInvoice.findMany({
    where: {
      OR: [{ paid: true }, { totalAmount: { lt: 0 } }],
      issuedAt: { gte: from, lte: to },
    },
    select: {
      invoiceKey: true, series: true, number: true, client: true,
      totalAmount: true, paid: true, issuedAt: true, syncedAt: true,
    },
    orderBy: { issuedAt: "asc" },
  });

  const total = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const byDay: Record<string, { invoices: typeof invoices; dayTotal: number }> = {};
  for (const inv of invoices) {
    const y  = inv.issuedAt.getFullYear();
    const mo = String(inv.issuedAt.getMonth() + 1).padStart(2, "0");
    const dd = String(inv.issuedAt.getDate()).padStart(2, "0");
    const day = `${y}-${mo}-${dd}`;
    if (!byDay[day]) byDay[day] = { invoices: [], dayTotal: 0 };
    byDay[day].invoices.push(inv);
    byDay[day].dayTotal += inv.totalAmount;
  }

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    totalInvoices: invoices.length,
    totalAmount: Math.round(total * 100) / 100,
    byDay,
  });
}
