import { StaleBanner } from "@/components/shared/stale-banner"
import { StatCard } from "@/components/shared/stat-card"
import { UnavailableState } from "@/components/shared/unavailable-state"
import { Badge } from "@/components/ui/badge"
import { getCensus, getConfig } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"

/**
 * `blocked` (on the suspension profile) and `disabled` (the RouterOS flag) are
 * different things; a customer can be neither, either or both.
 */
export async function CensusStats() {
  const [census, config] = await Promise.all([getCensus(), getConfig()])
  const data = census.data

  if (!data) {
    return (
      <UnavailableState
        title="No census available"
        reason={census.unavailableReason ?? "The router has not answered yet."}
      />
    )
  }

  return (
    <div className="space-y-4">
      <StaleBanner read={census} />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Secrets"
          value={formatCount(data.secrets)}
          hint="PPPoE credentials on the router — one per customer line"
        />
        <StatCard
          label="Active"
          value={formatCount(data.active)}
          hint="Secrets not on the blocked profile (ignores the disabled flag)"
        />
        <StatCard
          label="Blocked"
          value={formatCount(data.blocked)}
          hint={
            <>
              On <code className="font-mono">{config.blockedProfile}</code>
              {" — suspended for non-payment, still connecting at throttled speed"}
            </>
          }
        />
        <StatCard
          label="Disabled"
          value={formatCount(data.disabled)}
          hint="RouterOS flag set — new customers who have not paid yet. Not suspension."
        />
        <StatCard
          label="Online"
          value={formatCount(data.online)}
          hint="Distinct customers with a live session right now"
        />
        <StatCard
          label="Blocked and online"
          value={formatCount(data.blockedAndOnline)}
          action={<Badge variant="secondary">expected</Badge>}
          hint="Blocked customers reconnect into the throttled profile — this number being large is the system working"
        />
      </div>
    </div>
  )
}
