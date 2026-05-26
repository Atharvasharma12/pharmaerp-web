// src/layouts/auth/desktop/AuthDesktopLayout.jsx

import { Outlet } from "react-router-dom";

import AuthDesktopTopBar from "./AuthDesktopTopBar";
import AuthDesktopFooter from "./AuthDesktopFooter";

const AuthDesktopLayout = () => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <AuthDesktopTopBar />

      <main className="min-h-[calc(100vh-136px)]">
        <Outlet />
      </main>

      <AuthDesktopFooter />
    </div>
  );
};

export default AuthDesktopLayout;
