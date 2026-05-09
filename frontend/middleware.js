import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // only check these routes
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-login`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const isLoggedIn = response.ok;

    // root route
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(isLoggedIn ? "/dashboard" : "/auth/login", request.url),
      );
    }

    // protect dashboard
    if (
      protectedRoutes.some((route) => pathname.startsWith(route)) &&
      !isLoggedIn
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // prevent auth pages after login
    if (authRoutes.some((route) => pathname.startsWith(route)) && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
