import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, Users, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface WriterBookCardProps {
  title: string
  author: string
  authorAvatar: string
  cover: string
  rating: number
  price: number
  isFree?: boolean
  genre: string
  followers: number
  chapters: number
  completed: boolean
}

export default function WriterBookCard({
  title,
  author,
  authorAvatar,
  cover,
  rating,
  price,
  isFree = false,
  genre,
  followers,
  chapters,
  completed,
}: WriterBookCardProps) {
  return (
    <Card className="overflow-hidden border-gold/30 transition-all duration-200 hover:shadow-lg hover:shadow-gold/20">
      <div className="relative">
        <Image
          src={cover || "/placeholder.svg"}
          alt={title}
          width={180}
          height={280}
          className="h-[280px] w-full object-cover"
        />
        <Badge className="absolute left-2 top-2 bg-gold text-black">{genre}</Badge>
        {isFree && <Badge className="absolute right-2 top-2 bg-purple text-white">Free</Badge>}
        {completed && <Badge className="absolute right-2 top-2 bg-green-600 text-white">Completed</Badge>}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-gold">
          <Star className="h-3 w-3 fill-gold text-gold" />
          {rating}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-gold">{title}</h3>
        <div className="mt-2 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorAvatar || "/placeholder.svg"} alt={author} />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{author}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {followers.toLocaleString()} followers
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {chapters} chapters
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-gold text-black hover:bg-gold-dark">
          {isFree ? "Read Now" : `Buy for $${price.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
