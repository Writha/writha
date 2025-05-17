import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">The page you are looking for does not exist.</p>
      </div>
      <Button asChild className="bg-gold text-black hover:bg-gold-dark">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
