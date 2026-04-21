import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FMS_API_KEY = process.env.FMS_API_KEY || "Jo00eGZGXN7oJ_xABzl7uEVNbgj7suZS";
const FMS_BASE = "https://api.fm-track.com";

export async function GET() {
  const [vehiclesRes, coordsRes] = await Promise.all([
    fetch(`${FMS_BASE}/objects?version=1&api_key=${FMS_API_KEY}`, { cache: "no-store" }),
    fetch(`${FMS_BASE}/objects-last-coordinate?version=2&api_key=${FMS_API_KEY}`, { cache: "no-store" }),
  ]);

  if (!vehiclesRes.ok || !coordsRes.ok) {
    return NextResponse.json({ error: "FMS API error" }, { status: 502 });
  }

  const vehicles = await vehiclesRes.json() as Array<{
    id: string;
    name: string;
    imei: number;
    vehicle_params: {
      make: string | null;
      model: string | null;
      plate_number: string | null;
      fuel_type: string | null;
    };
  }>;

  const coordsData = await coordsRes.json() as {
    results: Array<{
      id: string;
      last_coordinate: {
        latitude: number;
        longitude: number;
        speed: number;
        direction: number;
        altitude: number;
        datetime: string;
        satellites_count: number;
      } | null;
    }>;
  };

  const coordsMap = new Map(coordsData.results.map((r) => [r.id, r.last_coordinate]));

  const result = vehicles.map((v) => {
    const coord = coordsMap.get(v.id) ?? null;
    const isOnline = coord
      ? Date.now() - new Date(coord.datetime).getTime() < 15 * 60 * 1000
      : false;

    return {
      id: v.id,
      name: v.name,
      plate: v.vehicle_params.plate_number || v.name,
      make: v.vehicle_params.make || "",
      model: v.vehicle_params.model || "",
      fuelType: v.vehicle_params.fuel_type || "",
      lat: coord?.latitude ?? null,
      lng: coord?.longitude ?? null,
      speed: coord?.speed ?? 0,
      direction: coord?.direction ?? 0,
      altitude: coord?.altitude ?? 0,
      lastSeen: coord?.datetime ?? null,
      satellites: coord?.satellites_count ?? 0,
      online: isOnline,
    };
  });

  return NextResponse.json(result);
}
