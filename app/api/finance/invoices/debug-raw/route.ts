/**
 * Debug: returns raw SmartBill API response for one invoice
 * GET /api/finance/invoices/debug-raw?series=M-SSB&number=101
 */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SMARTBILL_BASE = "https://ws.smartbill.ro/SBORO/api";

function smartbillAuth() {
  const email = process.env.SMARTBILL_EMAIL!;
  const token = process.env.SMARTBILL_TOKEN!;
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

export async function GET(req: NextRequest) {
  const cif = process.env.SMARTBILL_CIF;
  if (!cif) return NextResponse.json({ error: "SMARTBILL_CIF not configured" });

  const series = req.nextUrl.searchParams.get("series") ?? "M-SSB";
  const number = req.nextUrl.searchParams.get("number") ?? "101";

  const url = `${SMARTBILL_BASE}/invoice?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(series)}&number=${number}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: smartbillAuth(), Accept: "application/json" },
      cache: "no-store",
    });
    const text = await res.text();
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { parsed = text; }
    return NextResponse.json({ status: res.status, url, raw: parsed });
  } catch (e) {
    return NextResponse.json({ error: String(e), url });
  }
}
