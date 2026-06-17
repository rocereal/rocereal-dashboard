import type { RawDelivery, RawFuelEntry, RawExpense } from "./googleSheetsDelivery";

// Fallback cost per km when no fuel data is available for that vehicle/month
export const FALLBACK_COST_PER_KM: Record<string, number> = {
  "SB-10-RCR": 1.2,
  "AR-40-RCR": 1.0,
  "SB-20-RCR": 1.0,
};
const DEFAULT_COST_PER_KM = 1.0;

export interface VehicleMonthStats {
  vehicle:       string;
  month:         number;
  year:          number;
  totalKm:       number;
  totalFuel:     number;    // lei
  costPerKm:     number;    // lei/km (computed or fallback)
  deliveryCount: number;
}

export interface EnrichedDelivery extends RawDelivery {
  logisticCost:       number;   // totalKm × costPerKm
  efficiencyStatus:   "efficient" | "high_cost" | "covered" | "subsidized" | "incomplete";
  efficiencyLabel:    string;
  profitabilityRatio: number | null;  // logisticCost / invoiceAmount (0..∞)
}

export interface VehicleSummary {
  vehicle:       string;
  totalKm:       number;
  totalFuel:     number;
  totalLogistic: number;
  deliveryCount: number;
  coveredCount:  number;   // client paid >= logistic cost
}

export interface DriverStats {
  driver:        string;
  deliveryCount: number;
  totalKm:       number;
  totalLogistic: number;
  vehiclesUsed:  string[];
}

export interface CountyStats {
  county:        string;
  deliveryCount: number;
  totalKm:       number;
  totalLogistic: number;
  totalRevenue:  number;   // sum of amountPaidByClient
}

export interface MonthlyTrend {
  month:         number;
  year:          number;
  label:         string;
  deliveryCount: number;
  totalKm:       number;
  totalLogistic: number;
  totalRevenue:  number;
  efficiency:    number;  // % of deliveries that are "efficient"
}

export interface ExpenseSummary {
  expenseType: string;
  amount:      number;
  count:       number;
}

