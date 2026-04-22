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

  // Try the list endpoint — returns invoices with real issue dates
  const from = req.nextUrl.searchParams.get("from") ?? "2026-04-01";
  const to   = req.nextUrl.searchParams.get("to")   ?? "2026-04-30";

  const url = `${SMARTBILL_BASE}/invoice/list?cif=${encodeURIComponent(cif)}&from=${from}&to=${to}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: smartbillAuth(), Accept: "application/json" },
      cache: "no-store",
    });
    const text = await res.text();
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { parsed = text; }
    // Return only first 2 items so we can see the field names without flooding
    if (parsed && typeof parsed === "object" && "list" in (parsed as object)) {
      const p = parsed as { list: unknown[] };
      return NextResponse.json({ status: res.status, url, first2: p.list?.slice(0, 2), totalCount: p.list?.length });
    }
    return NextResponse.json({ status: res.status, url, raw: parsed });
  } catch (e) {
    return NextResponse.json({ error: String(e), url });
  }
}
