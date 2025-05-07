"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Award } from "lucide-react"
import BookCard from "./book-card"
import GenreFilter from "./genre-filter"

export default function PopularBooksSection() {
  const [selectedGenre, setSelectedGenre] = useState("All")

  // Mock data for demonstration
  const trendingBooks = [
    {
      id: 1,
      title: "The Silent Echo",
      author: "Maya Johnson",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.7,
      price: 12.99,
      isFree: false,
      genre: "Mystery",
    },
    {
      id: 2,
      title: "Beyond the Horizon",
      author: "James Carter",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.5,
      price: 0,
      isFree: true,
      genre: "Sci-Fi",
    },
    {
      id: 3,
      title: "Whispers in the Dark",
      author: "Elena Blackwood",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.8,
      price: 14.99,
      isFree: false,
      genre: "Thriller",
    },
    {
      id: 4,
      title: "The Last Summer",
      author: "Thomas Wright",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.3,
      price: 9.99,
      isFree: false,
      genre: "Romance",
    },
  ]

  const bestSellers = [
    {
      id: 5,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.9,
      price: 15.99,
      isFree: false,
      genre: "Fiction",
    },
    {
      id: 6,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.8,
      price: 13.99,
      isFree: false,
      genre: "Self-Help",
    },
    {
      id: 7,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.7,
      price: 11.99,
      isFree: false,
      genre: "Fiction",
    },
    {
      id: 8,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.6,
      price: 12.99,
      isFree: false,
      genre: "Finance",
    },
  ]

  const newReleases = [
    {
      id: 9,
      title: "The Starless Sea",
      author: "Erin Morgenstern",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.5,
      price: 16.99,
      isFree: false,
      genre: "Fantasy",
    },
    {
      id: 10,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.9,
      price: 14.99,
      isFree: false,
      genre: "Sci-Fi",
    },
    {
      id: 11,
      title: "The Four Winds",
      author: "Kristin Hannah",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.6,
      price: 13.99,
      isFree: false,
      genre: "Historical Fiction",
    },
    {
      id: 12,
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.7,
      price: 12.99,
      isFree: false,
      genre: "Fantasy",
    },
  ]

  const genres = [
    "All",
    "Fiction",
    "Mystery",
    "Sci-Fi",
    "Fantasy",
    "Romance",
    "Thriller",
    "Self-Help",
    "Historical Fiction",
    "Finance",
  ]

  const filterBooksByGenre = (books: any[]) => {
    if (selectedGenre === "All") return books
    return books.filter((book) => book.genre === selectedGenre)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-[#5c3d53] mb-4 md:mb-0">Discover Popular Books</h2>
        <GenreFilter genres={genres} selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />
      </div>

      <Tabs defaultValue="trending">
        <TabsList className="mb-6">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="bestsellers" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Bestsellers
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            New Releases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooksByGenre(trendingBooks).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooksByGenre(trendingBooks).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found in this genre. Try another category.</p>
            </div>
          )}

          {filterBooksByGenre(trendingBooks).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bestsellers" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooksByGenre(bestSellers).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooksByGenre(bestSellers).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found in this genre. Try another category.</p>
            </div>
          )}

          {filterBooksByGenre(bestSellers).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooksByGenre(newReleases).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooksByGenre(newReleases).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found in this genre. Try another category.</p>
            </div>
          )}

          {filterBooksByGenre(newReleases).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
