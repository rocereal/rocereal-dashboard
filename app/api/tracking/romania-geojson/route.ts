import { NextResponse } from "next/server";

// Cached in memory for the lifetime of the serverless function instance
let memCache: unknown = null;

// Sources in priority order — GADM is the most reliable official source
const GEOJSON_SOURCES = [
  // GADM 4.1 — official administrative boundaries, Romania counties (level 1)
  "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_ROU_1.json",
  // Backup: geoboundaries
  "https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/ROU/ADM1/geoBoundaries-ROU-ADM1.geojson",
  // Backup: nicktgn
  "https://raw.githubusercontent.com/nicktgn/RomaniaMap/master/data/counties.json",
];

export const dynamic = "force-dynamic";

export async function GET() {
  if (memCache) {
    return NextResponse.json(memCache, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  for (const url of GEOJSON_SOURCES) {
    try {
      const res = await fetch(url, {
        // Next.js data cache — reuse across requests for 24h
        next:    { revalidate: 86400 },
        headers: { Accept: "application/json" },
        signal:  AbortSignal.timeout(20_000), // 20s timeout per source
      });
      if (!res.ok) continue;

      const data = await res.json() as Record<string, unknown>;

      // Accept any GeoJSON object — Feature, FeatureCollection, etc.
      if (!data || typeof data !== "object") continue;

      memCache = data;
      return NextResponse.json(data, {
        headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" },
      });
    } catch { continue; }
  }

  return NextResponse.json({ error: "GeoJSON indisponibil" }, { status: 503 });
}
