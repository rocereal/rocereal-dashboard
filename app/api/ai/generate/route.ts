import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface InsightDraft {
  title:    string;
  body:     string;
  priority: "high" | "medium" | "low";
  category: string;
  action:   string | null;
}

// ── Shared attribution logic (mirrors /api/finance/ai-analysis) ───────────────

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

async function fetchAnalysisData() {
  const now  = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);

  const [calls, sbClients, invoices, fbAds, stockItems, target] = await Promise.all([
    prisma.crmCall.findMany({
      where:  { date: { gte: from } },
      select: { caller: true, source: true, status: true },
    }),
    prisma.smartbillClient.findMany({ select: { name: true, phone: true } }),
    prisma.smartbillInvoice.findMany({
      where:   { paid: true, totalAmount: { gt: 0 } },
      select:  { client: true, totalAmount: true, invoiceKey: true },
    }),
    prisma.facebookAdInsight.findMany({
      where:   { level: "ad", dateStart: { gte: from } },
      select:  { entityName: true, campaignName: true, spend: true, clicks: true, conversions: true },
      orderBy: { spend: "desc" },
      take:    100,
    }),
    prisma.productStock.findMany({
      select:  { name: true, quantity: true, status: true, category: true },
      orderBy: { totalValue: "desc" },
      take:    50,
    }).catch(() => [] as { name: string; quantity: number; status: string; category: string | null }[]),
    prisma.monthlySalesTarget.findFirst({
      where: { period: now.toISOString().slice(0, 7) },
    }).catch(() => null),
  ]);

  // Phone → client map
  const phoneToClient = new Map<string, string>();
  for (const c of sbClients) {
    const n = normalizePhone(c.phone);
    if (n) phoneToClient.set(n, c.name.toUpperCase());
  }

  // Client → revenue map (deduped by invoiceKey)
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

  // Per-channel attribution (same logic as Finance Reports)
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
    const phone      = normalizePhone(call.caller);
    const clientName = phoneToClient.get(phone);
    if (!clientName) continue;
    const inv = clientRevMap.get(clientName);
    if (inv && inv.revenue > 0) {
      channelRevenue[ch].conversions++;
      channelRevenue[ch].revenue += inv.revenue;
    }
  }

  const totalSmartbillRevenue = Array.from(clientRevMap.values()).reduce((s, v) => s + v.revenue, 0);
  const attributedRevenue     = Object.values(channelRevenue).reduce((s, v) => s + v.revenue, 0);
  const unattributedRevenue   = Math.max(0, totalSmartbillRevenue - attributedRevenue);
  const totalCalls            = calls.length;
  const answeredCalls         = calls.filter(c => c.status === "Answered").length;
  const fbTotalSpend          = fbAds.reduce((s, a) => s + (a.spend ?? 0), 0);
  const fbTotalConversions    = fbAds.reduce((s, a) => s + (a.conversions ?? 0), 0);
  const zeroConvAds           = fbAds.filter(a => (a.spend ?? 0) > 50 && (a.conversions ?? 0) === 0);

  const daysElapsed = now.getDate();
  const daysTotal   = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const forecast    = daysElapsed > 0 ? Math.round((attributedRevenue / daysElapsed) * daysTotal) : 0;
  const roas        = fbTotalSpend > 0 ? (attributedRevenue / fbTotalSpend).toFixed(2) : "N/A";
  const answerRate  = totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0;

  return {
    now, daysElapsed, daysTotal,
    channelRevenue, attributedRevenue, unattributedRevenue, totalSmartbillRevenue,
    totalCalls, answeredCalls, answerRate,
    fbTotalSpend, fbTotalConversions, zeroConvAds, fbAds,
    stockItems, forecast, roas,
    targetRON: target?.targetRON ?? null,
    invoices,
  };
}

