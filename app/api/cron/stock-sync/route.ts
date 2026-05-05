import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret     = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${req.headers.get("host")}`;

    const [stockRes, pricesRes] = await Promise.all([
      fetch(`${baseUrl}/api/stock/sync`,        { method: "POST" }),
      fetch(`${baseUrl}/api/stock/sync-prices`, { method: "POST" }),
    ]);

    const stockJson  = await stockRes.json()  as Record<string, unknown>;
    const pricesJson = await pricesRes.json() as Record<string, unknown>;

    return NextResponse.json({
      ok: true,
      triggeredAt: new Date().toISOString(),
      stock:  stockJson,
      prices: pricesJson,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
