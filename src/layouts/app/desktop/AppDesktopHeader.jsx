// src/layouts/app/desktop/AppDesktopHeader.jsx

import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { ROUTES } from "@/constants";
import {
  HeaderSearchBar,
  HeaderNotifications,
  HeaderProfileDropdown,
} from "@/layouts/app/components/header";

/**
 * Route-to-Title Dictionary & Formatter
 */
const getPageTitle = (pathname) => {
  if (!pathname || pathname === "/" || pathname === ROUTES.HOME) return "Dashboard";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/workspace-products")) return "Products";
  if (pathname.startsWith("/catalog/global-products")) return "Global Catalog";
  if (pathname.startsWith("/catalog")) return "Catalog";
  if (pathname.startsWith("/parties/customers")) return "Customers";
  if (pathname.startsWith("/parties/suppliers")) return "Suppliers";
  if (pathname.startsWith("/parties")) return "Parties";
  if (pathname.startsWith("/finance")) return "Finance";
  if (pathname.startsWith("/marketplace")) return "Marketplace";
  if (pathname.startsWith("/access-control")) return "Access Control";
  if (pathname.startsWith("/branches")) return "Branches";
  if (pathname.startsWith("/companies")) return "Companies";
  if (pathname.startsWith("/workspace")) return "Workspace";
  if (pathname.startsWith("/setup")) return "Setup Center";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/me") || pathname.startsWith("/profile")) return "My Profile";

  const segment = pathname.split("/").filter(Boolean).pop() || "Dashboard";
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const AppDesktopHeader = ({ sidebarCollapsed, sidebarWidth = 240 }) => {
  const effectiveWidth = sidebarWidth ?? (sidebarCollapsed ? 68 : 240);
  const location = useLocation();
  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  return (
    <header
      className="fixed top-0 z-30 h-[58px] border-b border-border bg-surface/95 backdrop-blur-md transition-[left] duration-200 ease-out"
      style={{
        left: effectiveWidth,
        right: 0,
      }}
    >
      <div className="flex h-full w-full items-center justify-between px-6">
        {/* ── LEFT: Dynamic Page Title ─────────────────────────────── */}
        <div className="min-w-0 shrink-0">
          <AnimatePresence mode="wait">
            <motion.h1
              key={pageTitle}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="truncate text-base lg:text-[17px] font-bold tracking-tight text-text leading-normal py-0.5"
            >
              {pageTitle}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* ── CENTER: Modern Command Search Bar ────────────────────── */}
        <div className="mx-4 flex flex-1 justify-center max-w-[480px] lg:max-w-[540px]">
          <HeaderSearchBar />
        </div>

        {/* ── RIGHT: Notifications & User Profile ──────────────────── */}
        <div className="flex shrink-0 items-center gap-3">
          <HeaderNotifications />
          <HeaderProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppDesktopHeader;
