"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, ThumbsUp, ThumbsDown } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { generateText } from "ai"
import { getGroqModel } from "@/lib/groq/client"

interface Book {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  genre: string | null
}

interface BookRecommendationsProps {
  userId: string
  currentBookId?: string
  genre?: string
}

export function BookRecommendations({ userId, currentBookId, genre }: BookRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    fetchRecommendations()
  }, [userId, currentBookId, genre])

  const fetchRecommendations = async () => {
    setIsLoading(true)
    try {
      // First, get user's reading history
      const { data: userLibrary } = await supabase
        .from("user_library")
        .select("writer_story_id")
        .eq("user_id", userId)
        .not("writer_story_id", "is", null)

      const readBookIds = userLibrary?.map((item) => item.writer_story_id) || []

      // Get user's ratings
      const { data: userRatings } = await supabase
        .from("ratings")
        .select("writer_story_id, rating")
        .eq("user_id", userId)
        .not("writer_story_id", "is", null)

      // Get some books to recommend
      let query = supabase.from("writer_stories").select("id, title, description, cover_url, genre").limit(10)

      // Exclude current book if provided
      if (currentBookId) {
        query = query.neq("id", currentBookId)
      }

      // Filter by genre if provided
      if (genre) {
        query = query.eq("genre", genre)
      }

      // Exclude books the user has already read
      if (readBookIds.length > 0) {
        query = query.not("id", "in", `(${readBookIds.join(",")})`)
      }

      const { data: books } = await query

      if (!books || books.length === 0) {
        setRecommendations([])
        setIsLoading(false)
        return
      }

      // If we have user ratings, use Groq to personalize recommendations
      if (userRatings && userRatings.length > 0) {
        try {
          const userPreferences = userRatings.map((rating) => ({
            bookId: rating.writer_story_id,
            rating: rating.rating,
          }))

          const model = getGroqModel()
          const { text: recommendationResponse } = await generateText({
            model,
            prompt: `
              I need book recommendations based on user preferences.
              
              User's rated books:
              ${JSON.stringify(userPreferences)}
              
              Available books to recommend:
              ${JSON.stringify(
                books.map((book) => ({
                  id: book.id,
                  title: book.title,
                  genre: book.genre,
                  description: book.description,
                })),
              )}
              
              Please analyze the user's preferences and return a JSON array of book IDs from the available books, 
              ordered by how well they match the user's taste. Return only the IDs in a JSON array, nothing else.
            `,
          })

          try {
            const recommendedIds = JSON.parse(recommendationResponse)
            if (Array.isArray(recommendedIds) && recommendedIds.length > 0) {
              // Reorder books based on AI recommendations
              const orderedBooks = recommendedIds
                .map((id) => books.find((book) => book.id === id))
                .filter(Boolean) as Book[]

              // Add any remaining books not in the AI recommendations
              const remainingBooks = books.filter((book) => !recommendedIds.includes(book.id))

              setRecommendations([...orderedBooks, ...remainingBooks].slice(0, 4))
              setIsLoading(false)
              return
            }
          } catch (parseError) {
            console.error("Error parsing AI recommendations:", parseError)
          }
        } catch (aiError) {
          console.error("Error getting AI recommendations:", aiError)
        }
      }

      // Fallback: just use the books we got from the database
      setRecommendations(books.slice(0, 4))
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (bookId: string, isPositive: boolean) => {
    // Record the feedback
    setFeedbackGiven((prev) => ({ ...prev, [bookId]: true }))

    try {
      // In a real app, you would store this feedback to improve recommendations
      await supabase.from("recommendation_feedback").insert({
        user_id: userId,
        book_id: bookId,
        is_positive: isPositive,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving feedback:", error)
    }
  }

  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-[150px] w-full rounded-md" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-[200px] w-full">
                <Image
                  src={book.cover_url || "/placeholder.svg?height=280&width=180"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium line-clamp-1">{book.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {book.description || "No description available."}
                </p>
                <div className="flex mt-3 justify-between">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/books/${book.id}`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
                {!feedbackGiven[book.id] && (
                  <div className="flex justify-center mt-2 space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleFeedback(book.id, true)}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFeedback(book.id, false)}>
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
