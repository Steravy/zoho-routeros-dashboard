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
        title="Ação manual"
        description="Clientes que a ponte não conseguiu colocar no roteador. Cada linha abre o que ela sabia e quais secrets podem ser deles."
        actions={<WindowSelect value={window} />}
      />

      <Alert>
        <HandPointingIcon />
        <AlertTitle>Não existe botão de vínculo</AlertTitle>
        <AlertDescription>
          O mapeamento é corrigido manualmente fora desta ferramenta. Estas telas existem
          para dar tudo o que você precisa para decidir.
        </AlertDescription>
      </Alert>

      <div className="space-y-1">
        <NeedsHumanTabs value={code} />
        <p className="text-sm text-muted-foreground">{FAILURE_CODE_DESCRIPTIONS[code]}</p>
      </div>

      <Suspense fallback={<TableSkeleton columns={6} />}>
        <FailuresTable
          query={{ window, failureCode: code, cursor }}
          emptyTitle="Nenhuma ação manual pendente"
          emptyDescription="Nenhum cliente falhou com este código no período selecionado."
        />
      </Suspense>
    </>
  )
}
