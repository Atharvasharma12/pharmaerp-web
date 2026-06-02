// src/layouts/app/desktop/AppDesktopLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppDesktopHeader from "./AppDesktopHeader";
import AppDesktopSidebar from "./AppDesktopSidebar";

const AppDesktopLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen overflow-hidden bg-bg text-text">
      <AppDesktopSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={[
          "flex h-screen min-w-0 flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-[230px]" : "ml-0",
        ].join(" ")}
      >
        <AppDesktopHeader
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="mt-[58px] h-[calc(100vh-58px)] min-w-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppDesktopLayout;
