import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as Record<string, unknown>;

    const uniqueid  = (payload.uniqueid  ?? payload.id)        as string | undefined;
    const clid      = (payload.clid      ?? payload.caller)    as string | undefined;
    const direction = (payload.direction)                       as string | undefined;
    const status    = (payload.status)                         as string | undefined;
    const duration  = payload.billsec ?? payload.duration      as number | undefined;
    const callstart = (payload.callstart ?? payload.startedAt) as string | undefined;
    const callend   = (payload.callend   ?? payload.endedAt)   as string | undefined;
    const recording = (payload.recording)                      as string | undefined;
    const campaign  = (payload.campaign)                       as string | undefined;
    const queue     = (payload.queue)                          as string | undefined;

    if (!uniqueid || !clid) {
      return NextResponse.json({ error: "uniqueid și clid sunt obligatorii" }, { status: 400 });
    }

    await prisma.leadCall.upsert({
      where:  { externalId: uniqueid },
      update: { status, duration: Number(duration) || null, endedAt: callend ? new Date(callend) : null, recordingUrl: recording ?? null, rawPayload: payload },
      create: {
        provider:    "daktela",
        externalId:  uniqueid,
        callerPhone: clid,
        direction,
        status,
        duration:    Number(duration) || null,
        recordingUrl: recording ?? null,
        campaign,
        queue,
        tags:        [],
        startedAt:   callstart ? new Date(callstart) : new Date(),
        endedAt:     callend   ? new Date(callend)   : null,
        rawPayload:  payload,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
