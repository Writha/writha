import { NextResponse } from "next/server"
import { createProfileForNewUser } from "@/lib/supabase/auth-helpers"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  // Handle error from OAuth provider
  if (error) {
    console.error("OAuth error:", error, error_description)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, process.env.NEXT_PUBLIC_SITE_URL || ""),
    )
  }

  if (code) {
    const supabase = getSupabaseServer()
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(
          new URL("/login?error=auth_callback_error", process.env.NEXT_PUBLIC_SITE_URL || ""),
        )
      }

      // If we have a user, ensure they have a profile
      if (data?.user) {
        try {
          await createProfileForNewUser(
            data.user.id,
            data.user.email || `user-${data.user.id}@example.com`,
            data.user.app_metadata?.provider || "email",
          )
        } catch (profileError) {
          console.error("Error creating profile:", profileError)
          // Continue anyway, as the user is authenticated
        }
      }
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(new URL("/login?error=unexpected_error", process.env.NEXT_PUBLIC_SITE_URL || ""))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_SITE_URL || ""))
}
