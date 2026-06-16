import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiMenu,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { AppAvatar, AppIconButton } from "@/components";
import { ROUTES } from "@/constants";

import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import AppMobileContextSheet from "./AppMobileContextSheet";

const AppMobileHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [contextSheetOpen, setContextSheetOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const { user, logout, clearCredentials } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { currentCompany } = useCompany();
  const { currentBranch } = useBranch();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearCredentials();
      setProfileOpen(false);
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  // Compute clean text descriptions for context indicators
  const currentWorkspaceName = currentWorkspace?.name || "Select Workspace";
  const currentCompanyName = currentCompany?.name || "Select Company";
  const currentBranchName = currentBranch?.name || "Select Branch";

  const userName = user?.name || user?.fullName || "Admin";
  const userRole = user?.role || "Owner";
  const userInitials = userName
    ?.split(" ")
    ?.map((word) => word?.[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-divider bg-bg/95 backdrop-blur-md">
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* Sidebar Toggle */}
            <AppIconButton
              icon={<FiMenu className="text-[22px]" />}
              onClick={onMenuClick}
              variant="text"
              colorVariant="dark"
              rounded="lg"
              aria-label="Open menu"
              sx={{
                width: 36,
                height: 36,
                minWidth: 36,
                style: { height: "36px", width: "36px" },
              }}
            />

            {/* Middle Module: Interactive Multi-Context Trigger Selector */}
            <button
              type="button"
              onClick={() => {
                setContextSheetOpen(true);
                setProfileOpen(false);
              }}
              className="flex min-w-0 flex-1 items-center justify-between gap-1.5 rounded-xl border border-divider bg-surface px-2.5 py-1 text-left shadow-xs transition active:bg-surface-hover"
            >
              <div className="min-w-0 flex-1">
                {/* Primary App Context Tier Name */}
                <div className="truncate text-xs font-bold text-text leading-tight">
                  {currentCompanyName !== "Select Company"
                    ? currentCompanyName
                    : currentWorkspaceName}
                </div>

                {/* Context Breadcrumbs Detail Row */}
                <div className="mt-0.5 flex items-center gap-1.5 truncate text-[9px] font-medium text-text-muted leading-none">
                  <span className="truncate max-w-[70px]">
                    {currentWorkspaceName}
                  </span>
                  {currentCompanyName !== "Select Company" && (
                    <>
                      <span className="text-divider">•</span>
                      <span className="truncate max-w-[75px] text-primary">
                        {currentBranchName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <FiChevronDown className="shrink-0 text-xs text-text-muted" />
            </button>

            {/* Global Utility Controls Actions Segment */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition active:bg-surface-hover active:text-primary"
              >
                <FiBell className="text-[20px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              {/* Profile Dropdown Container */}
              <div ref={profileRef} className="relative shrink-0 pl-0.5">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center justify-center rounded-xl transition active:scale-95"
                  aria-label="Toggle profile menu"
                >
                  <AppAvatar
                    name={userName}
                    initials={userInitials}
                    size="small"
                  />
                </button>

                {/* Dropdown Card Overlays */}
                {profileOpen && (
                  <div className="absolute right-0 top-[42px] z-50 w-[220px] rounded-xl border border-divider bg-surface p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-2.5 px-2.5 py-2">
                      <AppAvatar
                        name={userName}
                        initials={userInitials}
                        size="small"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-text">
                          {userName}
                        </div>
                        <div className="mt-0.5 truncate text-[10px] text-text-muted">
                          {userRole}
                        </div>
                      </div>
                    </div>

                    <div className="my-1.5 h-px bg-divider" />

                    <Link
                      to={ROUTES.PROFILE}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-text-muted transition active:bg-surface-hover active:text-text"
                    >
                      <FiUser className="text-[14px]" />
                      My Profile
                    </Link>

                    <Link
                      to={ROUTES.SETTINGS}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-text-muted transition active:bg-surface-hover active:text-text"
                    >
                      <FiSettings className="text-[14px]" />
                      Account Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-error transition active:bg-error-soft"
                    >
                      <FiLogOut className="text-[14px]" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Sheet Dropdown Overlay Dialog */}
      <AppMobileContextSheet
        isOpen={contextSheetOpen}
        onClose={() => setContextSheetOpen(false)}
      />
    </>
  );
};

export default AppMobileHeader;
