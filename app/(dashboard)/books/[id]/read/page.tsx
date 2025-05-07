import { notFound } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"
import { BookReader } from "@/components/books/book-reader"

interface ReadBookPageProps {
  params: {
    id: string
  }
  searchParams: {
    chapter?: string
  }
}

export default async function ReadBookPage({ params, searchParams }: ReadBookPageProps) {
  const supabase = getSupabaseServer()

  // Check if book exists
  const { data: book, error } = await supabase.from("writer_stories").select("id").eq("id", params.id).single()

  if (error || !book) {
    notFound()
  }

  const initialChapter = searchParams.chapter ? Number.parseInt(searchParams.chapter) : 1

  return <BookReader bookId={params.id} initialChapter={initialChapter} isWriterStory={true} />
}
