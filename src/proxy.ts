import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function proxy(request: NextRequest) {
  // 1. Initialize Supabase Client & Update Session
  const { supabase, response } = await updateSession(request)
  const url = request.nextUrl.clone()
  
  // 3. Handle Subdomain Routing
  const hostname = request.headers.get("host")
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  
  // -- LOCAL DEV FALLBACK --
  // If ?_dev_subdomain=test is present, use it as the subdomain override
  const devSubdomainOverride = url.searchParams.get("_dev_subdomain")
  
  console.log(`[Proxy] Request: ${hostname}${url.pathname}${url.search ? '?' + url.search : ''}`)

  // 2. Protect /admin routes inside the base domain
  if (!devSubdomainOverride && url.pathname.startsWith("/admin")) {
    if (!supabase) return response
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    
    // Check if user is a platform admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_platform_admin")
      .eq("id", user.id)
      .single()

    if (profile && !profile.is_platform_admin) {
      // return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Extract subdomain if hostname is not the root domain exactly
  let subdomain = devSubdomainOverride || null
  
  if (!subdomain && hostname && hostname !== rootDomain) {
    // Advanced extraction: handle lvh.me:3000, localhost:3000, etc.
    if (hostname.endsWith(`.${rootDomain}`)) {
      subdomain = hostname.replace(`.${rootDomain}`, "")
    } else {
      // Direct detection for localhost variants if domain is complex
      // e.g., if rootDomain is 'lvh.me:3000' and host is 'test.lvh.me:3000'
      const parts = hostname.split(".")
      if (parts.length > 2 && rootDomain.includes(parts[parts.length-2])) {
         subdomain = parts[0]
      }
    }
  }

  // If we have a valid subdomain (not root, not www)
  if (subdomain && subdomain !== "www") {
    console.log(`[Proxy] Detected subdomain: ${subdomain} (via ${devSubdomainOverride ? 'URL' : 'Host'}) -> Rewriting to /${subdomain}${url.pathname}`)
    // Rewrite to the dynamic domain route
    try {
      // Strip out the internal dev param before rewrite if it exists
      if (devSubdomainOverride) {
        url.searchParams.delete("_dev_subdomain")
      }
      return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}${url.search ? '?' + url.search : ''}`, request.url))
    } catch (e) {
      console.error("[Proxy] Rewrite failed:", e)
      return response
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
