import Link from "next/link"

import { LoginForm } from "@/components/login-form"
import { DASHBOARD_HOME } from "@/lib/constants"
import { loginSearchSchema } from "@/lib/validations/auth"
import type { SearchParams } from "@/types/query"
import { CommandIcon } from "@phosphor-icons/react/ssr"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function LoginPage({ searchParams }: Props) {
  const { next, reason } = loginSearchSchema.parse(await searchParams)

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href={DASHBOARD_HOME} className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CommandIcon className="size-4" />
            </div>
            Bridge Ops
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm next={next} reason={reason} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex flex-col justify-end p-10 text-muted-foreground">
          <p className="text-lg font-medium text-foreground">Zoho ↔ RouterOS</p>
          <p className="max-w-sm text-sm text-balance">
            The bridge creates, unblocks, blocks and deletes customer access on the
            router as billing events arrive. This dashboard shows what happened and
            what needs a human.
          </p>
        </div>
      </div>
    </div>
  )
}
