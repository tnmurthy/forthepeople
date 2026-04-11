import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes("/admin") || req.nextUrl.pathname.includes("/api/admin")) {
    const allowed = process.env.ADMIN_ALLOWED_IPS?.split(",").map(s => s.trim()) || [];

    // If ADMIN_ALLOWED_IPS is empty or not set, skip IP check
    if (allowed.length > 0 && allowed[0] !== "") {
      const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
                       req.headers.get("x-real-ip") || "";
      if (!allowed.includes(clientIP)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/en/admin/:path*", "/kn/admin/:path*", "/api/admin/:path*"],
};
