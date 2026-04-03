import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function proxy(request: NextRequest) {
  // 1. Update Supabase session (refreshes if expired)
  const response = await updateSession(request)

  // 2. Handle Subdomain Routing
  const url = request.nextUrl.clone()
  const hostname = request.headers.get("host")

  // Define your root domain (e.g., localhost:3000 or yoursaas.com)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

  // Extract subdomain if hostname is not the root domain exactly
  let subdomain = null
  if (hostname && hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)) {
    subdomain = hostname.replace(`.${rootDomain}`, "")
  }

  // If we have a valid subdomain (not root, not www)
  if (subdomain && subdomain !== "www") {
    // Rewrite to the dynamic domain route
    try {
      return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url))
    } catch (e) {
      console.error("Rewrite failed:", e)
      return response
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
