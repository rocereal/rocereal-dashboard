import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const agentMap: Record<string, string> = {
  "0724547086": "Cătălin",
  "0722647098": "Valentin",
};

// Normalize phone to a canonical format: strip spaces/dashes, convert +40 → 0
function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  let p = raw.replace(/[\s\-().]/g, "");
  if (p.startsWith("+40")) p = "0" + p.slice(3);
  if (p.startsWith("40") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

export async function GET() {
  // 1. All Invox calls — group by normalized caller phone
  const calls = await prisma.crmCall.findMany({
    select: {
      caller: true,
      date: true,
      rawPayload: true,
    },
    orderBy: { date: "asc" },
  });

  // Build map: normalizedPhone → { firstSeen, latestAgent, callCount }
  const callMap = new Map<string, {
    rawPhone: string;
    firstSeen: Date;
    latestAgent: string;
    callCount: number;
  }>();

  for (const call of calls) {
    const phone = normalizePhone(call.caller);
    if (!phone) continue;

    const raw = call.rawPayload as Record<string, unknown> | null;
    const destNumber = raw?.destinationnumber as string | undefined;
    const agent = agentMap[destNumber ?? ""] ?? destNumber ?? "—";

    const existing = callMap.get(phone);
    if (!existing) {
      callMap.set(phone, {
        rawPhone: call.caller,
        firstSeen: call.date,
        latestAgent: agent,
        callCount: 1,
      });
    } else {
      existing.callCount++;
      // Keep latest agent (last call wins)
      if (call.date > existing.firstSeen) {
        existing.latestAgent = agent;
      }
    }
  }

  // 2. All SmartBill clients — index by normalized phone
  const sbClients = await prisma.smartbillClient.findMany({
    select: { name: true, phone: true, email: true },
  });

  const sbClientMap = new Map<string, { name: string; email: string }>();
  for (const c of sbClients) {
    const phone = normalizePhone(c.phone);
    if (phone) sbClientMap.set(phone, { name: c.name, email: c.email });
  }

  // 3. All SmartBill invoices — aggregate by client name → total paid
  const invoices = await prisma.smartbillInvoice.findMany({
    select: { client: true, totalAmount: true, paidAmount: true, paid: true },
  });

  // Map client name → { totalValue, paidCount }
  const invoiceByClient = new Map<string, { totalValue: number; paidCount: number }>();
  for (const inv of invoices) {
    const name = inv.client.trim().toUpperCase();
    if (!name) continue;
    const existing = invoiceByClient.get(name);
    if (!existing) {
      invoiceByClient.set(name, {
        totalValue: inv.paidAmount,
        paidCount: inv.paid ? 1 : 0,
      });
    } else {
      existing.totalValue += inv.paidAmount;
      if (inv.paid) existing.paidCount++;
    }
  }

  // 4. Build final client list
  const clients = Array.from(callMap.entries()).map(([phone, callData]) => {
    const sbClient = sbClientMap.get(phone);
    const clientName = sbClient?.name ?? "";
    const invoiceData = clientName
      ? invoiceByClient.get(clientName.trim().toUpperCase())
      : undefined;

    const totalValue  = invoiceData?.totalValue  ?? 0;
    const paidCount   = invoiceData?.paidCount   ?? 0;
    const status      = paidCount > 0 ? "Calificat" : "Necalificat";

    return {
      phone,
      name:          clientName,
      agent:         callData.latestAgent,
      status,
      firstSeen:     callData.firstSeen.toISOString(),
      email:         sbClient?.email ?? "",
      channel:       "Invox",
      totalValue,
      callCount:     callData.callCount,
    };
  });

  // Sort: qualified first, then by totalValue desc
  clients.sort((a, b) => {
    if (a.status !== b.status) return a.status === "Calificat" ? -1 : 1;
    return b.totalValue - a.totalValue;
  });

  return NextResponse.json(clients);
}
