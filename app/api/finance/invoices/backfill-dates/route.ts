/**
 * One-time backfill: re-fetches issue dates from SmartBill API for all invoices
 * whose issuedAt is clearly wrong (= stored as sync date, not real invoice date).
 *
 * Rate-limited to BATCH_SIZE per call. Call repeatedly until done=true.
 * GET /api/finance/invoices/backfill-dates          → process next batch
 * GET /api/finance/invoices/backfill-dates?dry=1    → preview without writing
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SMARTBILL_BASE = "https://ws.smartbill.ro/SBORO/api";
const BATCH_SIZE = 10; // conservative: stay well under the 30/10min rate limit
// Delay between requests in ms to avoid rate limiting
const DELAY_MS = 400;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function smartbillAuth() {
  const email = process.env.SMARTBILL_EMAIL!;
  const token = process.env.SMARTBILL_TOKEN!;
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

async function fetchIssueDate(cif: string, series: string, number: number): Promise<string | null> {
  try {
    const url = `${SMARTBILL_BASE}/invoice?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(series)}&number=${number}`;
    const res = await fetch(url, {
      headers: { Authorization: smartbillAuth(), Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.errorText) return null;
    const inv = data.invoice ?? data;
    return (inv.issueDate ?? inv.issuedate ?? inv.seriesDate ?? inv.date ?? null) as string | null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const cif = process.env.SMARTBILL_CIF;
  if (!cif) return NextResponse.json({ error: "SMARTBILL_CIF not configured" }, { status: 503 });

  const dry = req.nextUrl.searchParams.get("dry") === "1";

  // Find invoices that still have a "wrong" issuedAt.
  // Heuristic: issuedAt after 2026-04-01 is almost certainly the sync date,
  // since the business has been running before that. Adjust if needed.
  const CUTOFF = new Date("2026-04-01T00:00:00Z");

  const toFix = await prisma.smartbillInvoice.findMany({
    where: { issuedAt: { gte: CUTOFF } },
    select: { invoiceKey: true, series: true, number: true, issuedAt: true },
    orderBy: { number: "asc" },
    take: BATCH_SIZE,
  });

  const totalStillWrong = await prisma.smartbillInvoice.count({
    where: { issuedAt: { gte: CUTOFF } },
  });

  if (toFix.length === 0) {
    return NextResponse.json({ done: true, message: "All issue dates are already correct." });
  }

  const results: { invoiceKey: string; oldDate: string; newDate: string | null; updated: boolean }[] = [];

  for (const inv of toFix) {
    await sleep(DELAY_MS);
    const issueDate = await fetchIssueDate(cif, inv.series, inv.number);

    if (issueDate && !dry) {
      await prisma.smartbillInvoice.update({
        where: { invoiceKey: inv.invoiceKey },
        data: { issuedAt: new Date(issueDate) },
      });
    }

    results.push({
      invoiceKey: inv.invoiceKey,
      oldDate: inv.issuedAt.toISOString().slice(0, 10),
      newDate: issueDate,
      updated: !!issueDate && !dry,
    });
  }

  const updated = results.filter(r => r.updated).length;
  const failed  = results.filter(r => !r.newDate).length;
  const remaining = totalStillWrong - updated;

  return NextResponse.json({
    done: remaining <= 0,
    dry,
    processed: toFix.length,
    updated,
    failed,
    remaining: Math.max(0, remaining),
    results,
  });
}
