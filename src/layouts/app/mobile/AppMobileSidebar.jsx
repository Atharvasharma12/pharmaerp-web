// src/layouts/app/mobile/AppMobileSidebar.jsx

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

const AppMobileSidebar = ({ open, onClose }) => {
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
      onClose();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Slide-out Mobile Sidebar Sheet */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-[275px] max-w-[85vw] border-r border-border bg-surface shadow-[var(--app-shadow-xl)]",
          "transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col justify-between overflow-hidden",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* ── TOP: Company & Branch Tabbed Selector ───────────────────── */}
        <SidebarCompanySelector
          collapsed={false}
          onClose={onClose}
          showClose={true}
        />

        {/* ── MIDDLE: Multi-Level Navigation Tree (WhatsApp-Style Auto-Hiding Scrollbar) ── */}
        <SidebarScrollArea className="px-2 py-2 space-y-3">
          <nav className="space-y-3">
            {SIDEBAR_NAV_GROUPS.map((group) => (
              <div key={group.id} className="space-y-0.5">
                {/* Subtle Group Label (11px uppercase) */}
                <div className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-text-muted/70">
                  {group.label}
                </div>

                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.id || item.label}
                      item={item}
                      level={1}
                      collapsed={false}
                      onItemClick={onClose}
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
            collapsed={false}
            onLogout={handleLogout}
          />
        </div>
      </aside>
    </>
  );
};

export default AppMobileSidebar;
