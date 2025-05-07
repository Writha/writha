"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, Menu, Home, BookMarked, PenTool, User, Wallet, LogOut } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            <span className="font-bold">Writha</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-3 py-4">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link
            href="/explore"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Explore
          </Link>
          <Link
            href="/library"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          >
            <BookMarked className="mr-2 h-4 w-4" />
            My Library
          </Link>
          <Link
            href="/writer"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          >
            <PenTool className="mr-2 h-4 w-4" />
            Writer Dashboard
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/wallet"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Wallet
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-left"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
