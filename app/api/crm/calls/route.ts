import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const debug  = searchParams.get("debug");
  const counts = searchParams.get("counts");
  const from   = searchParams.get("from");
  const to     = searchParams.get("to");

  if (debug === "1") {
    const latest = await prisma.crmCall.findFirst({
      orderBy: { date: "desc" },
      select: { rawPayload: true, account: true, caller: true },
    });
    return NextResponse.json(latest);
  }

  if (debug === "statuses") {
    const rows = await prisma.crmCall.findMany({
      select: { status: true },
      distinct: ["status"],
    });
    return NextResponse.json(rows.map((r) => r.status));
  }

  const dateFilter: { gte?: Date; lt?: Date } = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) {
    const d = new Date(to);
    d.setDate(d.getDate() + 1);
    dateFilter.lt = d;
  }
  const dateWhere = Object.keys(dateFilter).length ? { date: dateFilter } : {};

  if (counts === "1") {
    const rows = await prisma.crmCall.findMany({
      where: dateWhere,
      select: { source: true, status: true },
    });

    const channels         = { facebook: 0, tiktok: 0, google: 0 };
    const channelsAnswered = { facebook: 0, tiktok: 0, google: 0 };
    let total = 0, answered = 0;
    for (const { source, status } of rows) {
      total++;
      const isAnswered = status === "Answered";
      if (isAnswered) answered++;
      const s = (source ?? "").toLowerCase();
      type Ch = keyof typeof channels;
      let ch: Ch | null = null;
      if (s.includes("meta") || s.includes("facebook")) ch = "facebook";
      else if (s.includes("tik tok") || s.includes("tiktok")) ch = "tiktok";
      else if (s.includes("google")) ch = "google";
      if (ch) { channels[ch]++; if (isAnswered) channelsAnswered[ch]++; }
    }

    return NextResponse.json({ total, answered, channels, channelsAnswered });
  }

  const calls = await prisma.crmCall.findMany({
    where: dateWhere,
    orderBy: { date: "desc" },
    take: 10000,
  });
  return NextResponse.json(calls);
}
