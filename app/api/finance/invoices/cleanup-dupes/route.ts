/**
 * One-time cleanup: removes invoices with bogus series names containing digits
 * (e.g. "SSB48" instead of "SSB") caused by a greedy regex bug in the Python
 * scraper. Safe to call multiple times — idempotent.
 *
 * GET /api/finance/invoices/cleanup-dupes?dry=1   → preview only
 * GET /api/finance/invoices/cleanup-dupes         → delete and fix
 */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const dry = req.nextUrl.searchParams.get("dry") === "1";

  // A valid SmartBill series contains only letters and hyphens (e.g. "SSB", "M-SSB").
  // Bogus series created by the greedy regex contain digits (e.g. "SSB48", "SSB4").
  const allInvoices = await prisma.smartbillInvoice.findMany({
    select: { invoiceKey: true, series: true, number: true, totalAmount: true, issuedAt: true },
  });

  const bogus = allInvoices.filter((inv) => /\d/.test(inv.series));

  if (!dry && bogus.length > 0) {
    await prisma.smartbillInvoice.deleteMany({
      where: { invoiceKey: { in: bogus.map((i) => i.invoiceKey) } },
    });
  }

  return NextResponse.json({
    dry,
    bogusFound: bogus.length,
    deleted: dry ? 0 : bogus.length,
    bogusInvoices: bogus.map((i) => ({
      invoiceKey: i.invoiceKey,
      series: i.series,
      number: i.number,
      totalAmount: i.totalAmount,
      issuedAt: i.issuedAt,
    })),
  });
}
