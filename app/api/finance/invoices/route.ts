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
    client: inv.client,
    issueDate: inv.issuedAt.toISOString(),
    dueDate: inv.dueDate?.toISOString() ?? null,
    totalAmount: inv.totalAmount,
    netAmount: inv.netAmount,
    taxAmount: inv.taxAmount,
    currency: "RON",
    status: inv.paid ? "Incasata" : inv.unpaidAmount === inv.totalAmount ? "Emisa" : "Partial",
    series: inv.series,
    number: inv.number,
  }));

  return NextResponse.json(mapped);
}
