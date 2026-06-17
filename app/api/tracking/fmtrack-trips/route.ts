import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FMS_BASE    = "https://api.fm-track.com";
const FMS_API_KEY = process.env.FMS_API_KEY ?? "";

interface FmVehicle {
  id:             string;
  name:           string;
  vehicle_params: { plate_number?: string | null };
}

interface FmAddress {
  locality?:    string;
  street?:      string;
  country_code?: string;
}

interface FmTripPoint {
  datetime:  string;
  latitude:  number;
  longitude: number;
  address?:  FmAddress;
}

interface FmTrip {
  object_id:     string;
  trip_duration: number;   // seconds
  mileage:       number;   // meters
  trip_start:    FmTripPoint;
  trip_end:      FmTripPoint;
}

interface FmTripsResponse {
  continuation_token?: string;
  trips?: FmTrip[];
}

export interface DayTrip {
  vehicleId:      string;
  plate:          string;
  date:           string;   // YYYY-MM-DD (date of trip_start)
  gpsKm:          number;
  gpsDurationMin: number;
  tripCount:      number;
  firstDeparture: string;   // locality name
  lastArrival:    string;
}

async function fetchVehicleTrips(
  vehicleId: string,
  from: string,
  to:   string,
): Promise<FmTrip[]> {
  const all: FmTrip[] = [];
  let token: string | undefined;

  do {
    const url = new URL(`${FMS_BASE}/objects/${vehicleId}/trips`);
    url.searchParams.set("version",       "1");
    url.searchParams.set("api_key",       FMS_API_KEY);
    url.searchParams.set("from_datetime", new Date(`${from}T00:00:00`).toISOString());
    url.searchParams.set("to_datetime",   new Date(`${to}T23:59:59`).toISOString());
    url.searchParams.set("limit",         "1000");
    if (token) url.searchParams.set("continuation_token", token);

    const res = await fetch(url.toString(), {
      cache:  "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) break;

    const data = await res.json() as FmTripsResponse;
    all.push(...(data.trips ?? []));
    token = data.continuation_token ?? undefined;
  } while (token);

  return all;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? new Date().toISOString().slice(0, 10);
  const to   = searchParams.get("to")   ?? new Date().toISOString().slice(0, 10);

  if (!FMS_API_KEY) {
    return NextResponse.json({ error: "FMS_API_KEY lipsește" }, { status: 503 });
  }

  // 1. Fetch vehicle list
  const vehiclesRes = await fetch(
    `${FMS_BASE}/objects?version=1&api_key=${FMS_API_KEY}`,
    { cache: "no-store", signal: AbortSignal.timeout(10_000) },
  );
  if (!vehiclesRes.ok) {
    return NextResponse.json({ error: `FM-Track vehicles HTTP ${vehiclesRes.status}` }, { status: 502 });
  }
  const vehicles = await vehiclesRes.json() as FmVehicle[];

  // 2. Fetch trips for each vehicle in parallel
  const allResults = await Promise.all(
    vehicles.map(async (v) => {
      const plate = v.vehicle_params?.plate_number || v.name;
      try {
        const trips = await fetchVehicleTrips(v.id, from, to);
        return { vehicleId: v.id, plate, trips };
      } catch {
        return { vehicleId: v.id, plate, trips: [] as FmTrip[] };
      }
    }),
  );

  // 3. Aggregate by vehicle + date
  const dayMap = new Map<string, DayTrip>();

  for (const { vehicleId, plate, trips } of allResults) {
    for (const trip of trips) {
      const date = trip.trip_start.datetime.slice(0, 10);
      const key  = `${vehicleId}|${date}`;
      const km   = Math.round((trip.mileage ?? 0) / 1000);
      const min  = Math.round((trip.trip_duration ?? 0) / 60);
      const dep  = trip.trip_start.address?.locality ?? "";
      const arr  = trip.trip_end.address?.locality   ?? "";

      const ex = dayMap.get(key);
      if (ex) {
        ex.gpsKm         += km;
        ex.gpsDurationMin += min;
        ex.tripCount      += 1;
        if (arr) ex.lastArrival = arr;
      } else {
        dayMap.set(key, {
          vehicleId, plate, date,
          gpsKm: km, gpsDurationMin: min, tripCount: 1,
          firstDeparture: dep, lastArrival: arr,
        });
      }
    }
  }

  const dayTrips = Array.from(dayMap.values())
    .sort((a, b) => b.date.localeCompare(a.date) || a.plate.localeCompare(b.plate));

  return NextResponse.json(dayTrips);
}
