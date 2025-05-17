import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Download, BookOpen, Calendar, Users } from "lucide-react"

interface PublicBookCardProps {
  title: string
  author: string
  cover: string
  category: string
  year: number
  downloads: number
  formats: string[]
}

export default function PublicBookCard({
  title,
  author,
  cover,
  category,
  year,
  downloads,
  formats,
}: PublicBookCardProps) {
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
        <Badge className="absolute left-2 top-2 bg-gold text-black">{category}</Badge>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-gold">
          <Calendar className="h-3 w-3" />
          {year > 0 ? year : `${Math.abs(year)} BCE`}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-gold">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {downloads.toLocaleString()} downloads
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {formats.map((format) => (
            <Badge key={format} variant="outline" className="text-xs">
              {format}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" className="flex-1 border-gold text-gold hover:bg-gold/10">
          <BookOpen className="mr-1 h-4 w-4" />
          Preview
        </Button>
        <Button className="flex-1 bg-gold text-black hover:bg-gold-dark">
          <Download className="mr-1 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}
