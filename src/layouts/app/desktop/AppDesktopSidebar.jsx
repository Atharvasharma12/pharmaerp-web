// src/layouts/app/desktop/AppDesktopSidebar.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";

import {
  SIDEBAR_NAV_GROUPS,
  SidebarItem,
  SidebarCompanySelector,
  SidebarUserProfile,
  SidebarScrollArea,
} from "../components/sidebar";

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 68;

const AppDesktopSidebar = ({
  collapsed = false,
  onToggleCollapse,
  onExpand,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user, logout, clearCredentials } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearCredentials();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const handleSidebarExpand = () => {
    if (onExpand) {
      onExpand();
    } else if (collapsed && onToggleCollapse) {
      onToggleCollapse();
    }
  };

  const currentWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <div
      className="relative shrink-0 transition-[width] duration-200 ease-out"
      style={{ width: currentWidth }}
    >
      <aside
        className="fixed left-0 top-0 z-30 h-[100dvh] border-r border-border bg-surface shadow-xs transition-[width] duration-200 ease-out overflow-hidden flex flex-col justify-between"
        style={{ width: currentWidth }}
      >
        {/* ── TOP: Company & Branch Tabbed Selector ───────────────────── */}
        <SidebarCompanySelector
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          onClose={onClose}
        />

        {/* ── MIDDLE: Multi-Level Navigation Tree (WhatsApp-Style Auto-Hiding Scrollbar) ── */}
        <SidebarScrollArea className="px-2 py-2 space-y-3">
          <nav className="space-y-3">
            {SIDEBAR_NAV_GROUPS.map((group) => (
              <div key={group.id} className="space-y-0.5">
                {/* Subtle Group Label (11px uppercase) */}
                {!collapsed && (
                  <div className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-text-muted/70">
                    {group.label}
                  </div>
                )}

                {/* Group Tree Items */}
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.id || item.label}
                      item={item}
                      level={1}
                      collapsed={collapsed}
                      onExpand={handleSidebarExpand}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </SidebarScrollArea>

        {/* ── BOTTOM: User Profile ───────────────────────────────────── */}
        <div className="shrink-0">
          <SidebarUserProfile
            user={user}
            collapsed={collapsed}
            onLogout={handleLogout}
          />
        </div>
      </aside>
    </div>
  );
};

export default AppDesktopSidebar;
