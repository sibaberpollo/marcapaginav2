import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Si es el subdominio transtextos y está en la raíz
  if (host.startsWith("transtextos.") && url.pathname === "/") {
    url.pathname = "/transtextos";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
