"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Download, BookOpen } from "lucide-react"
import Image from "next/image"

interface BookCardProps {
  book: {
    id: number
    title: string
    author: string
    cover: string
    rating: number
    price: number
    isFree: boolean
    genre: string
  }
}

export default function BookCard({ book }: BookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <Image
          src={book.cover || "/placeholder.svg"}
          alt={book.title}
          width={180}
          height={280}
          className="w-full h-[280px] object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
        </Button>
        <Badge className="absolute top-2 left-2">{book.genre}</Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
        <p className="text-muted-foreground text-sm">{book.author}</p>
        <div className="flex items-center mt-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-sm">{book.rating}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <div>
          {book.isFree ? (
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              Free
            </Badge>
          ) : (
            <span className="font-medium">${book.price.toFixed(2)}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <BookOpen className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm">
            {book.isFree ? (
              <>
                <Download className="h-4 w-4 mr-1" />
                Get
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
