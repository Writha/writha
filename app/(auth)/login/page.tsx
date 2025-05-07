import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { getSupabaseServer } from "@/lib/supabase/server"

export default async function LoginPage() {
  const supabase = getSupabaseServer()

  // Check if user is already authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthForm />
      </div>
    </div>
  )
}
