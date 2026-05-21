import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = process.env.SMARTBILL_SESSION_ID;
  if (!sessionId) {
    return NextResponse.json({ error: "SMARTBILL_SESSION_ID lipsește din env" }, { status: 503 });
  }

  // Get fresh CSRF token
  const loginRes    = await fetch("https://cloud.smartbill.ro/auth/login/", { redirect: "follow", cache: "no-store" });
  let csrfCookie    = "";
  loginRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie" && value.includes("csrftoken")) {
      csrfCookie = value.split(";")[0];
    }
  });
  const csrfValue = csrfCookie.split("=")[1] ?? "";

  const cookieHeader = `${csrfCookie}; sessionid=${sessionId}`;
  const today        = new Date().toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
  const sSearch      = JSON.stringify({
    date: today, warehouse: "-1", vat_code: "-1", vat_included: "-1",
    show_products_with_multiple_vatcodes: false, vatCodeIncluded: "-1",
    search_products_ids: [], page: 1, results_per_page: "10",
  });

  const priceRes  = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
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
  try { body = JSON.parse(text); } catch { body = text.slice(0, 500); }

  return NextResponse.json({ status: priceRes.status, csrfFound: !!csrfValue, body });
}
