import { ProfileBadge } from "@/components/shared/profile-badge"
import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { getCensus, getConfig } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import { isProfileListUnavailable } from "@/lib/profiles"
import { WarningIcon } from "@phosphor-icons/react/ssr"

/** One tile per plan, straight from `data.plans` — names and order come from the API, never guessed. */
export async function PlanTiles() {
  const [census, config] = await Promise.all([getCensus(), getConfig()])
  const data = census.data
  if (!data) return null

  if (data.plans.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum plano configurado.</p>
    )
  }

  // When the whole list is unreadable the table shows one banner; no badge per tile.
  const listUnavailable = isProfileListUnavailable(data.byProfile)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.plans.map((plan) => (
        <StatCard
          key={plan.profile}
          label={
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <ProfileBadge
                profile={plan.profile}
                blockedProfile={config.blockedProfile}
              />
              <span aria-hidden>·</span>
              <code className="font-mono">{plan.rateLimit ?? "—"}</code>
            </span>
          }
          value={formatCount(plan.count)}
          hint="Secrets neste plano"
          action={
            !plan.existsOnRouter && !listUnavailable ? (
              <Badge variant="destructive">
                <WarningIcon />
                não está no roteador
              </Badge>
            ) : undefined
          }
        />
      ))}
    </div>
  )
}
