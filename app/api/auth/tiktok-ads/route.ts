import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_ID       = process.env.TIKTOK_APP_ID ?? "7633989708837552129";
const REDIRECT_URI = "https://www.rocereal.ro/";

export async function GET() {
  const params = new URLSearchParams({
    app_id:       APP_ID,
    redirect_uri: REDIRECT_URI,
    state:        "dashboard",
  });

  return NextResponse.redirect(
    `https://business-api.tiktok.com/portal/auth?${params.toString()}`
  );
}
