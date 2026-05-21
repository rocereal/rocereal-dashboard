import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function GET() {
  const sessionId    = process.env.SMARTBILL_SESSION_ID;
  const storedCsrf   = process.env.SMARTBILL_CSRF_TOKEN ?? "";
  const extraCookies = process.env.SMARTBILL_EXTRA_COOKIES ?? "";

  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }

  const baseCookies = [
    storedCsrf ? `csrftoken=${storedCsrf}` : "",
    `sessionid=${sessionId}`,
    "srvid=2", "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  // Step 1: GET authenticated page to capture fresh CSRF
  const pageRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/", {
    method: "GET",
    headers: { Cookie: baseCookies, "User-Agent": BROWSER_UA, Accept: "text/html,*/*" },
    redirect: "manual", cache: "no-store",
  });

  let freshCsrf = storedCsrf;
  pageRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie" && value.includes("csrftoken")) {
      const match = value.match(/csrftoken=([^;]+)/);
      if (match) freshCsrf = match[1];
    }
  });

  if (pageRes.status !== 200) {
    return NextResponse.json({ error: "Sesiune expirată", pageStatus: pageRes.status });
  }

  // Step 2: POST without date field (date causes 500 on SmartBill server)
  const ajaxCookies = [
    `csrftoken=${freshCsrf}`,
    `sessionid=${sessionId}`,
    "srvid=2", "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  const sSearch = JSON.stringify({
    warehouse: "-1", vat_code: "-1", vat_included: "-1",
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

  const text = await ajaxRes.text();
  let body: unknown;
  try { body = JSON.parse(text); } catch { body = text.slice(0, 500); }

  return NextResponse.json({ status: ajaxRes.status, body });
}
