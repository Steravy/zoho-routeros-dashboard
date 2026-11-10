"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CUSTOMER_TABS, DEFAULT_CUSTOMER_TAB } from "@/lib/constants"
import { CUSTOMER_TAB_LABELS } from "@/lib/labels"
import type { CustomerTab } from "@/types/ui"

interface Props {
  value: CustomerTab
}

/**
 * The three views of a customer. Writes `?tab=` and nothing else: filters and
 * cursors belong to one tab, so they are dropped on the way out.
 */
export function CustomerTabs({ value }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  return (
    <Tabs
      value={value}
      onValueChange={(next) =>
        startTransition(() =>
          router.push(next === DEFAULT_CUSTOMER_TAB ? pathname : `${pathname}?tab=${next}`)
        )
      }
    >
      <div className="flex items-center gap-2">
        <TabsList variant="line">
          {CUSTOMER_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {CUSTOMER_TAB_LABELS[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
        {pending && <Spinner className="text-muted-foreground" />}
      </div>
    </Tabs>
  )
}
