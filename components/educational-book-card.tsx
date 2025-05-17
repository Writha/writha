import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, GraduationCap } from "lucide-react"

interface EducationalBookCardProps {
  title: string
  author: string
  institution: string
  cover: string
  rating: number
  price: number
  rentPrice: number
  level: string
  subject: string
}

export default function EducationalBookCard({
  title,
  author,
  institution,
  cover,
  rating,
  price,
  rentPrice,
  level,
  subject,
}: EducationalBookCardProps) {
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
        <Badge className="absolute left-2 top-2 bg-purple text-white">{subject}</Badge>
        <Badge className="absolute right-2 top-2 bg-gold text-black">{level}</Badge>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-gold">
          <Star className="h-3 w-3 fill-gold text-gold" />
          {rating}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-gold">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <GraduationCap className="h-3 w-3" />
          {institution}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <Button className="w-full bg-gold text-black hover:bg-gold-dark">Buy for ${price.toFixed(2)}</Button>
        <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold/10">
          Rent for ${rentPrice.toFixed(2)}
        </Button>
      </CardFooter>
    </Card>
  )
}
