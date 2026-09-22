"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQueryParams } from "@/hooks/use-query-params"
import { NEEDS_HUMAN_CODES } from "@/lib/constants"
import { FAILURE_CODE_LABELS } from "@/lib/labels"
import type { NeedsHumanCode } from "@/types/ops"

interface Props {
  value: NeedsHumanCode
}

/** The API filters one failure code per call, so the two human-fixable codes are tabs. */
export function NeedsHumanTabs({ value }: Props) {
  const { set } = useQueryParams()

  return (
    <Tabs value={value} onValueChange={(next) => set({ code: next })}>
      <TabsList variant="line">
        {NEEDS_HUMAN_CODES.map((code) => (
          <TabsTrigger key={code} value={code}>
            {FAILURE_CODE_LABELS[code]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
