// src/layouts/auth/desktop/AuthDesktopFooter.jsx

import React from "react";
import { Link } from "react-router-dom";

import { FiShield, FiLock, FiHelpCircle, FiMail } from "react-icons/fi";

const AuthDesktopFooter = () => {
  const footerLinks = [
    {
      label: "Privacy Policy",
      path: "/privacy-policy",
    },
    {
      label: "Terms of Service",
      path: "/terms-of-service",
    },
    {
      label: "Help Center",
      path: "/help-center",
    },
    {
      label: "Contact Support",
      path: "/contact",
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5">
            <FiShield className="text-[14px] text-primary" />

            <span className="text-[12px] font-semibold text-primary">
              Secure Authentication
            </span>
          </div>

          <div className="hidden items-center gap-2 text-[12px] text-text-muted lg:flex">
            <FiLock className="text-[13px]" />

            <span>256-bit SSL Encryption</span>
          </div>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-[12px] font-medium text-text-muted transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/help-center"
            className="flex items-center gap-1.5 text-[12px] font-medium text-text-muted transition hover:text-primary"
          >
            <FiHelpCircle className="text-[14px]" />

            <span className="hidden sm:inline">Help</span>
          </Link>

          <Link
            to="/contact"
            className="flex items-center gap-1.5 text-[12px] font-medium text-text-muted transition hover:text-primary"
          >
            <FiMail className="text-[14px]" />

            <span className="hidden sm:inline">Support</span>
          </Link>

          <span className="hidden text-[12px] text-text-muted lg:inline">
            © 2024 PharmaERP
          </span>
        </div>
      </div>
    </footer>
  );
};

export default AuthDesktopFooter;
