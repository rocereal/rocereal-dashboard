import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Convert YYYY-MM-DD to DD/MM/YYYY (SmartBill vanzari format)
function ymdToSb(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

async function getAuthCsrf(cookies: string): Promise<string | null> {
  try {
    const res = await fetch("https://cloud.smartbill.ro/raport/vanzari-produse/", {
      method:   "GET",
      headers:  { Cookie: cookies, "User-Agent": BROWSER_UA, Accept: "text/html,*/*" },
      redirect: "manual",
      cache:    "no-store",
    });
    if (res.status !== 200) return null;
    let csrf = "";
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie" && value.includes("csrftoken")) {
        const match = value.match(/csrftoken=([^;]+)/);
        if (match) csrf = match[1];
      }
    });
    return csrf || null;
  } catch {
    return null;
  }
}

export interface SaleDoc {
  id:          number;
  clientName:  string;
  clientCif:   string | null;
  issueDate:   string; // "DD/MM/YYYY"
  docType:     string;
  document:    string;
  quantity:    number;
  price:       number;
  vPrice:      number;
  value:       number;  // net fara TVA
  currency:    string;
  um:          string;
}

export interface ProductSaleItem {
  productId:     number;
  productName:   string;
  productCode:   string;
  quantity:      number;
  vAveragePrice: number;
  vValue:        number;      // total net
  vTotalValue:   number;      // total cu TVA
  documentsList: SaleDoc[];
}

interface SmartBillSalesResponse {
  products?:   ProductSaleItem[];
  csrf_fails?: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from"); // YYYY-MM-DD
  const to   = searchParams.get("to");   // YYYY-MM-DD

  if (!from || !to) {
    return NextResponse.json({ error: "Parametrii 'from' și 'to' sunt obligatorii" }, { status: 400 });
  }

  const sessionId    = process.env.SMARTBILL_SESSION_ID;
  const storedCsrf   = process.env.SMARTBILL_CSRF_TOKEN    ?? "";
  const extraCookies = process.env.SMARTBILL_EXTRA_COOKIES ?? "";

  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește" }, { status: 503 });
  }

  const baseCookies = [
    storedCsrf ? `csrftoken=${storedCsrf}` : "",
    `sessionid=${sessionId}`,
    "srvid=2",
    "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  const freshCsrf = await getAuthCsrf(baseCookies);
  if (!freshCsrf) {
    return NextResponse.json({ error: "Sesiune SmartBill expirată — actualizează SMARTBILL_SESSION_ID în Vercel" }, { status: 401 });
  }

  const ajaxCookies = [
    `csrftoken=${freshCsrf}`,
    `sessionid=${sessionId}`,
    "srvid=2",
    "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  const sSearch = JSON.stringify({
    reportType:           1,
    from:                 ymdToSb(from),
    to:                   ymdToSb(to),
    currencyId:           "-1",
    doCurrencyConvertion: false,
    documentType:         "",
    page:                 1,
    results_per_page:     1000,
    products_type:        "0",
    save_filter:          false,
  });

  const res = await fetch("https://cloud.smartbill.ro/raport/vanzari-produse/ajax/", {
    method:  "POST",
    headers: {
      "Content-Type":     "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie:             ajaxCookies,
      "X-CSRFToken":      freshCsrf,
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":       BROWSER_UA,
      Accept:             "application/json, text/javascript, */*; q=0.01",
      Origin:             "https://cloud.smartbill.ro",
      Referer:            "https://cloud.smartbill.ro/raport/vanzari-produse/",
    },
    body:  new URLSearchParams({ sSearch }).toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: `SmartBill ${res.status}`, body: txt.slice(0, 200) }, { status: 502 });
  }

  const data = await res.json() as SmartBillSalesResponse;

  if (data.csrf_fails) {
    return NextResponse.json({ error: "Sesiune SmartBill expirată — actualizează SMARTBILL_SESSION_ID în Vercel" }, { status: 401 });
  }

  return NextResponse.json({
    products:  data.products ?? [],
    fetchedAt: new Date().toISOString(),
  });
}
