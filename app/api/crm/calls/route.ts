import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const calls = await prisma.crmCall.findMany({
    orderBy: { date: "desc" },
    take: 2500,
  });
  return NextResponse.json(calls);
}
