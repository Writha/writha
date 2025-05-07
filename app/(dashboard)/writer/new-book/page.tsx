import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"
import { BookUploadForm } from "@/components/books/book-upload-form"

export default async function NewBookPage() {
  const supabase = getSupabaseServer()

  // Check if user is authenticated and is a writer
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

  if (!profile || profile.user_type !== "writer") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Book</h2>
        <p className="text-muted-foreground">Share your story with readers around the world.</p>
      </div>

      <BookUploadForm />
    </div>
  )
}
