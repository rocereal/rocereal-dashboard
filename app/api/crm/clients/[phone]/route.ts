import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const agentMap: Record<string, string> = {
  "0724547086": "Cătălin",
  "0722647098": "Valentin",
};

function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  let p = raw.replace(/[\s\-().]/g, "");
  if (p.startsWith("+40")) p = "0" + p.slice(3);
  if (p.startsWith("40") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ phone: string }> }
) {
  const { phone } = await params;
  const decodedPhone = decodeURIComponent(phone);

  // 1. Find all calls for this phone (match by normalized caller)
  const allCalls = await prisma.crmCall.findMany({
    orderBy: { date: "asc" },
  });

  const clientCalls = allCalls.filter(
    (c) => normalizePhone(c.caller) === decodedPhone
  );

  if (clientCalls.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // 2. Find SmartBill client by normalized phone
  const sbClients = await prisma.smartbillClient.findMany({
    select: { name: true, phone: true, email: true },
  });

  const sbClient = sbClients.find(
    (c) => normalizePhone(c.phone) === decodedPhone
  );

  // 3. Get invoices for this client
  const invoices = sbClient
    ? await prisma.smartbillInvoice.findMany({
        where: { client: sbClient.name },
        orderBy: { issuedAt: "desc" },
      })
    : [];

  // 4. Build call list with agent names
  const calls = clientCalls.map((c) => {
    const raw = c.rawPayload as Record<string, unknown> | null;
    const destNumber = raw?.destinationnumber as string | undefined;
    const agent = agentMap[destNumber ?? ""] ?? destNumber ?? "—";
    return {
      id: c.id,
      date: c.date.toISOString(),
      duration: c.duration ?? null,
      status: c.status ?? null,
      agent,
      source: c.source ?? null,
      campaign: c.campaign ?? null,
      utmSource: c.utmSource ?? null,
      medium: c.medium ?? null,
      receivingNumber: c.receivingNumber ?? null,
    };
  });

  // 5. Aggregate stats
  const totalValue = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const paidCount = invoices.filter((i) => i.paid).length;

  return NextResponse.json({
    phone: decodedPhone,
    rawPhone: clientCalls[0].caller,
    name: sbClient?.name ?? "",
    email: sbClient?.email ?? "",
    status: paidCount > 0 ? "Calificat" : "Necalificat",
    firstSeen: clientCalls[0].date.toISOString(),
    lastSeen: clientCalls[clientCalls.length - 1].date.toISOString(),
    callCount: calls.length,
    totalValue,
    paidInvoices: paidCount,
    totalInvoices: invoices.length,
    calls,
    invoices: invoices.map((i) => ({
      invoiceKey: i.invoiceKey,
      series: i.series,
      number: i.number,
      issuedAt: i.issuedAt.toISOString(),
      dueDate: i.dueDate?.toISOString() ?? null,
      totalAmount: i.totalAmount,
      paidAmount: i.paidAmount,
      unpaidAmount: i.unpaidAmount,
      paid: i.paid,
    })),
  });
}
