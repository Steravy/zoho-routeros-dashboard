import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  count?: number
  /** Match the real grid's column classes so the swap is layout-stable. */
  className?: string
}

/** Same box model as `StatCard`: label line, big value, hint line. */
export function StatGridSkeleton({
  count = 4,
  className = "grid gap-4 grid-cols-2 lg:grid-cols-4",
}: Props) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-8 w-20" />
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
