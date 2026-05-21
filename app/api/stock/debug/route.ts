import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractCookies(headers: Headers): string {
  const cookies: string[] = [];
  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") cookies.push(value.split(";")[0]);
  });
  return cookies.join("; ");
}

const LOGIN_URL = "https://cloud.smartbill.ro/auth/login/";

export async function GET() {
  const email    = process.env.SMARTBILL_EMAIL;
  const password = process.env.SMARTBILL_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({ error: "SMARTBILL_EMAIL / SMARTBILL_PASSWORD lipsesc din env" }, { status: 503 });
  }

  // ── Step 1: GET login page — show HTML to find CSRF + field names ───────────
  const loginPageRes     = await fetch(LOGIN_URL, { redirect: "follow", cache: "no-store" });
  const loginPageCookies = extractCookies(loginPageRes.headers);
  const loginPageHtml    = await loginPageRes.text();

  // Show a 2000-char snippet of the HTML around "token" or "csrf"
  const tokenIdx = loginPageHtml.toLowerCase().indexOf("token");
  const htmlSnippet = tokenIdx >= 0
    ? loginPageHtml.slice(Math.max(0, tokenIdx - 200), tokenIdx + 500)
    : loginPageHtml.slice(0, 1000);

  // Try many CSRF patterns
  const patterns = [
    /_token['"]\s+value=['"]([^'"]+)['"]/,
    /value=['"]([^'"]+)['"]\s+name=['"]_token['"]/,
    /name=['"]_token['"]\s+value=['"]([^'"]+)['"]/,
    /"_token":"([^"]+)"/,
    /token['"]:\s*['"]([^'"]+)['"]/i,
    /csrf.*?value=['"]([^'"]+)['"]/i,
    /<input[^>]+name=['"]?_token['"]?[^>]+value=['"]([^'"]+)['"]/i,
    /<input[^>]+value=['"]([^'"]+)['"][^>]+name=['"]?_token['"]?/i,
  ];
  let csrfToken: string | null = null;
  for (const p of patterns) {
    const m = loginPageHtml.match(p);
    if (m) { csrfToken = m[1]; break; }
  }

  return NextResponse.json({
    step1: {
      status:       loginPageRes.status,
      finalUrl:     loginPageRes.url,
      cookiesFound: loginPageCookies.length > 0,
      cookies:      loginPageCookies,
      csrfToken,
      htmlSnippet,
    },
  });
}
