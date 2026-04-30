import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AGENT_MAP: Record<string, string> = {
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

function durationToSeconds(dur: string | null | undefined): number | null {
  if (!dur) return null;
  if (/^\d+$/.test(dur.trim())) return parseInt(dur);
  const parts = dur.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from");
  const to   = searchParams.get("to");

  const dateFilter: { gte?: Date; lt?: Date } = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) {
    const d = new Date(to);
    d.setDate(d.getDate() + 1);
    dateFilter.lt = d;
  }
  const dateWhere = Object.keys(dateFilter).length ? { date: dateFilter } : {};

  try {
    const [allCalls, sbClients, invoices] = await Promise.all([
      prisma.crmCall.findMany({
        where: dateWhere,
        select: { caller: true, status: true, duration: true, rawPayload: true },
      }),
      prisma.smartbillClient.findMany({ select: { name: true, phone: true } }),
      prisma.smartbillInvoice.findMany({
        where: { paid: true, totalAmount: { gt: 0 } },
        select: { client: true, totalAmount: true, invoiceKey: true },
      }),
    ]);

    const phoneToClient = new Map<string, string>();
    for (const c of sbClients) {
      const norm = normalizePhone(c.phone);
      if (norm) phoneToClient.set(norm, c.name.toUpperCase());
    }

    const clientRevMap = new Map<string, { revenue: number; keys: Set<string> }>();
    for (const inv of invoices) {
      const key = inv.client.toUpperCase();
      if (!clientRevMap.has(key)) clientRevMap.set(key, { revenue: 0, keys: new Set() });
      const entry = clientRevMap.get(key)!;
      if (!entry.keys.has(inv.invoiceKey)) {
        entry.keys.add(inv.invoiceKey);
        entry.revenue += Number(inv.totalAmount);
      }
    }

    type AgentBucket = {
      callsTotal: number;
      callsAnswered: number;
      totalDurationSec: number;
      durationCount: number;
      callerPhones: Set<string>;
    };
    const buckets = new Map<string, AgentBucket>();

    for (const call of allCalls) {
      const raw = call.rawPayload as Record<string, unknown> | null;
      const destRaw = (raw?.destinationnumber as string | undefined) ?? "";
      const dest = normalizePhone(destRaw) || destRaw;
      const agent = AGENT_MAP[dest] ?? null;
      if (!agent) continue;

      if (!buckets.has(agent)) {
        buckets.set(agent, { callsTotal: 0, callsAnswered: 0, totalDurationSec: 0, durationCount: 0, callerPhones: new Set() });
      }
      const b = buckets.get(agent)!;
      b.callsTotal++;

      if (call.status === "Answered") {
        b.callsAnswered++;
        const dur = durationToSeconds(call.duration);
        if (dur !== null && dur > 0) { b.totalDurationSec += dur; b.durationCount++; }
        const phone = normalizePhone(call.caller);
        if (phone) b.callerPhones.add(phone);
      }
    }

    const result = Array.from(buckets.entries()).map(([name, b]) => {
      let revenue = 0;
      let conversions = 0;
      for (const phone of b.callerPhones) {
        const clientName = phoneToClient.get(phone);
        if (!clientName) continue;
        const inv = clientRevMap.get(clientName);
        if (!inv || inv.revenue <= 0) continue;
        conversions++;
        revenue += inv.revenue;
      }
      const avgDurationSec = b.durationCount > 0 ? Math.round(b.totalDurationSec / b.durationCount) : 0;
      const conversionRate  = b.callsAnswered > 0 ? Math.round((conversions / b.callsAnswered) * 1000) / 10 : 0;
      return {
        name,
        callsTotal:    b.callsTotal,
        callsAnswered: b.callsAnswered,
        avgDurationSec,
        revenue:       Math.round(revenue * 100) / 100,
        conversions,
        conversionRate,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) });
  }
}
