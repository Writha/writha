"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { SocialAuthButtons } from "./social-auth-buttons"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerUserType, setRegisterUserType] = useState("reader")
  const [registerError, setRegisterError] = useState("")

  const router = useRouter()
  const supabase = getSupabaseClient()

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setLoginError("")

    if (!loginEmail || !loginPassword) {
      setLoginError("Email and password are required")
      return
    }

    setIsLoading(true)

    try {
      // Simple login with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        console.error("Login error:", error)
        throw new Error(error.message || "Failed to sign in")
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back to Writha!",
        })

        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError(error.message || "Failed to sign in")

      toast({
        title: "Login failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()
    setRegisterError("")

    if (!registerEmail || !registerPassword || !registerUsername || !registerUserType) {
      setRegisterError("All fields are required")
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
      })

      if (error) {
        console.error("Registration error:", error)
        throw new Error(error.message || "Failed to create account")
      }

      if (data.user) {
        // Step 2: Create a profile in the profiles table
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username: registerUsername,
          user_type: registerUserType,
          wallet_balance: 0,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          throw new Error("Failed to create user profile")
        }

        toast({
          title: "Registration successful",
          description: "Welcome to Writha! Please check your email to verify your account.",
        })

        setActiveTab("login")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegisterError(error.message || "Failed to create account")

      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Writha</CardTitle>
        <CardDescription className="text-center">Your cross-platform book application</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && <div className="text-sm text-red-500">{loginError}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="yourname"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="register-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="user-type" className="text-sm font-medium">
                  I am a
                </label>
                <Select value={registerUserType} onValueChange={(value) => setRegisterUserType(value)}>
                  <SelectTrigger id="user-type">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reader">Reader</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="educator">Educator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {registerError && <div className="text-sm text-red-500">{registerError}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <SocialAuthButtons />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to Writha's Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  )
}
