import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FMS_BASE    = "https://api.fm-track.com";
const FMS_API_KEY = process.env.FMS_API_KEY ?? "";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "2026-01-01";
  const to   = searchParams.get("to")   ?? "2026-12-31";

  // 1. Fetch vehicles
  const vehiclesRes = await fetch(
    `${FMS_BASE}/objects?version=1&api_key=${FMS_API_KEY}`,
    { cache: "no-store" },
  );
  const vehiclesRaw = await vehiclesRes.text();
  let vehicles: unknown[] = [];
  try { vehicles = JSON.parse(vehiclesRaw) as unknown[]; } catch { /* ignore */ }

  // 2. Try trips for first vehicle
  const firstVehicle = (vehicles as Array<{ id: string; name: string }>)[0];
  let tripsRaw = "(no vehicle to test)";
  let tripsUrl = "";

  if (firstVehicle) {
    const url = new URL(`${FMS_BASE}/objects/${firstVehicle.id}/trips`);
    url.searchParams.set("version",       "1");
    url.searchParams.set("api_key",       FMS_API_KEY);
    url.searchParams.set("from_datetime", new Date(`${from}T00:00:00`).toISOString());
    url.searchParams.set("to_datetime",   new Date(`${to}T23:59:59`).toISOString());
    url.searchParams.set("limit",         "5");
    tripsUrl = url.toString().replace(FMS_API_KEY, "***");

    const tripsRes = await fetch(url.toString(), { cache: "no-store" });
    tripsRaw = await tripsRes.text();
  }

  return NextResponse.json({
    apiKey:      FMS_API_KEY ? `${FMS_API_KEY.slice(0, 6)}...` : "MISSING",
    vehicleCount: vehicles.length,
    vehicles:    (vehicles as Array<{ id: string; name: string; vehicle_params?: unknown }>)
                   .map(v => ({ id: v.id, name: v.name, params: v.vehicle_params })),
    tripsUrl,
    tripsResponse: JSON.parse(tripsRaw || "null"),
  });
}
