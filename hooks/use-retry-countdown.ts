"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * The 429 carries its wait only inside the message. Count it down and
 * re-enable the form when it reaches zero.
 */
export function useRetryCountdown() {
  const [retryIn, setRetryIn] = useState(0)

  useEffect(() => {
    if (retryIn <= 0) return
    const timer = setTimeout(() => setRetryIn((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [retryIn])

  const start = useCallback((seconds: number | undefined) => {
    setRetryIn(seconds && seconds > 0 ? seconds : 0)
  }, [])

  return { retryIn, locked: retryIn > 0, start }
}
