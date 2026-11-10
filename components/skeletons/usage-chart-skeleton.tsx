import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  /** Reserve room for the active-users chart under the bars (network page). */
  activeUsers?: boolean
}

const BARS = 24

/** Same box as `UsageChartCard`: title, two-line caption, a 16rem plot of vertical bars. */
export function UsageChartSkeleton({ activeUsers = false }: Props) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-64 items-end gap-1.5 pb-8 pl-[72px]">
          {Array.from({ length: BARS }, (_, index) => (
            <Skeleton
              key={index}
              className="flex-1 rounded-t-[4px] rounded-b-none"
              style={{ height: `${25 + ((index * 37) % 65)}%` }}
            />
          ))}
        </div>
        {activeUsers && (
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-28 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
