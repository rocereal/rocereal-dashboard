import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { unitPrice } = await req.json() as { unitPrice: number };
    if (typeof unitPrice !== "number" || unitPrice < 0) {
      return NextResponse.json({ error: "unitPrice invalid" }, { status: 400 });
    }
    const stock = await prisma.productStock.findUnique({ where: { id }, select: { quantity: true } });
    if (!stock) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const totalValue = parseFloat((unitPrice * stock.quantity).toFixed(2));
    const updated = await prisma.productStock.update({
      where: { id },
      data:  { unitPrice, totalValue },
    });
    return NextResponse.json({ ok: true, unitPrice: updated.unitPrice, totalValue: updated.totalValue });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
