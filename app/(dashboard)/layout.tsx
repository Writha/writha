import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, PenTool, User, Wallet, LogOut, Home } from "lucide-react"
import { getSupabaseServer } from "@/lib/supabase/server"
import { MobileNav } from "@/components/layout/mobile-nav"
import { UserNav } from "@/components/layout/user-nav"
import { Suspense } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { SearchInput } from "@/components/search/search-input"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Writha</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                Home
              </Link>
              <Link href="/explore" className="transition-colors hover:text-foreground/80">
                Explore
              </Link>
              <Link href="/library" className="transition-colors hover:text-foreground/80">
                My Library
              </Link>
              {profile?.user_type === "writer" && (
                <Link href="/writer" className="transition-colors hover:text-foreground/80">
                  Writer Dashboard
                </Link>
              )}
            </nav>
          </div>
          <MobileNav />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <SearchInput />
            </div>
            <nav className="flex items-center">
              <ThemeToggle />
              <NotificationCenter />
              <UserNav user={profile} />
            </nav>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/library">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Library
                </Button>
              </Link>
              {profile?.user_type === "writer" && (
                <Link href="/writer">
                  <Button variant="ghost" className="w-full justify-start">
                    <PenTool className="mr-2 h-4 w-4" />
                    Writer Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="ghost" className="w-full justify-start">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </Button>
              </Link>
              <form action="/api/auth/signout" method="post">
                <Button variant="ghost" className="w-full justify-start" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
