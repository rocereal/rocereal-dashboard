import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Check token from multiple possible header locations
  const token =
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace(/^(Bearer|Token)\s+/i, "") ||
    req.headers.get("x-token") ||
    req.headers.get("token") ||
    new URL(req.url).searchParams.get("token");

  const expectedToken = process.env.INVOX_WEBHOOK_TOKEN;

  if (token !== expectedToken) {
    // Log headers for debugging (visible in Vercel logs)
    const headerMap: Record<string, string> = {};
    req.headers.forEach((v, k) => { headerMap[k] = v; });
    console.error("[invox webhook] 401 — token mismatch", {
      received: token,
      expectedPrefix: expectedToken?.slice(0, 8),
      headers: Object.keys(headerMap),
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const calls = Array.isArray(body) ? body : [body];

  for (const call of calls) {
    if (!call.id) continue;
    await prisma.crmCall.upsert({
      where: { invoxId: String(call.id) },
      update: {
        account: call.account || null,
        status: call.status || null,
        duration: call.duration || null,
        summary: call.summary || null,
      },
      create: {
        invoxId: String(call.id),
        caller: call.caller || "",
        account: call.account || null,
        date: call.date ? new Date(call.date) : new Date(),
        duration: call.duration || null,
        status: call.status || null,
        source: call.source || null,
        campaign: call.campaign || null,
        utmSource: call.utm_source || null,
        medium: call.medium || null,
        receivingNumber: call.receivingnumber || null,
        recordingUri: call.recording_uri || null,
        reason: call.reason || null,
        summary: call.summary || null,
        rawPayload: call,
      },
    });
  }

  return NextResponse.json({ success: true });
}
