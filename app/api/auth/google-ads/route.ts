import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLIENT_ID    = process.env.GOOGLE_ADS_CLIENT_ID!;
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/google-ads/callback`;

export async function GET() {
  if (!CLIENT_ID) {
    return NextResponse.json({ error: "GOOGLE_ADS_CLIENT_ID not set" }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: "code",
    scope:         "https://www.googleapis.com/auth/adwords",
    access_type:   "offline",
    prompt:        "consent",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
