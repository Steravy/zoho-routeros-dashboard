import { Suspense } from "react"

import { ConfigCard } from "@/components/health/config-card"
import { HealthCard } from "@/components/health/health-card"
import { PageHeader } from "@/components/layout/page-header"
import { AutoRefresh } from "@/components/shared/auto-refresh"
import { DetailCardSkeleton } from "@/components/skeletons/detail-card-skeleton"
import { requireSession } from "@/lib/auth/session"

export default async function HealthPage() {
  await requireSession()

  return (
    <>
      <PageHeader
        title="Health & config"
        description="Whether the bridge is up, and which operational flags are in force right now."
        actions={<AutoRefresh intervalMs={60_000} />}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<DetailCardSkeleton rows={3} />}>
          <HealthCard />
        </Suspense>
        <Suspense fallback={<DetailCardSkeleton rows={5} />}>
          <ConfigCard />
        </Suspense>
      </div>
    </>
  )
}
