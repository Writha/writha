"use client"

import { useRouter, usePathname } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const genres = [
  "All Genres",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Historical Fiction",
  "Literary Fiction",
  "Young Adult",
  "Children",
  "Biography",
  "Memoir",
  "Self-Help",
  "Business",
  "Other",
]

const formSchema = z.object({
  type: z.enum(["all", "books", "writers"]),
  genre: z.string().optional(),
})

interface SearchFiltersProps {
  currentType: string
  currentGenre: string
  query: string
}

export function SearchFilters({ currentType, currentGenre, query }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: (currentType as "all" | "books" | "writers") || "all",
      genre: currentGenre || "All Genres",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()

    if (query) params.set("q", query)
    if (values.type !== "all") params.set("type", values.type)
    if (values.genre && values.genre !== "All Genres") params.set("genre", values.genre)

    router.push(`${pathname}?${params.toString()}`)
  }

  function resetFilters() {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="all" />
                        </FormControl>
                        <FormLabel className="font-normal">All</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="books" />
                        </FormControl>
                        <FormLabel className="font-normal">Books</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="writers" />
                        </FormControl>
                        <FormLabel className="font-normal">Writers</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-2">
              <Button type="submit">Apply Filters</Button>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
