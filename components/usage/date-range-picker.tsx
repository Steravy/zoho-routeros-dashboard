"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { USAGE_TIMEZONE } from "@/lib/constants"
import { localDateToYmd, toYmd, ymdToLocalDate } from "@/lib/usage/time"
import { CalendarBlankIcon } from "@phosphor-icons/react/ssr"

interface Props {
  /** Applied range as calendar dates (`YYYY-MM-DD`, both inclusive); absent while a preset is active. */
  from?: string
  to?: string
  onApply: (from: string, to: string) => void
  /** Return a sentence to refuse a range (e.g. too many buckets); `null` accepts it. */
  validate?: (from: string, to: string) => string | null
}

const shortDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })

/**
 * Custom range. Days are calendar days in the bridge's timezone: the widget
 * only picks dates, and the server turns them into instants.
 */
export function DateRangePicker({ from, to, onApply, validate }: Props) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>()

  const applied = from && to ? { from: ymdToLocalDate(from), to: ymdToLocalDate(to) } : undefined
  // "Today" as the bridge sees it — history cannot exist past it.
  const today = ymdToLocalDate(toYmd(Date.now(), USAGE_TIMEZONE))

  const draftFrom = draft?.from ? localDateToYmd(draft.from) : undefined
  const draftTo = draft?.to ? localDateToYmd(draft.to) : undefined
  const complete = Boolean(draftFrom && draftTo)
  const problem = draftFrom && draftTo && validate ? validate(draftFrom, draftTo) : null

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setDraft(applied)
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" data-active={Boolean(applied)} className="data-[active=true]:bg-muted">
          <CalendarBlankIcon />
          {applied?.from && applied.to
            ? `${shortDate.format(applied.from)} – ${shortDate.format(applied.to)}`
            : "Personalizado"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          locale={ptBR}
          weekStartsOn={1}
          numberOfMonths={isMobile ? 1 : 2}
          defaultMonth={draft?.from ?? applied?.from ?? today}
          selected={draft}
          onSelect={setDraft}
          disabled={today ? { after: today } : undefined}
        />
        <div className="flex items-center justify-between gap-3 border-t p-3">
          <p
            role={problem ? "alert" : undefined}
            className={
              problem ? "max-w-64 text-xs text-destructive" : "max-w-64 text-xs text-muted-foreground"
            }
          >
            {problem ?? "Dias no horário de Cabo Verde."}
          </p>
          <Button
            size="sm"
            disabled={!complete || Boolean(problem)}
            onClick={() => {
              if (!draftFrom || !draftTo) return
              onApply(draftFrom, draftTo)
              setOpen(false)
            }}
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
