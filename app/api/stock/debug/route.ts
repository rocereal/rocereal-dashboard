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

  let freshCsrf = storedCsrf;
  const baseCookies = [
    storedCsrf ? `csrftoken=${storedCsrf}` : "",
    `sessionid=${sessionId}`,
    "srvid=2", "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  // Get fresh CSRF from page
  const pageRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/", {
    method: "GET",
    headers: { Cookie: baseCookies, "User-Agent": BROWSER_UA, Accept: "text/html,*/*" },
    redirect: "manual", cache: "no-store",
  });
  pageRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie" && value.includes("csrftoken")) {
      const match = value.match(/csrftoken=([^;]+)/);
      if (match) freshCsrf = match[1];
    }
  });

  const ajaxCookies = [
    `csrftoken=${freshCsrf}`,
    `sessionid=${sessionId}`,
    "srvid=2", "sip=true",
    extraCookies,
  ].filter(Boolean).join("; ");

  const today = todayRO();

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

  const post = async (sSearch: object) => {
    const r = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
      method: "POST", headers: postHeaders,
      body: new URLSearchParams({ sSearch: JSON.stringify(sSearch) }).toString(),
      cache: "no-store",
    });
    const txt = await r.text();
    let body: unknown;
    try { body = JSON.parse(txt); } catch { body = txt.slice(0, 200); }
    return { status: r.status, body };
  };

  // Binary search: find which field causes 500
  const [r1, r2, r3, r4] = await Promise.all([
    // A: just date (most likely needed for non-empty results)
    post({ date: today, page: 1, results_per_page: "100" }),
    // B: all fields EXCEPT date
    post({ warehouse: "-1", vat_code: "-1", vat_included: "-1",
           show_products_with_multiple_vatcodes: false, vatCodeIncluded: "-1",
           search_products_ids: [], page: 1, results_per_page: "5" }),
    // C: integer types for warehouse/vat instead of strings
    post({ date: today, warehouse: -1, vat_code: -1, vat_included: -1,
           show_products_with_multiple_vatcodes: false, vatCodeIncluded: -1,
           search_products_ids: [], page: 1, results_per_page: "5" }),
    // D: empty string for warehouse/vat
    post({ date: today, warehouse: "", vat_code: "", vat_included: "",
           show_products_with_multiple_vatcodes: false,
           search_products_ids: [], page: 1, results_per_page: "5" }),
  ]);

  return NextResponse.json({ today, A_dateOnly: r1, B_noDate: r2, C_intTypes: r3, D_emptyStr: r4 });
}
