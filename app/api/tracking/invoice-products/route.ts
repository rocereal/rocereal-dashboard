import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SMARTBILL_BASE = "https://ws.smartbill.ro/SBORO/api";

function smartbillAuth() {
  const email = process.env.SMARTBILL_EMAIL ?? "";
  const token = process.env.SMARTBILL_TOKEN ?? "";
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

export interface InvoiceProduct {
  name:        string;
  code:        string;
  quantity:    number;
  um:          string;
  unitPrice:   number;
  totalPrice:  number;
}

// Parse "SSB-494" → { series: "SSB", number: 494 }
function parseInvoiceKey(key: string): { series: string; number: number } | null {
  const m = key.match(/^([A-Z]+)-(\d+)$/);
  if (!m) return null;
  return { series: m[1]!, number: parseInt(m[2]!) };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invoiceKey = searchParams.get("invoice")?.trim().toUpperCase();

  if (!invoiceKey) {
    return NextResponse.json({ error: "Parametru 'invoice' lipsește" }, { status: 400 });
  }

  const parsed = parseInvoiceKey(invoiceKey);
  if (!parsed) {
    return NextResponse.json({ error: `Format factură invalid: ${invoiceKey}` }, { status: 400 });
  }

  const rawCif = process.env.SMARTBILL_CIF;
  if (!rawCif) {
    return NextResponse.json({ error: "SMARTBILL_CIF lipsește în Vercel Environment Variables", products: [] }, { status: 503 });
  }
  // Strip branch suffix like "__subsidiary_2" — REST API needs only the CIF
  const cif = rawCif.split("__")[0]!;

  try {
    const url = `${SMARTBILL_BASE}/invoice?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(parsed.series)}&number=${parsed.number}`;
    const res = await fetch(url, {
      headers: { Authorization: smartbillAuth(), Accept: "application/json" },
      cache:   "no-store",
    });

    const rawText = await res.text();
    let data: Record<string, unknown> = {};
    try { data = JSON.parse(rawText) as Record<string, unknown>; } catch { /**/ }

    if (!res.ok) {
      const msg = (data.errorMessage ?? data.message ?? data.error ?? `HTTP ${res.status}`) as string;
      return NextResponse.json({ error: String(msg), products: [], _debug: { status: res.status, cif, url } });
    }

    if (data.errorText || data.errorMessage) {
      return NextResponse.json({ error: String(data.errorText ?? data.errorMessage), products: [], _debug: { cif } });
    }

    const inv = (data.invoice ?? data) as Record<string, unknown>;
    const rawProducts = (inv.products ?? inv.Products ?? []) as Record<string, unknown>[];

    const products: InvoiceProduct[] = rawProducts.map(p => ({
      name:       String(p.name ?? p.Name ?? p.productName ?? ""),
      code:       String(p.code ?? p.Code ?? p.productCode ?? ""),
      quantity:   Number(p.quantity ?? p.Quantity ?? 0),
      um:         String(p.um ?? p.Um ?? p.measureUnit ?? "buc"),
      unitPrice:  Number(p.price ?? p.Price ?? p.unitPrice ?? 0),
      totalPrice: Number(p.value ?? p.Value ?? p.totalValue ?? 0),
    }));

    return NextResponse.json({ products, invoiceKey });
  } catch (e) {
    return NextResponse.json({ error: String(e), products: [] });
  }
}
