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

  // Fetch the full page to extract the JS AJAX call and find any extra params
  const pageRes  = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/", {
    method:  "GET",
    headers: {
      Cookie:       baseCookies,
      "User-Agent": BROWSER_UA,
      Accept:       "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    redirect: "manual",
    cache:    "no-store",
  });

  let freshCsrf = storedCsrf;
  pageRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie" && value.includes("csrftoken")) {
      const match = value.match(/csrftoken=([^;]+)/);
      if (match) freshCsrf = match[1];
    }
  });

  // Grab the full page and look for the sSearch / ajax call context
  const pageText = await pageRes.text();
  // Find the section around "lista_preturi" or "sSearch" in the JS
  const ajaxIdx  = pageText.indexOf("lista_preturi");
  const jsSnip   = ajaxIdx >= 0 ? pageText.slice(Math.max(0, ajaxIdx - 200), ajaxIdx + 2000) : pageText.slice(0, 3000);

  // Also try POST with minimal sSearch to see if it's a payload issue
  const ajaxCookies = [
    `csrftoken=${freshCsrf}`,
    `sessionid=${sessionId}`,
    "srvid=2",
    "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  const today   = todayRO();

  // Attempt 1: our current payload
  const sSearch1 = JSON.stringify({
    date: today, warehouse: "-1", vat_code: "-1", vat_included: "-1",
    show_products_with_multiple_vatcodes: false, vatCodeIncluded: "-1",
    search_products_ids: [], page: 1, results_per_page: "5",
  });

  // Attempt 2: minimal payload — just page and results_per_page
  const sSearch2 = JSON.stringify({ page: 1, results_per_page: "5" });

  const postHeaders = {
    "Content-Type":     "application/x-www-form-urlencoded; charset=UTF-8",
    Cookie:             ajaxCookies,
    "X-CSRFToken":      freshCsrf,
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent":       BROWSER_UA,
    Accept:             "application/json, text/javascript, */*; q=0.01",
    Origin:             "https://cloud.smartbill.ro",
    Referer:            "https://cloud.smartbill.ro/nomenclator/lista_preturi/",
  };

  const [res1, res2] = await Promise.all([
    fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
      method: "POST", headers: postHeaders,
      body: new URLSearchParams({ sSearch: sSearch1 }).toString(), cache: "no-store",
    }),
    fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
      method: "POST", headers: postHeaders,
      body: new URLSearchParams({ sSearch: sSearch2 }).toString(), cache: "no-store",
    }),
  ]);

  const t1 = await res1.text();
  const t2 = await res2.text();
  let b1: unknown; try { b1 = JSON.parse(t1); } catch { b1 = t1.slice(0, 300); }
  let b2: unknown; try { b2 = JSON.parse(t2); } catch { b2 = t2.slice(0, 300); }

  return NextResponse.json({
    pageStatus: pageRes.status,
    today,
    jsSnip,
    attempt1: { status: res1.status, body: b1 },
    attempt2: { status: res2.status, body: b2 },
  });
}
