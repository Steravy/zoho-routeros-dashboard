import { OutcomeBadge } from "@/components/shared/outcome-badge"
import { OUTCOMES } from "@/lib/constants"
import { formatCount } from "@/lib/format"
import type { OutcomeCounts as Counts } from "@/types/ops"

interface Props {
  counts: Counts
}

/** Lifetime outcome tally for this customer, in fixed enum order. */
export function OutcomeCounts({ counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {OUTCOMES.map((outcome) => (
        <div
          key={outcome}
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
        >
          <OutcomeBadge outcome={outcome} />
          <span className="font-medium tabular-nums">{formatCount(counts[outcome])}</span>
        </div>
      ))}
    </div>
  )
}
