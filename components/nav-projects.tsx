"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { isActiveUrl } from "@/lib/nav"
import type { NavShortcut } from "@/types/nav"
import {
  ArrowSquareOutIcon,
  DotsThreeOutlineIcon,
  LinkIcon,
} from "@phosphor-icons/react/ssr"

interface Props {
  shortcuts: NavShortcut[]
}

export function NavProjects({ shortcuts }: Props) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`)
      toast.success("Link copied")
    } catch {
      toast.error("Could not copy the link")
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
      <SidebarMenu>
        {shortcuts.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={isActiveUrl(item.url, pathname)}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="aria-expanded:bg-muted"
                >
                  <DotsThreeOutlineIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem asChild>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <ArrowSquareOutIcon className="text-muted-foreground" />
                    <span>Open in new tab</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => copyLink(item.url)}>
                  <LinkIcon className="text-muted-foreground" />
                  <span>Copy link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
