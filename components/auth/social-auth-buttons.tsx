"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { toast } from "@/components/ui/use-toast"
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa"

export function SocialAuthButtons() {
  const [isLoading, setIsLoading] = useState<{
    google: boolean
    facebook: boolean
    apple: boolean
  }>({
    google: false,
    facebook: false,
    apple: false,
  })

  // Create a fresh Supabase client for each request
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setIsLoading({ ...isLoading, [provider]: true })
    try {
      // Get the current origin for the redirect
      const origin = window.location.origin
      const redirectTo = `${origin}/auth/callback`

      console.log(`Attempting to sign in with ${provider}, redirecting to: ${redirectTo}`)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error(`${provider} authentication error:`, error)
      toast({
        title: "Authentication error",
        description: error.message || `Failed to authenticate with ${provider}`,
        variant: "destructive",
      })
      setIsLoading({ ...isLoading, [provider]: false })
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        type="button"
        disabled={isLoading.google}
        onClick={() => handleSocialLogin("google")}
        className="flex items-center justify-center"
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        {isLoading.google ? "Connecting..." : "Continue with Google"}
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading.facebook}
        onClick={() => handleSocialLogin("facebook")}
        className="flex items-center justify-center"
      >
        <FaFacebook className="mr-2 h-4 w-4" />
        {isLoading.facebook ? "Connecting..." : "Continue with Facebook"}
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading.apple}
        onClick={() => handleSocialLogin("apple")}
        className="flex items-center justify-center"
      >
        <FaApple className="mr-2 h-4 w-4" />
        {isLoading.apple ? "Connecting..." : "Continue with Apple"}
      </Button>
    </div>
  )
}
