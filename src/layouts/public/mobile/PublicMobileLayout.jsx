// src/layouts/public/mobile/PublicMobileLayout.jsx

import { Outlet } from "react-router-dom";
import PublicMobileTopBar from "./PublicMobileTopBar";
import PublicMobileBottomBar from "./PublicMobileBottomBar";

const PublicMobileLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white pb-16">
      <PublicMobileTopBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicMobileBottomBar />
    </div>
  );
};

export default PublicMobileLayout;
