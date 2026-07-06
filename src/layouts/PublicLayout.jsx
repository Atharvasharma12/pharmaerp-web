// src/layouts/PublicLayout.jsx

import { PublicFooter, PublicNavbar } from "@/features/landing";
import { Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <PublicNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
