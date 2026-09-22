import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { UserMinusIcon } from "@phosphor-icons/react/ssr"

export default function CustomerNotFound() {
  return (
    <EmptyState
      icon={<UserMinusIcon />}
      title="No customer with that Zoho id"
      description="The bridge has no mapping, no audit row and nothing queued for it. Check the id, or search by name or phone."
      action={
        <Button asChild variant="outline">
          <Link href="/dashboard/customers">Back to search</Link>
        </Button>
      }
    />
  )
}
