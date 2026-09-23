import Link from "next/link"
import { notFound } from "next/navigation"

import { LinkCandidates } from "@/components/customers/link-candidates"
import { ProbeLadder } from "@/components/customers/probe-ladder"
import { SuggestionsBasis } from "@/components/customers/suggestions-basis"
import { PageHeader } from "@/components/layout/page-header"
import { UnavailableState } from "@/components/shared/unavailable-state"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/client"
import { getSuggestions } from "@/lib/api/ops"
import { requireSession } from "@/lib/auth/session"
import type { SuggestionsResponse } from "@/types/ops"
import { ArrowLeftIcon, HandPointingIcon } from "@phosphor-icons/react/ssr"

interface Props {
  params: Promise<{ id: string }>
}

export default async function SuggestionsPage({ params }: Props) {
  await requireSession()
  const { id } = await params

  let result: SuggestionsResponse
  try {
    result = await getSuggestions(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }

  const customerHref = `/dashboard/customers/${encodeURIComponent(result.zohoCustomerId)}`

  return (
    <>
      <PageHeader
        title="Qual secret é deste cliente?"
        description={`Id do Zoho ${result.zohoCustomerId}`}
        actions={
          <Button asChild variant="outline">
            <Link href={customerHref}>
              <ArrowLeftIcon />
              Cliente 360
            </Link>
          </Button>
        }
      />

      <Alert>
        <HandPointingIcon />
        <AlertTitle>Nada aqui grava um mapeamento</AlertTitle>
        <AlertDescription>
          Não existe endpoint de vínculo. Decida com base no que está abaixo e corrija o
          mapeamento manualmente fora desta ferramenta.
        </AlertDescription>
      </Alert>

      <SuggestionsBasis
        basis={result.basis}
        currentMapping={result.currentMapping}
        failureCode={result.failureCode}
      />

      {result.router.available && result.router.data ? (
        <>
          <ProbeLadder tried={result.router.data.tried} />
          <LinkCandidates suggestions={result.router.data.suggestions} />
        </>
      ) : (
        // Not necessarily "router down": also "no stored payload to derive names from".
        <UnavailableState
          title="Não foi possível consultar o roteador"
          reason={result.router.unavailableReason ?? "O roteador não respondeu."}
        />
      )}
    </>
  )
}
