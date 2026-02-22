import { useRef } from 'react';

import { useMeta } from '@/hooks/useMeta';

const MainPage = () => {
  const mainRef = useRef<HTMLElement>(null);
  
  useMeta(
    "Saqo Hair Salon - Dashboard",
    "Welcome to the Saqo Hair Salon dashboard. Manage your appointments and services."
  );

  return (
    <main ref={mainRef} className="bg-[#0f0f0f] text-white overflow-x-hidden">
      Dashboard
    </main>
  );
};

export default MainPage;