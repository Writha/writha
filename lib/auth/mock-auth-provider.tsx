"use client"

import { createContext, useContext, type ReactNode } from "react"

// Define the shape of the user object
interface User {
  id: string
  username: string
  avatar_url: string | null
  user_type: string
}

// Define the shape of the auth context
interface AuthContextType {
  user: User | null
  isLoading: boolean
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
})

// Create a provider component
export function MockAuthProvider({ children }: { children: ReactNode }) {
  // Create a mock user
  const mockUser: User = {
    id: "mock-user-id",
    username: "Guest User",
    avatar_url: null,
    user_type: "reader",
  }

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a MockAuthProvider")
  }
  return context
}
