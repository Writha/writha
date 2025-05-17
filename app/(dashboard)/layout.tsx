import type React from "react"
import Link from "next/link"
import { BookOpen, Home, Library, PenTool, GraduationCap, User, LogIn } from "lucide-react"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <BookOpen className="h-5 w-5 text-gold" />
            <span>Writha</span>
          </Link>

          <nav className="ml-auto flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium">
              Explore
            </Link>
            <Link href="/library" className="text-sm font-medium">
              Library
            </Link>
            <Link href="/login" className="text-sm font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/library"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Library className="h-4 w-4" />
                My Library
              </Link>
              <Link
                href="/educational"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <GraduationCap className="h-4 w-4" />
                Educational Hub
              </Link>
              <Link
                href="/writers"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <PenTool className="h-4 w-4" />
                Writers Marketplace
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
