"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Search, BookOpenCheck } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PublicAccessBooks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Mock data for public access books
  const publicBooks = [
    {
      id: 1,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Classic",
      year: 1813,
      downloads: 25000,
      format: ["PDF", "EPUB", "MOBI"],
    },
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Classic",
      year: 1925,
      downloads: 18000,
      format: ["PDF", "EPUB"],
    },
    {
      id: 3,
      title: "Frankenstein",
      author: "Mary Shelley",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Gothic",
      year: 1818,
      downloads: 15000,
      format: ["PDF", "EPUB", "MOBI"],
    },
    {
      id: 4,
      title: "The Art of War",
      author: "Sun Tzu",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Philosophy",
      year: -500,
      downloads: 30000,
      format: ["PDF", "EPUB"],
    },
    {
      id: 5,
      title: "Dracula",
      author: "Bram Stoker",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Gothic",
      year: 1897,
      downloads: 12000,
      format: ["PDF", "EPUB"],
    },
    {
      id: 6,
      title: "The Republic",
      author: "Plato",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Philosophy",
      year: -380,
      downloads: 22000,
      format: ["PDF"],
    },
    {
      id: 7,
      title: "Moby Dick",
      author: "Herman Melville",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Adventure",
      year: 1851,
      downloads: 14000,
      format: ["PDF", "EPUB", "MOBI"],
    },
    {
      id: 8,
      title: "The Odyssey",
      author: "Homer",
      cover: "/placeholder.svg?height=280&width=180",
      category: "Epic",
      year: -800,
      downloads: 28000,
      format: ["PDF", "EPUB"],
    },
  ]

  const categories = ["All", "Classic", "Gothic", "Philosophy", "Adventure", "Epic"]

  const filteredBooks = publicBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold gold-text mb-1">Public Domain Books</h2>
          <p className="text-muted-foreground">Free access to classic literature and educational resources</p>
        </div>
      </div>

      <div className="bg-writha-black p-4 rounded-lg border border-writha-gold mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or author..."
              className="pl-8 bg-background/5 border-writha-gold/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0 w-full md:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background/5 border-writha-gold/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg border-writha-gold/30 bg-background/50"
          >
            <div className="relative">
              <Image
                src={book.cover || "/placeholder.svg"}
                alt={book.title}
                width={180}
                height={280}
                className="w-full h-[280px] object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-writha-gold text-black">{book.category}</Badge>
              <Badge
                variant="outline"
                className="absolute bottom-2 right-2 bg-black/70 border-writha-gold text-writha-gold"
              >
                <BookOpenCheck className="h-3 w-3 mr-1" />
                Public Domain
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1 gold-text">{book.title}</h3>
              <p className="text-muted-foreground text-sm">{book.author}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Year: {book.year}</span>
                <span className="text-xs text-muted-foreground">{book.downloads.toLocaleString()} downloads</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="flex gap-1">
                {book.format.map((fmt) => (
                  <Badge key={fmt} variant="outline" className="text-xs border-writha-purple text-writha-purple">
                    {fmt}
                  </Badge>
                ))}
              </div>
              <Button size="sm" className="gold-button">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your search criteria.</p>
        </div>
      )}

      {filteredBooks.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-writha-gold text-writha-gold hover:bg-writha-gold/10">
            Load More Books
          </Button>
        </div>
      )}
    </div>
  )
}
