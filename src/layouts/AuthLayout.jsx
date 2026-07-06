// src/layouts/AuthLayout.jsx

import { Outlet } from "react-router-dom";

import { PublicNavbar, PublicFooter } from "@/features/landing";
import { ScrollToTop } from "@/components";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      {/* Navbar */}
      <PublicNavbar />

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default AuthLayout;
