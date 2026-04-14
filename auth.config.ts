import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    // Credentials fără authorize — logica e în auth.ts (Node.js runtime)
    Credentials({}),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const publicRoutes = ["/login", "/register", "/forgot-password"];
      const isPublicRoute = publicRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isPublicRoute) {
        if (isLoggedIn && nextUrl.pathname === "/login") {
          return Response.redirect(new URL("/finance", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) return false;
      return true;
    },
  },
} satisfies NextAuthConfig;
