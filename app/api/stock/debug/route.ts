import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = process.env.SMARTBILL_EMAIL;
  const token = process.env.SMARTBILL_TOKEN;
  const cif   = process.env.SMARTBILL_CIF;

  if (!email || !token || !cif) {
    return NextResponse.json({ error: "Credențiale SmartBill lipsesc din env" }, { status: 503 });
  }

  const auth    = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  const baseCif = cif.split("__")[0]; // strip "__subsidiary_X" for endpoints that don't accept it

  // Use a known product code from stock
  const sampleStock = await prisma.productStock.findFirst({
    where:   { sku: { not: null } },
    select:  { sku: true, name: true },
    orderBy: { createdAt: "asc" },
  });
  const productCode = sampleStock?.sku ?? "FR88064";

  const probe = async (label: string, url: string, method = "GET") => {
    try {
      const res  = await fetch(url, { method, headers: { Authorization: auth, Accept: "application/json" }, cache: "no-store" });
      const text = await res.text();
      let body: unknown;
      try { body = JSON.parse(text); } catch { body = text.slice(0, 300); }
      return { label, url, status: res.status, ok: res.ok, body };
    } catch (e) {
      return { label, url, error: e instanceof Error ? e.message : String(e) };
    }
  };

  const results = await Promise.all([
    // Product catalog — various forms
    probe("products (full cif)",             `https://ws.smartbill.ro/SBORO/api/products?cif=${encodeURIComponent(cif)}`),
    probe("products (base cif)",             `https://ws.smartbill.ro/SBORO/api/products?cif=${encodeURIComponent(baseCif)}`),
    probe("products paginated (full cif)",   `https://ws.smartbill.ro/SBORO/api/products?cif=${encodeURIComponent(cif)}&count=5&offset=0`),
    probe("products paginated (base cif)",   `https://ws.smartbill.ro/SBORO/api/products?cif=${encodeURIComponent(baseCif)}&count=5&offset=0`),

    // Single product by code — various param names
    probe("product by code (full cif)",      `https://ws.smartbill.ro/SBORO/api/product?cif=${encodeURIComponent(cif)}&productCode=${encodeURIComponent(productCode)}`),
    probe("product by code (base cif)",      `https://ws.smartbill.ro/SBORO/api/product?cif=${encodeURIComponent(baseCif)}&productCode=${encodeURIComponent(productCode)}`),
    probe("product by code param=code",      `https://ws.smartbill.ro/SBORO/api/product?cif=${encodeURIComponent(cif)}&code=${encodeURIComponent(productCode)}`),

    // Price-specific endpoints
    probe("price by productCode",            `https://ws.smartbill.ro/SBORO/api/price?cif=${encodeURIComponent(cif)}&productCode=${encodeURIComponent(productCode)}`),
    probe("price by productCode (base cif)", `https://ws.smartbill.ro/SBORO/api/price?cif=${encodeURIComponent(baseCif)}&productCode=${encodeURIComponent(productCode)}`),

    // Invoice detail — try POST
    (async () => {
      const inv = await prisma.smartbillInvoice.findFirst({ where: { paid: true }, orderBy: { issuedAt: "desc" }, select: { series: true, number: true } });
      if (!inv) return { label: "invoice detail (no invoice in DB)", url: "n/a", status: 0 };
      return probe(
        "invoice detail GET (full cif)",
        `https://ws.smartbill.ro/SBORO/api/invoice?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(inv.series)}&number=${inv.number}`
      );
    })(),
    (async () => {
      const inv = await prisma.smartbillInvoice.findFirst({ where: { paid: true }, orderBy: { issuedAt: "desc" }, select: { series: true, number: true } });
      if (!inv) return { label: "invoice detail (no invoice in DB)", url: "n/a", status: 0 };
      return probe(
        "invoice detail GET (base cif)",
        `https://ws.smartbill.ro/SBORO/api/invoice?cif=${encodeURIComponent(baseCif)}&seriesname=${encodeURIComponent(inv.series)}&number=${inv.number}`
      );
    })(),
  ]);

  return NextResponse.json({ cif, baseCif, productCode, productName: sampleStock?.name, results });
}
