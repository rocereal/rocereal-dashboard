import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password", "/api/auth"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) return NextResponse.next();

  // NextAuth v5 foloseste "authjs.session-token" (nu "next-auth.session-token")
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
