import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <BookOpen className="h-16 w-16 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-primary">Writha</h1>
          <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
            Your cross-platform book application for readers, writers, and educators
          </p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Enter Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Login / Register
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          <FeatureCard
            title="For Readers"
            description="Discover new books, track your reading progress, and connect with other readers."
            icon="📚"
          />
          <FeatureCard
            title="For Writers"
            description="Publish your work, build an audience, and earn from your creativity."
            icon="✍️"
          />
          <FeatureCard
            title="For Educators"
            description="Find educational resources, create reading lists, and track student progress."
            icon="🎓"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-2 text-3xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
