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
        <EmptyTitle>Não foi possível carregar esta página</EmptyTitle>
        <EmptyDescription>
          A API não respondeu. Verifique se ela está rodando e tente novamente.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={reset}>Tentar novamente</Button>
      </EmptyContent>
    </Empty>
  )
}
