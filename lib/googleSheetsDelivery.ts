/**
 * Google Sheets delivery data integration.
 *
 * Required env vars (set in Vercel):
 *   GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON  – full service account JSON from Google Cloud
 *   GOOGLE_SHEETS_SPREADSHEET_ID        – e.g. "1kaoZ6bCOyv683enKvmKBHlfD-LGU_h3g"
 *
 * Setup:
 *   1. Google Cloud Console → Create Service Account → download JSON key
 *   2. Google Sheets → Share the spreadsheet with the service account email (view access)
 *   3. Add both env vars to Vercel Environment Variables
 */

import { detectCounty } from "./countyMapper";

export const SHEET_TABS = ["SB-10-RCR", "AR-40-RCR", "SB-20-RCR", "Alte cheltuieli"] as const;
export type SheetTab = typeof SHEET_TABS[number];

export interface RawDelivery {
  date: string;
  month: number;
  year: number;
  vehicleNumber: string;
  driver: string;
  departureLocation: string;
  arrivalLocation: string;
  returnDepartureLocation: string;
  returnArrivalLocation: string;
  totalKm: number;
  amountPaidByClient: number;
  invoiceNumber: string;
  observations: string;
  county: string;
  sourceSheet: string;
  rowNumber: number;
}

export interface RawFuelEntry {
  date: string;
  month: number;
  year: number;
  vehicleNumber: string;
  odometerKm: number;
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  expenseType: string;
  observations: string;
  sourceSheet: string;
  rowNumber: number;
}

export interface RawExpense {
  date: string;
  month: number;
  year: number;
  vehicleNumber: string;
  amount: number;
  expenseType: string;
  description: string;
  sourceSheet: string;
  rowNumber: number;
}

export interface ParsedSheetData {
  deliveries:  RawDelivery[];
  fuelEntries: RawFuelEntry[];
  expenses:    RawExpense[];
}

