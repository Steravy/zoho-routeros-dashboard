import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  /** Lines the customer has — one box each. */
  lines?: number
}

/** Same box as one `LiveLineCard`: username + badge, two speeds, sparkline, three facts. */
export function LiveLineSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="space-y-3">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center gap-6">
            <Skeleton className="h-4 w-24 shrink-0" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function liveGridClass(lines: number): string {
  return lines > 1 ? "grid gap-4 md:grid-cols-2" : "grid gap-4"
}

/** Mirrors `LiveUsagePanel` before its first read. */
export function LivePanelSkeleton({ lines = 1 }: Props) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full max-w-md" />
      </CardHeader>
      <CardContent className={liveGridClass(lines)}>
        {Array.from({ length: lines }, (_, index) => (
          <LiveLineSkeleton key={index} />
        ))}
      </CardContent>
    </Card>
  )
}
