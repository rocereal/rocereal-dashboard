import { NextResponse } from "next/server";
import { fetchAllDeliveryData } from "@/lib/googleSheetsDelivery";

export const dynamic = "force-dynamic";

// Debug endpoint: GET /api/tracking/deliveries/debug
// Returns raw counts + first few rows of each category to diagnose parsing
export async function GET() {
  const data = await fetchAllDeliveryData();

  return NextResponse.json({
    error: data.error ?? null,
    counts: {
      deliveries:  data.deliveries.length,
      fuelEntries: data.fuelEntries.length,
      expenses:    data.expenses.length,
    },
    sampleDeliveries: data.deliveries.slice(0, 5),
    sampleFuel:       data.fuelEntries.slice(0, 5),
    yearBreakdown: {
      deliveries:  countByYear(data.deliveries.map(d => d.year)),
      fuelEntries: countByYear(data.fuelEntries.map(f => f.year)),
    },
  });
}

function countByYear(years: number[]): Record<number, number> {
  const out: Record<number, number> = {};
  for (const y of years) out[y] = (out[y] ?? 0) + 1;
  return out;
}
