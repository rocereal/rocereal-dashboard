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

  const auth  = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  const today = new Date().toISOString().slice(0, 10);

  const url = `https://ws.smartbill.ro/SBORO/api/stocks?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`;
  const res  = await fetch(url, { headers: { Authorization: auth, Accept: "application/json" }, cache: "no-store" });
  const body = await res.json();

  const stockCount = await prisma.productStock.count();

  return NextResponse.json({ cif, warehouse, today, status: res.status, body, stockCount });
}
