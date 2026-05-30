// src/layouts/app/desktop/AppDesktopHeader.jsx

import React from "react";
import { Link } from "react-router-dom";

import {
  FiBell,
  FiChevronDown,
  FiHelpCircle,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";

import { AppAvatar, AppIconButton, AppSearchInput } from "@/components";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";
import { ROUTES } from "@/constants";

const AppDesktopHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-divider bg-surface/90 backdrop-blur-md">
      <div className="flex h-[58px] w-full items-center justify-between px-5 lg:px-6">
        <button
          type="button"
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

          <FiChevronDown className="text-[15px] text-text-muted" />
        </button>

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

          <Link
            to={ROUTES.PROFILE}
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

            <FiChevronDown className="hidden text-[15px] text-text-muted xl:block" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppDesktopHeader;
