"use client"

import { Button } from "@/components/ui/button"
import { useQueryParams } from "@/hooks/use-query-params"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr"

interface Props {
  /** Exactly what the API returned — the only cursor we ever send back. */
  nextCursor: string | null
  /** Rows on this page, for the caption. */
  count: number
}

export function CursorPagination({ nextCursor, count }: Props) {
  const { searchParams, set } = useQueryParams()
  const onFirstPage = !searchParams.has("cursor")

  if (onFirstPage && !nextCursor) return null

  return (
    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
      <span>{count} linhas nesta página</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={onFirstPage}
          onClick={() => set({ cursor: undefined })}
        >
          <CaretLeftIcon />
          Primeira página
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!nextCursor}
          onClick={() => set({ cursor: nextCursor ?? undefined })}
        >
          Próxima
          <CaretRightIcon />
        </Button>
      </div>
    </div>
  )
}
