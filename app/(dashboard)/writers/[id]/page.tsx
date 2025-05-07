import { notFound } from "next/navigation"
import Image from "next/image"
import { getSupabaseServer } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, User, Calendar, BookMarked } from "lucide-react"

interface WriterProfilePageProps {
  params: {
    id: string
  }
}

export default async function WriterProfilePage({ params }: WriterProfilePageProps) {
  const supabase = getSupabaseServer()

  // Get writer profile
  const { data: writer, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .eq("user_type", "writer")
    .single()

  if (error || !writer) {
    notFound()
  }

  // Get writer's books
  const { data: books } = await supabase
    .from("writer_stories")
    .select("*")
    .eq("writer_id", params.id)
    .order("created_at", { ascending: false })

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={writer.avatar_url || "/placeholder.svg?height=96&width=96"} />
                    <AvatarFallback>{writer.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-xl font-bold mb-1">{writer.username}</h1>
                  <p className="text-muted-foreground text-sm capitalize mb-4">{writer.user_type}</p>

                  <div className="w-full flex flex-col space-y-4 mt-4">
                    <Button className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Follow Writer
                    </Button>

                    <Button variant="outline" className="w-full">
                      <BookMarked className="mr-2 h-4 w-4" />
                      View All Books
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">About {writer.username}</h2>
            <p className="text-muted-foreground">
              {writer.bio || `${writer.username} is a writer on Writha. They haven't added a bio yet.`}
            </p>

            <div className="flex items-center mt-4 text-sm text-muted-foreground">
              <div className="flex items-center mr-4">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{books?.length || 0} Books</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {formatDate(writer.created_at)}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="books">
            <TabsList className="mb-4">
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="books">
              {books && books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.map((book) => (
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
                          <h3 className="font-medium line-clamp-1">{book.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {book.description || "No description available."}
                          </p>
                          <div className="flex mt-3">
                            <Button variant="default" size="sm" className="w-full" asChild>
                              <a href={`/books/${book.id}`}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                View Book
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">This writer hasn't published any books yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Biography</h3>
                  <p className="text-muted-foreground mb-6">
                    {writer.bio || `${writer.username} hasn't added a bio yet.`}
                  </p>

                  <h3 className="font-medium mb-2">Member Since</h3>
                  <p className="text-muted-foreground mb-6">{formatDate(writer.created_at)}</p>

                  <h3 className="font-medium mb-2">Books Published</h3>
                  <p className="text-muted-foreground">{books?.length || 0} books</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
