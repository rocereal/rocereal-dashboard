import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function todayRO(): string {
  const d = new Date();
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function GET() {
  const sessionId    = process.env.SMARTBILL_SESSION_ID;
  const extraCookies = process.env.SMARTBILL_EXTRA_COOKIES ?? "";

  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }

  // Stored CSRF is used ONLY for the initial page load cookie jar
  const storedCsrf = process.env.SMARTBILL_CSRF_TOKEN ?? "";

  const baseCookies = [
    storedCsrf ? `csrftoken=${storedCsrf}` : "",
    `sessionid=${sessionId}`,
    "srvid=2",
    "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  // Step 1: GET the page exactly as the browser does, capture fresh csrftoken from Set-Cookie
  const pageRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/", {
    method:  "GET",
    headers: {
      Cookie:       baseCookies,
      "User-Agent": BROWSER_UA,
      Accept:       "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      Referer:      "https://cloud.smartbill.ro/",
    },
    redirect: "manual",
    cache:    "no-store",
  });

  // Extract any updated cookies from the page response (SmartBill may refresh csrftoken)
  let freshCsrf = storedCsrf;
  const setCookieHeaders: string[] = [];
  pageRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      setCookieHeaders.push(value);
      if (value.includes("csrftoken")) {
        const match = value.match(/csrftoken=([^;]+)/);
        if (match) freshCsrf = match[1];
      }
    }
  });

  // Step 2: POST AJAX with the fresh CSRF from Step 1
  const ajaxCookies = [
    `csrftoken=${freshCsrf}`,
    `sessionid=${sessionId}`,
    "srvid=2",
    "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  const today   = todayRO();
  const sSearch = JSON.stringify({
    date: today, warehouse: "-1", vat_code: "-1", vat_included: "-1",
    show_products_with_multiple_vatcodes: false, vatCodeIncluded: "-1",
    search_products_ids: [], page: 1, results_per_page: "5",
  });

  const ajaxRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
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

  const ajaxText = await ajaxRes.text();
  let ajaxBody: unknown;
  try { ajaxBody = JSON.parse(ajaxText); } catch { ajaxBody = ajaxText.slice(0, 1000); }

  return NextResponse.json({
    pageStatus:    pageRes.status,
    csrfRotated:   freshCsrf !== storedCsrf,
    setCookies:    setCookieHeaders.map(c => c.split(";")[0]),
    ajax:          { status: ajaxRes.status, body: ajaxBody },
    today,
  });
}
