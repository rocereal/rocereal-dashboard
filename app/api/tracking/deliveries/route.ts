import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAllDeliveryData } from "@/lib/googleSheetsDelivery";
import type { RawDelivery } from "@/lib/googleSheetsDelivery";
import { buildDeliveryReport } from "@/lib/deliveryCostCalculator";
import { resolveCoords, routeKey, osrmRoadKm } from "@/lib/geoDistance";

// Pre-compute real road distances for all unique routes via OSRM.
// Runs at most 5 requests in parallel to stay within the free server's limits.
async function computeOsrmDistances(deliveries: RawDelivery[]): Promise<Map<string, number>> {
  const pairs = new Map<string, { from: [number, number]; to: [number, number] }>();
  for (const d of deliveries) {
    const from = resolveCoords(d.departureLocation);
    const to   = resolveCoords(d.arrivalLocation, d.county);
    if (!from || !to) continue;
    const key = routeKey(from, to);
    if (!pairs.has(key)) pairs.set(key, { from, to });
  }

  const result = new Map<string, number>();
  const entries = Array.from(pairs.entries());
  const BATCH = 5;

  for (let i = 0; i < entries.length; i += BATCH) {
    await Promise.all(
      entries.slice(i, i + BATCH).map(async ([key, { from, to }]) => {
        const km = await osrmRoadKm(from, to);
        if (km !== null) result.set(key, km);
      }),
    );
  }

  return result;
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from"); // YYYY-MM-DD
  const to   = searchParams.get("to");   // YYYY-MM-DD

  // 1. Fetch all delivery data from Google Sheets
  const sheetData = await fetchAllDeliveryData();
  if (sheetData.error) {
    return NextResponse.json({ error: sheetData.error }, { status: 503 });
  }

  // 2. Filter by date range if provided
  let { deliveries, fuelEntries, expenses } = sheetData;
  if (from || to) {
    const fromDate = from ? new Date(from) : null;
    const toDate   = to   ? new Date(to)   : null;
    const inRange  = (dateStr: string) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return true;
      if (fromDate && d < fromDate) return false;
      if (toDate   && d > toDate)   return false;
      return true;
    };
    deliveries  = deliveries.filter(d  => inRange(d.date));
    fuelEntries = fuelEntries.filter(f => inRange(f.date));
    expenses    = expenses.filter(e    => inRange(e.date));
  }

  // 3. Collect unique invoice numbers from deliveries
  const invoiceNumbers = [...new Set(
    deliveries.map(d => d.invoiceNumber).filter(Boolean),
  )];

  // 4. Fetch matching SmartBill invoices from DB
  const invoiceAmountMap = new Map<string, number>();
  if (invoiceNumbers.length > 0) {
    const dbInvoices = await prisma.smartbillInvoice.findMany({
      where: { invoiceKey: { in: invoiceNumbers } },
      select: { invoiceKey: true, totalAmount: true },
    });
    for (const inv of dbInvoices) {
      invoiceAmountMap.set(inv.invoiceKey, inv.totalAmount);
    }
  }

  // 5. Pre-compute real road distances (OSRM), then build the report
  const osrmMap = await computeOsrmDistances(deliveries);
  const report  = buildDeliveryReport(deliveries, fuelEntries, expenses, invoiceAmountMap, osrmMap);

  return NextResponse.json(report);
}
