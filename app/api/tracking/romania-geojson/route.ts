import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24h cache

// Multiple sources in fallback order
const GEOJSON_SOURCES = [
  "https://raw.githubusercontent.com/nicktgn/RomaniaMap/master/data/counties.json",
  "https://raw.githubusercontent.com/ionut-t/geo-romania/master/counties.geojson",
  "https://raw.githubusercontent.com/vlad-stoian/romania-geojson/master/romania-judete.geojson",
];

export async function GET() {
  for (const url of GEOJSON_SOURCES) {
    try {
      const res = await fetch(url, {
        next:    { revalidate: 86400 },
        headers: { Accept: "application/json" },
      });
      if (!res.ok) continue;
      const data: unknown = await res.json();
      return NextResponse.json(data, {
        headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" },
      });
    } catch { continue; }
  }
  return NextResponse.json({ error: "GeoJSON indisponibil" }, { status: 503 });
}
