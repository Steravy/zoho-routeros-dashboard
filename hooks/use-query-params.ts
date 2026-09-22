"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type Patch = Record<string, string | undefined>

interface SetOptions {
  /** Cursors belong to one result set; changing any filter drops it unless asked not to. */
  keepCursor?: boolean
}

/** URL is the source of truth for filters, window, tabs and cursors. */
export function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const set = useCallback(
    (patch: Patch, { keepCursor = false }: SetOptions = {}) => {
      const next = new URLSearchParams(searchParams)
      if (!keepCursor) next.delete("cursor")
      for (const [key, value] of Object.entries(patch)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      const query = next.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [router, pathname, searchParams]
  )

  return { searchParams, set }
}
