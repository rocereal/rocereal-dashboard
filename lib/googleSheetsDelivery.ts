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
): Promise<{ values: string[][]; error?: string }> {
  const range = encodeURIComponent(`'${sheetName}'!A1:Z500`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { values: [], error: `HTTP ${res.status} pentru tab "${sheetName}": ${body.slice(0, 200)}` };
  }
  const data = await res.json() as { values?: string[][] };
  return { values: data.values ?? [] };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(raw: string): { iso: string; month: number; year: number } | null {
  if (!raw) return null;
  // M/D/YYYY (Google Sheets US locale export)
  let m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, mo, d, y] = m;
    return { iso: `${y}-${mo!.padStart(2,"0")}-${d!.padStart(2,"0")}`, month: parseInt(mo!), year: parseInt(y!) };
  }
  // DD.MM.YYYY
  m = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return { iso: `${y}-${mo!.padStart(2,"0")}-${d!.padStart(2,"0")}`, month: parseInt(mo!), year: parseInt(y!) };
  }
  // YYYY-MM-DD
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

function g(row: string[], i: number): string {
  return (row[i] ?? "").trim();
}

// Find date near a specific column (±2 tolerance for merged/shifted cells)
function findDateIdxFrom(row: string[], startCol: number): number {
  const from = Math.max(0, startCol - 1);
  const to   = Math.min(row.length, startCol + 3);
  for (let i = from; i < to; i++) {
    if (parseDate(g(row, i))) return i;
  }
  return -1;
}

function normCell(s: string): string {
  return (s ?? "").trim().toUpperCase()
    .replace(/Ă/g, "A").replace(/Â/g, "A").replace(/Î/g, "I")
    .replace(/Ș/g, "S").replace(/Ş/g, "S").replace(/Ț/g, "T").replace(/Ţ/g, "T");
}

// ─── Section-based parsers ────────────────────────────────────────────────────
// Spreadsheet structure per tab (SB-10-RCR, AR-40-RCR, SB-20-RCR):
//
// ALIMENTARI [LUNA] section header row — followed by data rows:
//   dateIdx+0 = Date
//   dateIdx+1 = Vehicle # (Numar auto)
//   dateIdx+2 = Odometer KM
//   dateIdx+3 = Amount (Suma)
//   dateIdx+4 = Payment method (Mod Plata)
//   dateIdx+5 = Receipt # (Numar Bon)
//   dateIdx+6 = Expense type (Cheltuieli)
//   dateIdx+7 = Observations
//
// LIVRARI [LUNA] section header row — followed by data rows:
//   dateIdx+0 = Date
//   dateIdx+1 = Driver (Sofer)
//   dateIdx+2 = Vehicle # (Numar auto)
//   dateIdx+3 = Departure (Plecare)
//   dateIdx+4 = Arrival/Destination
//   dateIdx+5 = Return departure
//   dateIdx+6 = Return arrival
//   dateIdx+7 = Total KM
//   dateIdx+8 = Client payment (Achitat)
//   dateIdx+9 = Invoice # (Nr. Factura)
//   dateIdx+10 = Observations

function parseFuelRow(
  row: string[], dateIdx: number, defaultVehicle: string, sheet: string, rowNum: number,
): RawFuelEntry | null {
  const parsed = parseDate(g(row, dateIdx));
  if (!parsed) return null;
  const amount = parseNum(g(row, dateIdx + 3));
  if (!amount) return null;
  return {
    date:          parsed.iso,
    month:         parsed.month,
    year:          parsed.year,
    vehicleNumber: g(row, dateIdx + 1) || defaultVehicle,
    odometerKm:    parseNum(g(row, dateIdx + 2)),
    amount,
    paymentMethod: g(row, dateIdx + 4),
    receiptNumber: g(row, dateIdx + 5),
    expenseType:   g(row, dateIdx + 6) || "Alimentare",
    observations:  g(row, dateIdx + 7),
    sourceSheet:   sheet,
    rowNumber:     rowNum,
  };
}

function parseDeliveryRow(
  row: string[], dateIdx: number, defaultVehicle: string, sheet: string, rowNum: number,
): RawDelivery | null {
  const parsed = parseDate(g(row, dateIdx));
  if (!parsed) return null;
  const arrival = g(row, dateIdx + 4);
  return {
    date:                    parsed.iso,
    month:                   parsed.month,
    year:                    parsed.year,
    vehicleNumber:           g(row, dateIdx + 2) || defaultVehicle,
    driver:                  g(row, dateIdx + 1),
    departureLocation:       g(row, dateIdx + 3),
    arrivalLocation:         arrival,
    returnDepartureLocation: g(row, dateIdx + 5),
    returnArrivalLocation:   g(row, dateIdx + 6),
    totalKm:                 parseNum(g(row, dateIdx + 7)),
    amountPaidByClient:      parseNum(g(row, dateIdx + 8)),
    invoiceNumber:           g(row, dateIdx + 9).toUpperCase().replace(/\s+/g, ""),
    observations:            g(row, dateIdx + 10),
    county:                  detectCounty(arrival),
    sourceSheet:             sheet,
    rowNumber:               rowNum,
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
  if (sheetName === "Alte cheltuieli") return result;

  const vehicle = SHEET_TO_VEHICLE[sheetName] ?? "";

  // The sheet has two side-by-side sections:
  //   LEFT  (cols A-J): ALIMENTARI (fuel) sections
  //   RIGHT (cols K-T): LIVRARI (delivery) sections
  // Both run on the same row ranges, so we track each section's start column
  // independently and parse BOTH from every data row.
  let fuelSectionCol     = -1;
  let deliverySectionCol = -1;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] ?? [];

    // Scan ALL cells for section headers (not just first 6)
    let foundHeader = false;
    for (let col = 0; col < row.length; col++) {
      const norm = normCell(row[col] ?? "");
      if (norm.startsWith("ALIMENTARI")) { fuelSectionCol     = col; foundHeader = true; }
      if (norm.startsWith("LIVRARI"))    { deliverySectionCol = col; foundHeader = true; }
    }
    if (foundHeader) continue;

    // Try fuel section
    if (fuelSectionCol >= 0) {
      const dateIdx = findDateIdxFrom(row, fuelSectionCol);
      if (dateIdx >= 0) {
        const entry = parseFuelRow(row, dateIdx, vehicle, sheetName, i + 1);
        if (entry) result.fuelEntries.push(entry);
      }
    }

    // Try delivery section (independent of fuel — same row can have both)
    if (deliverySectionCol >= 0) {
      const dateIdx = findDateIdxFrom(row, deliverySectionCol);
      if (dateIdx >= 0) {
        const entry = parseDeliveryRow(row, dateIdx, vehicle, sheetName, i + 1);
        if (entry) result.deliveries.push(entry);
      }
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
  const sheetErrors: string[] = [];

  await Promise.allSettled(
    SHEET_TABS.map(async (tab) => {
      const result = await fetchSheetValues(token, spreadsheetId, tab);
      if (result.error) { sheetErrors.push(result.error); return; }
      const parsed = parseSheetTab(result.values, tab);
      all.deliveries.push(...parsed.deliveries);
      all.fuelEntries.push(...parsed.fuelEntries);
      all.expenses.push(...parsed.expenses);
    }),
  );

  if (sheetErrors.length === SHEET_TABS.length) {
    return { ...all, error: sheetErrors[0] };
  }
  return all;
}
