import { Suspense } from "react"

import { ChangePasswordForm } from "@/components/account/change-password-form"
import { SessionCard } from "@/components/account/session-card"
import { PageHeader } from "@/components/layout/page-header"
import { DetailCardSkeleton } from "@/components/skeletons/detail-card-skeleton"
import { requireSession } from "@/lib/auth/session"

export default async function AccountPage() {
  await requireSession()

  return (
    <>
      <PageHeader
        title="Minha conta"
        description="Sua conta neste painel. Alterar a senha encerra suas outras sessões."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<DetailCardSkeleton rows={3} />}>
          <SessionCard />
        </Suspense>
        <ChangePasswordForm />
      </div>
    </>
  )
}
