import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UISearchInput } from "./UISearchInput";
import { UIButton } from "./UIButton";
import { UIIconButton } from "./UIIconButton";
import { UIBadge } from "./UIBadge";

/**
 * ============================================================================
 * UIFilterChip (#26 Sub-component)
 * ============================================================================
 * Removable badge chip representing an active filter.
 */
export const UIFilterChip = forwardRef(
  (
    {
      label,
      value,
      onRemove,
      color = "primary",
      icon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.85, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className={cn(
          "inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-lg text-xs font-medium border select-none transition-colors",
          "bg-surface border-border text-text shadow-2xs hover:border-border-strong",
          className
        )}
        {...props}
      >
        {icon && <span className="text-text-muted shrink-0 size-3 flex items-center justify-center">{icon}</span>}
        <span className="text-text-muted text-[11px] font-normal">{label}:</span>
        <span className="font-semibold text-text truncate max-w-[140px]">{value}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove filter for ${label}`}
            className="size-4 rounded-md inline-flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer ml-0.5"
          >
            <X className="size-3" />
          </button>
        )}
      </motion.div>
    );
  }
);
UIFilterChip.displayName = "UIFilterChip";

/**
 * ============================================================================
 * UIFilterBar (#26 Primary Component)
 * ============================================================================
 * Composable filter toolbar integrating search, filter dropdowns, active chips,
 * clear-all trigger, and collapsible advanced filter drawer.
 */
export const UIFilterBar = forwardRef(
  (
    {
      searchQuery,
      onSearchChange,
      onSearch,
      searchPlaceholder = "Search records...",
      enableSearch = true,
      searchClassName,
      activeFilters = [], // Array<{ key: string, label: string, value: string, onRemove?: () => void }>
      onClearAll,
      filterCount,
      hasActiveFilters,
      totalResults,
      isLoading = false,
      actions,
      quickFilters, // Array<{ id, label, count?, active?, onClick }> or ReactNode
      isAdvancedOpen: controlledAdvancedOpen,
      onToggleAdvanced,
      renderAdvancedFilters,
      variant = "card", // "card" | "flat" | "clean"
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalAdvancedOpen, setInternalAdvancedOpen] = useState(false);
    const isControlledAdvanced = controlledAdvancedOpen !== undefined;
    const isAdvancedOpen = isControlledAdvanced
      ? controlledAdvancedOpen
      : internalAdvancedOpen;

    const handleToggleAdvanced = () => {
      const next = !isAdvancedOpen;
      if (!isControlledAdvanced) {
        setInternalAdvancedOpen(next);
      }
      onToggleAdvanced?.(next);
    };

    const count =
      filterCount !== undefined
        ? filterCount
        : activeFilters.length;
    const isFiltering =
      hasActiveFilters !== undefined
        ? hasActiveFilters
        : Boolean(count > 0 || searchQuery);

    const variantClasses = {
      card: "p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-xs",
      flat: "p-4 sm:p-5 rounded-2xl border border-border/80 bg-surface-alt/40",
      clean: "pb-4 border-b border-border/70",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full font-sans transition-colors duration-150 relative overflow-visible",
          variantClasses[variant] || variantClasses.card,
          className
        )}
        {...props}
      >
        {/* Top Controls Area */}
        <div className="flex flex-col gap-3">
          {/* Main Controls Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Left Area: Search Input + Main Filter Trigger */}
            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5 min-w-0">
              {enableSearch && (
                <div className={cn("flex-1 min-w-[200px] max-w-full md:max-w-md", searchClassName)}>
                  <UISearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    onSearch={onSearch}
                    placeholder={searchPlaceholder}
                    isLoading={isLoading}
                    size="sm"
                  />
                </div>
              )}

              {/* Quick Filter Slot / Dropdowns */}
              {children && (
                <div className="flex items-center flex-wrap gap-2 min-w-0">
                  {children}
                </div>
              )}

              {/* Advanced Filters Expand Toggle (if renderAdvancedFilters provided) */}
              {renderAdvancedFilters && (
                <UIButton
                  type="button"
                  variant={isAdvancedOpen ? "primary" : "outline"}
                  size="sm"
                  startIcon={<SlidersHorizontal className="size-3.5" />}
                  endIcon={
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200 ease-out",
                        isAdvancedOpen && "rotate-180"
                      )}
                    />
                  }
                  onClick={handleToggleAdvanced}
                >
                  <span>Filters</span>
                  {count > 0 && (
                    <span
                      className={cn(
                        "ml-1 font-mono text-[10px] tabular-nums font-bold px-1.5 py-0.2 rounded-full",
                        isAdvancedOpen
                          ? "bg-primary-contrast text-primary"
                          : "bg-primary text-primary-contrast"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </UIButton>
              )}
            </div>

            {/* Right Area: Results Counter & Custom Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 select-none">
              {totalResults !== undefined && (
                <span className="text-xs text-text-muted font-medium">
                  <strong className="text-text font-mono font-bold tabular-nums">
                    {totalResults.toLocaleString()}
                  </strong>{" "}
                  results
                </span>
              )}

              {actions}
            </div>
          </div>

          {/* Quick Filter Pill Buttons (Optional) */}
          {Array.isArray(quickFilters) && quickFilters.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
              {quickFilters.map((qf) => (
                <button
                  key={qf.id}
                  type="button"
                  onClick={qf.onClick}
                  className={cn(
                    "inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold select-none transition-all cursor-pointer",
                    qf.active
                      ? "bg-primary text-primary-contrast shadow-2xs"
                      : "bg-surface-alt hover:bg-surface-hover text-text-muted hover:text-text border border-border/70"
                  )}
                >
                  <span>{qf.label}</span>
                  {qf.count !== undefined && (
                    <span
                      className={cn(
                        "font-mono text-[10px] tabular-nums font-bold px-1.5 py-0.2 rounded-full",
                        qf.active
                          ? "bg-primary-contrast/20 text-primary-contrast"
                          : "bg-surface text-text-muted"
                      )}
                    >
                      {qf.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filter Chips Bar & Clear All */}
        <AnimatePresence initial={false}>
          {isFiltering && (
            <motion.div
              key="active-filters-chips-bar"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
              }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-border/60 mt-3 flex items-center flex-wrap gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1 mr-1 select-none">
                  <Filter className="size-3" />
                  Active:
                </span>

                {/* Dynamic Chips */}
                {activeFilters.map((filter) => (
                  <UIFilterChip
                    key={filter.key || `${filter.label}-${filter.value}`}
                    label={filter.label}
                    value={filter.value}
                    onRemove={filter.onRemove}
                  />
                ))}

                {/* Clear All Trigger */}
                {onClearAll && (
                  <motion.button
                    layout
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={onClearAll}
                    className="inline-flex items-center gap-1 h-7 px-2 text-xs font-semibold text-text-muted hover:text-error transition-colors cursor-pointer select-none ml-auto"
                  >
                    <RotateCcw className="size-3" />
                    <span>Clear all</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsible Advanced Filters Drawer */}
        {renderAdvancedFilters && (
          <AnimatePresence initial={false}>
            {isAdvancedOpen && (
              <motion.div
                key="advanced-filters-drawer"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                  transitionEnd: { overflow: "visible" },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  overflow: "hidden",
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                }}
                className="overflow-hidden"
              >
                <div className="pt-3.5 border-t border-border/70 mt-3.5 space-y-4">
                  {typeof renderAdvancedFilters === "function"
                    ? renderAdvancedFilters()
                    : renderAdvancedFilters}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }
);
UIFilterBar.displayName = "UIFilterBar";

export default UIFilterBar;
