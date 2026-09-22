"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQueryParams } from "@/hooks/use-query-params"
import { DRIFT_BUCKETS } from "@/lib/constants"
import { formatCount } from "@/lib/format"
import { DRIFT_BUCKET_LABELS } from "@/lib/labels"
import type { DriftBucket } from "@/types/ops"

interface Props {
  value: DriftBucket
  counts: Record<DriftBucket, number>
}

/** All three counts come back whichever bucket is paged, so every tab shows its size. */
export function DriftTabs({ value, counts }: Props) {
  const { set } = useQueryParams()

  return (
    <Tabs value={value} onValueChange={(next) => set({ bucket: next })}>
      <TabsList variant="line">
        {DRIFT_BUCKETS.map((bucket) => (
          <TabsTrigger key={bucket} value={bucket}>
            {DRIFT_BUCKET_LABELS[bucket]}
            <Badge variant={counts[bucket] ? "secondary" : "outline"}>
              {formatCount(counts[bucket])}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
