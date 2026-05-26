import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic   = "force-dynamic";
export const maxDuration = 120;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PageContext {
  pageType:    "weekly" | "annual";
  period:      string;
  revenue:     number;
  prevRevenue?: number;
  totalSpend:  number;
  calls:       number;
  answered:    number;
  orders:      number;
  channels:    { name: string; spend: number; calls: number; revenue: number }[];
  categories?: { name: string; revenue: number; qty: number }[];
  months?:     { month: string; revenue: number; spend: number; orders: number }[];
}

function buildPrompt(
  emp: { role: string; dailyTasks: string; autonomyRule: string },
  ctx: PageContext,
): string {
  const investPct  = ctx.revenue > 0 ? ((ctx.totalSpend / ctx.revenue) * 100).toFixed(1) : "N/A";
  const answerRate = ctx.calls > 0 ? Math.round((ctx.answered / ctx.calls) * 100) : 0;
  const prevStr    = ctx.prevRevenue != null ? ` | Perioadă anterioară: ${ctx.prevRevenue.toFixed(0)} RON` : "";

  const channelBlock = ctx.channels
    .map(c => `${c.name}: spend ${c.spend.toFixed(0)} RON | apeluri ${c.calls} | CA atribuită ${c.revenue.toFixed(0)} RON`)
    .join("\n");

  const categoryBlock = ctx.categories && ctx.categories.length > 0
    ? ctx.categories.sort((a, b) => b.revenue - a.revenue).slice(0, 8)
        .map(c => `${c.name}: ${c.revenue.toFixed(0)} RON | ${c.qty} buc`)
        .join("\n")
    : "Date indisponibile";

  const monthsBlock = ctx.months && ctx.months.length > 0
    ? ctx.months.map(m => `${m.month}: CA ${m.revenue.toFixed(0)} RON | spend ${m.spend.toFixed(0)} RON | comenzi ${m.orders}`)
        .join("\n")
    : "";

  const contextBlock = `
## Date ${ctx.pageType === "annual" ? "anuale" : "săptămânale"} — ${ctx.period}
- CA (venituri emise): ${ctx.revenue.toFixed(0)} RON${prevStr}
- Investiție totală marketing: ${ctx.totalSpend.toFixed(0)} RON (${investPct}% din CA)
- Apeluri: ${ctx.calls} totale | ${ctx.answered} receptionate (${answerRate}%)
- Comenzi atribuite: ${ctx.orders}

## Performanță canale:
${channelBlock || "Date indisponibile"}

## Vânzări pe categorii:
${categoryBlock}${monthsBlock ? `\n\n## Evoluție lunară:\n${monthsBlock}` : ""}`.trim();

  return `Ești ${emp.role}

Sarcini zilnice: ${emp.dailyTasks}
Regula de autonomie: ${emp.autonomyRule}

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

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY lipsește" }, { status: 503 });
  }

  const ctx = await req.json().catch(() => null) as PageContext | null;
  if (!ctx) return NextResponse.json({ error: "Context lipsă" }, { status: 400 });

  const employees = await prisma.aiEmployee.findMany({ orderBy: { createdAt: "asc" } });
  if (employees.length === 0) return NextResponse.json([]);

  const settled = await Promise.allSettled(
    employees.map(async (emp) => {
      const msg  = await anthropic.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages:   [{ role: "user", content: buildPrompt(emp, ctx) }],
      });
      const raw       = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : "";
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      const insights  = jsonMatch ? (JSON.parse(jsonMatch[0]) as object[]) : [];
      return { id: emp.id, name: emp.name, title: emp.title, skills: emp.skills, avatarColor: emp.avatarColor, insights };
    }),
  );

  const result = settled.map((r, i) => {
    const emp = employees[i]!;
    if (r.status === "fulfilled") return r.value;
    return { id: emp.id, name: emp.name, title: emp.title, skills: emp.skills, avatarColor: emp.avatarColor, insights: [], error: r.reason instanceof Error ? r.reason.message : String(r.reason) };
  });

  return NextResponse.json(result);
}
