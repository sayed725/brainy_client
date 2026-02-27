import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { userServices } from "./services/user.service";
import { Roles } from "./constants/roles";


export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let isAuthenticated = false;
  let isAdmin = false;
  let isTutor = false;


  const { data } = await userServices.getSession();

  if (data && data.user) {
    isAuthenticated = true;
    isAdmin = data.user.role === Roles.admin;
    isTutor = data.user.role === Roles.tutor;
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