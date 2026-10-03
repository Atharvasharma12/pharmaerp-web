// src/layouts/auth/desktop/AuthDesktopLayout.jsx

import { Outlet } from "react-router-dom";

const AuthDesktopLayout = () => {
  return (
    <div className="relative min-h-screen w-full bg-bg text-text selection:bg-primary/20 selection:text-primary">
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthDesktopLayout;
