import Link from "next/link"
import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenTool, BookOpen, TrendingUp, DollarSign, Users } from "lucide-react"

export default async function WriterDashboardPage() {
  const supabase = getSupabaseServer()

  // Check if user is authenticated and is a writer
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

  if (!profile || profile.user_type !== "writer") {
    redirect("/dashboard")
  }

  // Get writer's books
  const { data: books } = await supabase
    .from("writer_stories")
    .select("*")
    .eq("writer_id", session.user.id)
    .order("created_at", { ascending: false })

  // Get total earnings
  const { data: earnings } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", session.user.id)
    .eq("transaction_type", "sale")

  const totalEarnings = earnings?.reduce((acc, curr) => acc + curr.amount, 0) || 0

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Writer Dashboard</h2>
          <p className="text-muted-foreground">Manage your books, track performance, and grow your audience.</p>
        </div>
        <Link href="/writer/new-book">
          <Button>
            <PenTool className="mr-2 h-4 w-4" />
            Write New Book
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Readers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="books">
        <TabsList>
          <TabsTrigger value="books">My Books</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="books" className="space-y-4">
          {books && books.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                    <CardDescription>
                      {book.genre || "Fiction"} • {book.is_completed ? "Completed" : "Ongoing"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.description || "No description available."}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/books/${book.id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                    <Link href={`/writer/edit/${book.id}`}>
                      <Button>Edit</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No books yet</CardTitle>
                <CardDescription>Start writing your first book to see it here.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/writer/new-book">
                  <Button>Write New Book</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>No drafts</CardTitle>
              <CardDescription>You don't have any drafts yet.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/writer/new-book">
                <Button>Create Draft</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your performance and reader engagement.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics will be available once you have published books with reader activity.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
