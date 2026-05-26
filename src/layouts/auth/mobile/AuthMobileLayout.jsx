// src/layouts/auth/mobile/AuthMobileLayout.jsx

import { Outlet } from "react-router-dom";

import AuthMobileTopBar from "./AuthMobileTopBar";
import AuthMobileBottomBar from "./AuthMobileBottomBar";

const AuthMobileLayout = () => {
  return (
    <div className="min-h-screen bg-bg pb-16 text-text">
      <AuthMobileTopBar />

      <main className="min-h-[calc(100vh-128px)]">
        <Outlet />
      </main>

      <AuthMobileBottomBar />
    </div>
  );
};

export default AuthMobileLayout;
