// src/layouts/public/desktop/PublicDesktopLayout.jsx

import { Outlet } from "react-router-dom";
import PublicDesktopNavbar from "./PublicDesktopNavbar";
import PublicDesktopFooter from "./PublicDesktopFooter";

const PublicDesktopLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* <PublicDesktopNavbar /> */}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* <PublicDesktopFooter /> */}
    </div>
  );
};

export default PublicDesktopLayout;
