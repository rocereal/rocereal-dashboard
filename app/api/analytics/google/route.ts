import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GA4 Data API requires a Service Account JSON key.
// Set GA4_SERVICE_ACCOUNT_JSON and GA4_PROPERTY_ID in your env.
const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "";
const SERVICE_ACCOUNT_JSON = process.env.GA4_SERVICE_ACCOUNT_JSON || "";

async function getAccessToken(): Promise<string | null> {
  if (!SERVICE_ACCOUNT_JSON) return null;
  try {
    const sa = JSON.parse(SERVICE_ACCOUNT_JSON);
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };
    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString("base64url");
    const unsigned = `${encode(header)}.${encode(payload)}`;

    // Sign with RS256 using the private key from service account
    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(unsigned);
    const signature = sign.sign(sa.private_key, "base64url");
    const jwt = `${unsigned}.${signature}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const tokenData = await tokenRes.json() as { access_token?: string };
    return tokenData.access_token ?? null;
  } catch {
    return null;
  }
}

async function runReport(token: string, body: object) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );
  return res.json();
}

export async function GET() {
  if (!PROPERTY_ID || !SERVICE_ACCOUNT_JSON) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "auth_failed" }, { status: 401 });
  }

  const dateRange = { startDate: "30daysAgo", endDate: "today" };

  const [overviewRes, sessionsOverTimeRes, topPagesRes, sourcesRes, devicesRes] =
    await Promise.all([
      // Overview metrics
      runReport(token, {
        dateRanges: [dateRange],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "conversions" },
          { name: "newUsers" },
          { name: "engagementRate" },
        ],
      }),
      // Sessions over time (last 30 days)
      runReport(token, {
        dateRanges: [dateRange],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      // Top pages
      runReport(token, {
        dateRanges: [dateRange],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      // Traffic sources
      runReport(token, {
        dateRanges: [dateRange],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
      // Device breakdown
      runReport(token, {
        dateRanges: [dateRange],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
      }),
    ]);

  // Parse overview
  const overviewRow = overviewRes?.rows?.[0]?.metricValues ?? [];
  const overview = {
    sessions:              Number(overviewRow[0]?.value ?? 0),
    users:                 Number(overviewRow[1]?.value ?? 0),
    pageViews:             Number(overviewRow[2]?.value ?? 0),
    bounceRate:            parseFloat((Number(overviewRow[3]?.value ?? 0) * 100).toFixed(1)),
    avgSessionDuration:    Math.round(Number(overviewRow[4]?.value ?? 0)),
    conversions:           Number(overviewRow[5]?.value ?? 0),
    newUsers:              Number(overviewRow[6]?.value ?? 0),
    engagementRate:        parseFloat((Number(overviewRow[7]?.value ?? 0) * 100).toFixed(1)),
  };

  // Parse sessions over time
  const sessionsOverTime = (sessionsOverTimeRes?.rows ?? []).map((r: { dimensionValues: {value:string}[]; metricValues: {value:string}[] }) => ({
    date: `${r.dimensionValues[0].value.slice(0,4)}-${r.dimensionValues[0].value.slice(4,6)}-${r.dimensionValues[0].value.slice(6,8)}`,
    sessions: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
  }));

  // Parse top pages
  const topPages = (topPagesRes?.rows ?? []).map((r: { dimensionValues: {value:string}[]; metricValues: {value:string}[] }) => ({
    path: r.dimensionValues[0].value,
    title: r.dimensionValues[1].value,
    views: Number(r.metricValues[0].value),
    avgDuration: Math.round(Number(r.metricValues[1].value)),
  }));

  // Parse sources
  const sources = (sourcesRes?.rows ?? []).map((r: { dimensionValues: {value:string}[]; metricValues: {value:string}[] }) => ({
    name: r.dimensionValues[0].value,
    value: Number(r.metricValues[0].value),
  }));

  // Parse devices
  const devices = (devicesRes?.rows ?? []).map((r: { dimensionValues: {value:string}[]; metricValues: {value:string}[] }) => ({
    name: r.dimensionValues[0].value,
    value: Number(r.metricValues[0].value),
  }));

  return NextResponse.json({ overview, sessionsOverTime, topPages, sources, devices });
}
