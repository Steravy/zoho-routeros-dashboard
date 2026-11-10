"use client"

import { useEffect, useRef, useState } from "react"

import { readLiveUsage } from "@/app/dashboard/customers/[id]/actions"
import { LIVE_HISTORY, LIVE_POLL_MS } from "@/lib/constants"
import type { LiveUsageData, RouterRead } from "@/types/ops"
import type { LiveSample } from "@/types/ui"

export type LiveUsageState =
  | { status: "loading" }
  | { status: "ready"; read: RouterRead<LiveUsageData> }
  /** The read itself failed (API unreachable, 4xx/5xx) — not the same as `available: false`. */
  | { status: "error"; message: string }

/**
 * Polls a customer's live usage while — and only while — the element holding
 * `containerRef` is on screen and the browser tab is visible. Each read queries
 * the router, so reads never overlap and never start less than `LIVE_POLL_MS`
 * apart, even when visibility flips back and forth. The speed history lives in
 * memory only and is gone when the panel unmounts.
 */
export function useLiveUsage(zohoCustomerId: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastStartedAt = useRef(0)
  const [state, setState] = useState<LiveUsageState>({ status: "loading" })
  const [history, setHistory] = useState<Record<string, LiveSample[]>>({})
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sync = () => setTabVisible(document.visibilityState === "visible")
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [])

  const active = onScreen && tabVisible

  useEffect(() => {
    if (!active) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const tick = async () => {
      lastStartedAt.current = Date.now()
      let next: LiveUsageState
      try {
        const result = await readLiveUsage(zohoCustomerId)
        next = result.ok
          ? { status: "ready", read: result.data }
          : { status: "error", message: result.message }
      } catch {
        // A dropped connection rejects the action call itself.
        next = { status: "error", message: "Não foi possível conectar à API" }
      }
      if (cancelled) return

      setState(next)
      if (next.status === "ready" && next.read.data) {
        const at = Date.now()
        const lines = next.read.data.lines
        setHistory((previous) => {
          const updated: Record<string, LiveSample[]> = {}
          for (const line of lines) {
            // A line that went offline starts a fresh history when it returns.
            if (!line.online) continue
            const sample = {
              at,
              download: line.downloadBitsPerSecond ?? 0,
              upload: line.uploadBitsPerSecond ?? 0,
            }
            updated[line.routerosUsername] = [
              ...(previous[line.routerosUsername] ?? []),
              sample,
            ].slice(-LIVE_HISTORY)
          }
          return updated
        })
      }
      timer = setTimeout(tick, LIVE_POLL_MS)
    }

    // Resuming must not beat the floor: wait out what is left of the interval.
    const wait = Math.max(0, LIVE_POLL_MS - (Date.now() - lastStartedAt.current))
    timer = setTimeout(tick, wait)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [active, zohoCustomerId])

  return { containerRef, state, history, paused: !active }
}
