// src/layouts/app/mobile/AppMobileHeader.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  X,
  ChevronRight,
  Layers,
  ExternalLink,
} from "lucide-react";

import { ROUTES } from "@/constants";
import {
  HeaderNotifications,
  HeaderProfileDropdown,
} from "@/layouts/app/components/header";
import { UIIconButton } from "@/components/ui";

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

const QUICK_COMMANDS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: Layers },
  { label: "Products Catalog", path: ROUTES.WORKSPACE_PRODUCTS, icon: Layers },
  { label: "Create Company", path: ROUTES.CREATE_COMPANY, icon: ExternalLink },
  { label: "Create Branch", path: ROUTES.CREATE_BRANCH, icon: ExternalLink },
];

const AppMobileHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_COMMANDS;
    return QUICK_COMMANDS.filter((cmd) =>
      cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-13 items-center justify-between px-3">
        {/* Left: Menu & Dynamic Title */}
        <div className="flex min-w-0 items-center gap-2">
          <UIIconButton
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            variant="ghost"
            size="sm"
          >
            <Menu className="size-5" />
          </UIIconButton>

          <AnimatePresence mode="wait">
            <motion.h1
              key={pageTitle}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="truncate text-[15px] font-extrabold tracking-tight text-text leading-tight"
            >
              {pageTitle}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Right: Search Toggle, Modular Notifications, and Modular Profile */}
        <div className="flex shrink-0 items-center gap-1.5">
          <UIIconButton
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            variant={searchOpen ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full"
          >
            <Search className="size-4" />
          </UIIconButton>

          <HeaderNotifications />
          <HeaderProfileDropdown />
        </div>
      </div>

      {/* Expandable Mobile Search Bar (Styled like AuthInput) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-border bg-surface px-3 py-2"
          >
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 flex items-center text-text-muted">
                <Search className="size-3.5" />
              </span>

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or type a command..."
                className="h-9 w-full rounded-[10px] border border-border bg-surface pl-8.5 pr-8 text-xs text-text placeholder:text-text-muted/60 outline-none transition-all duration-150 ease-out hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 flex size-4 cursor-pointer items-center justify-center rounded-full text-text-muted hover:text-text"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Filtered Mobile Commands */}
            {searchQuery && (
              <div className="mt-2 max-h-[160px] overflow-y-auto space-y-0.5">
                {filteredCommands.length ? (
                  filteredCommands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.label}
                        type="button"
                        onClick={() => {
                          navigate(cmd.path);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex w-full items-center justify-between rounded-[6px] px-2 py-1.5 text-xs text-text hover:bg-surface-hover"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="size-3.5 text-primary" />
                          <span>{cmd.label}</span>
                        </div>
                        <ChevronRight className="size-3 text-text-muted" />
                      </button>
                    );
                  })
                ) : (
                  <div className="py-2 text-center text-xs text-text-muted">
                    No matching commands
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AppMobileHeader;
