// src/layouts/app/mobile/AppMobileLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppMobileHeader from "./AppMobileHeader";
import AppMobileBottomNav from "./AppMobileBottomNav";
import AppMobileSidebar from "./AppMobileSidebar";

const AppMobileLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg pb-16 text-text">
      <AppMobileHeader onMenuClick={() => setSidebarOpen(true)} />

      <AppMobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-[calc(100vh-128px)] px-4 py-4">
        <Outlet />
      </main>

      <AppMobileBottomNav />
    </div>
  );
};

export default AppMobileLayout;
