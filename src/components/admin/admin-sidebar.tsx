import {
  Calendar, Clock,
  Users
} from 'lucide-react';
import { useLocation } from 'react-router-dom';


export default function AdminSidebar() {

  const { pathname } = useLocation()

  return (
    <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 bg-white rounded-lg"><Clock size={20} className="text-black" /></div>
        <h1 className="font-black tracking-tighter uppercase text-xl">Saqo Admin</h1>
      </div>

      <nav className="space-y-2">
        <NavLink icon={<Calendar />} label="Bookings" active={pathname === '/manage/appointments'} href='appointments' />
        <NavLink icon={<Clock />} label="Schedules" active={pathname === '/manage/schedule'} href='schedule' />
        <NavLink icon={<Users />} label="Barbers" active={pathname === '/manage/barbers'} href='barbers' />
        {/* <NavLink icon={<Settings />} label="Settings" active={pathname === '/manage/settings'} href='settings' /> */}
      </nav>
    </aside>
  );
}


function NavLink({ icon, label, active, href }: any) {
  return (
    <a
      href={`/manage/${href}`}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${active ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
        }`}
    >
      {icon} {label}
    </a>
  );
}
