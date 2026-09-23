"use client"

import { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ArrowsClockwiseIcon } from "@phosphor-icons/react/ssr"

interface Props {
  /** Poll interval. Omit to offer manual refresh only. */
  intervalMs?: number
}

/**
 * Re-renders the server components on this route. No websockets exist on the API —
 * polling is the contract. Pauses while the tab is hidden.
 */
export function AutoRefresh({ intervalMs }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (!intervalMs) return
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        startTransition(() => router.refresh())
      }
    }, intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs, router])

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      aria-label="Refresh"
    >
      {pending ? <Spinner /> : <ArrowsClockwiseIcon />}
      Atualizar
    </Button>
  )
}
