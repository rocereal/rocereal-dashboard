import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const email     = process.env.SMARTBILL_EMAIL;
  const token     = process.env.SMARTBILL_TOKEN;
  const cif       = process.env.SMARTBILL_CIF;
  const warehouse = process.env.SMARTBILL_WAREHOUSE ?? "GESTIUNE PARC SIBIU- VESTEM";

  if (!email || !token || !cif) {
    return NextResponse.json({ error: "Credențiale SmartBill lipsesc din env" }, { status: 503 });
  }

  const auth  = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  const today = new Date().toISOString().slice(0, 10);

  const endpoints = [
    `https://ws.smartbill.ro/SBORO/api/stocks?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`,
    `https://ws.smartbill.ro/SBORO/api/stocks?cif=${encodeURIComponent(cif)}&date=${today}`,
    `https://ws.smartbill.ro/SBORO/api/stock?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`,
    `https://ws.smartbill.ro/SBORO/api/products?cif=${encodeURIComponent(cif)}`,
    `https://ws.smartbill.ro/SBORO/api/series?cif=${encodeURIComponent(cif)}&type=f`,
  ];

  const results: Record<string, unknown>[] = [];

  for (const url of endpoints) {
    try {
      const res  = await fetch(url, { headers: { Authorization: auth, Accept: "application/json" }, cache: "no-store" });
      const text = await res.text();
      let body: unknown;
      try { body = JSON.parse(text); } catch { body = text.slice(0, 500); }
      results.push({ url, status: res.status, ok: res.ok, body });
    } catch (e) {
      results.push({ url, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return NextResponse.json({ cif, warehouse, today, results });
}
