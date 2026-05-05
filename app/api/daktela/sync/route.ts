import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DAKTELA_API_URL   = process.env.DAKTELA_API_URL;
const DAKTELA_API_TOKEN = process.env.DAKTELA_API_TOKEN;

interface DaktelaCall {
  uniqueid:    string;
  clid:        string;  // caller phone
  queue:       string;
  agent:       string;
  direction:   string;
  status:      string;
  duration:    number;
  billsec:     number;
  callstart:   string;
  callend:     string;
  recording?:  string;
  campaign?:   string;
  tags?:       string[];
}

export async function POST(req: NextRequest) {
  if (!DAKTELA_API_URL || !DAKTELA_API_TOKEN) {
    return NextResponse.json({ error: "DAKTELA_API_URL sau DAKTELA_API_TOKEN lipsesc din env" }, { status: 503 });
  }

  const { from, to } = await req.json().catch(() => ({})) as { from?: string; to?: string };
  const dateFrom = from ?? new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const dateTo   = to   ?? new Date().toISOString().slice(0, 10);

  try {
    const url = new URL(`${DAKTELA_API_URL}/api/v5/records/calls.json`);
    url.searchParams.set("accessToken", DAKTELA_API_TOKEN);
    url.searchParams.set("from",        dateFrom);
    url.searchParams.set("to",          dateTo);
    url.searchParams.set("limit",       "500");

    const res  = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ error: `Daktela API ${res.status}: ${res.statusText}` }, { status: 502 });

    const data = await res.json() as { result?: { data?: DaktelaCall[] }; error?: string };
    if (data.error) return NextResponse.json({ error: data.error }, { status: 502 });

    const calls = data.result?.data ?? [];
    let created = 0, skipped = 0;

    for (const c of calls) {
      const existing = await prisma.leadCall.findUnique({ where: { externalId: c.uniqueid } });
      if (existing) { skipped++; continue; }

      await prisma.leadCall.create({
        data: {
          provider:    "daktela",
          externalId:  c.uniqueid,
          callerPhone: c.clid ?? "",
          calledPhone: null,
          direction:   c.direction,
          status:      c.status,
          duration:    c.billsec ?? c.duration ?? null,
          recordingUrl: c.recording ?? null,
          campaign:    c.campaign ?? null,
          queue:       c.queue ?? null,
          tags:        c.tags ?? [],
          startedAt:   new Date(c.callstart),
          endedAt:     c.callend ? new Date(c.callend) : null,
          rawPayload:  c as unknown as Record<string, unknown>,
        },
      });
      created++;
    }

    // Update provider last sync
    await prisma.integrationProvider.update({
      where: { name: "daktela" },
      data:  { updatedAt: new Date() },
    });

    return NextResponse.json({ ok: true, created, skipped, total: calls.length });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
