import { useRef } from 'react';
import { Outlet } from 'react-router-dom';

import AdminSidebar from '@/components/admin/admin-sidebar';
import { Constants } from '@/Constants';
import { useMeta } from '@/hooks/useMeta';

const MainPage = () => {
  const mainRef = useRef<HTMLElement>(null);

  useMeta(
    `${Constants.SITE_TITLE} - Dashboard`,
    `Welcome to the ${Constants.SITE_TITLE} dashboard. Manage your appointments and services.`
  );

  return (
    <main ref={mainRef} className="relative">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <Outlet />
      </div>
    </main>
  );
};

export default MainPage;