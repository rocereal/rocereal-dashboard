import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const invoices = await prisma.smartbillInvoice.findMany({
    orderBy: { number: "desc" },
    take: 500,
  });

  const mapped = invoices.map((inv) => ({
    id: inv.invoiceKey,
    issueDate: inv.issuedAt.toISOString(),
    totalAmount: inv.totalAmount,
    netAmount: inv.netAmount,
    taxAmount: inv.taxAmount,
    currency: "RON",
    status: inv.paid ? "Incasata" : inv.unpaidAmount === inv.totalAmount ? "Emisa" : "Partial",
    paidAmount: inv.paidAmount,
    unpaidAmount: inv.unpaidAmount,
    series: inv.series,
    number: inv.number,
  }));

  return NextResponse.json(mapped);
}
