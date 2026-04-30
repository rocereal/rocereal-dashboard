import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MONTH_NAMES = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get("year") ?? String(new Date().getFullYear()));

  const from = new Date(year, 0, 1);
  const to   = new Date(year + 1, 0, 1);

  try {
    const invoices = await prisma.smartbillInvoice.findMany({
      where: {
        paid: true,
        totalAmount: { gt: 0 },
        issuedAt: { gte: from, lt: to },
      },
      select: { totalAmount: true, issuedAt: true, invoiceKey: true },
    });

    const monthlyRevenue = new Array(12).fill(0);
    const seenKeys = new Set<string>();

    for (const inv of invoices) {
      if (seenKeys.has(inv.invoiceKey)) continue;
      seenKeys.add(inv.invoiceKey);
      const month = new Date(inv.issuedAt).getMonth();
      monthlyRevenue[month] += Number(inv.totalAmount);
    }

    const now = new Date();
    const lastFilledMonth = now.getFullYear() === year ? now.getMonth() : 11;

    const result = MONTH_NAMES.map((luna, i) => ({
      luna,
      venituriIncasate: i <= lastFilledMonth ? Math.round(monthlyRevenue[i]) : null,
      investitie: null as number | null,
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) });
  }
}
