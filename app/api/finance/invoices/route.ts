import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const invoices = await prisma.smartbillInvoice.findMany({
    orderBy: { number: "desc" },
    take: 500,
  });

  // Build client phone lookup map
  const clientNames = [...new Set(invoices.map((inv) => inv.client).filter(Boolean))];
  const clients = await prisma.smartbillClient.findMany({
    where: { name: { in: clientNames } },
    select: { name: true, phone: true, email: true },
  });
  const clientMap = new Map(clients.map((c) => [c.name, c]));

  const mapped = invoices.map((inv) => {
    const clientData = clientMap.get(inv.client);
    return {
      id: inv.invoiceKey,
      client: inv.client,
      clientPhone: clientData?.phone ?? null,
      clientEmail: clientData?.email ?? null,
      issueDate: inv.issuedAt.toISOString(),
      dueDate: inv.dueDate?.toISOString() ?? null,
      totalAmount: inv.totalAmount,
      netAmount: inv.netAmount,
      taxAmount: inv.taxAmount,
      currency: "RON",
      status: inv.paid ? "Incasata" : inv.unpaidAmount === inv.totalAmount ? "Emisa" : "Partial",
      series: inv.series,
      number: inv.number,
    };
  });

  return NextResponse.json(mapped);
}
