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
  const sessionId  = process.env.SMARTBILL_SESSION_ID;
  const envCsrf    = process.env.SMARTBILL_CSRF_TOKEN ?? "";
  const extraCookies = process.env.SMARTBILL_EXTRA_COOKIES ?? "";

  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }
  if (!envCsrf) {
    return NextResponse.json({ error: "SMARTBILL_CSRF_TOKEN lipsește din env" }, { status: 503 });
  }

  const cookieHeader = [
    `csrftoken=${envCsrf}`,
    `sessionid=${sessionId}`,
    "srvid=2",
    "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  // Step 1: GET the page to verify session is valid
  const pageRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/", {
    method:  "GET",
    headers: {
      Cookie:     cookieHeader,
      "User-Agent": BROWSER_UA,
      Accept:     "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    redirect: "manual",
    cache:    "no-store",
  });

  const pageStatus   = pageRes.status;
  const pageLocation = pageRes.headers.get("location") ?? "";
  const pageBodySnip = (await pageRes.text()).slice(0, 300);

  // Step 2: POST to AJAX endpoint
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
      Cookie:             cookieHeader,
      "X-CSRFToken":      envCsrf,
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
    page:  { status: pageStatus, location: pageLocation, bodySnip: pageBodySnip },
    ajax:  { status: ajaxRes.status, body: ajaxBody },
    today,
  });
}
