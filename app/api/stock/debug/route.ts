import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = process.env.SMARTBILL_EMAIL;
  const token = process.env.SMARTBILL_TOKEN;

  if (!email || !token) {
    return NextResponse.json({ error: "Credențiale SmartBill lipsesc din env" }, { status: 503 });
  }

  const auth  = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  const today = new Date().toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });

  // Try with warehouse=-1 (all warehouses) so we don't need to know the internal warehouse ID
  const sSearch = JSON.stringify({
    date:                              today,
    warehouse:                         "-1",
    vat_code:                          "-1",
    vat_included:                      "-1",
    show_products_with_multiple_vatcodes: false,
    vatCodeIncluded:                   "-1",
    search_products_ids:               [],
    page:                              1,
    results_per_page:                  "1000",
  });

  const body = new URLSearchParams({ sSearch }).toString();

  try {
    const res = await fetch("https://cloud.smartbill.ro/nomenclator/lista_preturi/ajax/", {
      method:  "POST",
      headers: {
        Authorization:  auth,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept:         "application/json, text/javascript, */*; q=0.01",
      },
      body,
      cache: "no-store",
    });

    const text = await res.text();
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { parsed = text.slice(0, 1000); }

    return NextResponse.json({ status: res.status, ok: res.ok, today, sSearch, body: parsed });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) });
  }
}
