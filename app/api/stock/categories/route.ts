import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/stock/categories
// Returns distinct non-null categories from ProductStock, sorted alphabetically
export async function GET() {
  const rows = await prisma.productStock.findMany({
    where:   { category: { not: null } },
    select:  { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return NextResponse.json(rows.map(r => r.category as string));
}
