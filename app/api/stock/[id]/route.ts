import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json() as { unitPrice?: number; category?: string };

    const stock = await prisma.productStock.findUnique({ where: { id }, select: { quantity: true } });
    if (!stock) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updateData: { unitPrice?: number; totalValue?: number; category?: string | null } = {};

    if (body.unitPrice !== undefined) {
      if (typeof body.unitPrice !== "number" || body.unitPrice < 0)
        return NextResponse.json({ error: "unitPrice invalid" }, { status: 400 });
      updateData.unitPrice   = body.unitPrice;
      updateData.totalValue  = parseFloat((body.unitPrice * stock.quantity).toFixed(2));
    }

    if (body.category !== undefined) {
      updateData.category = body.category.trim() || null;
    }

    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ error: "Niciun câmp de actualizat" }, { status: 400 });

    const updated = await prisma.productStock.update({ where: { id }, data: updateData });
    return NextResponse.json({
      ok:         true,
      unitPrice:  updated.unitPrice,
      totalValue: updated.totalValue,
      category:   updated.category,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
