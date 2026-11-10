import type { ReactNode } from "react"

import { StatCard } from "@/components/shared/stat-card"
import { formatBytes, formatShare } from "@/lib/format"
import type { UsageTotals } from "@/types/ops"

interface Props {
  totals: UsageTotals
  /** Fourth card — the network page's peak bucket. */
  peak?: { value: ReactNode; hint: ReactNode }
}

/** Total, download and upload of the selected range — same colours as the chart's series. */
export function UsageSummaryCards({ totals, peak }: Props) {
  const share = (bytes: number) =>
    totals.totalBytes > 0 ? `${formatShare(bytes / totals.totalBytes)} do total` : "Sem tráfego no período"

  return (
    <div className={peak ? "grid grid-cols-2 gap-4 lg:grid-cols-4" : "grid auto-rows-min gap-4 md:grid-cols-3"}>
      <StatCard label="Total" value={formatBytes(totals.totalBytes)} hint="Download + upload" />
      <StatCard
        label={<SeriesLabel dot="bg-usage-download">Download</SeriesLabel>}
        value={formatBytes(totals.downloadBytes)}
        hint={share(totals.downloadBytes)}
      />
      <StatCard
        label={<SeriesLabel dot="bg-usage-upload">Upload</SeriesLabel>}
        value={formatBytes(totals.uploadBytes)}
        hint={share(totals.uploadBytes)}
      />
      {peak && <StatCard label="Pico" value={peak.value} hint={peak.hint} />}
    </div>
  )
}

function SeriesLabel({ dot, children }: { dot: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-[2px] ${dot}`} />
      {children}
    </span>
  )
}
