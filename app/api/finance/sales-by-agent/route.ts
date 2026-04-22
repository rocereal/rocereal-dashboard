import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const from = fromParam ? new Date(fromParam) : undefined;
  // Set to end of day for `to` so the selected day is fully included
  let to: Date | undefined;
  if (toParam) {
    to = new Date(toParam);
    to.setHours(23, 59, 59, 999);
  }

  // 1. Build phone → agent map from CRM calls
  const calls = await prisma.crmCall.findMany({
    select: { caller: true, rawPayload: true },
  });

  const phoneAgentMap = new Map<string, string>();
  for (const call of calls) {
    const phone = normalizePhone(call.caller);
    if (!phone) continue;
    const raw = call.rawPayload as Record<string, unknown> | null;
    const dest = raw?.destinationnumber as string | undefined;
    const agent = agentMap[dest ?? ""];
    // Only set if we have a known agent and haven't already set a better one
    if (agent && !phoneAgentMap.has(phone)) {
      phoneAgentMap.set(phone, agent);
    }
  }

  // 2. Build clientName → normalizedPhone from SmartBill clients
  const sbClients = await prisma.smartbillClient.findMany({
    select: { name: true, phone: true },
  });

  const clientPhoneMap = new Map<string, string>(); // UPPERCASE name → normalizedPhone
  for (const c of sbClients) {
    const phone = normalizePhone(c.phone);
    if (phone) clientPhoneMap.set(c.name.trim().toUpperCase(), phone);
  }

  // 3. Fetch paid invoices with optional date filter
  const invoices = await prisma.smartbillInvoice.findMany({
    where: {
      paid: true,
      issuedAt: {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      },
    },
    select: { client: true, paidAmount: true, issuedAt: true },
    orderBy: { issuedAt: "asc" },
  });

  // 4. Group by day, split by agent
  type DayData = {
    date: string;     // "YYYY-MM-DD"
    cătălin: number;
    valentin: number;
    alteCanale: number;
    total: number;
  };

  const dayMap = new Map<string, DayData>();

  for (const inv of invoices) {
    const d = new Date(inv.issuedAt);
    const day = d.toISOString().slice(0, 10); // "YYYY-MM-DD"

    if (!dayMap.has(day)) {
      dayMap.set(day, { date: day, cătălin: 0, valentin: 0, alteCanale: 0, total: 0 });
    }

    const entry = dayMap.get(day)!;
    const amount = inv.paidAmount;
    const clientName = inv.client.trim().toUpperCase();
    const phone = clientPhoneMap.get(clientName);
    const agent = phone ? phoneAgentMap.get(phone) : undefined;

    entry.total += amount;

    if (agent === "Cătălin") {
      entry.cătălin += amount;
    } else if (agent === "Valentin") {
      entry.valentin += amount;
    } else {
      entry.alteCanale += amount;
    }
  }

  // Fill every calendar day in the requested range with zeros if no invoices
  const allDays: typeof dayMap extends Map<string, infer V> ? V[] : never[] = [];
  if (from && to) {
    const cursor = new Date(from);
    cursor.setUTCHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setUTCHours(0, 0, 0, 0);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      allDays.push(
        dayMap.get(key) ?? { date: key, cătălin: 0, valentin: 0, alteCanale: 0, total: 0 }
      );
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  } else {
    // No range filter — just return days that have data, sorted
    Array.from(dayMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((v) => allDays.push(v));
  }

  // Round to 2 decimal places
  const rounded = allDays.map((d) => ({
    date: d.date,
    cătălin: Math.round(d.cătălin * 100) / 100,
    valentin: Math.round(d.valentin * 100) / 100,
    alteCanale: Math.round(d.alteCanale * 100) / 100,
    total: Math.round(d.total * 100) / 100,
  }));

  return NextResponse.json(rounded);
}
