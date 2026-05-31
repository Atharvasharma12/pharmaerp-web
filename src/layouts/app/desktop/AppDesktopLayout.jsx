// src/layouts/app/desktop/AppDesktopLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppDesktopHeader from "./AppDesktopHeader";
import AppDesktopSidebar from "./AppDesktopSidebar";

const AppDesktopLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="flex min-h-screen">
        <AppDesktopSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <AppDesktopHeader
            sidebarOpen={sidebarOpen}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppDesktopLayout;
