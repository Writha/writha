"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"
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
  const supabase = getSupabaseClient()

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setIsLoading({ ...isLoading, [provider]: true })
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Failed to authenticate with provider",
        variant: "destructive",
      })
    } finally {
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
