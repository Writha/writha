"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface UserNavProps {
  user: {
    id: string
    username: string
    avatar_url: string | null
    user_type: string
  }
  isAuthenticated?: boolean
}

export function UserNav({ user, isAuthenticated = false }: UserNavProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        // Import dynamically to avoid issues during rendering
        const { getSupabaseClient } = await import("@/lib/supabase/client")
        const supabase = getSupabaseClient()
        await supabase.auth.signOut()
      }
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Error during logout:", error)
      router.push("/login")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || "/placeholder.svg?height=32&width=32"} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">{user.user_type}</p>
            {!isAuthenticated && <p className="text-xs text-muted-foreground mt-1">(Guest Mode)</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/library")}>My Library</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/wallet")}>Wallet</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/login")}>Log in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
