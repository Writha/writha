"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Dashboard Error</h2>
        <p className="mt-2 text-muted-foreground">There was a problem loading the dashboard. Please try again.</p>
        <p className="mt-2 text-sm text-red-500">{error.message}</p>
      </div>
      <Button onClick={reset} className="bg-gold text-black hover:bg-gold-dark">
        Try again
      </Button>
    </div>
  )
}
