import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") ?? new Date().toISOString().slice(0, 7);
  try {
    const target = await prisma.monthlySalesTarget.findUnique({ where: { period } });
    return NextResponse.json(target ?? { period, targetRON: null });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { period, targetRON, notes } = await req.json() as { period: string; targetRON: number; notes?: string };
    const target = await prisma.monthlySalesTarget.upsert({
      where: { period },
      update: { targetRON, notes },
      create: { period, targetRON, notes },
    });
    return NextResponse.json(target);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
