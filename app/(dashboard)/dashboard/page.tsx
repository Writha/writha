import { Suspense } from "react"
import { getSupabaseServer } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, TrendingUp, Sparkles } from "lucide-react"

async function getRecommendedBooks() {
  const supabase = getSupabaseServer()

  const { data } = await supabase.from("writer_stories").select("*").limit(4)

  return data || []
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Writha</h2>
        <p className="text-muted-foreground">
          Your cross-platform book application for discovering, reading, and publishing books.
        </p>
      </div>

      <Tabs defaultValue="trending">
        <TabsList>
          <TabsTrigger value="trending">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new">
            <Sparkles className="mr-2 h-4 w-4" />
            New Releases
          </TabsTrigger>
          <TabsTrigger value="recommended">
            <BookOpen className="mr-2 h-4 w-4" />
            Recommended
          </TabsTrigger>
        </TabsList>
        <TabsContent value="trending" className="space-y-4">
          <Suspense fallback={<div>Loading trending books...</div>}>
            <TrendingBooks />
          </Suspense>
        </TabsContent>
        <TabsContent value="new" className="space-y-4">
          <Suspense fallback={<div>Loading new releases...</div>}>
            <NewReleases />
          </Suspense>
        </TabsContent>
        <TabsContent value="recommended" className="space-y-4">
          <Suspense fallback={<div>Loading recommendations...</div>}>
            <RecommendedBooks />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function TrendingBooks() {
  const supabase = getSupabaseServer()

  const { data: books } = await supabase
    .from("writer_stories")
    .select("*")
    .limit(4)
    .order("created_at", { ascending: false })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {books?.map((book) => (
        <Card key={book.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{book.genre || "Fiction"}</div>
          </CardContent>
        </Card>
      )) || <div>No trending books found</div>}
    </div>
  )
}

async function NewReleases() {
  const supabase = getSupabaseServer()

  const { data: books } = await supabase
    .from("writer_stories")
    .select("*")
    .limit(4)
    .order("created_at", { ascending: false })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {books?.map((book) => (
        <Card key={book.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{book.genre || "Fiction"}</div>
          </CardContent>
        </Card>
      )) || <div>No new releases found</div>}
    </div>
  )
}

async function RecommendedBooks() {
  const books = await getRecommendedBooks()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {books?.map((book) => (
        <Card key={book.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{book.genre || "Fiction"}</div>
          </CardContent>
        </Card>
      )) || <div>No recommended books found</div>}
    </div>
  )
}
