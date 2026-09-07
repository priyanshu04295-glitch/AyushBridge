import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/student",
    "/industry",
    "/faculty",
    "/institution",
    "/admin",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ayushbridge_token")?.value;
  const role = request.cookies.get("ayushbridge_role")?.value;

  if (!token || !role) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const roleRoutes: Record<string, string> = {
    student: "/student/dashboard",
    industry: "/industry",
    faculty: "/faculty",
    institution: "/institution/dashboard",
    admin: "/admin",
  };

  const allowedRoute = roleRoutes[role];

  if (!allowedRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const routeRole = pathname.split("/")[1];

  if (routeRole !== role) {
    return NextResponse.redirect(
      new URL(allowedRoute, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/industry/:path*",
    "/faculty/:path*",
    "/institution/:path*",
    "/admin/:path*",
  ],
};