// pharmaerp-web/src/components/ui/KeyboardShortcutsModal.jsx
//
// Interactive cheatsheet modal displaying Marg ERP shortcuts for Pharma ERP.
// Features live search, category filters, legacy Marg reference badges,
// and direct click-to-navigate functionality.

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  ExternalLink,
} from "lucide-react";

import { UIModal, UIModalHeader, UIModalTitle, UIModalDescription } from "./UIModal";
import { MARG_SHORTCUTS, SHORTCUT_CATEGORIES } from "@/config/shortcutsConfig";

export const KeyboardShortcutsModal = ({
  isOpen = false,
  onClose,
  onSelectShortcut,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const searchInputRef = useRef(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedCategory("ALL");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const categories = useMemo(() => {
    return [
      { id: "ALL", label: "All Shortcuts" },
      { id: SHORTCUT_CATEGORIES.BILLING, label: "Billing & Sales" },
      { id: SHORTCUT_CATEGORIES.OPERATIONS, label: "Operations & Shifts" },
      { id: SHORTCUT_CATEGORIES.INVENTORY, label: "Inventory & Stock" },
      { id: SHORTCUT_CATEGORIES.PARTIES, label: "Parties & Doctors" },
      { id: SHORTCUT_CATEGORIES.TREASURY, label: "Money & Vault" },
      { id: SHORTCUT_CATEGORIES.ACCOUNTS, label: "Finance & Accounts" },
      { id: SHORTCUT_CATEGORIES.SYSTEM, label: "System & Search" },
    ];
  }, []);

  // Filter shortcuts by search query and category
  const filteredShortcuts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MARG_SHORTCUTS.filter((s) => {
      // Category filter
      if (selectedCategory !== "ALL" && s.category !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!query) return true;

      const keysStr = s.displayKeys.join(" ").toLowerCase();
      const altKeysStr = s.altDisplayKeys ? s.altDisplayKeys.join(" ").toLowerCase() : "";
      const label = s.label.toLowerCase();
      const margLegacy = (s.margLegacy || "").toLowerCase();
      const description = (s.description || "").toLowerCase();
      const category = s.category.toLowerCase();

      return (
        label.includes(query) ||
        keysStr.includes(query) ||
        altKeysStr.includes(query) ||
        margLegacy.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleShortcutClick = (shortcut) => {
    if (typeof onSelectShortcut === "function") {
      onSelectShortcut(shortcut);
    }
    onClose?.();
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-h-[85vh] p-0 overflow-hidden flex flex-col"
    >
      {/* Modal Header */}
      <div className="border-b border-border bg-surface-alt/40 px-6 py-4.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Command className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <UIModalTitle className="text-base sm:text-lg font-bold">
                  Keyboard Shortcuts
                </UIModalTitle>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft/50 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
                  <Sparkles className="size-3" /> Marg ERP Mode
                </span>
              </div>
              <UIModalDescription className="text-xs text-text-muted mt-0.5">
                Full Marg ERP & MargBooks keyboard navigation for high-speed pharmacy operations
              </UIModalDescription>
            </div>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="mt-4 space-y-3">
          {/* Quick Filter Input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts by page, key (e.g. 'Alt + N', 'Purchase', 'Vault', 'Shift')..."
              className="h-9.5 w-full rounded-xl border border-border bg-surface pl-9 pr-9 text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "bg-primary text-white shadow-2xs font-semibold"
                      : "bg-surface-alt/70 text-text-muted hover:bg-surface-hover hover:text-text"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shortcuts List Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:thin] space-y-2">
        {filteredShortcuts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredShortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <div
                  key={shortcut.id}
                  onClick={() => handleShortcutClick(shortcut)}
                  role="button"
                  tabIndex={0}
                  className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-border/80 bg-surface p-3 transition-all duration-150 hover:border-primary/40 hover:bg-surface-hover hover:shadow-2xs active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Icon className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-text group-hover:text-primary transition-colors truncate">
                          {shortcut.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        {shortcut.margLegacy}
                      </div>
                    </div>
                  </div>

                  {/* Keyboard Badge Display */}
                  <div className="flex items-center gap-1 shrink-0">
                    {shortcut.displayKeys.map((key, i) => (
                      <React.Fragment key={key + i}>
                        {i > 0 && <span className="text-[10px] text-text-muted/60">+</span>}
                        <kbd className="inline-flex min-w-[22px] items-center justify-center rounded-md border border-border/90 bg-surface-alt px-1.5 py-0.5 text-[11px] font-mono font-bold text-text shadow-2xs group-hover:border-primary/30 group-hover:bg-primary-soft/40 group-hover:text-primary transition-colors">
                          {key}
                        </kbd>
                      </React.Fragment>
                    ))}

                    <ChevronRight className="ml-1 size-3.5 text-text-muted/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="size-8 text-text-muted/40 mb-2" />
            <p className="text-sm font-semibold text-text">No shortcuts found</p>
            <p className="text-xs text-text-muted mt-0.5">
              No matching shortcut for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="flex flex-wrap items-center justify-between border-t border-border bg-surface-alt/50 px-6 py-3 text-xs text-text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono font-medium">
              Ctrl
            </kbd>
            +
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono font-medium">
              K
            </kbd>
            <span className="ml-1">Search Bar</span>
          </span>
          <span className="hidden sm:inline-block text-border-strong">•</span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono font-medium">
              Alt
            </kbd>
            +
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono font-medium">
              N
            </kbd>
            <span className="ml-1">POS Billing</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Press</span>
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono font-medium">
            Esc
          </kbd>
          <span>to close</span>
        </div>
      </div>
    </UIModal>
  );
};

export default KeyboardShortcutsModal;
