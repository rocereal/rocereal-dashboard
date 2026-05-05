import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const employees = await prisma.aiEmployee.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        insights: {
          where: { isRead: false },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        tasks: {
          where: { status: { in: ["running", "done"] } },
          orderBy: { completedAt: "desc" },
          take: 3,
        },
      },
    });
    return NextResponse.json(employees);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
