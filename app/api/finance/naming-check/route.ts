import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkNamingViolations } from "@/lib/naming-convention";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ads = await prisma.facebookAdInsight.findMany({
      where: { level: { in: ["campaign", "adset", "ad"] } },
      select: { entityId: true, entityName: true, level: true },
      distinct: ["entityId"],
    });

    const entities = ads.map(a => ({
      id:       a.entityId,
      name:     a.entityName,
      level:    a.level as "campaign" | "adset" | "ad",
      platform: "facebook",
    }));

    const violations = checkNamingViolations(entities);

    return NextResponse.json({
      total:      entities.length,
      violations: violations.length,
      compliant:  entities.length - violations.length,
      items:      violations,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
