import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ProductPriceInfo {
  productCode:      string;
  priceWithVat:     number;
  priceWithoutVat:  number;
  stockQuantity:    number;
  warehouseName:    string;
}

interface PriceListResponse {
  successfully?:      boolean;
  csrf_fails?:        boolean;
  productPriceInfos?: ProductPriceInfo[];
}

async function getFreshCsrfToken(): Promise<{ csrfCookie: string; csrfValue: string } | null> {
  try {
    const res = await fetch("https://cloud.smartbill.ro/auth/login/", {
      redirect: "follow",
      cache:    "no-store",
    });
    // Extract csrftoken cookie
    let csrfCookie = "";
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie" && value.includes("csrftoken")) {
        csrfCookie = value.split(";")[0]; // "csrftoken=XXXX"
      }
    });
    const csrfValue = csrfCookie.split("=")[1] ?? "";
    if (!csrfValue) return null;
    return { csrfCookie, csrfValue };
  } catch {
    return null;
  }
}

export async function POST() {
  const sessionId = process.env.SMARTBILL_SESSION_ID;
  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }

  // Get a fresh CSRF token (public endpoint, no auth needed)
  const csrf = await getFreshCsrfToken();
  if (!csrf) {
    return NextResponse.json({ error: "Nu s-a putut obține CSRF token de la SmartBill" }, { status: 502 });
  }

  const cookieHeader = `${csrf.csrfCookie}; sessionid=${sessionId}`;
  const today        = new Date().toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
  const sSearch      = JSON.stringify({
    date:                                today,
    warehouse:                           "-1",
    vat_code:                            "-1",
    vat_included:                        "-1",
    show_products_with_multiple_vatcodes: false,
    vatCodeIncluded:                     "-1",
    search_products_ids:                 [],
    page:                                1,
    results_per_page:                    "1000",
  });

  const priceRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
    method:  "POST",
    headers: {
      "Content-Type":     "application/x-www-form-urlencoded",
      Cookie:             cookieHeader,
      "X-CSRFToken":      csrf.csrfValue,
      "X-Requested-With": "XMLHttpRequest",
      Accept:             "application/json, text/javascript, */*; q=0.01",
      Referer:            "https://cloud.smartbill.ro/nomenclator/lista_preturi/",
    },
    body:  new URLSearchParams({ sSearch }).toString(),
    cache: "no-store",
  });

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

  // Update ProductStock where sku matches
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

  return NextResponse.json({ ok: true, updated, pricesFound: priceMap.size });
}
