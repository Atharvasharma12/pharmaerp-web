// src/layouts/auth/desktop/AuthDesktopTopBar.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FiArrowLeft, FiShield } from "react-icons/fi";

import { AppButton } from "@/components";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";

const AuthDesktopTopBar = () => {
  const location = useLocation();

  const isLoginPage = location.pathname.includes("login");
  const isRegisterPage = location.pathname.includes("register");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-7 w-7 object-contain"
              />
            </div>

            <span className="text-[24px] font-bold tracking-tight text-text">
              Pharma<span className="text-primary">ERP</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-2 lg:flex">
            <FiShield className="text-[15px] text-primary" />

            <span className="text-[13px] font-semibold text-primary">
              Secure Authentication
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AppButton
            component={Link}
            to="/"
            startIcon={<FiArrowLeft className="text-[16px]" />}
            variant="text"
            colorVariant="dark"
            rounded="lg"
            sx={{
              px: "14px",
              py: "9px",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Back to Website
          </AppButton>

          <ThemeSwitcher />

          {isLoginPage && (
            <AppButton
              component={Link}
              to="/register"
              variant="contained"
              colorVariant="primary"
              rounded="lg"
              sx={{
                px: "20px",
                py: "10px",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Create Account
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
                px: "20px",
                py: "10px",
                fontSize: "14px",
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

export default AuthDesktopTopBar;
