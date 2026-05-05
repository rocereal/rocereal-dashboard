import { prisma } from "@/lib/prisma";
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

  const auth = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;

  // Fetch one real paid invoice from DB to probe its detail endpoint
  const sampleInvoice = await prisma.smartbillInvoice.findFirst({
    where:   { paid: true },
    orderBy: { issuedAt: "desc" },
    select:  { series: true, number: true, invoiceKey: true },
  });

  let invoiceDetail: unknown = null;
  if (sampleInvoice) {
    try {
      const url = `https://ws.smartbill.ro/SBORO/api/invoice?cif=${encodeURIComponent(cif)}&seriesname=${encodeURIComponent(sampleInvoice.series)}&number=${sampleInvoice.number}`;
      const res  = await fetch(url, { headers: { Authorization: auth, Accept: "application/json" }, cache: "no-store" });
      const text = await res.text();
      try { invoiceDetail = JSON.parse(text); } catch { invoiceDetail = text.slice(0, 2000); }
    } catch (e) {
      invoiceDetail = { error: e instanceof Error ? e.message : String(e) };
    }
  }

  return NextResponse.json({
    cif,
    warehouse,
    sampleInvoice,
    invoiceDetail,
  });
}
