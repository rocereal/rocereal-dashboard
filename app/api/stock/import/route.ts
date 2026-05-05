import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StockRow {
  name:      string;
  sku?:      string;
  category?: string;
  quantity:  number;
  unitPrice: number;
  unit?:     string;
}

function determineStatus(qty: number): string {
  if (qty <= 0)  return "out_of_stock";
  if (qty <= 2)  return "low_stock";
  return "in_stock";
}

// Parse CSV text into stock rows — handles SmartBill export format
function parseCsv(text: string): StockRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase().replace(/['"]/g, ""));

  const colIdx = (names: string[]) => {
    for (const n of names) {
      const i = header.findIndex(h => h.includes(n));
      if (i !== -1) return i;
    }
    return -1;
  };

  const nameCol     = colIdx(["denumire", "produs", "name", "articol"]);
  const skuCol      = colIdx(["cod", "sku", "code"]);
  const catCol      = colIdx(["categorie", "category", "grup"]);
  const qtyCol      = colIdx(["cantitate", "qty", "quantity", "stoc"]);
  const priceCol    = colIdx(["pret", "price", "valoare unitara"]);
  const unitCol     = colIdx(["um", "unit", "unitate"]);

  if (nameCol === -1 || qtyCol === -1) return [];

  const rows: StockRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(/[,;]/).map(c => c.trim().replace(/^["']|["']$/g, ""));
    const name = cols[nameCol]?.trim();
    if (!name) continue;
    const qty   = parseFloat(cols[qtyCol]?.replace(",", ".") ?? "0") || 0;
    const price = priceCol >= 0 ? parseFloat(cols[priceCol]?.replace(",", ".") ?? "0") || 0 : 0;
    rows.push({
      name,
      sku:      skuCol >= 0   ? cols[skuCol]   : undefined,
      category: catCol >= 0   ? cols[catCol]   : undefined,
      quantity: qty,
      unitPrice: price,
      unit:     unitCol >= 0  ? cols[unitCol]  : undefined,
    });
  }
  return rows;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const warehouse = (formData.get("warehouse") as string | null) ?? "GESTIUNE PARC SIBIU- VESTEM";

    if (!file) return NextResponse.json({ error: "Fișier lipsă" }, { status: 400 });

    const text = await file.text();
    const rows = parseCsv(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Nu s-au putut parsa rânduri valide. Verifică formatul CSV." }, { status: 422 });
    }

    // Upsert by name + warehouse
    let created = 0, updated = 0;
    const now = new Date();

    for (const row of rows) {
      const totalValue = row.quantity * row.unitPrice;
      const status     = determineStatus(row.quantity);

      const existing = await prisma.productStock.findFirst({ where: { name: row.name, warehouse } });
      if (existing) {
        await prisma.productStock.update({
          where: { id: existing.id },
          data: { sku: row.sku, category: row.category, quantity: row.quantity, unitPrice: row.unitPrice, totalValue, unit: row.unit, status, lastSyncedAt: now },
        });
        updated++;
      } else {
        await prisma.productStock.create({
          data: { name: row.name, sku: row.sku, category: row.category, quantity: row.quantity, unitPrice: row.unitPrice, totalValue, unit: row.unit, status, warehouse, lastSyncedAt: now },
        });
        created++;
      }
    }

    return NextResponse.json({ ok: true, created, updated, total: rows.length });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
