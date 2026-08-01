import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin/* routes (except /admin/login)
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const cookie = request.cookies.get("admin_auth");
    if (!cookie || cookie.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect /admin/login to /admin if already logged in
  if (path === "/admin/login") {
    const cookie = request.cookies.get("admin_auth");
    if (cookie?.value === "true") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
