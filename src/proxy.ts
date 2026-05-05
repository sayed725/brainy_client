import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { Roles } from "./constants/roles";


export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let isAuthenticated = false;
  let isAdmin = false;
  let isTutor = false;


  const authUrl = process.env.AUTH_URL;
  let sessionUser = null;

  if (authUrl) {
    try {
      const res = await fetch(`${authUrl}/get-session`, {
        method: "GET",
        headers: {
          Cookie: request.cookies.getAll().map((c) => `${c.name}=${c.value}`).join("; "),
          Accept: "application/json",
        },
        cache: "no-store",
      });
      if (res.ok) {
        const sessionData = await res.json();
        sessionUser = sessionData?.user;
      }
    } catch (err) {
      console.error("Failed to fetch session in proxy:", err);
    }
  }

  if (sessionUser) {
    isAuthenticated = true;
    isAdmin = sessionUser.role === Roles.admin;
    isTutor = sessionUser.role === Roles.tutor;
  }

  //* User in not authenticated 
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //* User is authenticated and role = ADMIN
  //* Admin can not visit user dashboard
  if (isAdmin && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  if (isAdmin && pathname.startsWith("/tutor-dashboard")) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }




  //* User is authenticated and role = TUTOR
  //* Tutor can not visit user dashboard
  if (isTutor && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
  }

  //* User is authenticated and role = USER
  //* User can not visit admin-dashboard
  if (!isAdmin && pathname.startsWith("/admin-dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin-dashboard",
    "/tutor-dashboard",
    "/admin-dashboard/:path*",
    "/tutor-dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
};