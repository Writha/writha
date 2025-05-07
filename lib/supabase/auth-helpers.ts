import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function createProfileForNewUser(userId: string, email: string, provider: string) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking for existing profile:", checkError)
      throw checkError
    }

    // Only create profile if it doesn't exist
    if (!existingProfile) {
      // Generate a username from the email
      const username = email.split("@")[0] + Math.floor(Math.random() * 1000)

      // Create a new profile
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        username,
        user_type: "reader", // Default role for social login users
        wallet_balance: 0,
      })

      if (insertError) {
        console.error("Error creating profile:", insertError)
        throw insertError
      }

      console.log("Created new profile for user:", userId)
    } else {
      console.log("Profile already exists for user:", userId)
    }
  } catch (error) {
    console.error("Error in createProfileForNewUser:", error)
    throw error
  }
}
