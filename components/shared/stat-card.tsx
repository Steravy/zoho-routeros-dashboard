import type { ReactNode } from "react"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  label: string
  value: ReactNode
  /** One line under the number: what it means or what to do about it. */
  hint?: ReactNode
  /** Top-right slot — a badge or an icon. */
  action?: ReactNode
}

export function StatCard({ label, value, hint, action }: Props) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      {/* mt-auto pins the muted band flush to the bottom when a grid row stretches the card. */}
      {hint && (
        <CardFooter className="mt-auto">
          <p className="text-sm text-muted-foreground">{hint}</p>
        </CardFooter>
      )}
    </Card>
  )
}
