"use client"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { WarningIcon } from "@phosphor-icons/react/ssr"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ reset }: Props) {
  return (
    <Empty className="flex-1 rounded-xl bg-muted/50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WarningIcon />
        </EmptyMedia>
        <EmptyTitle>Couldn&apos;t load this page</EmptyTitle>
        <EmptyDescription>
          The API didn&apos;t answer. Check that it is running, then try again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={reset}>Try again</Button>
      </EmptyContent>
    </Empty>
  )
}
