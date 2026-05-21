import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractCookies(headers: Headers): string {
  const cookies: string[] = [];
  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") cookies.push(value.split(";")[0]);
  });
  return cookies.join("; ");
}

function findCsrfInHtml(html: string): string | null {
  const patterns = [
    /name=["']csrfmiddlewaretoken["']\s+value=["']([^"']+)["']/,
    /value=["']([^"']+)["']\s+name=["']csrfmiddlewaretoken["']/,
    /name=["']_token["']\s+value=["']([^"']+)["']/,
    /value=["']([^"']+)["']\s+name=["']_token["']/,
    /"_token"\s*:\s*"([^"]+)"/,
    /token["']\s*:\s*["']([^"']{40,})["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
}

const LOGIN_URL = "https://cloud.smartbill.ro/auth/login/";

export async function GET() {
  const email    = process.env.SMARTBILL_EMAIL;
  const password = process.env.SMARTBILL_PASSWORD;
  if (!email || !password) {
    return NextResponse.json({ error: "SMARTBILL_EMAIL / SMARTBILL_PASSWORD lipsesc din env" }, { status: 503 });
  }

  // ── 1. GET login page ───────────────────────────────────────────────────────
  const pageRes     = await fetch(LOGIN_URL, { redirect: "follow", cache: "no-store" });
  const pageCookies = extractCookies(pageRes.headers);
  const pageHtml    = await pageRes.text();
  const csrfToken   = findCsrfInHtml(pageHtml);

  // ── 2. POST login ───────────────────────────────────────────────────────────
  const formBody = new URLSearchParams({
    email,
    password,
    ...(csrfToken ? { csrfmiddlewaretoken: csrfToken, _token: csrfToken } : {}),
  }).toString();

  const loginRes     = await fetch(LOGIN_URL, {
    method:  "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:         pageCookies,
      Referer:        LOGIN_URL,
      "User-Agent":   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept:         "text/html,application/xhtml+xml,*/*",
      "X-CSRFToken":  csrfToken ?? "",
    },
    body:     formBody,
    redirect: "manual",
    cache:    "no-store",
  });

  const loginCookies  = extractCookies(loginRes.headers);
  const loginLocation = loginRes.headers.get("location");
  const loginStatus   = loginRes.status;
  const allCookies    = [pageCookies, loginCookies].filter(Boolean).join("; ");

  // ── 3. If redirected after login, follow to get final session cookies ───────
  let sessionCookies = allCookies;
  if (loginStatus === 302 || loginStatus === 301) {
    const redirectUrl = loginLocation?.startsWith("http")
      ? loginLocation
      : `https://cloud.smartbill.ro${loginLocation}`;
    const redirectRes     = await fetch(redirectUrl, {
      headers: { Cookie: allCookies, "User-Agent": "Mozilla/5.0" },
      redirect: "manual",
      cache:    "no-store",
    });
    const redirectCookies = extractCookies(redirectRes.headers);
    sessionCookies = [allCookies, redirectCookies].filter(Boolean).join("; ");
  }

  // ── 4. Call price list ──────────────────────────────────────────────────────
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

  return NextResponse.json({
    step1: { status: pageRes.status, cookiesFound: pageCookies.length > 0, csrfToken },
    step2: { status: loginStatus, location: loginLocation, cookiesFound: loginCookies.length > 0 },
    step3: { status: priceRes.status, ok: priceRes.ok, body: priceBody },
  });
}
