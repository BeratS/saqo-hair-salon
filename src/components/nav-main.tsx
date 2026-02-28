"use client"

import { Link, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="pt-4">
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}>
              <SidebarMenuButton
                className={cn("rounded-lg min-h-11 mt-1",
                  pathname.includes(item.url)
                    ? "bg-primary text-primary-foreground hover:bg-primary"
                    : "hover:bg-muted"
                )}
                render={<Link to={`/manage${item.url}`} />}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
