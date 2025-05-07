"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, BookOpen, ShieldCheck } from "lucide-react"
import Image from "next/image"

interface EducationalBookCardProps {
  book: {
    id: number
    title: string
    author: string
    institution: string
    cover: string
    rating: number
    price: number
    rentPrice: number
    level: string
    subject: string
    verified: boolean
  }
}

export default function EducationalBookCard({ book }: EducationalBookCardProps) {
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
        <Badge className="absolute top-2 left-2">{book.subject}</Badge>
        {book.verified && (
          <Badge variant="outline" className="absolute bottom-2 right-2 bg-white/80">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
        <p className="text-muted-foreground text-sm">{book.author}</p>
        <p className="text-muted-foreground text-xs">{book.institution}</p>
        <div className="flex items-center mt-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-sm">{book.rating}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {book.level}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex justify-between w-full mb-3">
          <div>
            <span className="font-medium">${book.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">Buy</span>
          </div>
          <div>
            <span className="font-medium">${book.rentPrice.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">Rent</span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button size="sm" variant="outline" className="flex-1">
            <BookOpen className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Buy
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
