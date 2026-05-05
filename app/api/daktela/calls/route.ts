import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const from  = searchParams.get("from");
  const to    = searchParams.get("to");
  const limit = parseInt(searchParams.get("limit") ?? "100");

  const dateFilter: { gte?: Date; lt?: Date } = {};
  if (from) dateFilter.gte = new Date(from);
  if (to)   { const d = new Date(to); d.setDate(d.getDate() + 1); dateFilter.lt = d; }

  try {
    const calls = await prisma.leadCall.findMany({
      where: {
        provider: "daktela",
        ...(Object.keys(dateFilter).length ? { startedAt: dateFilter } : {}),
      },
      include: { agent: { select: { name: true } }, lead: { select: { fullName: true, source: true } } },
      orderBy: { startedAt: "desc" },
      take: limit,
    });

    const total    = await prisma.leadCall.count({ where: { provider: "daktela" } });
    const answered = await prisma.leadCall.count({ where: { provider: "daktela", status: "Answered" } });

    return NextResponse.json({ calls, total, answered });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
