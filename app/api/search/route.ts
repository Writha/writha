import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "all" // all, books, writers
  const genre = searchParams.get("genre") || undefined

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const supabase = getSupabaseServer()

  try {
    let results: any[] = []

    // Search in writer_stories
    if (type === "all" || type === "books") {
      let storyQuery = supabase
        .from("writer_stories")
        .select(`
          id,
          title,
          description,
          cover_url,
          genre,
          is_free,
          price,
          profiles:writer_id (username)
        `)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(20)

      if (genre) {
        storyQuery = storyQuery.eq("genre", genre)
      }

      const { data: stories, error: storiesError } = await storyQuery

      if (storiesError) throw storiesError

      if (stories) {
        results = [
          ...results,
          ...stories.map((story) => ({
            ...story,
            type: "book",
            author: story.profiles.username,
          })),
        ]
      }
    }

    // Search for writers
    if (type === "all" || type === "writers") {
      const { data: writers, error: writersError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, user_type")
        .eq("user_type", "writer")
        .ilike("username", `%${query}%`)
        .limit(10)

      if (writersError) throw writersError

      if (writers) {
        results = [
          ...results,
          ...writers.map((writer) => ({
            ...writer,
            type: "writer",
          })),
        ]
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
