import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  let p = raw.replace(/[\s\-().]/g, "");
  if (p.startsWith("+40")) p = "0" + p.slice(3);
  if (p.startsWith("40") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

interface InsightDraft {
  title:    string;
  body:     string;
  priority: "high" | "medium" | "low";
  category: string;
  action:   string | null;
}

async function fetchSharedData() {
  const now    = new Date();
  const from   = new Date(now.getFullYear(), now.getMonth(), 1);
  const fromISO = from.toISOString();

  const [calls, sbClients, invoices, fbAds, stockItems, agentStats] = await Promise.all([
    prisma.crmCall.findMany({
      where: { date: { gte: from } },
      select: { caller: true, source: true, status: true, duration: true, date: true, agent: true },
    }),
    prisma.smartbillClient.findMany({ select: { name: true, phone: true } }),
    prisma.smartbillInvoice.findMany({
      where: { paid: true, totalAmount: { gt: 0 } },
      select: { client: true, totalAmount: true, invoiceKey: true, issueDate: true, products: true },
      orderBy: { totalAmount: "desc" },
      take: 200,
    }),
    prisma.facebookAdInsight.findMany({
      where: { level: "ad", dateStart: { gte: from } },
      select: { entityName: true, campaignName: true, adsetName: true, spend: true, impressions: true, clicks: true, conversions: true, status: true },
      orderBy: { spend: "desc" },
      take: 100,
    }),
    prisma.stockItem.findMany({
      select: { name: true, quantity: true, status: true, category: true, totalValue: true },
      orderBy: { totalValue: "desc" },
      take: 50,
    }).catch(() => [] as { name: string; quantity: number; status: string; category: string | null; totalValue: number }[]),
    prisma.salesAgent.findMany({ select: { name: true, phone: true } }).catch(() => [] as { name: string; phone: string }[]),
  ]);

  // Build phone→client and client→revenue
  const phoneToClient = new Map<string, string>();
  for (const c of sbClients) {
    const n = normalizePhone(c.phone);
    if (n) phoneToClient.set(n, c.name.toUpperCase());
  }

  const clientRevMap = new Map<string, number>();
  for (const inv of invoices) {
    const key = inv.client.toUpperCase();
    clientRevMap.set(key, (clientRevMap.get(key) ?? 0) + Number(inv.totalAmount));
  }

  const totalRevenue = Array.from(clientRevMap.values()).reduce((s, v) => s + v, 0);
  const totalCalls = calls.length;
  const answeredCalls = calls.filter(c => c.status === "Answered").length;

  const fbTotalSpend = fbAds.reduce((s, a) => s + (a.spend ?? 0), 0);
  const fbTotalConversions = fbAds.reduce((s, a) => s + (a.conversions ?? 0), 0);
  const zeroConvAds = fbAds.filter(a => (a.spend ?? 0) > 50 && (a.conversions ?? 0) === 0);

  const daysElapsed = now.getDate();
  const daysTotal   = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const forecast    = daysElapsed > 0 ? Math.round((totalRevenue / daysElapsed) * daysTotal) : 0;
  const roas        = fbTotalSpend > 0 ? (totalRevenue / fbTotalSpend).toFixed(2) : "N/A";

  return {
    fromISO,
    now,
    calls,
    invoices,
    fbAds,
    stockItems,
    agentStats,
    phoneToClient,
    clientRevMap,
    totalRevenue,
    totalCalls,
    answeredCalls,
    fbTotalSpend,
    fbTotalConversions,
    zeroConvAds,
    daysElapsed,
    daysTotal,
    forecast,
    roas,
  };
}

function buildPrompt(employee: { role: string; dailyTasks: string; autonomyRule: string; slug: string }, data: Awaited<ReturnType<typeof fetchSharedData>>): string {
  const {
    totalRevenue, totalCalls, answeredCalls, fbTotalSpend, fbTotalConversions,
    zeroConvAds, fbAds, stockItems, calls, invoices, daysElapsed, daysTotal, forecast, roas,
  } = data;

  const answerRate = totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0;
  const topAds = fbAds.slice(0, 10).map(a => `${a.entityName ?? "N/A"} | spend:${a.spend?.toFixed(0)} | clicks:${a.clicks} | conv:${a.conversions ?? 0}`).join("\n");
  const zeroAdsStr = zeroConvAds.slice(0, 8).map(a => `${a.entityName ?? "N/A"} | spend:${a.spend?.toFixed(0)} | clicks:${a.clicks}`).join("\n");
  const outOfStock = stockItems.filter(s => s.status === "out_of_stock").map(s => s.name).slice(0, 10).join(", ");
  const lowStock   = stockItems.filter(s => s.status === "low_stock").map(s => s.name).slice(0, 10).join(", ");
  const topInvoices = invoices.slice(0, 8).map(i => `${i.client} — ${Number(i.totalAmount).toFixed(0)} RON`).join("\n");

  const agentCallBreakdown = (() => {
    const map: Record<string, { total: number; answered: number }> = {};
    for (const c of calls) {
      const agent = c.agent ?? "Necunoscut";
      if (!map[agent]) map[agent] = { total: 0, answered: 0 };
      map[agent].total++;
      if (c.status === "Answered") map[agent].answered++;
    }
    return Object.entries(map).map(([a, v]) => `${a}: ${v.answered}/${v.total} (${Math.round((v.answered / Math.max(v.total, 1)) * 100)}%)`).join(", ");
  })();

  const contextBlock = `
## Date luna curentă (${daysElapsed}/${daysTotal} zile)
- Venituri totale facturate: ${totalRevenue.toFixed(0)} RON
- Forecast lunar: ${forecast.toFixed(0)} RON
- Total apeluri: ${totalCalls} | Receptionate: ${answeredCalls} (${answerRate}%)
- Total cheltuieli Facebook Ads: ${fbTotalSpend.toFixed(0)} RON
- Total conversii Facebook Ads: ${fbTotalConversions}
- ROAS global: ${roas}
- Reclame cu spend >50 RON și 0 conversii: ${zeroConvAds.length}

## Top 10 reclame după spend:
${topAds || "Nicio reclamă disponibilă"}

## Reclame cu 0 conversii (spend>50):
${zeroAdsStr || "Niciuna"}

## Performanță agenți:
${agentCallBreakdown || "Date indisponibile"}

## Stoc epuizat: ${outOfStock || "—"}
## Stoc redus: ${lowStock || "—"}

## Top facturi luna aceasta:
${topInvoices || "Nicio factură disponibilă"}
`.trim();

  return `Ești ${employee.role}

Sarcini zilnice: ${employee.dailyTasks}
Regula de autonomie: ${employee.autonomyRule}

${contextBlock}

Pe baza acestor date reale, generează 3-5 insight-uri acționabile specifice rolului tău.
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
  data: Awaited<ReturnType<typeof fetchSharedData>>,
  type: "daily" | "weekly"
): Promise<number> {
  const prompt = buildPrompt(employee, data);

  const msg = await anthropic.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages:   [{ role: "user", content: prompt }],
  });

  const raw = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return 0;

  const drafts = JSON.parse(jsonMatch[0]) as InsightDraft[];
  if (!Array.isArray(drafts) || drafts.length === 0) return 0;

  const now  = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);

  await prisma.aiInsight.createMany({
    data: drafts.map(d => ({
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
      where: body.slug ? { slug: body.slug } : undefined,
      orderBy: { createdAt: "asc" },
    });

    if (employees.length === 0) {
      return NextResponse.json({ error: "Niciun angajat AI găsit" }, { status: 404 });
    }

    const data = await fetchSharedData();
    const results: { slug: string; name: string; insightsCreated: number; error?: string }[] = [];

    for (const emp of employees) {
      try {
        const count = await generateForEmployee(emp, data, type);
        results.push({ slug: emp.slug, name: emp.name, insightsCreated: count });
      } catch (e) {
        results.push({ slug: emp.slug, name: emp.name, insightsCreated: 0, error: e instanceof Error ? e.message : String(e) });
      }
    }

    const totalCreated = results.reduce((s, r) => s + r.insightsCreated, 0);
    return NextResponse.json({ ok: true, type, totalCreated, employees: results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
