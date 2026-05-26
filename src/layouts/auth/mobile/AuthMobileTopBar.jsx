// src/layouts/auth/mobile/AuthMobileTopBar.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FiArrowLeft, FiShield } from "react-icons/fi";

import { AppButton } from "@/components";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";

const AuthMobileTopBar = () => {
  const location = useLocation();

  const isLoginPage = location.pathname.includes("login");
  const isRegisterPage = location.pathname.includes("register");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-[64px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text transition hover:border-primary hover:text-primary"
          >
            <FiArrowLeft className="text-[18px]" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-5 w-5 object-contain"
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[18px] font-bold tracking-tight text-text">
                Pharma<span className="text-primary">ERP</span>
              </span>

              <div className="mt-1 flex items-center gap-1">
                <FiShield className="text-[10px] text-primary" />

                <span className="text-[10px] font-medium text-primary">
                  Secure Auth
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher compact size="small" />

          {isLoginPage && (
            <AppButton
              component={Link}
              to="/register"
              variant="contained"
              colorVariant="primary"
              rounded="lg"
              sx={{
                px: "14px",
                py: "8px",
                minWidth: "unset",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Register
            </AppButton>
          )}

          {isRegisterPage && (
            <AppButton
              component={Link}
              to="/login"
              variant="contained"
              colorVariant="primary"
              rounded="lg"
              sx={{
                px: "16px",
                py: "8px",
                minWidth: "unset",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Sign In
            </AppButton>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthMobileTopBar;
