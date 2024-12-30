import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await request.cookies.get("token");

  // Jika mengakses halaman selain /auth dan tidak ada token
  if (!pathname.startsWith("/auth") && !token) {
    return NextResponse.redirect(new URL("/auth/LoginScreen", request.url));
  }

  // Jika sudah login dan mencoba akses /auth
  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/(tabs)", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi path mana saja yang akan di-handle middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
