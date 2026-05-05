import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const warehouse = req.nextUrl.searchParams.get("warehouse") ?? "GESTIUNE PARC SIBIU- VESTEM";
  try {
    const items = await prisma.productStock.findMany({
      where: { warehouse },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
    const syncedAt = items[0]?.lastSyncedAt ?? null;
    return NextResponse.json({ items, syncedAt, total: items.length });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
