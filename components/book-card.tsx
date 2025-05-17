import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"

interface BookCardProps {
  title: string
  author: string
  cover: string
  rating: number
  price: number
  isFree?: boolean
  genre: string
}

export default function BookCard({ title, author, cover, rating, price, isFree = false, genre }: BookCardProps) {
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
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-gold">
          <Star className="h-3 w-3 fill-gold text-gold" />
          {rating}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-gold">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-gold text-black hover:bg-gold-dark">
          {isFree ? "Read Now" : `Buy for $${price.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
