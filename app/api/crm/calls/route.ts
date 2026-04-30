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
    const [total, answered] = await Promise.all([
      prisma.crmCall.count({ where: dateWhere }),
      prisma.crmCall.count({ where: { status: "Answered", ...dateWhere } }),
    ]);
    return NextResponse.json({ total, answered });
  }

  const calls = await prisma.crmCall.findMany({
    where: dateWhere,
    orderBy: { date: "desc" },
    take: 10000,
  });
  return NextResponse.json(calls);
}
