import "server-only"

import { ApiError } from "@/lib/api/client"
import { getNetworkUsage, getTopConsumers } from "@/lib/api/usage"
import { resolveTopRange } from "@/lib/usage/range"
import type { TopConsumers } from "@/types/ops"
import type { TopConsumersQuery } from "@/types/query"

export interface TopConsumersResult {
  top: TopConsumers
  /** Network total over exactly the ranking's range; `undefined` when that cannot be guaranteed. */
  networkTotalBytes: number | undefined
}

/**
 * The ranking plus the network total it is a share of. Both calls get the same
 * explicit `from`/`to`; the total is only trusted when the two responses report
 * the same range (`/usage/total` widens `from`, `/usage/top` does not).
 */
export async function loadTopConsumers(query: TopConsumersQuery): Promise<TopConsumersResult> {
  const range = resolveTopRange(query, new Date())
  const granularity = range.totalGranularity

  const [top, network] = await Promise.all([
    getTopConsumers(range, query.limit),
    granularity
      ? getNetworkUsage({ granularity, from: range.from, to: range.to }).catch((error: unknown) => {
          // The share is a nicety — the ranking still stands without it.
          if (error instanceof ApiError) return null
          throw error
        })
      : null,
  ])

  const sameRange =
    network !== null &&
    Date.parse(network.from) === Date.parse(top.from) &&
    Date.parse(network.to) === Date.parse(top.to)

  return { top, networkTotalBytes: sameRange ? network.totals.totalBytes : undefined }
}
