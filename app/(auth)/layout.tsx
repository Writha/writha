import type React from "react"
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen bg-gradient-to-br from-black to-black/90">{children}</div>
}
