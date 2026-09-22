import "server-only"

import { opsFetch } from "@/lib/api/client"
import { PAGE_LIMIT } from "@/lib/constants"
import type {
  Census,
  CustomerDetail,
  CustomerHit,
  Drift,
  FailureItem,
  FailuresByReason,
  Health,
  OpsConfig,
  OutagesResponse,
  Page,
  PendingResponse,
  RouterRead,
  SuggestionsResponse,
  Summary,
  TimeWindow,
} from "@/types/ops"
import type {
  CustomerSearchQuery,
  DriftQuery,
  FailuresQuery,
} from "@/types/query"

/*
 * One thin function per endpoint. Identical calls within a single render are
 * memoised by Next, so sections can each ask for what they need.
 */

export const getHealth = () =>
  opsFetch<Health>("/health", { auth: false, base: "root" })

export const getConfig = () => opsFetch<OpsConfig>("/config")

export const getSummary = (window: TimeWindow) =>
  opsFetch<Summary>("/summary", { query: { window } })

export const getFailures = ({ q, ...rest }: FailuresQuery) =>
  opsFetch<Page<FailureItem>>("/failures", {
    query: { ...rest, q: stripSqlWildcards(q), limit: PAGE_LIMIT },
  })

export const getFailuresByReason = (window: TimeWindow) =>
  opsFetch<FailuresByReason>("/failures/by-reason", { query: { window } })

export const getPending = () => opsFetch<PendingResponse>("/pending")

export const getOutages = (window: TimeWindow) =>
  opsFetch<OutagesResponse>("/outages", { query: { window } })

export const getCensus = () => opsFetch<RouterRead<Census>>("/router/census")

export const getDrift = ({ bucket, cursor }: DriftQuery) =>
  opsFetch<RouterRead<Drift>>("/router/drift", {
    query: { bucket, cursor, limit: PAGE_LIMIT },
  })

export const searchCustomers = ({ q, cursor }: CustomerSearchQuery) =>
  opsFetch<Page<CustomerHit>>("/customers/search", {
    query: { q, cursor, limit: PAGE_LIMIT },
  })

export const getCustomer = (zohoCustomerId: string, cursor?: string) =>
  opsFetch<CustomerDetail>(`/customers/${encodeURIComponent(zohoCustomerId)}`, {
    query: { cursor, limit: PAGE_LIMIT },
  })

export const getSuggestions = (zohoCustomerId: string) =>
  opsFetch<SuggestionsResponse>(
    `/customers/${encodeURIComponent(zohoCustomerId)}/suggestions`
  )

/** `/failures?q=` treats `%` and `_` as SQL wildcards (customer search does not). */
function stripSqlWildcards(q: string | undefined): string | undefined {
  const cleaned = q?.replace(/[%_]/g, "").trim()
  return cleaned || undefined
}
