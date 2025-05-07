import { Suspense } from "react"
import { SearchResults } from "@/components/search/search-results"
import { SearchFilters } from "@/components/search/search-filters"

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    genre?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const type = searchParams.type || "all"
  const genre = searchParams.genre || ""

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Search Results</h2>
        {query ? (
          <p className="text-muted-foreground">Showing results for "{query}"</p>
        ) : (
          <p className="text-muted-foreground">Search for books, writers, and more</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SearchFilters currentType={type} currentGenre={genre} query={query} />
        </div>
        <div className="md:col-span-3">
          <Suspense fallback={<div>Loading search results...</div>}>
            <SearchResults query={query} type={type} genre={genre} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
