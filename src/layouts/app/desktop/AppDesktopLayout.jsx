// src/layouts/app/desktop/AppDesktopLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";

import AppDesktopHeader from "./AppDesktopHeader";
import AppDesktopSidebar from "./AppDesktopSidebar";

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 68;

const AppDesktopLayout = () => {
  // Collapsed state (false = expanded 240px, true = collapsed icon rail 68px)
  const [collapsed, setCollapsed] = useState(false);
  const { currentCompany } = useCompany();
  const { currentBranch } = useBranch();

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <div className="flex min-h-[100dvh] w-full bg-bg text-text">
      {/* Redesigned Multi-level Desktop Sidebar */}
      <AppDesktopSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onExpand={() => setCollapsed(false)}
        onCollapse={() => setCollapsed(true)}
      />

      {/* Main Content Area smoothly adjusting to sidebar width */}
      <div
        className="flex min-w-0 flex-1 flex-col transition-[margin-left] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ marginLeft: 0 }}
      >
        <AppDesktopHeader
          sidebarCollapsed={collapsed}
          sidebarWidth={sidebarWidth}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />

        <main className="mt-[58px] min-h-[calc(100dvh-58px)] min-w-0 flex-1 overflow-y-auto px-6 py-6">
          <Outlet key={`${currentCompany?._id}-${currentBranch?._id}`} />
        </main>
      </div>
    </div>
  );
};

export default AppDesktopLayout;
