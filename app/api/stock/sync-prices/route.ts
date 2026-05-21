import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ProductPriceInfo {
  productCode:     string;
  priceWithVat:    number;
  priceWithoutVat: number;
  stockQuantity:   number;
  warehouseName:   string;
}

interface PriceListResponse {
  successfully?:      boolean;
  csrf_fails?:        boolean;
  productPriceInfos?: ProductPriceInfo[];
  totalCount?:        number;
}

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function getAuthenticatedCsrf(cookies: string): Promise<string | null> {
  try {
    const res = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/", {
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

export async function POST() {
  const sessionId    = process.env.SMARTBILL_SESSION_ID;
  const storedCsrf   = process.env.SMARTBILL_CSRF_TOKEN ?? "";
  const extraCookies = process.env.SMARTBILL_EXTRA_COOKIES ?? "";

  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }

  const baseCookies = [
    storedCsrf ? `csrftoken=${storedCsrf}` : "",
    `sessionid=${sessionId}`,
    "srvid=2",
    "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  // Get a CSRF token from an authenticated page (NOT the public login page)
  const freshCsrf = await getAuthenticatedCsrf(baseCookies);
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

  // NOTE: omitting "date" field — it causes a 500 on SmartBill's server when sent from outside a browser
  const sSearch = JSON.stringify({
    warehouse:                            "-1",
    vat_code:                             "-1",
    vat_included:                         "-1",
    show_products_with_multiple_vatcodes: false,
    vatCodeIncluded:                      "-1",
    search_products_ids:                  [],
    page:                                 1,
    results_per_page:                     "1000",
  });

  const priceRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
    method:  "POST",
    headers: {
      "Content-Type":     "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie:             ajaxCookies,
      "X-CSRFToken":      freshCsrf,
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":       BROWSER_UA,
      Accept:             "application/json, text/javascript, */*; q=0.01",
      Origin:             "https://cloud.smartbill.ro",
      Referer:            "https://cloud.smartbill.ro/nomenclator/lista_preturi/",
    },
    body:  new URLSearchParams({ sSearch }).toString(),
    cache: "no-store",
  });

  if (!priceRes.ok) {
    return NextResponse.json({ error: `SmartBill a returnat ${priceRes.status}` }, { status: 502 });
  }

  const data = await priceRes.json() as PriceListResponse;

  if (data.csrf_fails) {
    return NextResponse.json({ error: "Sesiune SmartBill expirată — actualizează SMARTBILL_SESSION_ID în Vercel" }, { status: 401 });
  }

  if (!data.successfully || !data.productPriceInfos?.length) {
    return NextResponse.json({ error: "SmartBill nu a returnat prețuri", raw: data }, { status: 502 });
  }

  // Build productCode → priceWithoutVat map (first occurrence per code)
  const priceMap = new Map<string, number>();
  for (const p of data.productPriceInfos) {
    if (!p.productCode) continue;
    const price = p.priceWithoutVat > 0 ? p.priceWithoutVat : p.priceWithVat;
    if (price > 0 && !priceMap.has(p.productCode)) {
      priceMap.set(p.productCode, price);
    }
  }

  if (priceMap.size === 0) {
    return NextResponse.json({ ok: true, updated: 0, message: "Niciun produs cu preț ≠ 0 în SmartBill" });
  }

  const stocks = await prisma.productStock.findMany({
    select: { id: true, sku: true, quantity: true },
  });

  let updated = 0;
  for (const stock of stocks) {
    if (!stock.sku) continue;
    const unitPrice = priceMap.get(stock.sku);
    if (!unitPrice) continue;
    const totalValue = parseFloat((unitPrice * stock.quantity).toFixed(2));
    await prisma.productStock.update({
      where: { id: stock.id },
      data:  { unitPrice, totalValue },
    });
    updated++;
  }

  return NextResponse.json({ ok: true, updated, pricesFound: priceMap.size, totalInSmartBill: data.totalCount });
}

// GET handler so the sync can be triggered directly from a browser URL
export { POST as GET };
