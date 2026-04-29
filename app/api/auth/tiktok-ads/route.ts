import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_ID      = process.env.TIKTOK_APP_ID!;
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/tiktok-ads/callback`;

export async function GET() {
  if (!APP_ID) {
    return NextResponse.json({ error: "TIKTOK_APP_ID not set" }, { status: 500 });
  }

  const params = new URLSearchParams({
    app_id:       APP_ID,
    redirect_uri: REDIRECT_URI,
    state:        "dashboard",
  });

  return NextResponse.redirect(
    `https://ads.tiktok.com/marketing_api/auth?${params.toString()}`
  );
}
