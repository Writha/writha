import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simply allow all requests through
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
