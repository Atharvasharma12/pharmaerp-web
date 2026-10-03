// src/layouts/app/mobile/AppMobileSidebar.jsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ROUTES } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import { useSetupStatus } from "@/features/setup/hooks/useSetupStatus";
import { usePermission } from "@/hooks";
import { UIConfirmDialog } from "@/components/ui";

import {
  SIDEBAR_NAV_GROUPS,
  SidebarItem,
  SidebarCompanySelector,
  SidebarUserProfile,
  SidebarScrollArea,
} from "../components/sidebar";
import { filterNavByPermission } from "../components/sidebar/filterNavByPermission";

const AppMobileSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user, logout, clearCredentials } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { currentWorkspace } = useWorkspace();
  const { currentCompany } = useCompany();
  const { currentBranch } = useBranch();
  const { isSetupComplete, companyCompleted, branchCompleted } = useSetupStatus();
  const { can, canAny, isOwner } = usePermission();

  // Filter nav groups by permissions, owner status, and setup completion
  const visibleNavGroups = useMemo(
    () =>
      filterNavByPermission(
        SIDEBAR_NAV_GROUPS,
        can,
        canAny,
        isOwner,
        { 
          isSetupComplete, 
          companyCompleted, 
          branchCompleted, 
          hasActiveCompany: !!currentCompany, 
          hasActiveBranch: !!currentBranch 
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [can, canAny, isOwner, isSetupComplete, companyCompleted, branchCompleted, currentCompany, currentBranch],
  );

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearCredentials();
      setIsLogoutDialogOpen(false);
      onClose();
      window.location.href = ROUTES.LOGIN;
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
          "transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between overflow-hidden",
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
            {visibleNavGroups.map((group) => (
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
            onLogout={handleLogoutClick}
          />
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <UIConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign out"
        description="Are you sure you want to sign out of your account?"
        intent="danger"
        confirmText="Sign out"
        cancelText="Cancel"
        isLoading={isLoggingOut}
        icon={<LogOut className="size-5 sm:size-6 text-error" />}
      />
    </>
  );
};

export default AppMobileSidebar;
