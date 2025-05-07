import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"

export default async function RootPage() {
  const supabase = getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
