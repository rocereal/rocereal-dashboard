import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SMARTBILL_BASE = "https://ws.smartbill.ro/SBORO/api";
const NEW_BATCH_SIZE = 6;      // new invoices per series per sync
const INITIAL_LOOKBACK = 30;   // first run: look back 30 invoices per series
const COOLDOWN_MINUTES = 15;   // don't sync more than once every 15 minutes
const STATUS_BATCH = 20;       // unpaid invoices to recheck per sync call

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

async function getInvoiceDetails(cif: string, series: string, number: number) {
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
    return {
      client:    (inv.client?.name ?? inv.clientName ?? "") as string,
      phone:     (inv.client?.phone ?? inv.clientPhone ?? "") as string,
      dueDate:   (inv.paymentDate ?? inv.dueDate ?? null) as string | null,
      issueDate: (inv.issueDate ?? inv.issuedate ?? inv.seriesDate ?? inv.date ?? null) as string | null,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const cif = process.env.SMARTBILL_CIF;
  if (!cif) return NextResponse.json({ error: "SMARTBILL_CIF not configured" }, { status: 503 });

  // Cooldown: skip if any series was synced less than COOLDOWN_MINUTES ago
  const recentSync = await prisma.smartbillSyncState.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  if (recentSync) {
    const minutesSince = (Date.now() - recentSync.updatedAt.getTime()) / 60000;
    if (minutesSince < COOLDOWN_MINUTES) {
      return NextResponse.json({ ok: true, skipped: true, nextSyncIn: Math.ceil(COOLDOWN_MINUTES - minutesSince) });
    }
  }

  const seriesList = await getSeriesFromAPI(cif);
  const results: Record<string, unknown> = {};
  let totalFetched = 0;

  // ── Step 1: Fetch new invoices per series ─────────────────────────────────
  for (const s of seriesList) {
    const { name: series, nextNumber } = s;
    const lastInvoice = nextNumber - 1;

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
    const toNumber = Math.min(lastInvoice, fromNumber + NEW_BATCH_SIZE - 1);

    if (fromNumber > lastInvoice) {
      results[series] = { fetched: 0, message: "Up to date" };
      continue;
    }

    const numbers = Array.from({ length: toNumber - fromNumber + 1 }, (_, i) => fromNumber + i);
    const [statuses, details] = await Promise.all([
      Promise.all(numbers.map((n) => getPaymentStatus(cif, series, n))),
      Promise.all(numbers.map((n) => getInvoiceDetails(cif, series, n))),
    ]);

    let fetched = 0;
    let lastProcessed = state.lastSyncedNumber;

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      const status = statuses[i];
      lastProcessed = num;

      if (!status) continue;

      const total = status.invoiceTotalAmount;
      const net = parseFloat((total / 1.19).toFixed(2));
      const tax = parseFloat((total - net).toFixed(2));
      const invoiceKey = `${series}-${num}`;
      const detail = details[i];
      const client   = detail?.client    ?? "";
      const dueDate  = detail?.dueDate   ? new Date(detail.dueDate)   : null;
      const issuedAt = detail?.issueDate ? new Date(detail.issueDate) : null;

      await prisma.smartbillInvoice.upsert({
        where: { invoiceKey },
        update: {
          totalAmount: total, paidAmount: status.paidAmount, unpaidAmount: status.unpaidAmount,
          paid: status.paid, netAmount: net, taxAmount: tax,
          ...(client   ? { client }   : {}),
          ...(dueDate  ? { dueDate }  : {}),
          ...(issuedAt ? { issuedAt } : {}),
          syncedAt: new Date(),
        },
        create: {
          invoiceKey, series, number: num,
          totalAmount: total, paidAmount: status.paidAmount, unpaidAmount: status.unpaidAmount,
          paid: status.paid, netAmount: net, taxAmount: tax,
          client, dueDate,
          issuedAt: issuedAt ?? new Date(),
        },
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

  // ── Step 2: Recheck payment status for unpaid invoices ────────────────────
  // Fetches the oldest-synced unpaid invoices and updates their paid status.
  // This ensures "Emisa" → "Incasata" transitions are reflected in real time.
  const unpaidInvoices = await prisma.smartbillInvoice.findMany({
    where: { paid: false },
    select: { invoiceKey: true, series: true, number: true },
    orderBy: { syncedAt: "asc" }, // oldest-synced first
    take: STATUS_BATCH,
  });

  let statusUpdated = 0;
  let statusNowPaid = 0;

  if (unpaidInvoices.length > 0) {
    const recheckStatuses = await Promise.all(
      unpaidInvoices.map((inv) => getPaymentStatus(cif, inv.series, inv.number))
    );

    for (let i = 0; i < unpaidInvoices.length; i++) {
      const inv = unpaidInvoices[i];
      const st  = recheckStatuses[i];
      if (!st) continue;

      await prisma.smartbillInvoice.update({
        where: { invoiceKey: inv.invoiceKey },
        data: {
          paid:         st.paid,
          paidAmount:   st.paidAmount,
          unpaidAmount: st.unpaidAmount,
          syncedAt:     new Date(),
        },
      });

      statusUpdated++;
      if (st.paid) statusNowPaid++;
    }
  }

  return NextResponse.json({
    ok: true,
    totalFetched,
    series: results,
    statusRecheck: {
      checked: unpaidInvoices.length,
      updated: statusUpdated,
      nowPaid: statusNowPaid,
    },
  });
}
