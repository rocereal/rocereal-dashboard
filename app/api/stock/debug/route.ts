import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function todayRO(): string {
  const d = new Date();
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

async function fetchFreshCsrf(): Promise<{ cookie: string; value: string }> {
  const res = await fetch("https://cloud.smartbill.ro/auth/login/", { redirect: "follow", cache: "no-store" });
  let cookie = "";
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === "set-cookie" && v.includes("csrftoken")) cookie = v.split(";")[0];
  });
  return { cookie, value: cookie.split("=")[1] ?? "" };
}

export async function GET() {
  const sessionId = process.env.SMARTBILL_SESSION_ID;
  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }

  // If SMARTBILL_CSRF_TOKEN is set, use it directly (avoids cross-session CSRF mismatch)
  const envCsrf   = process.env.SMARTBILL_CSRF_TOKEN ?? "";
  const csrfValue = envCsrf || (await fetchFreshCsrf()).value;

  // SMARTBILL_EXTRA_COOKIES = space for additional browser cookies, e.g. "sblsd=...; sb=..."
  const extraCookies = process.env.SMARTBILL_EXTRA_COOKIES ?? "";

  const cookieHeader = [
    `csrftoken=${csrfValue}`,
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
    status:      priceRes.status,
    csrfSource:  envCsrf ? "env" : "fresh-fetch",
    today,
    extraCookiesSet: !!extraCookies,
    body,
  });
}
