import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SMARTBILL_BASE = "https://ws.smartbill.ro/SBORO/api";
// Parallel fetches per series per run — fast enough for 10s Hobby timeout
const BATCH_SIZE = 8;
const INITIAL_LOOKBACK = 50; // first run: last 50 per series

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
  if (!res.ok) throw new Error(`Series API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.list as { name: string; nextNumber: number }[];
}

async function getPaymentStatus(cif: string, series: string, number: number) {
  try {
    const url = `${SMARTBILL_BASE}/invoice/paymentstatus?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(series)}&number=${number}`;
    const res = await fetch(url, {
      headers: { Authorization: smartbillAuth(), Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.errorText) return null;
    return data as { invoiceTotalAmount: number; paidAmount: number; unpaidAmount: number; paid: boolean };
  } catch {
    return null;
  }
}

export async function GET() {
  const cif = process.env.SMARTBILL_CIF;
  if (!cif) return NextResponse.json({ error: "SMARTBILL_CIF not configured" }, { status: 503 });

  const seriesList = await getSeriesFromAPI(cif);
  const results: Record<string, unknown> = {};
  let totalFetched = 0;

  for (const s of seriesList) {
    const { name: series, nextNumber } = s;
    const lastInvoice = nextNumber - 1;

    // Load or initialize sync state
    let state = await prisma.smartbillSyncState.findUnique({ where: { series } });
    if (!state) {
      const startFrom = Math.max(1, lastInvoice - INITIAL_LOOKBACK + 1);
      state = await prisma.smartbillSyncState.create({
        data: { series, lastSyncedNumber: startFrom - 1, nextNumber },
      });
    } else {
      await prisma.smartbillSyncState.update({ where: { series }, data: { nextNumber } });
    }

    const fromNumber = state.lastSyncedNumber + 1;
    const toNumber = Math.min(lastInvoice, fromNumber + BATCH_SIZE - 1);

    if (fromNumber > lastInvoice) {
      results[series] = { fetched: 0, message: "Up to date" };
      continue;
    }

    // Fetch all numbers in this batch IN PARALLEL
    const numbers = Array.from({ length: toNumber - fromNumber + 1 }, (_, i) => fromNumber + i);
    const statuses = await Promise.all(numbers.map((n) => getPaymentStatus(cif, series, n)));

    let fetched = 0;
    let lastProcessed = state.lastSyncedNumber;

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      const status = statuses[i];
      lastProcessed = num;

      if (!status) continue; // gap or non-existent invoice

      const total = status.invoiceTotalAmount;
      const net = parseFloat((total / 1.19).toFixed(2));
      const tax = parseFloat((total - net).toFixed(2));
      const invoiceKey = `${series}-${num}`;

      await prisma.smartbillInvoice.upsert({
        where: { invoiceKey },
        update: { totalAmount: total, paidAmount: status.paidAmount, unpaidAmount: status.unpaidAmount, paid: status.paid, netAmount: net, taxAmount: tax, syncedAt: new Date() },
        create: { invoiceKey, series, number: num, totalAmount: total, paidAmount: status.paidAmount, unpaidAmount: status.unpaidAmount, paid: status.paid, netAmount: net, taxAmount: tax, issuedAt: new Date() },
      });
      fetched++;
    }

    await prisma.smartbillSyncState.update({
      where: { series },
      data: { lastSyncedNumber: lastProcessed },
    });

    totalFetched += fetched;
    results[series] = { fetched, from: fromNumber, to: toNumber, remaining: Math.max(0, lastInvoice - toNumber) };
  }

  return NextResponse.json({ ok: true, totalFetched, series: results });
}
