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
        title="Which secret is this customer's?"
        description={`Zoho id ${result.zohoCustomerId}`}
        actions={
          <Button asChild variant="outline">
            <Link href={customerHref}>
              <ArrowLeftIcon />
              Customer 360
            </Link>
          </Button>
        }
      />

      <Alert>
        <HandPointingIcon />
        <AlertTitle>Nothing here writes a mapping</AlertTitle>
        <AlertDescription>
          There is no link endpoint. Decide from what is below, then fix the mapping by
          hand outside this tool.
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
          title="The router could not be consulted"
          reason={result.router.unavailableReason ?? "The router did not answer."}
        />
      )}
    </>
  )
}
