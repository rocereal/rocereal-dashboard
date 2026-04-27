import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLIENT_ID       = process.env.GOOGLE_ADS_CLIENT_ID!;
const CLIENT_SECRET   = process.env.GOOGLE_ADS_CLIENT_SECRET!;
const REFRESH_TOKEN   = process.env.GOOGLE_ADS_REFRESH_TOKEN!;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!;
const MANAGER_ID      = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID ?? "";
const CUSTOMER_ID     = process.env.GOOGLE_ADS_CUSTOMER_ID ?? "";

export async function GET() {
  const envCheck = {
    CLIENT_ID:       CLIENT_ID       ? `${CLIENT_ID.slice(0, 12)}…` : "MISSING",
    CLIENT_SECRET:   CLIENT_SECRET   ? `${CLIENT_SECRET.slice(0, 8)}…` : "MISSING",
    REFRESH_TOKEN:   REFRESH_TOKEN   ? `${REFRESH_TOKEN.slice(0, 8)}…` : "MISSING",
    DEVELOPER_TOKEN: DEVELOPER_TOKEN ? `${DEVELOPER_TOKEN.slice(0, 8)}…` : "MISSING",
    MANAGER_ID:      MANAGER_ID      || "NOT SET",
    CUSTOMER_ID:     CUSTOMER_ID     || "NOT SET",
  };

  if (!REFRESH_TOKEN) {
    return NextResponse.json({ envCheck, error: "REFRESH_TOKEN missing" });
  }

  // Step 1: get access token
  let accessToken: string;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type:    "refresh_token",
      }),
      cache: "no-store",
    });
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    if (!tokenData.access_token) {
      return NextResponse.json({ envCheck, tokenError: tokenData });
    }
    accessToken = tokenData.access_token;
  } catch (e) {
    return NextResponse.json({ envCheck, tokenError: String(e) });
  }

  // Step 2: list accessible customers
  const listRes = await fetch("https://googleads.googleapis.com/v24/customers:listAccessibleCustomers", {
    headers: {
      "Authorization":   `Bearer ${accessToken}`,
      "developer-token": DEVELOPER_TOKEN,
    },
    cache: "no-store",
  });
  const listData = await listRes.json();

  // Step 3: try the configured customer
  let customerTest: unknown = "skipped (CUSTOMER_ID not set)";
  if (CUSTOMER_ID) {
    const headers: Record<string, string> = {
      "Authorization":   `Bearer ${accessToken}`,
      "developer-token": DEVELOPER_TOKEN,
      "Content-Type":    "application/json",
    };
    headers["login-customer-id"] = MANAGER_ID || CUSTOMER_ID;

    const testRes = await fetch(
      `https://googleads.googleapis.com/v24/customers/${CUSTOMER_ID}/googleAds:search`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ query: "SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1" }),
        cache: "no-store",
      }
    );
    customerTest = await testRes.json();
  }

  return NextResponse.json({
    envCheck,
    accessibleCustomers: listData,
    customerTest,
  });
}
