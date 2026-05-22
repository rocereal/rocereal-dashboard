import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/campaigns/labels?platform=facebook
// Returns all labels for a platform as a map: { [campaignId]: internalName | null }
export async function GET(req: NextRequest) {
  const platform = new URL(req.url).searchParams.get("platform");
  if (!platform) return NextResponse.json({ error: "platform required" }, { status: 400 });

  const rows = await prisma.campaignLabel.findMany({ where: { platform } });
  const map: Record<string, string | null> = {};
  for (const r of rows) map[r.campaignId] = r.internalName ?? null;
  return NextResponse.json(map);
}

// PUT /api/campaigns/labels
// Body: { platform, campaignId, campaignName, internalName }
export async function PUT(req: NextRequest) {
  const body = await req.json() as {
    platform: string;
    campaignId: string;
    campaignName?: string;
    internalName: string | null;
  };

  const { platform, campaignId, campaignName = "", internalName } = body;
  if (!platform || !campaignId) {
    return NextResponse.json({ error: "platform and campaignId required" }, { status: 400 });
  }

  const row = await prisma.campaignLabel.upsert({
    where:  { platform_campaignId: { platform, campaignId } },
    update: { internalName: internalName || null, campaignName },
    create: { platform, campaignId, campaignName, internalName: internalName || null },
  });

  return NextResponse.json({ ok: true, internalName: row.internalName });
}
