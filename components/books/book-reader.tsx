"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Bookmark,
  X,
  Maximize,
  Minimize,
  Moon,
  Sun,
  Minus,
  Plus,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface BookReaderProps {
  bookId: string
  initialChapter?: number
  isWriterStory?: boolean
}

interface Chapter {
  id: string
  title: string
  content: string
  chapter_number: number
}

export function BookReader({ bookId, initialChapter = 1, isWriterStory = true }: BookReaderProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState<number>(initialChapter)
  const [isLoading, setIsLoading] = useState(true)
  const [bookTitle, setBookTitle] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light")
  const [fontFamily, setFontFamily] = useState<"serif" | "sans-serif" | "monospace">("serif")
  const readerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    fetchBookData()
  }, [bookId])

  const fetchBookData = async () => {
    setIsLoading(true)
    try {
      // Get book details
      const { data: book, error: bookError } = await supabase
        .from(isWriterStory ? "writer_stories" : "books")
        .select("title")
        .eq("id", bookId)
        .single()

      if (bookError) throw bookError
      setBookTitle(book.title)

      // Get chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("story_chapters")
        .select("*")
        .eq("story_id", bookId)
        .order("chapter_number", { ascending: true })

      if (chaptersError) throw chaptersError
      setChapters(chaptersData || [])

      // Record reading progress
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // You could save reading progress here
      }
    } catch (error) {
      console.error("Error fetching book data:", error)
      toast({
        title: "Error",
        description: "Failed to load book content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1)
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }

  const handleNextChapter = () => {
    if (currentChapter < chapters.length) {
      setCurrentChapter(currentChapter + 1)
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        })
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const currentChapterData = chapters.find((chapter) => chapter.chapter_number === currentChapter)

  const getThemeClass = () => {
    switch (theme) {
      case "light":
        return "bg-white text-gray-900"
      case "sepia":
        return "bg-[#f8f2e4] text-[#5f4b32]"
      case "dark":
        return "bg-gray-900 text-gray-100"
      default:
        return "bg-white text-gray-900"
    }
  }

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case "serif":
        return "font-serif"
      case "sans-serif":
        return "font-sans"
      case "monospace":
        return "font-mono"
      default:
        return "font-serif"
    }
  }

  return (
    <div
      ref={readerRef}
      className={`flex flex-col h-[calc(100vh-4rem)] ${getThemeClass()} transition-colors duration-200`}
    >
      {/* Reader Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <X className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h2 className="text-sm font-medium truncate max-w-[200px] md:max-w-[400px]">{bookTitle}</h2>
          <p className="text-xs text-muted-foreground">
            Chapter {currentChapter}: {currentChapterData?.title || ""}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Reading Settings</DrawerTitle>
                  <DrawerDescription>Customize your reading experience</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <Tabs defaultValue="display">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="display">Display</TabsTrigger>
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    <TabsContent value="display" className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Theme</h4>
                        <div className="flex space-x-2">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setTheme("light")}
                          >
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                          </Button>
                          <Button
                            variant={theme === "sepia" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setTheme("sepia")}
                          >
                            <Sun className="mr-2 h-4 w-4" />
                            Sepia
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setTheme("dark")}
                          >
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="text" className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Font Size</h4>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center">{fontSize}px</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Line Height</h4>
                        <Slider
                          value={[lineHeight * 10]}
                          min={10}
                          max={25}
                          step={1}
                          onValueChange={(value) => setLineHeight(value[0] / 10)}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs">1.0</span>
                          <span className="text-xs">2.5</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Font Family</h4>
                        <div className="flex space-x-2">
                          <Button
                            variant={fontFamily === "serif" ? "default" : "outline"}
                            className="flex-1 font-serif"
                            onClick={() => setFontFamily("serif")}
                          >
                            Serif
                          </Button>
                          <Button
                            variant={fontFamily === "sans-serif" ? "default" : "outline"}
                            className="flex-1 font-sans"
                            onClick={() => setFontFamily("sans-serif")}
                          >
                            Sans
                          </Button>
                          <Button
                            variant={fontFamily === "monospace" ? "default" : "outline"}
                            className="flex-1 font-mono"
                            onClick={() => setFontFamily("monospace")}
                          >
                            Mono
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="advanced" className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Reading Progress</h4>
                        <p className="text-sm text-muted-foreground">
                          Chapter {currentChapter} of {chapters.length}
                        </p>
                        <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${(currentChapter / chapters.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>Apply Settings</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">Chapters</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {chapters.map((chapter) => (
                    <Button
                      key={chapter.id}
                      variant={chapter.chapter_number === currentChapter ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setCurrentChapter(chapter.chapter_number)
                        if (contentRef.current) {
                          contentRef.current.scrollTop = 0
                        }
                      }}
                    >
                      <span className="mr-2">{chapter.chapter_number}.</span>
                      <span className="truncate">{chapter.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Reader Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : currentChapterData ? (
          <div
            className={`max-w-prose mx-auto ${getFontFamilyClass()}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          >
            <h1 className="text-2xl font-bold mb-6">{currentChapterData.title}</h1>
            <div className="whitespace-pre-wrap">{currentChapterData.content}</div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p>No content available for this chapter.</p>
          </div>
        )}
      </div>

      {/* Reader Footer */}
      <div className="flex items-center justify-between p-4 border-t">
        <Button variant="outline" onClick={handlePreviousChapter} disabled={currentChapter <= 1}>
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>
        <div className="text-sm">
          {currentChapter} / {chapters.length}
        </div>
        <Button variant="outline" onClick={handleNextChapter} disabled={currentChapter >= chapters.length}>
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
