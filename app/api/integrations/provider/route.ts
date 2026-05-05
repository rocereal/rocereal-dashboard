import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const providers = await prisma.integrationProvider.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(providers);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// Toggle provider — enforces Invox/Daktela mutual exclusivity
export async function PATCH(req: NextRequest) {
  try {
    const { name, enabled } = await req.json() as { name: string; enabled: boolean };

    await prisma.integrationProvider.update({ where: { name }, data: { enabled } });

    // Mutual exclusivity: invox ↔ daktela
    if (name === "daktela" && enabled) {
      await prisma.integrationProvider.update({ where: { name: "invox"   }, data: { enabled: false } });
    }
    if (name === "invox" && enabled) {
      await prisma.integrationProvider.update({ where: { name: "daktela" }, data: { enabled: false } });
    }

    const updated = await prisma.integrationProvider.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
