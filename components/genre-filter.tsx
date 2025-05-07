"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GenreFilterProps {
  genres: string[]
  selectedGenre: string
  onSelectGenre: (genre: string) => void
}

export default function GenreFilter({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) {
  return (
    <div className="w-full md:w-auto">
      <Select value={selectedGenre} onValueChange={onSelectGenre}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Genre" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
