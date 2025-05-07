"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, PenTool, TrendingUp, Sparkles } from "lucide-react"
import WriterBookCard from "./writer-book-card"
import GenreFilter from "./genre-filter"

export default function WritersMarketplaceSection() {
  const [selectedGenre, setSelectedGenre] = useState("All")

  // Mock data for demonstration
  const trendingStories = [
    {
      id: 1,
      title: "Whispers of the Forgotten",
      author: "Elena Blackwood",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.7,
      price: 2.99,
      isFree: false,
      genre: "Fantasy",
      followers: 12500,
      chapters: 24,
      completed: false,
    },
    {
      id: 2,
      title: "Midnight Chronicles",
      author: "Marcus Reed",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.5,
      price: 0,
      isFree: true,
      genre: "Mystery",
      followers: 8700,
      chapters: 18,
      completed: false,
    },
    {
      id: 3,
      title: "Starlight Odyssey",
      author: "Sophia Chen",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.8,
      price: 3.99,
      isFree: false,
      genre: "Sci-Fi",
      followers: 15200,
      chapters: 32,
      completed: true,
    },
    {
      id: 4,
      title: "Hearts Entwined",
      author: "Olivia Parker",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.6,
      price: 0,
      isFree: true,
      genre: "Romance",
      followers: 9800,
      chapters: 15,
      completed: false,
    },
  ]

  const newReleases = [
    {
      id: 5,
      title: "Shadows of Destiny",
      author: "Alexander Knight",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.3,
      price: 1.99,
      isFree: false,
      genre: "Thriller",
      followers: 5600,
      chapters: 8,
      completed: false,
    },
    {
      id: 6,
      title: "Echoes of Time",
      author: "Isabella Martinez",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.4,
      price: 0,
      isFree: true,
      genre: "Historical Fiction",
      followers: 4200,
      chapters: 6,
      completed: false,
    },
    {
      id: 7,
      title: "Realm of Dragons",
      author: "Lucas Thompson",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.2,
      price: 2.49,
      isFree: false,
      genre: "Fantasy",
      followers: 3800,
      chapters: 10,
      completed: false,
    },
    {
      id: 8,
      title: "City of Secrets",
      author: "Emma Wilson",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.1,
      price: 0,
      isFree: true,
      genre: "Mystery",
      followers: 2900,
      chapters: 5,
      completed: false,
    },
  ]

  const completedStories = [
    {
      id: 9,
      title: "The Last Guardian",
      author: "Daniel Brooks",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.9,
      price: 4.99,
      isFree: false,
      genre: "Fantasy",
      followers: 18700,
      chapters: 45,
      completed: true,
    },
    {
      id: 10,
      title: "Beyond the Stars",
      author: "Natalie Zhang",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.7,
      price: 3.49,
      isFree: false,
      genre: "Sci-Fi",
      followers: 14500,
      chapters: 36,
      completed: true,
    },
    {
      id: 11,
      title: "Whispers in the Dark",
      author: "James Anderson",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.8,
      price: 0,
      isFree: true,
      genre: "Horror",
      followers: 12800,
      chapters: 28,
      completed: true,
    },
    {
      id: 12,
      title: "Forever and Always",
      author: "Sarah Mitchell",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.6,
      price: 2.99,
      isFree: false,
      genre: "Romance",
      followers: 16200,
      chapters: 30,
      completed: true,
    },
  ]

  const genres = [
    "All",
    "Fantasy",
    "Sci-Fi",
    "Mystery",
    "Romance",
    "Thriller",
    "Horror",
    "Historical Fiction",
    "Adventure",
    "Young Adult",
  ]

  const filterBooksByGenre = (books: any[]) => {
    if (selectedGenre === "All") return books
    return books.filter((book) => book.genre === selectedGenre)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#5c3d53] mb-1">Writers Marketplace</h2>
          <p className="text-muted-foreground">Discover original stories from independent authors</p>
        </div>
        <GenreFilter genres={genres} selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />
      </div>

      <div className="bg-gradient-to-r from-[#f0e6ff] to-[#e6f0ff] p-4 rounded-lg mb-6 flex items-center">
        <PenTool className="h-5 w-5 text-[#5c3d53] mr-2" />
        <p className="text-sm">Are you a writer? Share your stories with millions of readers!</p>
        <Button variant="link" className="ml-auto text-[#5c3d53]">
          Start Writing
        </Button>
      </div>

      <Tabs defaultValue="trending">
        <TabsList className="mb-6">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            New Stories
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooksByGenre(trendingStories).map((book) => (
              <WriterBookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooksByGenre(trendingStories).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No stories found in this genre. Try another category.</p>
            </div>
          )}

          {filterBooksByGenre(trendingStories).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooksByGenre(newReleases).map((book) => (
              <WriterBookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooksByGenre(newReleases).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No stories found in this genre. Try another category.</p>
            </div>
          )}

          {filterBooksByGenre(newReleases).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooksByGenre(completedStories).map((book) => (
              <WriterBookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooksByGenre(completedStories).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No stories found in this genre. Try another category.</p>
            </div>
          )}

          {filterBooksByGenre(completedStories).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
