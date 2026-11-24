import { NextResponse, type NextRequest } from "next/server";

/** Canonical URLs: /en/ keeps its trailing slash, every other path drops it. */
export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname } = url;

  let canonical = pathname;
  if (pathname === "/en") canonical = "/en/";
  else if (pathname !== "/" && pathname !== "/en/") {
    canonical = pathname.replace(/\/+$/, "") || "/";
  }

  if (canonical === pathname) return NextResponse.next();
  url.pathname = canonical;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/|brand/|.*\\.[\\w]+$).*)"],
};
