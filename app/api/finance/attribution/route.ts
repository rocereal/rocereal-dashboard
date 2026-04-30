import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  let p = raw.replace(/[\s\-().]/g, "");
  if (p.startsWith("+40")) p = "0" + p.slice(3);
  if (p.startsWith("40") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

type Channel = "facebook" | "tiktok" | "google";

function sourceToChannel(source: string | null | undefined): Channel | null {
  if (!source) return null;
  const s = source.toLowerCase();
  if (s.includes("meta") || s.includes("facebook")) return "facebook";
  if (s.includes("tik tok") || s.includes("tiktok")) return "tiktok";
  if (s.includes("google")) return "google";
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from");
  const to   = searchParams.get("to");

  try {
    // ── 1. Answered calls in the selected period ───────────────────────────────
    const dateFilter: { gte?: Date; lt?: Date } = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) {
      const d = new Date(to);
      d.setDate(d.getDate() + 1);
      dateFilter.lt = d;
    }

    const calls = await prisma.crmCall.findMany({
      where: {
        status: "Answered",
        ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
      },
      select: { caller: true, source: true },
    });

    // ── 2. SmartBill clients (phone → client name) ─────────────────────────────
    const sbClients = await prisma.smartbillClient.findMany({
      select: { name: true, phone: true },
    });

    const phoneToClient = new Map<string, string>();
    for (const c of sbClients) {
      const norm = normalizePhone(c.phone);
      if (norm) phoneToClient.set(norm, c.name.toUpperCase());
    }

    // ── 3. Paid invoices (positive amounts) grouped by client name ─────────────
    const invoices = await prisma.smartbillInvoice.findMany({
      where: { paid: true, totalAmount: { gt: 0 } },
      select: { client: true, totalAmount: true, invoiceKey: true },
    });

    // client name (upper) → { totalRevenue, uniqueInvoiceKeys }
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

    // ── 4. Unique caller phones per channel ────────────────────────────────────
    const channelPhones = new Map<Channel, Set<string>>([
      ["facebook", new Set()],
      ["tiktok",   new Set()],
      ["google",   new Set()],
    ]);

    for (const call of calls) {
      const ch = sourceToChannel(call.source);
      if (!ch) continue;
      const phone = normalizePhone(call.caller);
      if (phone) channelPhones.get(ch)!.add(phone);
    }

    // ── 5. Match phones → clients → invoices ──────────────────────────────────
    const result: Record<Channel, { conversions: number; revenue: number }> = {
      facebook: { conversions: 0, revenue: 0 },
      tiktok:   { conversions: 0, revenue: 0 },
      google:   { conversions: 0, revenue: 0 },
    };

    for (const [ch, phones] of channelPhones.entries()) {
      for (const phone of phones) {
        const clientName = phoneToClient.get(phone);
        if (!clientName) continue;
        const inv = clientRevMap.get(clientName);
        if (!inv || inv.revenue <= 0) continue;
        result[ch].conversions += 1;
        result[ch].revenue     += inv.revenue;
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) });
  }
}
