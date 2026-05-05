import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  let p = raw.replace(/[\s\-().]/g, "");
  if (p.startsWith("+40")) p = "0" + p.slice(3);
  if (p.startsWith("40") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

function sourceToChannel(source: string | null | undefined): string | null {
  if (!source) return null;
  const s = source.toLowerCase();
  if (s.includes("meta") || s.includes("facebook")) return "facebook";
  if (s.includes("tik tok") || s.includes("tiktok"))  return "tiktok";
  if (s.includes("google"))                            return "google";
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from");
  const to   = searchParams.get("to");

  const dateFilter: { gte?: Date; lt?: Date } = {};
  if (from) dateFilter.gte = new Date(from);
  if (to)   { const d = new Date(to); d.setDate(d.getDate() + 1); dateFilter.lt = d; }
  const dateWhere = Object.keys(dateFilter).length ? { date: dateFilter } : {};

  try {
    // ── 1. Calls + attribution ────────────────────────────────────────────────
    const [calls, sbClients, invoices, fbAds, target] = await Promise.all([
      prisma.crmCall.findMany({ where: dateWhere, select: { caller: true, source: true, status: true } }),
      prisma.smartbillClient.findMany({ select: { name: true, phone: true } }),
      prisma.smartbillInvoice.findMany({ where: { paid: true, totalAmount: { gt: 0 } }, select: { client: true, totalAmount: true, invoiceKey: true } }),
      prisma.facebookAdInsight.findMany({
        where: { level: "ad", ...(from || to ? { dateStart: dateFilter.gte ? { gte: dateFilter.gte } : undefined, dateStop: dateFilter.lt ? { lt: dateFilter.lt } : undefined } : {}) },
        select: { entityId: true, entityName: true, campaignName: true, adsetName: true, spend: true, impressions: true, clicks: true, conversions: true, status: true },
        orderBy: { spend: "desc" },
        take: 200,
      }),
      from ? prisma.monthlySalesTarget.findFirst({ where: { period: from.slice(0, 7) } }) : null,
    ]);

    // ── 2. Build phone→client and client→revenue maps ─────────────────────────
    const phoneToClient = new Map<string, string>();
    for (const c of sbClients) {
      const n = normalizePhone(c.phone);
      if (n) phoneToClient.set(n, c.name.toUpperCase());
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

    // ── 3. Attribution per channel ────────────────────────────────────────────
    const channelRevenue: Record<string, { conversions: number; revenue: number; calls: number; answered: number }> = {
      facebook: { conversions: 0, revenue: 0, calls: 0, answered: 0 },
      tiktok:   { conversions: 0, revenue: 0, calls: 0, answered: 0 },
      google:   { conversions: 0, revenue: 0, calls: 0, answered: 0 },
    };

    for (const call of calls) {
      const ch = sourceToChannel(call.source);
      if (!ch || !channelRevenue[ch]) continue;
      channelRevenue[ch].calls++;
      if (call.status === "Answered") channelRevenue[ch].answered++;
      const phone = normalizePhone(call.caller);
      const clientName = phoneToClient.get(phone);
      if (!clientName) continue;
      const inv = clientRevMap.get(clientName);
      if (inv && inv.revenue > 0) {
        channelRevenue[ch].conversions++;
        channelRevenue[ch].revenue += inv.revenue;
      }
    }

    // ── 4. Total SmartBill revenue (for unattributed calc) ────────────────────
    const totalSmartbillRevenue = Array.from(clientRevMap.values()).reduce((s, v) => s + v.revenue, 0);
    const attributedRevenue = Object.values(channelRevenue).reduce((s, v) => s + v.revenue, 0);
    const unattributedRevenue = Math.max(0, totalSmartbillRevenue - attributedRevenue);

    const attributedInvoiceKeys = new Set<string>();
    for (const call of calls) {
      const phone = normalizePhone(call.caller);
      const clientName = phoneToClient.get(phone);
      if (!clientName) continue;
      const inv = clientRevMap.get(clientName);
      if (inv) inv.keys.forEach(k => attributedInvoiceKeys.add(k));
    }
    const totalInvoices = invoices.length;
    const attributedInvoicesCount = attributedInvoiceKeys.size;
    const unattributedInvoicesCount = totalInvoices - attributedInvoicesCount;

    // ── 5. Top products (by invoice amount — grouped by first word of client as proxy) ─
    const topInvoices = invoices
      .sort((a, b) => Number(b.totalAmount) - Number(a.totalAmount))
      .slice(0, 10)
      .map(i => ({ client: i.client, amount: Number(i.totalAmount), invoiceKey: i.invoiceKey }));

    // ── 6. Facebook ads with spend but zero conversions ───────────────────────
    const zeroConversionAds = fbAds
      .filter(ad => ad.spend > 50 && (ad.conversions ?? 0) === 0)
      .map(ad => ({ id: ad.entityId, name: ad.entityName, campaign: ad.campaignName, spend: ad.spend, impressions: ad.impressions, clicks: ad.clicks }));

    // ── 7. Sales target + forecast ────────────────────────────────────────────
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    const revenuePerDay = attributedRevenue / Math.max(dayOfMonth, 1);
    const forecast = Math.round(revenuePerDay * daysInMonth);

    return NextResponse.json({
      channelRevenue,
      totals: {
        attributedRevenue:     Math.round(attributedRevenue),
        unattributedRevenue:   Math.round(unattributedRevenue),
        totalSmartbillRevenue: Math.round(totalSmartbillRevenue),
        attributedInvoices:    attributedInvoicesCount,
        unattributedInvoices:  unattributedInvoicesCount,
        totalInvoices,
        totalCalls:    calls.length,
        answeredCalls: calls.filter(c => c.status === "Answered").length,
      },
      forecast: {
        projectedRevenue: forecast,
        targetRON:        target?.targetRON ?? null,
        belowTarget:      target ? forecast < target.targetRON : false,
        daysElapsed:      dayOfMonth,
        daysTotal:        daysInMonth,
      },
      zeroConversionAds,
      topInvoices,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
