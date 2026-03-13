import { ListIcon, SettingsIcon, UserCircle } from "lucide-react"

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