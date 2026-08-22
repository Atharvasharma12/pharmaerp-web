import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  Layers,
  CheckSquare,
  X,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UIButton } from "./UIButton";
import { UIIconButton } from "./UIIconButton";
import { UIBadge } from "./UIBadge";

/**
 * ============================================================================
 * UIActionBar (#27 Primary Component)
 * ============================================================================
 * Dual-mode action toolbar providing standard page actions (view toggles, export,
 * refresh) and seamlessly transitioning to a Bulk Action Mode when items are selected.
 */
export const UIActionBar = forwardRef(
  (
    {
      // Standard Actions Mode
      leftActions,
      rightActions,
      children,
      title,
      subtitle,

      // View Switcher (Optional)
      viewMode, // "table" | "grid" | "cards"
      onViewModeChange,
      showViewSwitcher = false,

      // Bulk Selection Mode
      selectedCount = 0,
      totalCount,
      onSelectAll,
      onDeselectAll,
      bulkActions, // ReactNode or Array of actions
      bulkDeleteText = "Delete Selected",
      onBulkDelete,
      bulkExportText = "Export Selected",
      onBulkExport,

      // Layout & Appearance
      variant = "card", // "card" | "floating" | "sticky" | "inline"
      className,
      ...props
    },
    ref
  ) => {
    const isBulkActive = selectedCount > 0;

    const variantClasses = {
      card: "p-3 sm:p-4 rounded-2xl border border-border bg-surface shadow-xs",
      floating:
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl p-3 sm:p-4 rounded-2xl border border-border bg-surface/95 backdrop-blur-md shadow-2xl ring-1 ring-border/50",
      sticky:
        "sticky top-0 z-20 p-3 sm:p-4 bg-surface/90 backdrop-blur-md border-b border-border shadow-2xs",
      inline: "py-2 bg-transparent",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full font-sans transition-all duration-200 isolate select-none",
          variantClasses[variant] || variantClasses.card,
          className
        )}
        {...props}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isBulkActive ? (
            /* ================================================================
             * 1. BULK SELECTION MODE
             * ================================================================ */
            <motion.div
              key="bulk-mode"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
            >
              {/* Left: Count Badge & Select/Deselect */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-text">
                    <strong className="font-mono text-primary font-extrabold tabular-nums">
                      {selectedCount}
                    </strong>{" "}
                    {selectedCount === 1 ? "item" : "items"} selected
                  </span>
                  {totalCount !== undefined && (
                    <span className="text-xs text-text-muted hidden sm:inline">
                      (of {totalCount.toLocaleString()})
                    </span>
                  )}
                </div>

                {onSelectAll && totalCount && selectedCount < totalCount && (
                  <button
                    type="button"
                    onClick={onSelectAll}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer ml-1"
                  >
                    Select all ({totalCount})
                  </button>
                )}
              </div>

              {/* Right: Bulk Action Buttons & Dismiss */}
              <div className="flex items-center flex-wrap gap-2 justify-end">
                {bulkActions ? (
                  bulkActions
                ) : (
                  <>
                    {onBulkExport && (
                      <UIButton
                        type="button"
                        variant="secondary"
                        size="xs"
                        startIcon={<Download className="size-3.5" />}
                        onClick={onBulkExport}
                      >
                        {bulkExportText}
                      </UIButton>
                    )}

                    {onBulkDelete && (
                      <UIButton
                        type="button"
                        variant="destructive"
                        size="xs"
                        startIcon={<Trash2 className="size-3.5" />}
                        onClick={onBulkDelete}
                      >
                        {bulkDeleteText}
                      </UIButton>
                    )}
                  </>
                )}

                {/* Deselect All '✕' */}
                {onDeselectAll && (
                  <UIIconButton
                    type="button"
                    icon={<X className="size-4" />}
                    variant="ghost"
                    size="xs"
                    tooltip="Clear selection"
                    aria-label="Clear selection"
                    onClick={onDeselectAll}
                  />
                )}
              </div>
            </motion.div>
          ) : (
            /* ================================================================
             * 2. STANDARD TOOLBAR ACTIONS MODE
             * ================================================================ */
            <motion.div
              key="standard-mode"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
            >
              {/* Left Column: Title / Info or Custom Left Actions */}
              <div className="flex items-center flex-wrap gap-2.5 min-w-0">
                {title && (
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-text tracking-tight leading-tight">
                      {title}
                    </h4>
                    {subtitle && (
                      <p className="text-xs text-text-muted leading-tight mt-0.5">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}

                {leftActions}
              </div>

              {/* Right Column: Custom Actions, View Switcher & Children */}
              <div className="flex items-center flex-wrap gap-2 justify-between sm:justify-end">
                {children}

                {rightActions}

                {/* Optional View Switcher (Table / Grid / Cards) */}
                {showViewSwitcher && onViewModeChange && (
                  <div className="flex items-center p-0.5 rounded-xl bg-surface-alt border border-border">
                    <button
                      type="button"
                      onClick={() => onViewModeChange("table")}
                      aria-label="Table View"
                      className={cn(
                        "p-1.5 rounded-lg transition-all cursor-pointer",
                        viewMode === "table"
                          ? "bg-surface text-primary shadow-2xs font-bold"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      <List className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewModeChange("grid")}
                      aria-label="Grid View"
                      className={cn(
                        "p-1.5 rounded-lg transition-all cursor-pointer",
                        viewMode === "grid"
                          ? "bg-surface text-primary shadow-2xs font-bold"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      <LayoutGrid className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
UIActionBar.displayName = "UIActionBar";

export default UIActionBar;
