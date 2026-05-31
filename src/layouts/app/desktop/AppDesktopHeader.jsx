// src/layouts/app/desktop/AppDesktopHeader.jsx

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiBell,
  FiBriefcase,
  FiChevronDown,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import { AppAvatar, AppIconButton, AppSearchInput } from "@/components";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";
import { ROUTES } from "@/constants";

const AppDesktopHeader = ({ sidebarOpen, onMenuClick }) => {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const workspaceRef = useRef(null);
  const profileRef = useRef(null);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-divider bg-surface/90 backdrop-blur-md">
      <div className="flex h-[58px] w-full items-center justify-between px-5 lg:px-6">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <AppIconButton
              icon={<FiMenu className="text-[22px]" />}
              onClick={onMenuClick}
              variant="text"
              colorVariant="dark"
              size="medium"
              rounded="lg"
              tooltip="Open Sidebar"
            />
          )}

          <div ref={workspaceRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setWorkspaceOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="flex min-w-[180px] items-center justify-between gap-3 rounded-xl bg-primary-soft/70 px-3 py-2 transition hover:bg-primary-soft"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-[17px] text-primary shadow-sm">
                  <FiShoppingBag />
                </span>

                <span className="text-left">
                  <span className="block text-[13px] font-semibold leading-none text-text">
                    My Pharmacy
                  </span>
                  <span className="mt-1 block text-[11px] font-normal leading-none text-text-muted">
                    Workspace
                  </span>
                </span>
              </span>

              <FiChevronDown
                className={[
                  "text-[15px] text-text-muted transition-transform duration-200",
                  workspaceOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {workspaceOpen && (
              <div className="absolute left-0 top-[46px] z-50 w-[240px] rounded-xl border border-divider bg-surface p-2 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-surface-hover"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <FiShoppingBag />
                  </span>

                  <span>
                    <span className="block text-[13px] font-semibold text-text">
                      My Pharmacy
                    </span>
                    <span className="mt-0.5 block text-[11px] text-text-muted">
                      Current workspace
                    </span>
                  </span>
                </button>

                <div className="my-2 h-px bg-divider" />

                <Link
                  to="/companies"
                  onClick={() => setWorkspaceOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiBriefcase className="text-[16px]" />
                  Manage Companies
                </Link>

                <Link
                  to="/branches"
                  onClick={() => setWorkspaceOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiSettings className="text-[16px]" />
                  Workspace Settings
                </Link>

                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-primary transition hover:bg-primary-soft"
                >
                  <FiPlus className="text-[16px]" />
                  Add Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mx-6 flex flex-1 justify-center">
          <AppSearchInput
            placeholder="Search anything... (Ctrl + K)"
            size="small"
            variant="soft"
            rounded="lg"
            startIcon={<FiSearch />}
            sx={{
              width: "100%",
              maxWidth: 440,
            }}
            inputSx={{
              height: 36,
              fontSize: 12,
              borderRadius: "12px",
              backgroundColor: "var(--app-color-bg)",
              boxShadow: "var(--app-shadow-xs)",
            }}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AppIconButton
            icon={<FiBell />}
            variant="text"
            colorVariant="dark"
            size="small"
            rounded="lg"
            tooltip="Notifications"
          />

          <Link
            to="/help-center"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-primary"
          >
            <FiHelpCircle className="text-[15px]" />
            <span>Help</span>
          </Link>

          <ThemeSwitcher size="small" />

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setWorkspaceOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-surface-hover"
            >
              <AppAvatar name="Admin" initials="AD" size="small" />

              <span className="hidden text-left xl:block">
                <span className="block text-[12px] font-semibold leading-none text-text">
                  Admin
                </span>
                <span className="mt-1 block text-[11px] font-normal leading-none text-text-muted">
                  Owner
                </span>
              </span>

              <FiChevronDown
                className={[
                  "hidden text-[15px] text-text-muted transition-transform duration-200 xl:block",
                  profileOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[46px] z-50 w-[230px] rounded-xl border border-divider bg-surface p-2 shadow-lg">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <AppAvatar name="Admin" initials="AD" size="medium" />

                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-text">
                      Admin
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-text-muted">
                      Owner
                    </div>
                  </div>
                </div>

                <div className="my-2 h-px bg-divider" />

                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiUser className="text-[16px]" />
                  My Profile
                </Link>

                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiSettings className="text-[16px]" />
                  Account Settings
                </Link>

                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-error transition hover:bg-error-soft"
                >
                  <FiLogOut className="text-[16px]" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppDesktopHeader;
