// src/layouts/app/mobile/AppMobileLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";

import AppMobileHeader from "./AppMobileHeader";
import AppMobileBottomNav from "./AppMobileBottomNav";
import AppMobileSidebar from "./AppMobileSidebar";

const AppMobileLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentCompany } = useCompany();
  const { currentBranch } = useBranch();

  return (
    <div className="min-h-screen bg-bg pb-16 text-text">
      <AppMobileHeader onMenuClick={() => setSidebarOpen(true)} />

      <AppMobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-[calc(100vh-128px)] px-3 py-4">
        <Outlet key={`${currentCompany?._id}-${currentBranch?._id}`} />
      </main>

      <AppMobileBottomNav />
    </div>
  );
};

export default AppMobileLayout;
