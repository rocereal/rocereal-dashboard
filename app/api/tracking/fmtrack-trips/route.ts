import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FMS_BASE    = "https://api.fm-track.com";
const FMS_API_KEY = process.env.FMS_API_KEY ?? "";

// FM-Track limits each request to 30 days — split longer ranges into chunks
const MAX_DAYS = 29;

interface FmVehicle {
  id:             string;
  name:           string;
  vehicle_params: { plate_number?: string | null };
}

interface FmAddress {
  locality?:    string;
  street?:      string;
}

interface FmTripPoint {
  datetime: string;
  address?: FmAddress;
}

interface FmTrip {
  trip_duration: number;   // seconds
  mileage:       number;   // meters
  trip_start:    FmTripPoint;
  trip_end:      FmTripPoint;
}

interface FmTripsResponse {
  code?:               number;
  continuation_token?: string;
  trips?:              FmTrip[];
}

export interface DayTrip {
  vehicleId:      string;
  plate:          string;
  date:           string;   // YYYY-MM-DD
  gpsKm:          number;
  gpsDurationMin: number;
  tripCount:      number;
  firstDeparture: string;
  lastArrival:    string;
}

// Split a date range into ≤MAX_DAYS chunks
function dateChunks(from: string, to: string): Array<{ from: string; to: string }> {
  const chunks: Array<{ from: string; to: string }> = [];
  let cursor = new Date(`${from}T00:00:00Z`);
  const end  = new Date(`${to}T23:59:59Z`);

  while (cursor <= end) {
    const chunkEnd = new Date(cursor);
    chunkEnd.setUTCDate(chunkEnd.getUTCDate() + MAX_DAYS - 1);
    if (chunkEnd > end) chunkEnd.setTime(end.getTime());
    chunks.push({
      from: cursor.toISOString().slice(0, 10),
      to:   chunkEnd.toISOString().slice(0, 10),
    });
    cursor = new Date(chunkEnd);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return chunks;
}

async function fetchChunk(vehicleId: string, from: string, to: string): Promise<FmTrip[]> {
  const all: FmTrip[] = [];
  let token: string | undefined;

  do {
    const url = new URL(`${FMS_BASE}/objects/${vehicleId}/trips`);
    url.searchParams.set("version",       "1");
    url.searchParams.set("api_key",       FMS_API_KEY);
    url.searchParams.set("from_datetime", `${from}T00:00:00Z`);
    url.searchParams.set("to_datetime",   `${to}T23:59:59Z`);
    url.searchParams.set("limit",         "1000");
    if (token) url.searchParams.set("continuation_token", token);

    const res = await fetch(url.toString(), {
      cache:  "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) break;

    const data = await res.json() as FmTripsResponse;
    // FM-Track returns { code: 400, message: "..." } for errors
    if (data.code && data.code >= 400) break;
    all.push(...(data.trips ?? []));
    token = data.continuation_token ?? undefined;
  } while (token);

  return all;
}

// Run promises in batches to avoid overwhelming FM-Track
async function batchAll<T>(
  items: Array<() => Promise<T>>,
  batchSize = 6,
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = await Promise.all(items.slice(i, i + batchSize).map(fn => fn()));
    results.push(...batch);
  }
  return results;
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

  const chunks = dateChunks(from, to);

  // 2. Build all (vehicle × chunk) fetch tasks
  const tasks = vehicles.flatMap(v => {
    const plate = v.vehicle_params?.plate_number || v.name;
    return chunks.map(c => () =>
      fetchChunk(v.id, c.from, c.to)
        .then(trips => ({ vehicleId: v.id, plate, trips }))
        .catch(() => ({ vehicleId: v.id, plate, trips: [] as FmTrip[] })),
    );
  });

  const results = await batchAll(tasks, 6);

  // 3. Aggregate by vehicle + date (using a plain Record to avoid L.Map collision)
  const dayAcc: Record<string, DayTrip> = {};

  for (const { vehicleId, plate, trips } of results) {
    for (const trip of trips) {
      const date = trip.trip_start.datetime.slice(0, 10);
      const key  = `${vehicleId}|${date}`;
      const km   = Math.round((trip.mileage ?? 0) / 1000);
      const min  = Math.round((trip.trip_duration ?? 0) / 60);
      const dep  = trip.trip_start.address?.locality ?? "";
      const arr  = trip.trip_end.address?.locality   ?? "";

      const ex = dayAcc[key];
      if (ex) {
        ex.gpsKm          += km;
        ex.gpsDurationMin += min;
        ex.tripCount      += 1;
        if (arr) ex.lastArrival = arr;
      } else {
        dayAcc[key] = {
          vehicleId, plate, date,
          gpsKm: km, gpsDurationMin: min, tripCount: 1,
          firstDeparture: dep, lastArrival: arr,
        };
      }
    }
  }

  const dayTrips = Object.values(dayAcc)
    .sort((a, b) => b.date.localeCompare(a.date) || a.plate.localeCompare(b.plate));

  return NextResponse.json(dayTrips);
}
