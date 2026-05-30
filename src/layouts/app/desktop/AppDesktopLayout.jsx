// src/layouts/app/desktop/AppDesktopLayout.jsx

import { Outlet } from "react-router-dom";

import AppDesktopHeader from "./AppDesktopHeader";
import AppDesktopSidebar from "./AppDesktopSidebar";
// import AppDesktopFooter from "./AppDesktopFooter";

const AppDesktopLayout = () => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="flex min-h-screen">
        <AppDesktopSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <AppDesktopHeader />

          <main className="flex-1">
            <Outlet />
          </main>

          {/* <AppDesktopFooter /> */}
        </div>
      </div>
    </div>
  );
};

export default AppDesktopLayout;
