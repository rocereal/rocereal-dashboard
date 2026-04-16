import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const expectedToken = process.env.INVOX_WEBHOOK_TOKEN;
  if (expectedToken) {
    const authHeader = req.headers.get("authorization") || "";
    const receivedToken =
      req.headers.get("x-api-key") ||
      authHeader.replace(/^(Bearer|Token)\s+/i, "").trim() ||
      authHeader.trim() ||
      req.headers.get("x-token") ||
      req.headers.get("token") ||
      new URL(req.url).searchParams.get("token");

    if (receivedToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Parse body — could be JSON or form-encoded
  let body: unknown;
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      console.log("[invox] raw body:", text.slice(0, 500));
      try { body = JSON.parse(text); } catch { body = Object.fromEntries(new URLSearchParams(text)); }
    }
  } catch (e) {
    return NextResponse.json({ error: "Bad request body", detail: String(e) }, { status: 400 });
  }

  console.log("[invox] body:", JSON.stringify(body)?.slice(0, 500));

  const calls = Array.isArray(body) ? body : [body];
  let saved = 0;

  for (const call of calls) {
    const c = call as Record<string, unknown>;
    if (!c.id) { console.log("[invox] skipping call without id:", JSON.stringify(c).slice(0, 200)); continue; }
    try {
      await prisma.crmCall.upsert({
        where: { invoxId: String(c.id) },
        update: {
          account: (c.account as string) || null,
          status: (c.status as string) || null,
          duration: (c.duration as string) || null,
          summary: (c.summary as string) || null,
        },
        create: {
          invoxId: String(c.id),
          caller: (c.caller as string) || "",
          account: (c.account as string) || null,
          date: c.date ? new Date(c.date as string) : new Date(),
          duration: (c.duration as string) || null,
          status: (c.status as string) || null,
          source: (c.source as string) || null,
          campaign: (c.campaign as string) || null,
          utmSource: (c.utm_source as string) || null,
          medium: (c.medium as string) || null,
          receivingNumber: (c.receivingnumber as string) || null,
          recordingUri: (c.recording_uri as string) || null,
          reason: (c.reason as string) || null,
          summary: (c.summary as string) || null,
          rawPayload: c as object,
        },
      });
      saved++;
    } catch (e) {
      console.error("[invox] upsert error:", String(e), JSON.stringify(c).slice(0, 200));
      return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, saved });
}
