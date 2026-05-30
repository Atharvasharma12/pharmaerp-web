// src/layouts/app/desktop/AppDesktopFooter.jsx

import React from "react";

const AppDesktopFooter = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="flex h-14 items-center justify-between px-6">
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} Pharma ERP
        </p>

        <p className="text-xs text-text-muted">Version 1.0.0</p>
      </div>
    </footer>
  );
};

export default AppDesktopFooter;
