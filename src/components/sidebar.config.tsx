import { ChartBarIcon, FolderIcon, LayoutDashboardIcon, ListIcon } from "lucide-react"

export const sidebarConfig = {
  pages: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon />
      ),
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: (
        <ListIcon />
      ),
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: (
        <ChartBarIcon />
      ),
    },
    {
      title: "Barbers",
      url: "/barbers",
      icon: (
        <FolderIcon />
      ),
    },
  ],
}