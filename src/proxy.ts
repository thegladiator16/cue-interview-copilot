import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const hasSession = req.cookies.has("cue_session");

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
