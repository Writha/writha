"use client"

import { FormDescription } from "@/components/ui/form"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { useGroqAI } from "@/hooks/use-groq-ai"

const bookSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  genre: z.string().min(1, { message: "Please select a genre" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  isFree: z.boolean().default(false),
  content: z.string().min(100, { message: "Content must be at least 100 characters" }),
})

const genres = [
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

export function BookUploadForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { generateImprovement, isGenerating } = useGroqAI()

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      price: 0,
      isFree: false,
      content: "",
    },
  })

  const watchIsFree = form.watch("isFree")
  const watchContent = form.watch("content")

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImproveDescription = async () => {
    const description = form.getValues("description")
    if (!description || description.length < 10) {
      toast({
        title: "Description too short",
        description: "Please enter at least 10 characters to improve",
        variant: "destructive",
      })
      return
    }

    try {
      const improved = await generateImprovement(
        description,
        "Improve this book description to make it more engaging and professional. Keep the same length but enhance the language and appeal:",
      )

      if (improved) {
        form.setValue("description", improved)
      }
    } catch (error) {
      toast({
        title: "AI improvement failed",
        description: "Could not generate an improved description",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(values: z.infer<typeof bookSchema>) {
    setIsLoading(true)
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to upload a book")

      // Upload cover image if provided
      let coverUrl = null
      if (coverFile) {
        const fileExt = coverFile.name.split(".").pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("book-covers")
          .upload(fileName, coverFile)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("book-covers").getPublicUrl(fileName)

        coverUrl = publicUrl
      }

      // Get user profile to check if they're a writer
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError
      if (profileData.user_type !== "writer") {
        throw new Error("Only writers can upload books")
      }

      // Create the story
      const { data: storyData, error: storyError } = await supabase
        .from("writer_stories")
        .insert({
          title: values.title,
          description: values.description,
          cover_url: coverUrl,
          price: values.isFree ? 0 : values.price,
          is_free: values.isFree,
          genre: values.genre,
          is_completed: true, // Assuming a single upload is a complete story
          writer_id: user.id,
        })
        .select()

      if (storyError) throw storyError

      // Add the first chapter with the content
      const storyId = storyData[0].id
      const { error: chapterError } = await supabase.from("story_chapters").insert({
        story_id: storyId,
        title: "Chapter 1",
        content: values.content,
        chapter_number: 1,
      })

      if (chapterError) throw chapterError

      toast({
        title: "Book uploaded successfully",
        description: "Your book has been published on Writha",
      })

      router.push(`/books/${storyId}`)
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upload a New Book</CardTitle>
        <CardDescription>Share your story with readers around the world</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your book title" {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Free Book</FormLabel>
                        <FormDescription>Make your book available for free</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!watchIsFree && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div>
                  <FormLabel>Book Cover</FormLabel>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-32 h-48 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {coverPreview ? (
                        <img
                          src={coverPreview || "/placeholder.svg"}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm text-center p-2">No cover uploaded</span>
                      )}
                    </div>
                    <Input type="file" accept="image/*" onChange={handleCoverChange} className="max-w-xs" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Book Description</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleImproveDescription}
                          disabled={isGenerating}
                        >
                          {isGenerating ? "Improving..." : "Improve with AI"}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Write a compelling description of your book"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your book content here or write it directly"
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {watchContent ? `${watchContent.length} characters` : "0 characters"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="px-0 pt-6">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Publish Book"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
