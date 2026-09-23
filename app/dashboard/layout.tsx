import { Suspense } from "react"
import { cookies } from "next/headers"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardBreadcrumb } from "@/components/layout/dashboard-breadcrumb"
import { DryRunIndicator } from "@/components/layout/dry-run-indicator"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getMe } from "@/lib/api/auth"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // /me on every render: confirms the token still works (a removed operator or a
  // changed password is a 401 → login) and tells us whether to show admin nav.
  const [me, cookieStore] = await Promise.all([getMe(), cookies()])
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar actor={me.actor} isAdmin={me.isAdmin} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <DashboardBreadcrumb />
          </div>
          <div className="ml-auto flex items-center px-4">
            {/* Own boundary: a slow /config must never block navigation. */}
            <Suspense fallback={null}>
              <DryRunIndicator />
            </Suspense>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
