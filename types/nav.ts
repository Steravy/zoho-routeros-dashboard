// Type-only: erased at compile time, so this never pulls the CSR entry into a bundle.
import type { Icon } from "@phosphor-icons/react"

export interface NavSubItem {
  title: string
  url: string
}

/** A collapsible entry in the Platform group. */
export interface NavMainItem {
  title: string
  url: string
  icon: Icon
  items: NavSubItem[]
}

export interface NavLink {
  title: string
  url: string
  icon: Icon
}

export interface NavShortcut {
  name: string
  url: string
  icon: Icon
}

export interface NavLocation {
  section: NavLink
  page: NavSubItem
  /** The section is its own page (no children) — render a single crumb. */
  flat: boolean
}