function buildPrompt(
  employee: { role: string; dailyTasks: string; autonomyRule: string },
  d: Awaited<ReturnType<typeof fetchAnalysisData>>
): string {
  const topAds = d.fbAds.slice(0, 10)
    .map(a => `${a.entityName ?? "N/A"} | spend:${a.spend?.toFixed(0)} RON | clicks:${a.clicks} | conv:${a.conversions ?? 0}`)
    .join("\n");

  const zeroAdsStr = d.zeroConvAds.slice(0, 8)
    .map(a => `${a.entityName ?? "N/A"} | spend:${a.spend?.toFixed(0)} RON | clicks:${a.clicks}`)
    .join("\n");

  const outOfStock = d.stockItems.filter(s => s.status === "out_of_stock").map(s => s.name).slice(0, 10).join(", ");
  const lowStock   = d.stockItems.filter(s => s.status === "low_stock").map(s => s.name).slice(0, 10).join(", ");

  const topInvoices = d.invoices.slice(0, 8)
    .map(i => `${i.client} — ${Number(i.totalAmount).toFixed(0)} RON`)
    .join("\n");

  const channelRows = Object.entries(d.channelRevenue)
    .map(([ch, v]) => `${ch}: ${v.calls} apeluri | ${v.answered} receptionate | ${v.conversions} conversii | ${v.revenue.toFixed(0)} RON`)
    .join("\n");

  const contextBlock = `
## Date luna curentă (${d.daysElapsed}/${d.daysTotal} zile) — aceleași cifre ca în Rapoarte Financiare
- Venituri totale SmartBill (facturi plătite): ${d.totalSmartbillRevenue.toFixed(0)} RON
- Venituri atribuite (call tracking): ${d.attributedRevenue.toFixed(0)} RON
- Venituri neatribuite: ${d.unattributedRevenue.toFixed(0)} RON
- Forecast lunar: ${d.forecast.toFixed(0)} RON${d.targetRON ? ` | Target: ${d.targetRON.toFixed(0)} RON` : ""}
- Total apeluri: ${d.totalCalls} | Receptionate: ${d.answeredCalls} (${d.answerRate}%)
- Cheltuieli Facebook Ads: ${d.fbTotalSpend.toFixed(0)} RON | Conversii platf.: ${d.fbTotalConversions}
- ROAS real (venituri atribuite / spend): ${d.roas}
- Reclame cu spend >50 RON și 0 conversii: ${d.zeroConvAds.length}

## Atribuire per canal (apeluri → clienți SmartBill → facturi):
${channelRows || "Date indisponibile"}

## Top 10 reclame Facebook după spend:
${topAds || "Nicio reclamă disponibilă"}

## Reclame fără conversii (spend >50 RON):
${zeroAdsStr || "Niciuna"}

## Stoc epuizat: ${outOfStock || "—"}
## Stoc redus: ${lowStock || "—"}

## Top facturi luna aceasta:
${topInvoices || "Nicio factură disponibilă"}
`.trim();

  return `Ești ${employee.role}

Sarcini zilnice: ${employee.dailyTasks}
Regula de autonomie: ${employee.autonomyRule}

${contextBlock}

Pe baza acestor date reale (tracking exact prin apeluri → SmartBill → facturi), generează 3-5 insight-uri acționabile specifice rolului tău.
Răspunde STRICT în format JSON array, fără text suplimentar:
[
  {
    "title": "titlu scurt max 60 caractere",
    "body": "analiza detaliata 2-4 propozitii cu numere concrete din date",
    "priority": "high|medium|low",
    "category": "ads|attribution|copy|cro|sales|stock|executive",
    "action": "scale|stop|test|investigate|monitor|null"
  }
]`;
}

async function generateForEmployee(
  employee: { id: string; slug: string; role: string; dailyTasks: string; autonomyRule: string },
  data: Awaited<ReturnType<typeof fetchAnalysisData>>,
  type: "daily" | "weekly"
): Promise<number> {
  const msg = await anthropic.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages:   [{ role: "user", content: buildPrompt(employee, data) }],
  });

  const raw       = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return 0;

  const drafts = JSON.parse(jsonMatch[0]) as InsightDraft[];
  if (!Array.isArray(drafts) || drafts.length === 0) return 0;

  const now  = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);

  await prisma.aiInsight.createMany({
    data: drafts.map((d: InsightDraft) => ({
      employeeId: employee.id,
      type,
      category:   d.category ?? "executive",
      priority:   ["high", "medium", "low"].includes(d.priority) ? d.priority : "medium",
      title:      String(d.title ?? "").slice(0, 200),
      body:       String(d.body ?? ""),
      action:     ["scale", "stop", "test", "investigate", "monitor"].includes(d.action ?? "") ? d.action : null,
      dataFrom:   from,
      dataTo:     now,
      isRead:     false,
    })),
  });

  return drafts.length;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY lipsește din variabilele de mediu" }, { status: 503 });
  }

  const body = await req.json().catch(() => ({})) as { slug?: string; type?: string };
  const type = body.type === "weekly" ? "weekly" : "daily";

  try {
    const employees = await prisma.aiEmployee.findMany({
      where:   body.slug ? { slug: body.slug } : undefined,
      orderBy: { createdAt: "asc" },
    });

    if (employees.length === 0) {
      return NextResponse.json({ error: "Niciun angajat AI găsit" }, { status: 404 });
    }

    const data    = await fetchAnalysisData();
    const results = await Promise.all(
      employees.map(async emp => {
        try {
          const count = await generateForEmployee(emp, data, type);
          return { slug: emp.slug, name: emp.name, insightsCreated: count };
        } catch (e) {
          return { slug: emp.slug, name: emp.name, insightsCreated: 0, error: e instanceof Error ? e.message : String(e) };
        }
      })
    );

    const totalCreated = results.reduce((s, r) => s + r.insightsCreated, 0);
    return NextResponse.json({ ok: true, type, totalCreated, employees: results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
