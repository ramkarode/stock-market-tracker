import axios from "axios";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/auth/login", "/auth/register"];

  const needsAuthCheck =
    pathname === "/" ||
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    authRoutes.some((route) => pathname.startsWith(route));

  if (!needsAuthCheck) {
    return NextResponse.next();
  }

  try {
    // Get cookies from incoming request
    const cookie = request.headers.get("cookie");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-login`,
      {
        headers: {
          cookie: cookie || "",
        },
        withCredentials: true,
      }
    );

    console.log("Middleware auth check:", response.data);

    const isLoggedIn = response.status === 200;

    // Root route
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(isLoggedIn ? "/dashboard" : "/auth/login", request.url)
      );
    }

    // Protect dashboard routes
    if (
      protectedRoutes.some((route) => pathname.startsWith(route)) &&
      !isLoggedIn
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Prevent auth pages after login
    if (
      authRoutes.some((route) => pathname.startsWith(route)) &&
      isLoggedIn
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Middleware auth error:", error?.response?.data || error);

    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};