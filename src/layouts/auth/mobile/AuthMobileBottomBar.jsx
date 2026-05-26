// src/layouts/auth/mobile/AuthMobileBottomBar.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FiHome, FiHelpCircle, FiMail, FiLock } from "react-icons/fi";

const AuthMobileBottomBar = () => {
  const location = useLocation();

  const isLoginPage = location.pathname.includes("login");
  const isRegisterPage = location.pathname.includes("register");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-3 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md">
      <div className="mx-auto grid h-[64px] max-w-md grid-cols-4 items-center">
        <BottomBarLink label="Home" path="/" icon={<FiHome />} />

        <BottomBarLink
          label={isLoginPage ? "Register" : "Sign In"}
          path={isLoginPage ? "/register" : "/login"}
          icon={<FiLock />}
          active={isLoginPage || isRegisterPage}
        />

        <BottomBarLink
          label="Help"
          path="/help-center"
          icon={<FiHelpCircle />}
        />

        <BottomBarLink label="Support" path="/contact" icon={<FiMail />} />
      </div>
    </nav>
  );
};

const BottomBarLink = ({ label, path, icon, active = false }) => {
  return (
    <Link
      to={path}
      className={[
        "flex h-full flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition",
        active ? "text-primary" : "text-text-muted hover:text-primary",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 items-center justify-center rounded-xl text-[19px] transition",
          active ? "bg-primary-soft text-primary" : "",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="leading-none">{label}</span>
    </Link>
  );
};

export default AuthMobileBottomBar;
