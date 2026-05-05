import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface InvoiceProduct {
  code?:         string;
  name:          string;
  quantity:      number;
  price:         number;       // unit price excl. VAT
  priceWithVat?: number;       // unit price incl. VAT
  value?:        number;       // line total excl. VAT
}

function smartbillAuth() {
  const email = process.env.SMARTBILL_EMAIL!;
  const token = process.env.SMARTBILL_TOKEN!;
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

async function getLineItems(cif: string, series: string, number: number): Promise<InvoiceProduct[]> {
  try {
    const url = `https://ws.smartbill.ro/SBORO/api/invoice?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(series)}&number=${number}`;
    const res = await fetch(url, {
      headers: { Authorization: smartbillAuth(), Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json() as { errorText?: string; invoice?: { products?: InvoiceProduct[]; items?: InvoiceProduct[] }; products?: InvoiceProduct[]; items?: InvoiceProduct[] };
    if (data.errorText) return [];
    const inv = data.invoice ?? data;
    return (inv.products ?? inv.items ?? []) as InvoiceProduct[];
  } catch {
    return [];
  }
}

export async function POST() {
  const cif = process.env.SMARTBILL_CIF;
  if (!cif) {
    return NextResponse.json({ error: "SMARTBILL_CIF lipsește din env" }, { status: 503 });
  }

  // Pull last 40 paid invoices (most recent first) from our local DB
  const invoices = await prisma.smartbillInvoice.findMany({
    where:   { paid: true },
    orderBy: { issuedAt: "desc" },
    take:    40,
    select:  { series: true, number: true },
  });

  if (invoices.length === 0) {
    return NextResponse.json({ ok: true, updated: 0, message: "Nicio factură in DB" });
  }

  // Fetch line items in parallel batches of 5 to avoid rate-limiting
  const priceMap = new Map<string, number>(); // productCode → unitPrice incl. VAT
  const BATCH = 5;

  for (let i = 0; i < invoices.length; i += BATCH) {
    const batch   = invoices.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(inv => getLineItems(cif, inv.series, inv.number)));

    for (const items of results) {
      for (const item of items) {
        if (!item.code) continue;
        // Use price incl. VAT if available, otherwise excl. VAT
        const unitPrice = item.priceWithVat ?? item.price ?? 0;
        if (unitPrice > 0 && !priceMap.has(item.code)) {
          // First occurrence = most recent invoice price
          priceMap.set(item.code, unitPrice);
        }
      }
    }
  }

  if (priceMap.size === 0) {
    return NextResponse.json({ ok: true, updated: 0, message: "Niciun produs cu preț găsit în facturi" });
  }

  // Update ProductStock rows where sku matches a found code
  const stocks = await prisma.productStock.findMany({
    select: { id: true, sku: true, quantity: true },
  });

  let updated = 0;
  for (const stock of stocks) {
    if (!stock.sku) continue;
    const unitPrice = priceMap.get(stock.sku);
    if (!unitPrice) continue;

    const totalValue = parseFloat((unitPrice * stock.quantity).toFixed(2));
    await prisma.productStock.update({
      where: { id: stock.id },
      data:  { unitPrice, totalValue },
    });
    updated++;
  }

  return NextResponse.json({ ok: true, updated, pricesFound: priceMap.size });
}
