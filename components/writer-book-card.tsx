"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Download, BookOpen, Users, CheckCircle } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface WriterBookCardProps {
  book: {
    id: number
    title: string
    author: string
    authorAvatar: string
    cover: string
    rating: number
    price: number
    isFree: boolean
    genre: string
    followers: number
    chapters: number
    completed: boolean
  }
}

export default function WriterBookCard({ book }: WriterBookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M"
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K"
    }
    return count.toString()
  }

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
        {book.completed && (
          <Badge variant="outline" className="absolute bottom-2 right-2 bg-white/80">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
        <div className="flex items-center mt-2">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={book.authorAvatar || "/placeholder.svg"} alt={book.author} />
            <AvatarFallback>{book.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{book.author}</span>
          <Button
            variant="ghost"
            size="sm"
            className={`ml-auto text-xs py-0 h-6 ${isFollowing ? "text-[#5c3d53]" : ""}`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1">{book.rating}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{formatFollowers(book.followers)}</span>
          </div>
          <div className="text-muted-foreground">{book.chapters} chapters</div>
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
            Read
          </Button>
          {book.isFree ? (
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" />
              Get
            </Button>
          ) : (
            <Button size="sm">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Buy
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
