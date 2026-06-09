// src/layouts/app/mobile/AppMobileHeader.jsx

import React from "react";
import { Link } from "react-router-dom";
import { FiBell, FiMenu } from "react-icons/fi";

import { AppAvatar, AppIconButton } from "@/components";
import { ROUTES } from "@/constants";

const AppMobileHeader = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <AppIconButton
            icon={<FiMenu className="text-[22px]" />}
            onClick={onMenuClick}
            variant="text"
            colorVariant="dark"
            rounded="lg"
            aria-label="Open menu"
            sx={{
              width: 38,
              height: 38,
              minWidth: 38,
            }}
          />

          <Link
            to={ROUTES.SETUP_CENTER}
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-6 w-6 object-contain"
              />
            </div>

            <div className="min-w-0 leading-none">
              <div className="truncate text-[22px] font-bold tracking-tight text-text">
                Pharma<span className="text-primary">ERP</span>
              </div>

              <div className="mt-1 truncate text-[10px] font-medium text-text-muted">
                Retail Pharmacy Management
              </div>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface-hover hover:text-primary"
            >
              <FiBell className="text-[21px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>

            <Link to={ROUTES.PROFILE}>
              <AppAvatar name="Admin" initials="AD" size="small" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppMobileHeader;
