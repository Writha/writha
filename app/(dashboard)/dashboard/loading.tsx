export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded"></div>
              ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-40 bg-muted animate-pulse rounded"></div>
          <div className="h-40 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      <div className="h-32 bg-muted animate-pulse rounded"></div>

      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded"></div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded"></div>
            ))}
        </div>
      </div>
    </div>
  )
}
