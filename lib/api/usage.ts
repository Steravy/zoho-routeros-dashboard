import "server-only"

import { opsFetch } from "@/lib/api/client"
import type {
  CustomerUsage,
  LiveUsageData,
  NetworkUsage,
  RouterRead,
  TopConsumers,
} from "@/types/ops"
import type { ResolvedUsageRange } from "@/types/query"

/*
 * Usage reads — docs/dashboard-api.md, "Usage — how the numbers are made".
 * Ranges are always sent explicitly (see `lib/usage/range.ts`): the backend's
 * defaults are not the presets the UI offers.
 */

type SeriesRange = Pick<ResolvedUsageRange, "granularity" | "from" | "to">

export const getCustomerUsage = (
  zohoCustomerId: string,
  { granularity, from, to }: SeriesRange
) =>
  opsFetch<CustomerUsage>(
    `/customers/${encodeURIComponent(zohoCustomerId)}/usage`,
    { query: { granularity, from, to } }
  )

/** Fresh or unavailable, never stale. Queries the router on every call — do not call it in a loop faster than `LIVE_POLL_MS`. */
export const getCustomerLiveUsage = (zohoCustomerId: string) =>
  opsFetch<RouterRead<LiveUsageData>>(
    `/customers/${encodeURIComponent(zohoCustomerId)}/usage/live`
  )

export const getNetworkUsage = ({ granularity, from, to }: SeriesRange) =>
  opsFetch<NetworkUsage>("/usage/total", { query: { granularity, from, to } })

export const getTopConsumers = (range: { from: string; to: string }, limit: number) =>
  opsFetch<TopConsumers>("/usage/top", {
    query: { from: range.from, to: range.to, limit },
  })
