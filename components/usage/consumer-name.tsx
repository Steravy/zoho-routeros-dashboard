import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { customerUsageHref } from "@/lib/usage/links"
import type { TopConsumer } from "@/types/ops"

interface Props {
  consumer: Pick<TopConsumer, "zohoCustomerId" | "name">
}

/**
 * Who a ranking row belongs to. A mapped secret links to its customer's usage;
 * a secret no customer is mapped to is labelled and is not a link.
 */
export function ConsumerName({ consumer }: Props) {
  if (!consumer.zohoCustomerId) {
    return (
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        —<Badge variant="outline">Não mapeado</Badge>
      </span>
    )
  }

  return (
    <Link href={customerUsageHref(consumer.zohoCustomerId)} className="font-medium hover:underline">
      {consumer.name ?? "—"}
    </Link>
  )
}
