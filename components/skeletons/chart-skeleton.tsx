import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  /** Number of horizontal bars the real chart will draw. */
  bars?: number
}

/** Title, subtitle and a stack of horizontal bars — the shape every chart here takes. */
export function ChartSkeleton({ bars = 6 }: Props) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: bars }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-4 w-28 shrink-0" />
            <Skeleton
              className="h-5 rounded-r-[4px]"
              style={{ width: `${85 - ((index * 29) % 60)}%` }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
