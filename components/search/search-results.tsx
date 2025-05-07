"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchResultsProps {
  query: string
  type?: string
  genre?: string
}

interface SearchResult {
  id: string
  title?: string
  description?: string
  cover_url?: string
  genre?: string
  is_free?: boolean
  price?: number
  type: "book" | "writer"
  author?: string
  username?: string
  avatar_url?: string
  user_type?: string
}

export function SearchResults({ query, type = "all", genre }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.append("q", query)
        if (type) params.append("type", type)
        if (genre) params.append("genre", genre)

        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, type, genre])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-[100px] w-[70px] rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found for "{query}"</p>
        <p className="text-sm text-muted-foreground mt-2">Try a different search term or filter</p>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Enter a search term to find books and writers</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden">
          <CardContent className="p-4">
            {result.type === "book" ? (
              <div className="flex gap-4">
                <div className="relative h-[100px] w-[70px] flex-shrink-0">
                  <Image
                    src={result.cover_url || "/placeholder.svg?height=150&width=100"}
                    alt={result.title || "Book cover"}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-1">{result.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">by {result.author}</p>
                  {result.genre && (
                    <div className="mt-1">
                      <span className="text-xs bg-muted px-2 py-1 rounded">{result.genre}</span>
                    </div>
                  )}
                  <p className="text-sm line-clamp-2 mt-2">{result.description || "No description available."}</p>
                  <div className="mt-3">
                    <Button size="sm" asChild>
                      <Link href={`/books/${result.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Book
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={result.avatar_url || "/placeholder.svg?height=48&width=48"} />
                  <AvatarFallback>{result.username?.charAt(0) || "W"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{result.username}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{result.user_type}</p>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/writers/${result.id}`}>
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
