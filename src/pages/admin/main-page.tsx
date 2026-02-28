import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Constants } from '@/Constants';
import { useMeta } from '@/hooks/useMeta';


const AdminMainPage = () => {

  useMeta(
    `${Constants.SITE_TITLE} - Admin Panel`,
    `Welcome to the ${Constants.SITE_TITLE} admin panel. Manage your appointments and services.`
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminMainPage;