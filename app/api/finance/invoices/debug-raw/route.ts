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

export async function GET(_req: NextRequest) {
  const cif = process.env.SMARTBILL_CIF;
  if (!cif) return NextResponse.json({ error: "SMARTBILL_CIF not configured" });

  // Try multiple candidate endpoints to find which one SmartBill supports
  const candidates = [
    `${SMARTBILL_BASE}/invoices?cif=${encodeURIComponent(cif)}&from=2026-04-01&to=2026-04-30`,
    `${SMARTBILL_BASE}/invoice?cif=${encodeURIComponent(cif)}&from=2026-04-01&to=2026-04-30`,
    `${SMARTBILL_BASE}/invoice/list?cif=${encodeURIComponent(cif)}&from=01-04-2026&to=30-04-2026`,
    `${SMARTBILL_BASE}/invoices?cif=${encodeURIComponent(cif)}&from=01-04-2026&to=30-04-2026`,
    `${SMARTBILL_BASE}/invoice/paymentstatus?cif=${encodeURIComponent(cif)}&seriesname=SSB&number=481`,
  ];

  const results: { url: string; status: number; snippet: string }[] = [];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: smartbillAuth(), Accept: "application/json" },
        cache: "no-store",
      });
      const text = await res.text();
      results.push({ url, status: res.status, snippet: text.slice(0, 300) });
    } catch (e) {
      results.push({ url, status: 0, snippet: String(e) });
    }
  }

  return NextResponse.json(results);
}
