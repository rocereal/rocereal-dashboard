import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const employeeSlug = searchParams.get("employee");
  const type = searchParams.get("type"); // "daily" | "weekly"
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    const insights = await prisma.aiInsight.findMany({
      where: {
        ...(employeeSlug ? { employee: { slug: employeeSlug } } : {}),
        ...(type ? { type } : {}),
      },
      include: { employee: { select: { name: true, title: true, avatarColor: true, slug: true } } },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
    return NextResponse.json(insights);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json() as { id: string };
    await prisma.aiInsight.update({ where: { id }, data: { isRead: true } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
