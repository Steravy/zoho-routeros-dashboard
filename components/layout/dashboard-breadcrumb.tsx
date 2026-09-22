"use client"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { findNavLocation } from "@/lib/nav"

/** Section › page, derived from the nav config so it follows every route automatically. */
export function DashboardBreadcrumb() {
  const location = findNavLocation(usePathname())
  if (!location) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* A flat section is its own page — one crumb, no separator. */}
        {!location.flat && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={location.section.url}>
                {location.section.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{location.page.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
