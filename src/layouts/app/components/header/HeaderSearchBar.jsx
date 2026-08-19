// src/layouts/app/components/header/HeaderSearchBar.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  Layers,
  ExternalLink,
  User,
  Settings,
  X,
} from "lucide-react";

import { ROUTES } from "@/constants";

const QUICK_COMMANDS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: Layers },
  { label: "Products Catalog", path: ROUTES.WORKSPACE_PRODUCTS, icon: Layers },
  { label: "Create Company", path: ROUTES.CREATE_COMPANY, icon: ExternalLink },
  { label: "Create Branch", path: ROUTES.CREATE_BRANCH, icon: ExternalLink },
  { label: "Manage Customers", path: ROUTES.CUSTOMERS, icon: User },
  { label: "Account Settings", path: ROUTES.SETTINGS, icon: Settings },
];

const HeaderSearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const searchInputRef = useRef(null);
  const containerRef = useRef(null);

  const isMac =
    typeof window !== "undefined" &&
    navigator.platform?.toUpperCase().indexOf("MAC") >= 0;
  const shortcutText = isMac ? "⌘ F" : "Ctrl + K";

  // Global Keyboard Shortcut (Cmd+F / Ctrl+F / Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "f" || e.key === "k")) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      } else if (e.key === "Escape") {
        setSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_COMMANDS;
    return QUICK_COMMANDS.filter((cmd) =>
      cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectCommand = (path) => {
    navigate(path);
    setSearchFocused(false);
    setSearchQuery("");
  };

  return (
    <div
      ref={containerRef}
      className={`group relative flex w-full max-w-[460px] lg:max-w-[540px] items-center ${className}`}
    >
      {/* Search Input styled identically to AuthInput */}
      <div className="relative flex w-full items-center">
        <span className="pointer-events-none absolute left-3 flex items-center text-text-muted transition-colors duration-150 group-focus-within:text-primary">
          <Search className="size-4 shrink-0" />
        </span>

        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search or type a command"
          className="h-10 w-full rounded-[12px] border border-border bg-surface pl-9.5 pr-14 text-sm text-text placeholder:text-text-muted/60 outline-none transition-all duration-150 ease-out hover:border-border-strong focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 shadow-2xs"
        />

        {/* Clear Button or Keyboard Shortcut Badge */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="flex size-5 cursor-pointer items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none flex select-none items-center gap-0.5 rounded-[5px] border border-border/70 bg-surface-alt px-1.5 py-0.5 text-[10px] font-mono font-medium text-text-muted shadow-2xs">
              {shortcutText}
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Command Palette Popover */}
      <AnimatePresence>
        {searchFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 right-0 top-[110%] z-50 overflow-hidden rounded-[14px] border border-border bg-surface p-2 shadow-[var(--app-shadow-xl)]"
          >
            <div className="px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-text-muted/70">
              Quick Navigation & Commands
            </div>

            <div className="max-h-[240px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-0.5 pt-1">
              {filteredCommands.length ? (
                filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.label}
                      type="button"
                      onClick={() => handleSelectCommand(cmd.path)}
                      className="flex w-full cursor-pointer items-center justify-between rounded-[8px] px-2.5 py-2 text-left text-xs text-text transition hover:bg-surface-hover active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-6 items-center justify-center rounded-[5px] bg-primary/10 text-primary">
                          <Icon className="size-3.5" />
                        </div>
                        <span className="font-medium">{cmd.label}</span>
                      </div>
                      <ChevronRight className="size-3.5 text-text-muted/60" />
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-text-muted">
                  No matching commands found for "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderSearchBar;
