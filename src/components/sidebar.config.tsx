import { ListIcon, MenuSquare,SettingsIcon, UserCircle } from "lucide-react"

export const sidebarConfig = {
  pages: [
    {
      title: "Appointments",
      url: "/appointments",
      icon: (
        <ListIcon />
      ),
    },
    {
      title: "Services (Menu)",
      url: "/menu",
      icon: (
        <MenuSquare />
      ),
    },
    {
      title: "Barbers",
      url: "/barbers",
      icon: (
        <UserCircle />
      ),
    },
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <SettingsIcon />
      ),
    },
  ],
}