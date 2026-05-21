import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper: extract cookie string from Set-Cookie headers
function extractCookies(headers: Headers): string {
  const cookies: string[] = [];
  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      cookies.push(value.split(";")[0]);
    }
  });
  return cookies.join("; ");
}

export async function GET() {
  const email    = process.env.SMARTBILL_EMAIL;
  const password = process.env.SMARTBILL_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({ error: "SMARTBILL_EMAIL / SMARTBILL_PASSWORD lipsesc din env" }, { status: 503 });
  }

  // ── Step 1: GET login page to pick up any session/CSRF cookies ──────────────
  const loginPageRes = await fetch("https://cloud.smartbill.ro/login/", {
    redirect: "follow",
    cache:    "no-store",
  });
  const loginPageCookies = extractCookies(loginPageRes.headers);
  const loginPageHtml    = await loginPageRes.text();

  // Extract CSRF token if present (common patterns)
  const csrfMatch =
    loginPageHtml.match(/name=["']?_token["']?\s+value=["']([^"']+)["']/) ||
    loginPageHtml.match(/name=["']?csrf_token["']?\s+value=["']([^"']+)["']/) ||
    loginPageHtml.match(/csrf[_-]token["']?\s*:\s*["']([^"']+)["']/i);
  const csrfToken = csrfMatch?.[1] ?? null;

  // ── Step 2: POST login ──────────────────────────────────────────────────────
  const loginBody = new URLSearchParams({
    email:    email,
    password: password,
    ...(csrfToken ? { _token: csrfToken } : {}),
  }).toString();

  const loginRes = await fetch("https://cloud.smartbill.ro/login/", {
    method:  "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:         loginPageCookies,
      Accept:         "text/html,application/xhtml+xml,*/*",
      Referer:        "https://cloud.smartbill.ro/login/",
    },
    body:     loginBody,
    redirect: "manual",
    cache:    "no-store",
  });

  const loginCookies       = extractCookies(loginRes.headers);
  const allCookies         = [loginPageCookies, loginCookies].filter(Boolean).join("; ");
  const loginRedirectUrl   = loginRes.headers.get("location");
  const loginStatus        = loginRes.status;

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
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:         allCookies,
      Accept:         "application/json, text/javascript, */*; q=0.01",
      Referer:        "https://cloud.smartbill.ro/nomenclator/lista_preturi/",
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
    step2_login:     { status: loginStatus, redirectTo: loginRedirectUrl, cookiesFound: loginCookies.length > 0 },
    step3_prices:    { status: priceRes.status, ok: priceRes.ok, body: priceBody },
  });
}
