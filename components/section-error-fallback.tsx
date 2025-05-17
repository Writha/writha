"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface SectionErrorFallbackProps {
  title: string
}

export function SectionErrorFallback({ title }: SectionErrorFallbackProps) {
  return (
    <Alert className="border-writha-gold/50 bg-writha-black">
      <AlertCircle className="h-4 w-4 text-writha-gold" />
      <AlertTitle className="gold-text">{title} Section Error</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        There was an error loading this section. Please try refreshing the page.
      </AlertDescription>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 border-writha-gold text-writha-gold hover:bg-writha-gold/10"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </Alert>
  )
}
