export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}