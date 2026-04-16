import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const debug = req.nextUrl.searchParams.get("debug");

  if (debug === "1") {
    // Return rawPayload of latest call for field inspection
    const latest = await prisma.crmCall.findFirst({
      orderBy: { date: "desc" },
      select: { rawPayload: true, account: true, caller: true },
    });
    return NextResponse.json(latest);
  }

  const calls = await prisma.crmCall.findMany({
    orderBy: { date: "desc" },
    take: 2500,
  });
  return NextResponse.json(calls);
}
