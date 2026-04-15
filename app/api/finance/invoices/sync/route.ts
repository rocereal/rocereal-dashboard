import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SMARTBILL_BASE = "https://ws.smartbill.ro/SBORO/api";
const BATCH_SIZE = 25; // stay under rate limit (30/min)
const INITIAL_LOOKBACK = 200; // how many invoices to fetch on first sync

function smartbillAuth() {
  const email = process.env.SMARTBILL_EMAIL!;
  const token = process.env.SMARTBILL_TOKEN!;
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

async function getSeriesFromAPI(cif: string) {
  const res = await fetch(
    `${SMARTBILL_BASE}/series?cif=${encodeURIComponent(cif)}&type=f`,
    { headers: { Authorization: smartbillAuth(), Accept: "application/json" }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Series API error ${res.status}`);
  const data = await res.json();
  return data.list as { name: string; nextNumber: number; type: string }[];
}

async function getPaymentStatus(cif: string, series: string, number: number) {
  const url = `${SMARTBILL_BASE}/invoice/paymentstatus?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(series)}&number=${number}`;
  const res = await fetch(url, {
    headers: { Authorization: smartbillAuth(), Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.errorText) return null;
  return data as {
    invoiceTotalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    paid: boolean;
  };
}

export async function GET(req: Request) {
  // Protect cron endpoint — only allow Vercel cron or internal calls
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cif = process.env.SMARTBILL_CIF!;
  if (!cif) return NextResponse.json({ error: "SMARTBILL_CIF not set" }, { status: 503 });

  const seriesList = await getSeriesFromAPI(cif);
  const results: Record<string, unknown> = {};
  let totalFetched = 0;

  for (const s of seriesList) {
    const { name: series, nextNumber } = s;
    const lastInvoice = nextNumber - 1;

    // Load or initialize sync state
    let state = await prisma.smartbillSyncState.findUnique({ where: { series } });
    if (!state) {
      // First run: start from INITIAL_LOOKBACK invoices ago
      const startFrom = Math.max(1, lastInvoice - INITIAL_LOOKBACK + 1);
      state = await prisma.smartbillSyncState.create({
        data: { series, lastSyncedNumber: startFrom - 1, nextNumber },
      });
    } else {
      // Update the nextNumber if it changed
      await prisma.smartbillSyncState.update({
        where: { series },
        data: { nextNumber },
      });
    }

    const fromNumber = state.lastSyncedNumber + 1;
    const toNumber = Math.min(lastInvoice, fromNumber + BATCH_SIZE - 1);

    if (fromNumber > lastInvoice) {
      results[series] = { fetched: 0, message: "Up to date" };
      continue;
    }

    let fetched = 0;
    let lastSuccessful = state.lastSyncedNumber;

    for (let num = fromNumber; num <= toNumber; num++) {
      const status = await getPaymentStatus(cif, series, num);
      if (!status) {
        // Invoice doesn't exist (gap or end of series), skip
        lastSuccessful = num; // mark as processed even if missing
        continue;
      }

      const total = status.invoiceTotalAmount;
      // Romanian standard VAT 19%
      const net = parseFloat((total / 1.19).toFixed(4));
      const tax = parseFloat((total - net).toFixed(4));
      const invoiceKey = `${series}-${num}`;

      await prisma.smartbillInvoice.upsert({
        where: { invoiceKey },
        update: {
          totalAmount: total,
          paidAmount: status.paidAmount,
          unpaidAmount: status.unpaidAmount,
          paid: status.paid,
          netAmount: net,
          taxAmount: tax,
          syncedAt: new Date(),
        },
        create: {
          invoiceKey,
          series,
          number: num,
          totalAmount: total,
          paidAmount: status.paidAmount,
          unpaidAmount: status.unpaidAmount,
          paid: status.paid,
          netAmount: net,
          taxAmount: tax,
          issuedAt: new Date(), // best approximation for new invoices
        },
      });

      lastSuccessful = num;
      fetched++;
    }

    // Update sync state
    await prisma.smartbillSyncState.update({
      where: { series },
      data: { lastSyncedNumber: Math.max(lastSuccessful, state.lastSyncedNumber) },
    });

    totalFetched += fetched;
    results[series] = {
      fetched,
      range: `${fromNumber}-${toNumber}`,
      remaining: Math.max(0, lastInvoice - toNumber),
    };
  }

  return NextResponse.json({ ok: true, totalFetched, series: results });
}
