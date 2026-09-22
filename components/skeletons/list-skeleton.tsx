import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  rows?: number
}

/** Rows of title + subtitle, for card lists such as link candidates. */
export function ListSkeleton({ rows = 3 }: Props) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="space-y-2 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}
