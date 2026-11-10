import { IdentityCard } from "@/components/customers/identity-card"
import { LinesCard } from "@/components/customers/lines-card"
import { MappingCard } from "@/components/customers/mapping-card"
import { RouterStateCard } from "@/components/customers/router-state-card"
import { getConfig } from "@/lib/api/ops"
import type { CustomerDetail } from "@/types/ops"

interface Props {
  customer: CustomerDetail
}

/** Who the customer is and where they stand on the router right now. */
export async function OverviewTab({ customer }: Props) {
  // `/config` names the blocked profile so every profile here can wear its tone.
  const { blockedProfile } = await getConfig()

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <IdentityCard zohoCustomerId={customer.zohoCustomerId} identity={customer.identity} />
        <MappingCard mapping={customer.mapping} blockedProfile={blockedProfile} />
        <RouterStateCard
          read={customer.router}
          blockedProfile={blockedProfile}
          otherLines={Math.max(0, customer.lines.length - 1)}
        />
      </div>
      <LinesCard
        lines={customer.lines}
        blockedProfile={blockedProfile}
        liveUsername={customer.router.data?.username ?? customer.mapping?.routerosUsername ?? null}
      />
    </>
  )
}
