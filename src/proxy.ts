import { NextResponse, type NextRequest } from "next/server";

/**
 * Canonical URLs. The English home page moved from /en/ to /, so the old address
 * redirects there instead of serving the same page twice; every other path drops
 * its trailing slash.
 */
export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname } = url;

  let canonical = pathname;
  if (pathname === "/en" || pathname === "/en/") canonical = "/";
  else if (pathname !== "/") canonical = pathname.replace(/\/+$/, "") || "/";

  if (canonical === pathname) return NextResponse.next();
  url.pathname = canonical;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/|brand/|videos/|.*\\.[\\w]+$).*)"],
};
