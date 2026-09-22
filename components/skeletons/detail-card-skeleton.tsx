import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  /** Label/value pairs the real card lists. */
  rows?: number
}

/** Mirrors a Card holding a `KeyValueList`. */
export function DetailCardSkeleton({ rows = 4 }: Props) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-6">
            <Skeleton className="h-4 w-24 shrink-0" />
            <Skeleton className="h-4" style={{ width: `${40 + ((index * 23) % 45)}%` }} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
