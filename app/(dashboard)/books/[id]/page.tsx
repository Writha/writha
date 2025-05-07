import { notFound } from "next/navigation"
import Image from "next/image"
import { getSupabaseServer } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Heart, ShoppingCart, Download, Star, User, Calendar } from "lucide-react"
import { BookComments } from "@/components/books/book-comments"
import { BookRecommendations } from "@/components/books/book-recommendations"

interface BookPageProps {
  params: {
    id: string
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const supabase = getSupabaseServer()

  // Get book details
  const { data: book, error } = await supabase
    .from("writer_stories")
    .select(`
      *,
      profiles:writer_id (
        username,
        avatar_url
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !book) {
    notFound()
  }

  // Get first chapter
  const { data: chapter } = await supabase
    .from("story_chapters")
    .select("*")
    .eq("story_id", params.id)
    .order("chapter_number", { ascending: true })
    .limit(1)
    .single()

  // Get ratings
  const { data: ratings } = await supabase.from("ratings").select("rating").eq("writer_story_id", params.id)

  const averageRating =
    ratings && ratings.length > 0 ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length : 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg mb-4">
              <Image
                src={book.cover_url || "/placeholder.svg?height=600&width=400"}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col space-y-4">
              {book.is_free ? (
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Get for Free
                </Button>
              ) : (
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy for ${book.price?.toFixed(2)}
                </Button>
              )}

              <Button variant="default" className="w-full" asChild>
                <a href={`/books/${params.id}/read`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Book
                </a>
              </Button>

              <Button variant="outline" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Read Sample
              </Button>

              <Button variant="ghost" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
              <span>{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">({ratings?.length || 0} ratings)</span>
            </div>

            <div className="flex items-center mr-4">
              <User className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{book.profiles.username}</span>
            </div>

            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{formatDate(book.created_at)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <div className="bg-muted text-xs px-2 py-1 rounded">{book.genre || "Fiction"}</div>
            <div className="bg-muted text-xs px-2 py-1 rounded">{book.is_completed ? "Completed" : "Ongoing"}</div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="sample">Sample</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <div className="prose max-w-none">
                <p>{book.description || "No description available."}</p>
              </div>
            </TabsContent>

            <TabsContent value="sample">
              {chapter ? (
                <div className="prose max-w-none">
                  <h2>{chapter.title}</h2>
                  <div className="whitespace-pre-wrap">{chapter.content.substring(0, 1000)}...</div>
                  <Button className="mt-4">Continue Reading</Button>
                </div>
              ) : (
                <div>No sample available.</div>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <BookComments bookId={params.id} isWriterStory={true} />
            </TabsContent>
          </Tabs>

          {/* Add recommendations at the bottom of the page */}
          <div className="mt-12">
            <BookRecommendations userId={"session.user.id"} currentBookId={params.id} genre={book.genre || undefined} />
          </div>
        </div>
      </div>
    </div>
  )
}
