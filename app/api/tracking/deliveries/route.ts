import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAllDeliveryData } from "@/lib/googleSheetsDelivery";
import { buildDeliveryReport } from "@/lib/deliveryCostCalculator";

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

  // 5. Build the report
  const report = buildDeliveryReport(deliveries, fuelEntries, expenses, invoiceAmountMap);

  return NextResponse.json(report);
}
