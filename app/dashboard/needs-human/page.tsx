import { Suspense } from "react"

import { FailuresTable } from "@/components/failures/failures-table"
import { PageHeader } from "@/components/layout/page-header"
import { NeedsHumanTabs } from "@/components/needs-human/needs-human-tabs"
import { WindowSelect } from "@/components/shared/window-select"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { requireSession } from "@/lib/auth/session"
import { FAILURE_CODE_DESCRIPTIONS } from "@/lib/labels"
import { needsHumanQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"
import { HandPointingIcon } from "@phosphor-icons/react/ssr"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function NeedsHumanPage({ searchParams }: Props) {
  await requireSession()
  const { window, code, cursor } = needsHumanQuerySchema.parse(await searchParams)

  return (
    <>
      <PageHeader
        title="Needs a human"
        description="Customers the bridge could not place on the router. Each row opens what it knew and which secrets could be theirs."
        actions={<WindowSelect value={window} />}
      />

      <Alert>
        <HandPointingIcon />
        <AlertTitle>There is no link button</AlertTitle>
        <AlertDescription>
          The mapping is fixed by hand outside this tool. These screens exist to give
          you everything needed to decide.
        </AlertDescription>
      </Alert>

      <div className="space-y-1">
        <NeedsHumanTabs value={code} />
        <p className="text-sm text-muted-foreground">{FAILURE_CODE_DESCRIPTIONS[code]}</p>
      </div>

      <Suspense fallback={<TableSkeleton columns={6} />}>
        <FailuresTable
          query={{ window, failureCode: code, cursor }}
          emptyTitle="Nobody needs a human right now"
          emptyDescription="No customer failed with this code in the selected window."
        />
      </Suspense>
    </>
  )
}
