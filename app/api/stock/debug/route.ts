import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractCookies(headers: Headers): string {
  const cookies: string[] = [];
  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") cookies.push(value.split(";")[0]);
  });
  return cookies.join("; ");
}

function extractCsrf(html: string): string | null {
  const m =
    html.match(/name=["']?_token["']?\s+value=["']([^"']+)["']/) ||
    html.match(/value=["']([^"']+)["']\s+name=["']?_token["']?/) ||
    html.match(/"_token"\s*:\s*"([^"]+)"/) ||
    html.match(/csrf[_-]?token["']?\s*[=:]\s*["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

const LOGIN_URL = "https://cloud.smartbill.ro/auth/login";

export async function GET() {
  const email    = process.env.SMARTBILL_EMAIL;
  const password = process.env.SMARTBILL_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({ error: "SMARTBILL_EMAIL / SMARTBILL_PASSWORD lipsesc din env" }, { status: 503 });
  }

  // ── Step 1: GET login page → pick up initial cookies + CSRF token ───────────
  const loginPageRes     = await fetch(LOGIN_URL, { redirect: "follow", cache: "no-store" });
  const loginPageCookies = extractCookies(loginPageRes.headers);
  const loginPageHtml    = await loginPageRes.text();
  const csrfToken        = extractCsrf(loginPageHtml);

  // ── Step 2: POST credentials ────────────────────────────────────────────────
  const loginBody = new URLSearchParams({
    email,
    password,
    ...(csrfToken ? { _token: csrfToken } : {}),
  }).toString();

  const loginRes     = await fetch(LOGIN_URL, {
    method:  "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:         loginPageCookies,
      Referer:        LOGIN_URL,
      "User-Agent":   "Mozilla/5.0",
      Accept:         "text/html,*/*",
    },
    body:     loginBody,
    redirect: "manual",
    cache:    "no-store",
  });

  const loginCookies   = extractCookies(loginRes.headers);
  const allCookies     = [loginPageCookies, loginCookies].filter(Boolean).join("; ");
  const loginStatus    = loginRes.status;
  const loginLocation  = loginRes.headers.get("location");

  // ── Step 3: Call price list with session cookies ────────────────────────────
  const today   = new Date().toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
  const sSearch = JSON.stringify({
    date: today, warehouse: "-1", vat_code: "-1", vat_included: "-1",
    show_products_with_multiple_vatcodes: false, vatCodeIncluded: "-1",
    search_products_ids: [], page: 1, results_per_page: "1000",
  });

  const priceRes  = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
    method:  "POST",
    headers: {
      "Content-Type":     "application/x-www-form-urlencoded",
      Cookie:             allCookies,
      Accept:             "application/json, text/javascript, */*; q=0.01",
      Referer:            "https://cloud.smartbill.ro/nomenclator/lista_preturi/",
      "X-Requested-With": "XMLHttpRequest",
    },
    body:  new URLSearchParams({ sSearch }).toString(),
    cache: "no-store",
  });

  const priceText = await priceRes.text();
  let   priceBody: unknown;
  try { priceBody = JSON.parse(priceText); } catch { priceBody = priceText.slice(0, 500); }

  return NextResponse.json({
    step1_loginPage: { status: loginPageRes.status, cookiesFound: loginPageCookies.length > 0, csrfToken },
    step2_login:     { status: loginStatus, location: loginLocation, cookiesFound: loginCookies.length > 0 },
    step3_prices:    { status: priceRes.status, ok: priceRes.ok, body: priceBody },
  });
}
