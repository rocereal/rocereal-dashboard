import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Keep alive",
    timestamp: new Date().toISOString(),
    status: "active",
  });
}

export async function POST() {
  return NextResponse.json({
    message: "Keep alive",
    timestamp: new Date().toISOString(),
    status: "active",
  });
}
