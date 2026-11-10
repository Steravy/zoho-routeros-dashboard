import { Skeleton } from "@/components/ui/skeleton"

/** The filter row above a usage chart: granularity, presets, custom range. */
export function UsageControlsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-7 w-32" />
    </div>
  )
}