// ─── JWT / Auth ───────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string | null> {
  const saJson = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON;
  if (!saJson) return null;
  try {
    const sa = JSON.parse(saJson) as { client_email: string; private_key: string };
    const now = Math.floor(Date.now() / 1000);
    const header  = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss:   sa.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud:   "https://oauth2.googleapis.com/token",
      exp:   now + 3600,
      iat:   now,
    };
    const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
    const unsigned = `${encode(header)}.${encode(payload)}`;
    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(unsigned);
    const signature = sign.sign(sa.private_key, "base64url");
    const jwt = `${unsigned}.${signature}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion:  jwt,
      }),
    });
    const data = await res.json() as { access_token?: string };
    return data.access_token ?? null;
  } catch { return null; }
}

// ─── Sheets API fetch ─────────────────────────────────────────────────────────

async function fetchSheetValues(
  token: string,
  spreadsheetId: string,
  sheetName: string,
): Promise<string[][]> {
  const range = encodeURIComponent(`'${sheetName}'!A1:Z500`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!res.ok) return [];
  const data = await res.json() as { values?: string[][] };
  return data.values ?? [];
}

// ─── Header detection ─────────────────────────────────────────────────────────

function findCol(headers: string[], ...terms: string[]): number {
  const h = headers.map(x => x.toLowerCase().trim().replace(/\s+/g, " "));
  for (const term of terms) {
    const idx = h.findIndex(x => x.includes(term.toLowerCase()));
    if (idx >= 0) return idx;
  }
  return -1;
}

interface ColMap {
  date:        number;
  type:        number;
  vehicle:     number;
  driver:      number;
  departure:   number;
  arrival:     number;
  retDep:      number;
  retArr:      number;
  km:          number;
  clientPaid:  number;
  invoice:     number;
  amount:      number;
  odometer:    number;
  payment:     number;
  receipt:     number;
  expType:     number;
  obs:         number;
}

function buildColMap(headerRow: string[]): ColMap {
  return {
    date:       findCol(headerRow, "data", "dată"),
    type:       findCol(headerRow, "tip", "type", "categorie"),
    vehicle:    findCol(headerRow, "nr. auto", "mașin", "masina", "vehicul", "nr auto"),
    driver:     findCol(headerRow, "șofer", "sofer", "conducător"),
    departure:  findCol(headerRow, "plecare", "de la"),
    arrival:    findCol(headerRow, "destinat", "sosire", "până la"),
    retDep:     findCol(headerRow, "retur plecare", "retur – plecare", "ret. plecare"),
    retArr:     findCol(headerRow, "retur destinat", "retur – destinat", "ret. destinat"),
    km:         findCol(headerRow, "km total", "km parcurși", "total km", "kilometri"),
    clientPaid: findCol(headerRow, "achitat client", "achitat de client", "transport achitat"),
    invoice:    findCol(headerRow, "nr. factură", "nr factura", "factur", "invoice"),
    amount:     findCol(headerRow, "sumă", "suma", "valoare", "cost", "lei"),
    odometer:   findCol(headerRow, "km bord", "odometru", "citire bord"),
    payment:    findCol(headerRow, "mod plată", "plată", "plata", "card/numerar"),
    receipt:    findCol(headerRow, "bon", "chitanță", "receipt"),
    expType:    findCol(headerRow, "tip cheltuial", "cheltuial"),
    obs:        findCol(headerRow, "observ", "mențiuni", "note"),
  };
}

// ─── Row type detection ───────────────────────────────────────────────────────

function detectRowType(row: string[], cols: ColMap): "delivery" | "fuel" | "expense" | "skip" {
  const get = (i: number) => (i >= 0 ? (row[i] ?? "").trim() : "");

  // Skip empty rows
  if (row.every(c => !c.trim())) return "skip";

  const typeCell = get(cols.type).toLowerCase();
  const obs      = get(cols.obs).toLowerCase();

  if (typeCell.includes("alimentar") || obs.includes("alimentar") || obs.includes("fuel"))
    return "fuel";
  if (typeCell.includes("cheltuial") || typeCell.includes("service") || typeCell.includes("repar"))
    return "expense";
  if (typeCell.includes("livrare") || typeCell.includes("transport"))
    return "delivery";

  // Heuristic: if has destination or invoice, likely a delivery
  if (get(cols.arrival) || get(cols.invoice)) return "delivery";
  // If has amount but no destination, likely fuel or expense
  if (get(cols.amount) && !get(cols.arrival)) {
    if (get(cols.receipt) || get(cols.odometer)) return "fuel";
    return "expense";
  }

  return "skip";
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parseDate(raw: string): { iso: string; month: number; year: number } | null {
  if (!raw) return null;
  // DD.MM.YYYY or DD/MM/YYYY or YYYY-MM-DD
  let m = raw.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return { iso: `${y}-${mo!.padStart(2,"0")}-${d!.padStart(2,"0")}`, month: parseInt(mo!), year: parseInt(y!) };
  }
  m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [, y, mo, d] = m;
    return { iso: `${y}-${mo}-${d}`, month: parseInt(mo!), year: parseInt(y!) };
  }
  return null;
}

function parseNum(raw: string | undefined): number {
  if (!raw) return 0;
  return parseFloat(raw.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
}

function parseDelivery(
  row: string[], cols: ColMap, vehicleNumber: string, sheet: string, rowIdx: number,
): RawDelivery | null {
  const get = (i: number) => (i >= 0 ? (row[i] ?? "").trim() : "");
  const parsed = parseDate(get(cols.date));
  if (!parsed) return null;

  const arrival = get(cols.arrival);
  const county  = detectCounty(arrival);

  return {
    date:                   parsed.iso,
    month:                  parsed.month,
    year:                   parsed.year,
    vehicleNumber:          get(cols.vehicle) || vehicleNumber,
    driver:                 get(cols.driver),
    departureLocation:      get(cols.departure),
    arrivalLocation:        arrival,
    returnDepartureLocation:get(cols.retDep),
    returnArrivalLocation:  get(cols.retArr),
    totalKm:                parseNum(get(cols.km)),
    amountPaidByClient:     parseNum(get(cols.clientPaid)),
    invoiceNumber:          get(cols.invoice).toUpperCase().replace(/\s+/g, ""),
    observations:           get(cols.obs),
    county,
    sourceSheet:            sheet,
    rowNumber:              rowIdx,
  };
}

function parseFuel(
  row: string[], cols: ColMap, vehicleNumber: string, sheet: string, rowIdx: number,
): RawFuelEntry | null {
  const get = (i: number) => (i >= 0 ? (row[i] ?? "").trim() : "");
  const parsed = parseDate(get(cols.date));
  if (!parsed) return null;

  return {
    date:         parsed.iso,
    month:        parsed.month,
    year:         parsed.year,
    vehicleNumber:get(cols.vehicle) || vehicleNumber,
    odometerKm:   parseNum(get(cols.odometer)),
    amount:       parseNum(get(cols.amount)),
    paymentMethod:get(cols.payment),
    receiptNumber:get(cols.receipt),
    expenseType:  get(cols.expType) || "Alimentare",
    observations: get(cols.obs),
    sourceSheet:  sheet,
    rowNumber:    rowIdx,
  };
}

function parseExpense(
  row: string[], cols: ColMap, vehicleNumber: string, sheet: string, rowIdx: number,
): RawExpense | null {
  const get = (i: number) => (i >= 0 ? (row[i] ?? "").trim() : "");
  const parsed = parseDate(get(cols.date));
  if (!parsed) return null;

  const amount = parseNum(get(cols.amount));
  if (!amount) return null;

  return {
    date:         parsed.iso,
    month:        parsed.month,
    year:         parsed.year,
    vehicleNumber:get(cols.vehicle) || vehicleNumber,
    amount,
    expenseType:  get(cols.expType) || get(cols.type) || "Cheltuiala",
    description:  get(cols.obs),
    sourceSheet:  sheet,
    rowNumber:    rowIdx,
  };
}

// Map sheet name → default vehicle plate
const SHEET_TO_VEHICLE: Record<string, string> = {
  "SB-10-RCR": "SB-10-RCR",
  "AR-40-RCR": "AR-40-RCR",
  "SB-20-RCR": "SB-20-RCR",
  "Alte cheltuieli": "",
};

// ─── Main parse function ──────────────────────────────────────────────────────

function parseSheetTab(rows: string[][], sheetName: string): ParsedSheetData {
  const result: ParsedSheetData = { deliveries: [], fuelEntries: [], expenses: [] };
  if (rows.length < 2) return result;

  // Find header row (first row with "data" or "dată" or "km")
  let headerIdx = 0;
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const lower = (rows[i] ?? []).map(c => c.toLowerCase());
    if (lower.some(c => c.includes("data") || c.includes("dată") || c.includes("km"))) {
      headerIdx = i;
      break;
    }
  }

  const headerRow = rows[headerIdx] ?? [];
  const cols      = buildColMap(headerRow);
  const vehicle   = SHEET_TO_VEHICLE[sheetName] ?? "";

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row  = rows[i] ?? [];
    const type = detectRowType(row, cols);

    if (type === "delivery") {
      const d = parseDelivery(row, cols, vehicle, sheetName, i + 1);
      if (d) result.deliveries.push(d);
    } else if (type === "fuel") {
      const f = parseFuel(row, cols, vehicle, sheetName, i + 1);
      if (f) result.fuelEntries.push(f);
    } else if (type === "expense") {
      const e = parseExpense(row, cols, vehicle, sheetName, i + 1);
      if (e) result.expenses.push(e);
    }
  }

  return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchAllDeliveryData(): Promise<ParsedSheetData & { error?: string }> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    return { deliveries: [], fuelEntries: [], expenses: [], error: "GOOGLE_SHEETS_SPREADSHEET_ID lipsește" };
  }

  const token = await getAccessToken();
  if (!token) {
    return { deliveries: [], fuelEntries: [], expenses: [], error: "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON lipsește sau invalid" };
  }

  const all: ParsedSheetData = { deliveries: [], fuelEntries: [], expenses: [] };

  await Promise.allSettled(
    SHEET_TABS.map(async (tab) => {
      const rows   = await fetchSheetValues(token, spreadsheetId, tab);
      const parsed = parseSheetTab(rows, tab);
      all.deliveries.push(...parsed.deliveries);
      all.fuelEntries.push(...parsed.fuelEntries);
      all.expenses.push(...parsed.expenses);
    }),
  );

  return all;
}
