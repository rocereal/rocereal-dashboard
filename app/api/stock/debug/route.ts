import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Build DD.MM.YYYY manually to avoid Node.js ICU locale differences across environments
function todayRO(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export async function GET() {
  const sessionId = process.env.SMARTBILL_SESSION_ID;
  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }

  // Get fresh CSRF token
  const loginRes = await fetch("https://cloud.smartbill.ro/auth/login/", { redirect: "follow", cache: "no-store" });
  let csrfCookie = "";
  loginRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie" && value.includes("csrftoken")) {
      csrfCookie = value.split(";")[0];
    }
  });
  const csrfValue = csrfCookie.split("=")[1] ?? "";

  // SMARTBILL_EXTRA_COOKIES = any additional cookies from browser (e.g. "cif=RO12345; company_id=42")
  const extraCookies  = process.env.SMARTBILL_EXTRA_COOKIES ?? "";
  const cookieHeader  = [csrfCookie, `sessionid=${sessionId}`, "srvid=2", "sip=true", extraCookies]
    .filter(Boolean).join("; ");

  const today   = todayRO();
  const sSearch = JSON.stringify({
    date: today, warehouse: "-1", vat_code: "-1", vat_included: "-1",
    show_products_with_multiple_vatcodes: false, vatCodeIncluded: "-1",
    search_products_ids: [], page: 1, results_per_page: "5",
  });

  const priceRes = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
    method:  "POST",
    headers: {
      "Content-Type":     "application/x-www-form-urlencoded",
      Cookie:             cookieHeader,
      "X-CSRFToken":      csrfValue,
      "X-Requested-With": "XMLHttpRequest",
      Accept:             "application/json, text/javascript, */*; q=0.01",
      Referer:            "https://cloud.smartbill.ro/nomenclator/lista_preturi/",
    },
    body:  new URLSearchParams({ sSearch }).toString(),
    cache: "no-store",
  });

  const text = await priceRes.text();
  let body: unknown;
  try { body = JSON.parse(text); } catch { body = text.slice(0, 2000); }

  return NextResponse.json({
    status:    priceRes.status,
    csrfFound: !!csrfValue,
    today,
    sSearchSent: sSearch,
    cookies:   `sessionid=...${sessionId.slice(-6)}; srvid=2; sip=true; csrftoken=...${csrfValue.slice(-6)}${extraCookies ? `; ${extraCookies}` : ""}`,
    body,
  });
}
