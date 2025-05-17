import BookCard from "@/components/book-card"
import PublicBookCard from "@/components/public-book-card"
import EducationalBookCard from "@/components/educational-book-card"
import WriterBookCard from "@/components/writer-book-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, GraduationCap, PenTool, BookOpenCheck } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-lg border border-gold bg-black p-6">
        <h1 className="text-3xl font-bold text-gold">Welcome to Writha</h1>
        <p className="mt-2 text-muted-foreground">
          Your cross-platform book application for discovering, reading, and publishing books
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="h-auto w-full justify-start border border-gold/30 bg-black p-1">
          <TabsTrigger value="popular" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <BookOpen className="mr-2 h-4 w-4" />
            Popular Books
          </TabsTrigger>
          <TabsTrigger value="educational" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <GraduationCap className="mr-2 h-4 w-4" />
            Educational Hub
          </TabsTrigger>
          <TabsTrigger value="writers" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <PenTool className="mr-2 h-4 w-4" />
            Writers Marketplace
          </TabsTrigger>
          <TabsTrigger value="public" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Public Domain
          </TabsTrigger>
        </TabsList>

        {/* Popular Books Tab */}
        <TabsContent value="popular" className="mt-6">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gold">Discover Popular Books</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <BookCard
                title="The Silent Echo"
                author="Maya Johnson"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.7}
                price={12.99}
                genre="Mystery"
              />
              <BookCard
                title="Beyond the Horizon"
                author="James Carter"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.5}
                price={0}
                isFree={true}
                genre="Sci-Fi"
              />
              <BookCard
                title="Whispers in the Dark"
                author="Elena Blackwood"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.8}
                price={14.99}
                genre="Thriller"
              />
              <BookCard
                title="The Last Summer"
                author="Thomas Wright"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.3}
                price={9.99}
                genre="Romance"
              />
            </div>
          </div>
        </TabsContent>

        {/* Educational Hub Tab */}
        <TabsContent value="educational" className="mt-6">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gold">Educational Hub</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <EducationalBookCard
                title="Introduction to Calculus"
                author="Dr. Robert Chen"
                institution="Stanford University"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.7}
                price={49.99}
                rentPrice={19.99}
                level="University"
                subject="Mathematics"
              />
              <EducationalBookCard
                title="Principles of Economics"
                author="Dr. Sarah Johnson"
                institution="Harvard University"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.5}
                price={54.99}
                rentPrice={22.99}
                level="University"
                subject="Economics"
              />
              <EducationalBookCard
                title="Biology: The Living World"
                author="Prof. Michael Davis"
                institution="MIT"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.8}
                price={44.99}
                rentPrice={18.99}
                level="High School"
                subject="Biology"
              />
              <EducationalBookCard
                title="World History: Modern Era"
                author="Dr. Emily Wilson"
                institution="Oxford University"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.6}
                price={39.99}
                rentPrice={16.99}
                level="High School"
                subject="History"
              />
            </div>
          </div>
        </TabsContent>

        {/* Writers Marketplace Tab */}
        <TabsContent value="writers" className="mt-6">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gold">Writers Marketplace</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <WriterBookCard
                title="Whispers of the Forgotten"
                author="Elena Blackwood"
                authorAvatar="/placeholder.svg?height=40&width=40"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.7}
                price={2.99}
                genre="Fantasy"
                followers={12500}
                chapters={24}
                completed={false}
              />
              <WriterBookCard
                title="Midnight Chronicles"
                author="Marcus Reed"
                authorAvatar="/placeholder.svg?height=40&width=40"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.5}
                price={0}
                isFree={true}
                genre="Mystery"
                followers={8700}
                chapters={18}
                completed={false}
              />
              <WriterBookCard
                title="Starlight Odyssey"
                author="Sophia Chen"
                authorAvatar="/placeholder.svg?height=40&width=40"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.8}
                price={3.99}
                genre="Sci-Fi"
                followers={15200}
                chapters={32}
                completed={true}
              />
              <WriterBookCard
                title="Hearts Entwined"
                author="Olivia Parker"
                authorAvatar="/placeholder.svg?height=40&width=40"
                cover="/placeholder.svg?height=280&width=180"
                rating={4.6}
                price={0}
                isFree={true}
                genre="Romance"
                followers={9800}
                chapters={15}
                completed={false}
              />
            </div>
          </div>
        </TabsContent>

        {/* Public Domain Tab */}
        <TabsContent value="public" className="mt-6">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gold">Public Domain Books</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <PublicBookCard
                title="Pride and Prejudice"
                author="Jane Austen"
                cover="/placeholder.svg?height=280&width=180"
                category="Classic"
                year={1813}
                downloads={25000}
                formats={["PDF", "EPUB", "MOBI"]}
              />
              <PublicBookCard
                title="The Great Gatsby"
                author="F. Scott Fitzgerald"
                cover="/placeholder.svg?height=280&width=180"
                category="Classic"
                year={1925}
                downloads={18000}
                formats={["PDF", "EPUB"]}
              />
              <PublicBookCard
                title="Frankenstein"
                author="Mary Shelley"
                cover="/placeholder.svg?height=280&width=180"
                category="Gothic"
                year={1818}
                downloads={15000}
                formats={["PDF", "EPUB", "MOBI"]}
              />
              <PublicBookCard
                title="The Art of War"
                author="Sun Tzu"
                cover="/placeholder.svg?height=280&width=180"
                category="Philosophy"
                year={-500}
                downloads={30000}
                formats={["PDF", "EPUB"]}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
