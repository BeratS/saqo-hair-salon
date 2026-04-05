import { BanknoteArrowDownIcon, ListIcon, MenuSquare, SettingsIcon, UserCircle } from "lucide-react"

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
      title: "Cancel Requests",
      url: "/cancel-booking",
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
    {
      title: "Monthly Payments",
      url: "/monthly-payments",
      icon: (
        <BanknoteArrowDownIcon />
      ),
    },
  ],
}