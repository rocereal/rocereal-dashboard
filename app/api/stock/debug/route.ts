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

export async function GET() {
  const email    = process.env.SMARTBILL_EMAIL;
  const password = process.env.SMARTBILL_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({ error: "SMARTBILL_EMAIL / SMARTBILL_PASSWORD lipsesc din env" }, { status: 503 });
  }

  const results: Record<string, unknown> = {};

  // ── Step 1: GET root to find login URL ──────────────────────────────────────
  const rootRes  = await fetch("https://cloud.smartbill.ro/", { redirect: "manual", cache: "no-store" });
  const rootCookies = extractCookies(rootRes.headers);
  results.step1_root = {
    status:      rootRes.status,
    location:    rootRes.headers.get("location"),
    cookies:     rootCookies,
  };

  // Try to determine the login URL from the redirect
  const loginUrl = rootRes.headers.get("location") ?? "https://cloud.smartbill.ro/";

  // ── Step 2: GET login page (follow redirects) ───────────────────────────────
  const loginPageRes     = await fetch(loginUrl, { redirect: "follow", cache: "no-store" });
  const loginPageCookies = extractCookies(loginPageRes.headers);
  const loginPageHtml    = await loginPageRes.text();
  const csrfToken        = extractCsrf(loginPageHtml);
  const finalLoginUrl    = loginPageRes.url;

  results.step2_loginPage = {
    status:       loginPageRes.status,
    finalUrl:     finalLoginUrl,
    cookies:      loginPageCookies,
    csrfToken,
    htmlSnippet:  loginPageHtml.slice(0, 800),
  };

  // ── Step 3: POST login ──────────────────────────────────────────────────────
  const allInitialCookies = [rootCookies, loginPageCookies].filter(Boolean).join("; ");
  const loginBody = new URLSearchParams({
    email,
    password,
    ...(csrfToken ? { _token: csrfToken } : {}),
  }).toString();

  const loginPostRes     = await fetch(finalLoginUrl, {
    method:  "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:         allInitialCookies,
      Referer:        finalLoginUrl,
      "User-Agent":   "Mozilla/5.0",
      Accept:         "text/html,*/*",
    },
    body:     loginBody,
    redirect: "manual",
    cache:    "no-store",
  });
  const loginPostCookies = extractCookies(loginPostRes.headers);
  const loginPostText    = await loginPostRes.text();

  results.step3_loginPost = {
    status:      loginPostRes.status,
    location:    loginPostRes.headers.get("location"),
    cookies:     loginPostCookies,
    htmlSnippet: loginPostText.slice(0, 500),
  };

  // ── Step 4: Try price list with accumulated cookies ─────────────────────────
  const sessionCookies = [allInitialCookies, loginPostCookies].filter(Boolean).join("; ");
  const today          = new Date().toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
  const sSearch        = JSON.stringify({
    date: today, warehouse: "-1", vat_code: "-1", vat_included: "-1",
    show_products_with_multiple_vatcodes: false, vatCodeIncluded: "-1",
    search_products_ids: [], page: 1, results_per_page: "1000",
  });

  const priceRes  = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
    method:  "POST",
    headers: {
      "Content-Type":     "application/x-www-form-urlencoded",
      Cookie:             sessionCookies,
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

  results.step4_prices = { status: priceRes.status, ok: priceRes.ok, body: priceBody };

  return NextResponse.json(results);
}
