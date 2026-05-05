import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SmartBillProduct {
  productName:    string;
  productCode?:   string;
  measuringUnit?: string;
  quantity:       number;
}

interface SmartBillWarehouseEntry {
  warehouse: { warehouseName: string; warehouseType?: string };
  products:  SmartBillProduct[];
}

interface SmartBillStocksResponse {
  list?:      SmartBillWarehouseEntry[];
  errorText?: string;
}

function determineStatus(qty: number): string {
  if (qty <= 0) return "out_of_stock";
  if (qty <= 2) return "low_stock";
  return "in_stock";
}

export async function POST() {
  const email     = process.env.SMARTBILL_EMAIL;
  const token     = process.env.SMARTBILL_TOKEN;
  const cif       = process.env.SMARTBILL_CIF;
  const warehouse = process.env.SMARTBILL_WAREHOUSE ?? "GESTIUNE PARC SIBIU- VESTEM";

  if (!email || !token || !cif) {
    return NextResponse.json({ error: "SMARTBILL_EMAIL / SMARTBILL_TOKEN / SMARTBILL_CIF lipsesc din env" }, { status: 503 });
  }

  try {
    const auth  = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
    const today = new Date().toISOString().slice(0, 10);
    const url   = `https://ws.smartbill.ro/SBORO/api/stocks?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`;

    const res = await fetch(url, {
      headers: { Authorization: auth, Accept: "application/json" },
      cache:   "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: `SmartBill API ${res.status}: ${res.statusText}` }, { status: 502 });
    }

    const data = await res.json() as SmartBillStocksResponse;
    if (data.errorText) {
      return NextResponse.json({ error: data.errorText }, { status: 502 });
    }

    // Find the warehouse entry matching our warehouse name
    const warehouseEntry = (data.list ?? []).find(
      e => e.warehouse?.warehouseName === warehouse
    );

    const products = warehouseEntry?.products ?? [];

    if (products.length === 0) {
      return NextResponse.json({ ok: true, created: 0, updated: 0, total: 0, message: "Niciun produs găsit în gestiunea specificată" });
    }

    let created = 0, updated = 0;
    const now = new Date();

    for (const product of products) {
      const qty        = Number(product.quantity) || 0;
      const status     = determineStatus(qty);

      const existing = await prisma.productStock.findFirst({
        where: { name: product.productName, warehouse },
      });

      if (existing) {
        await prisma.productStock.update({
          where: { id: existing.id },
          data:  {
            quantity:     qty,
            status,
            unit:         product.measuringUnit ?? existing.unit,
            sku:          product.productCode   ?? existing.sku,
            lastSyncedAt: now,
          },
        });
        updated++;
      } else {
        await prisma.productStock.create({
          data: {
            name:         product.productName,
            sku:          product.productCode,
            quantity:     qty,
            unitPrice:    0,
            totalValue:   0,
            unit:         product.measuringUnit,
            status,
            warehouse,
            lastSyncedAt: now,
          },
        });
        created++;
      }
    }

    return NextResponse.json({ ok: true, created, updated, total: products.length });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
