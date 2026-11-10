import { SectionError } from "@/components/shared/section-error"
import { UsageChartCard } from "@/components/usage/usage-chart-card"
import { UsageNotRecordedYet } from "@/components/usage/usage-empty"
import { UsageSummaryCards } from "@/components/usage/usage-summary-cards"
import { ApiError } from "@/lib/api/client"
import { getNetworkUsage } from "@/lib/api/usage"
import { formatBucketLabel, formatBytes } from "@/lib/format"
import { TOO_MANY_BUCKETS_MESSAGE } from "@/lib/labels"
import { exceedsBucketLimit, resolveUsageRange } from "@/lib/usage/range"
import { peakBucket, toChartRows } from "@/lib/usage/series"
import type { NetworkUsage as NetworkUsageData } from "@/types/ops"
import type { UsageQuery } from "@/types/query"

interface Props {
  query: UsageQuery
}

/** The whole network over the selected range: totals, the peak bucket, bytes and active users per bucket. */
export async function NetworkUsage({ query }: Props) {
  const range = resolveUsageRange(query, new Date())
  if (exceedsBucketLimit(range.buckets)) {
    return <SectionError title="Intervalo longo demais" messages={[TOO_MANY_BUCKETS_MESSAGE]} />
  }

  let usage: NetworkUsageData
  try {
    usage = await getNetworkUsage(range)
  } catch (error) {
    if (error instanceof ApiError) {
      return <SectionError title="Não foi possível carregar o consumo da rede" messages={error.messages} />
    }
    throw error
  }

  if (usage.samplingSince === null) return <UsageNotRecordedYet />

  const rows = toChartRows(usage.points, usage, { live: range.live })
  const peak = peakBucket(rows)

  return (
    <>
      <UsageSummaryCards
        totals={usage.totals}
        peak={{
          value: peak ? formatBytes(peak.total) : "—",
          hint: peak
            ? `${formatBucketLabel(peak.start, usage.granularity, usage.timezone)}${peak.inProgress ? " (em andamento)" : ""}`
            : "Sem tráfego no período",
        }}
      />
      <UsageChartCard rows={rows} granularity={usage.granularity} range={usage} activeUsers />
    </>
  )
}