export interface DeliveryReport {
  enrichedDeliveries: EnrichedDelivery[];
  fuelEntries:        RawFuelEntry[];
  expenses:           RawExpense[];
  vehicleStats:       VehicleSummary[];
  driverStats:        DriverStats[];
  countyStats:        CountyStats[];
  monthlyTrends:      MonthlyTrend[];
  expenseSummary:     ExpenseSummary[];
  kpis: {
    totalDeliveries:   number;
    totalKm:           number;
    totalFuelCost:     number;
    totalExpenses:     number;
    totalLogisticCost: number;
    totalRevenue:      number;  // sum amountPaidByClient
    coveredPercent:    number;  // % where client paid >= logistic
    avgCostPerKm:      number;
    avgKmPerDelivery:  number;
    incompleteCount:   number;
  };
  problems: {
    missingDate:    RawDelivery[];
    missingKm:      RawDelivery[];
    missingInvoice: RawDelivery[];
    highCostRatio:  EnrichedDelivery[];  // logisticCost > 30% of invoice
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getVehicleMonthKey(vehicle: string, month: number, year: number) {
  return `${vehicle}|${year}|${month}`;
}

const MONTH_LABELS = [
  "", "Ian", "Feb", "Mar", "Apr", "Mai", "Iun",
  "Iul", "Aug", "Sep", "Oct", "Noi", "Dec",
];

// ─── Main calculator ──────────────────────────────────────────────────────────

export function buildDeliveryReport(
  deliveries:  RawDelivery[],
  fuelEntries: RawFuelEntry[],
  expenses:    RawExpense[],
  invoiceAmountMap: Map<string, number>,  // invoiceNumber → totalAmount from SmartBill
): DeliveryReport {

  // Step 1: compute costPerKm per vehicle per month from fuel data
  const vmStats = new Map<string, VehicleMonthStats>();

  for (const f of fuelEntries) {
    const key = getVehicleMonthKey(f.vehicleNumber, f.month, f.year);
    const existing = vmStats.get(key);
    if (existing) {
      existing.totalFuel += f.amount;
    } else {
      vmStats.set(key, {
        vehicle: f.vehicleNumber, month: f.month, year: f.year,
        totalKm: 0, totalFuel: f.amount, costPerKm: 0, deliveryCount: 0,
      });
    }
  }

  for (const d of deliveries) {
    const key = getVehicleMonthKey(d.vehicleNumber, d.month, d.year);
    const existing = vmStats.get(key);
    if (existing) {
      existing.totalKm      += d.totalKm;
      existing.deliveryCount += 1;
    } else {
      vmStats.set(key, {
        vehicle: d.vehicleNumber, month: d.month, year: d.year,
        totalKm: d.totalKm, totalFuel: 0,
        costPerKm: FALLBACK_COST_PER_KM[d.vehicleNumber] ?? DEFAULT_COST_PER_KM,
        deliveryCount: 1,
      });
    }
  }

  // Compute costPerKm for months that have both fuel and km data
  for (const stats of vmStats.values()) {
    if (stats.totalKm > 0 && stats.totalFuel > 0) {
      stats.costPerKm = stats.totalFuel / stats.totalKm;
    } else if (stats.costPerKm === 0) {
      stats.costPerKm = FALLBACK_COST_PER_KM[stats.vehicle] ?? DEFAULT_COST_PER_KM;
    }
  }

  // Step 2: enrich deliveries
  const enriched: EnrichedDelivery[] = deliveries.map(d => {
    const key        = getVehicleMonthKey(d.vehicleNumber, d.month, d.year);
    const costPerKm  = vmStats.get(key)?.costPerKm
                    ?? FALLBACK_COST_PER_KM[d.vehicleNumber]
                    ?? DEFAULT_COST_PER_KM;
    const logisticCost = d.totalKm * costPerKm;

    const invoiceAmt = d.invoiceNumber ? invoiceAmountMap.get(d.invoiceNumber) : undefined;
    let efficiencyStatus: EnrichedDelivery["efficiencyStatus"];
    let efficiencyLabel: string;
    let profitabilityRatio: number | null = null;

    if (!d.totalKm || d.totalKm === 0) {
      efficiencyStatus = "incomplete";
      efficiencyLabel  = "Date incomplete";
    } else if (invoiceAmt !== undefined && invoiceAmt > 0) {
      profitabilityRatio = logisticCost / invoiceAmt;
      const ratio = profitabilityRatio;
      if (ratio <= 0.10) {
        efficiencyStatus = "efficient";
        efficiencyLabel  = "Livrare eficientă";
      } else {
        efficiencyStatus = "high_cost";
        efficiencyLabel  = "Cost logistic ridicat";
      }
    } else {
      // No invoice amount — use clientPaid
      if (d.amountPaidByClient > 0) {
        if (d.amountPaidByClient >= logisticCost) {
          efficiencyStatus = "covered";
          efficiencyLabel  = "Transport acoperit";
        } else {
          efficiencyStatus = "subsidized";
          efficiencyLabel  = "Transport subvenționat";
        }
      } else {
        efficiencyStatus = "incomplete";
        efficiencyLabel  = "Date incomplete";
      }
    }

    return { ...d, logisticCost, efficiencyStatus, efficiencyLabel, profitabilityRatio };
  });

  // Step 3: vehicle summaries
  const vehicleMap = new Map<string, VehicleSummary>();
  for (const d of enriched) {
    const v = d.vehicleNumber || "Necunoscut";
    const existing = vehicleMap.get(v);
    if (existing) {
      existing.totalKm       += d.totalKm;
      existing.totalLogistic += d.logisticCost;
      existing.deliveryCount += 1;
      if (d.efficiencyStatus === "efficient" || d.efficiencyStatus === "covered")
        existing.coveredCount += 1;
    } else {
      vehicleMap.set(v, {
        vehicle:       v,
        totalKm:       d.totalKm,
        totalFuel:     0,
        totalLogistic: d.logisticCost,
        deliveryCount: 1,
        coveredCount:  (d.efficiencyStatus === "efficient" || d.efficiencyStatus === "covered") ? 1 : 0,
      });
    }
  }
  for (const f of fuelEntries) {
    const v = f.vehicleNumber || "Necunoscut";
    const existing = vehicleMap.get(v);
    if (existing) existing.totalFuel += f.amount;
    else vehicleMap.set(v, { vehicle: v, totalKm: 0, totalFuel: f.amount, totalLogistic: 0, deliveryCount: 0, coveredCount: 0 });
  }
  const vehicleStats = Array.from(vehicleMap.values()).sort((a, b) => b.totalKm - a.totalKm);

  // Step 4: driver stats
  const driverMap = new Map<string, DriverStats>();
  for (const d of enriched) {
    const driver = d.driver || "Necunoscut";
    const existing = driverMap.get(driver);
    if (existing) {
      existing.deliveryCount += 1;
      existing.totalKm       += d.totalKm;
      existing.totalLogistic += d.logisticCost;
      if (!existing.vehiclesUsed.includes(d.vehicleNumber)) existing.vehiclesUsed.push(d.vehicleNumber);
    } else {
      driverMap.set(driver, {
        driver, deliveryCount: 1, totalKm: d.totalKm, totalLogistic: d.logisticCost,
        vehiclesUsed: d.vehicleNumber ? [d.vehicleNumber] : [],
      });
    }
  }
  const driverStats = Array.from(driverMap.values()).sort((a, b) => b.deliveryCount - a.deliveryCount);

  // Step 5: county stats
  const countyMap = new Map<string, CountyStats>();
  for (const d of enriched) {
    const county = d.county || "Necunoscut";
    const existing = countyMap.get(county);
    if (existing) {
      existing.deliveryCount += 1;
      existing.totalKm       += d.totalKm;
      existing.totalLogistic += d.logisticCost;
      existing.totalRevenue  += d.amountPaidByClient;
    } else {
      countyMap.set(county, {
        county, deliveryCount: 1, totalKm: d.totalKm,
        totalLogistic: d.logisticCost, totalRevenue: d.amountPaidByClient,
      });
    }
  }
  const countyStats = Array.from(countyMap.values()).sort((a, b) => b.deliveryCount - a.deliveryCount);

  // Step 6: monthly trends
  const monthMap = new Map<string, MonthlyTrend>();
  for (const d of enriched) {
    const key = `${d.year}-${String(d.month).padStart(2, "0")}`;
    const existing = monthMap.get(key);
    const isEfficient = d.efficiencyStatus === "efficient" || d.efficiencyStatus === "covered";
    if (existing) {
      existing.deliveryCount += 1;
      existing.totalKm       += d.totalKm;
      existing.totalLogistic += d.logisticCost;
      existing.totalRevenue  += d.amountPaidByClient;
      existing.efficiency     = Math.round(
        ((existing.efficiency / 100 * (existing.deliveryCount - 1)) + (isEfficient ? 1 : 0))
        / existing.deliveryCount * 100,
      );
    } else {
      monthMap.set(key, {
        month: d.month, year: d.year,
        label: `${MONTH_LABELS[d.month] ?? d.month} ${d.year}`,
        deliveryCount: 1, totalKm: d.totalKm, totalLogistic: d.logisticCost,
        totalRevenue: d.amountPaidByClient, efficiency: isEfficient ? 100 : 0,
      });
    }
  }
  const monthlyTrends = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  // Step 7: expense summary
  const expMap = new Map<string, ExpenseSummary>();
  for (const e of expenses) {
    const type = e.expenseType || "Altele";
    const existing = expMap.get(type);
    if (existing) { existing.amount += e.amount; existing.count += 1; }
    else expMap.set(type, { expenseType: type, amount: e.amount, count: 1 });
  }
  const expenseSummary = Array.from(expMap.values()).sort((a, b) => b.amount - a.amount);

  // Step 8: KPIs
  const totalDeliveries   = enriched.length;
  const totalKm           = enriched.reduce((s, d) => s + d.totalKm, 0);
  const totalFuelCost     = fuelEntries.reduce((s, f) => s + f.amount, 0);
  const totalExpenses     = expenses.reduce((s, e) => s + e.amount, 0);
  const totalLogisticCost = enriched.reduce((s, d) => s + d.logisticCost, 0);
  const totalRevenue      = enriched.reduce((s, d) => s + d.amountPaidByClient, 0);
  const coveredCount      = enriched.filter(d => d.efficiencyStatus === "efficient" || d.efficiencyStatus === "covered").length;
  const incompleteCount   = enriched.filter(d => d.efficiencyStatus === "incomplete").length;

  // Step 9: problems
  const problems = {
    missingDate:    deliveries.filter(d => !d.date) as RawDelivery[],
    missingKm:      deliveries.filter(d => !d.totalKm || d.totalKm === 0) as RawDelivery[],
    missingInvoice: deliveries.filter(d => !d.invoiceNumber) as RawDelivery[],
    highCostRatio:  enriched.filter(d => d.profitabilityRatio !== null && d.profitabilityRatio > 0.3),
  };

  return {
    enrichedDeliveries: enriched,
    fuelEntries,
    expenses,
    vehicleStats,
    driverStats,
    countyStats,
    monthlyTrends,
    expenseSummary,
    kpis: {
      totalDeliveries,
      totalKm,
      totalFuelCost,
      totalExpenses,
      totalLogisticCost,
      totalRevenue,
      coveredPercent: totalDeliveries > 0
        ? Math.round((coveredCount / totalDeliveries) * 100) : 0,
      avgCostPerKm:       totalKm > 0 ? totalLogisticCost / totalKm : 0,
      avgKmPerDelivery:   totalDeliveries > 0 ? totalKm / totalDeliveries : 0,
      incompleteCount,
    },
    problems,
  };
}
