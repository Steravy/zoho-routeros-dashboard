import {
  BookOpenIcon,
  GitDiffIcon,
  HardDrivesIcon,
  HeartbeatIcon,
  PulseIcon,
  QueueIcon,
  UserFocusIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr"

import { DASHBOARD_HOME } from "@/lib/constants"
import type {
  NavLink,
  NavLocation,
  NavMainItem,
  NavShortcut,
} from "@/types/nav"

export const NAV_MAIN: NavMainItem[] = [
  {
    title: "Operações",
    url: DASHBOARD_HOME,
    icon: PulseIcon,
    items: [
      { title: "Visão geral", url: DASHBOARD_HOME },
      { title: "Falhas", url: "/dashboard/failures" },
      { title: "Ação manual", url: "/dashboard/needs-human" },
      { title: "Fila", url: "/dashboard/queue" },
    ],
  },
  {
    title: "Roteador",
    url: "/dashboard/census",
    icon: HardDrivesIcon,
    items: [
      { title: "Censo", url: "/dashboard/census" },
      { title: "Divergência", url: "/dashboard/drift" },
      { title: "Quedas", url: "/dashboard/outages" },
    ],
  },
  // One destination, so no children: rendered as a flat item.
  { title: "Clientes", url: "/dashboard/customers", icon: UsersIcon, items: [] },
]

/** The three worklists an operator opens most. */
export const NAV_SHORTCUTS: NavShortcut[] = [
  { name: "Ação manual", url: "/dashboard/needs-human", icon: UserFocusIcon },
  { name: "Fila", url: "/dashboard/queue", icon: QueueIcon },
  { name: "Divergência", url: "/dashboard/drift", icon: GitDiffIcon },
]

export const NAV_SECONDARY: NavLink[] = [
  { title: "Status e config", url: "/dashboard/health", icon: HeartbeatIcon },
  { title: "Glossário", url: "/dashboard/glossary", icon: BookOpenIcon },
]

/** Overview matches only exactly; every other url also owns its nested routes. */
export function isActiveUrl(url: string, pathname: string): boolean {
  if (url === DASHBOARD_HOME) return pathname === DASHBOARD_HOME
  return pathname === url || pathname.startsWith(`${url}/`)
}

/** Section › page for the header breadcrumb, including nested routes like /customers/123. */
export function findNavLocation(pathname: string): NavLocation | undefined {
  for (const section of NAV_MAIN) {
    const page = section.items.find((item) => isActiveUrl(item.url, pathname))
    if (page) return { section, page, flat: false }
    // Flat section: it is its own page.
    if (section.items.length === 0 && isActiveUrl(section.url, pathname)) {
      return { section, page: section, flat: true }
    }
  }
  const secondary = NAV_SECONDARY.find((item) => isActiveUrl(item.url, pathname))
  if (secondary) {
    return {
      section: { title: "Bridge Ops", url: DASHBOARD_HOME, icon: secondary.icon },
      page: secondary,
      flat: false,
    }
  }
  return undefined
}
