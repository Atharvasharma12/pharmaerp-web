// src/components/ui/UIFilterToolbar.jsx

import React, { forwardRef } from "react";
import { LayoutGrid, List, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { UISearchInput } from "./UISearchInput";
import { UISelect } from "./UISelect";
import { UIButton } from "./UIButton";

export const UI_TOOLBAR_VIEWS = {
  GRID: "grid",
  LIST: "list",
};

/**
 * ============================================================================
 * UIFilterToolbar Component
 * ============================================================================
 * Standardized enterprise filter & view controls toolbar for dashboard lists,
 * grids, tables, and administrative records.
 */
export const UIFilterToolbar = forwardRef(
  (
    {
      // Search controls
      searchQuery = "",
      onSearchChange,
      onSearchClear,
      searchPlaceholder = "Search records...",
      enableSearch = true,
      searchClassName,
      searchSize = "sm",

      // Filter slots & controls
      filters,
      children,

      // Sort controls
      sortBy,
      onSortChange,
      sortOptions = [],
      sortPlaceholder = "Sort By",

      // Active chips & Reset
      activeFilterChips = [],
      onClearFilters,
      resetLabel = "Reset",

      // View mode switcher
      viewMode = UI_TOOLBAR_VIEWS.GRID,
      onViewModeChange,
      showViewSwitcher = true,
      viewOptions = [
        { id: UI_TOOLBAR_VIEWS.GRID, label: "Grid View", icon: LayoutGrid },
        { id: UI_TOOLBAR_VIEWS.LIST, label: "List View", icon: List },
      ],

      // Custom action slot on right
      actions,

      // Styling variants
      variant = "compact", // "compact" | "card" | "flat"
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      compact: "bg-surface border border-border/60 rounded-xl p-2.5 px-3 shadow-2xs",
      card: "bg-surface border border-border rounded-2xl p-3.5 sm:p-4 shadow-sm",
      flat: "bg-surface-alt/60 border border-border/70 rounded-xl p-2.5 px-3",
    };

    const hasActiveFilters =
      activeFilterChips.length > 0 ||
      (sortOptions.length > 0 && sortBy && sortBy !== sortOptions[0]?.value);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full flex flex-col md:flex-row items-stretch md:items-center gap-2.5 transition-colors duration-150 select-none",
          variantClasses[variant] || variantClasses.compact,
          className
        )}
        {...props}
      >
        {/* ── Left Area: Search Input ── */}
        {enableSearch && (
          <div className={cn("flex-1 min-w-[220px]", searchClassName)}>
            <UISearchInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e?.target?.value ?? e)}
              onClear={() => {
                onSearchClear?.();
                onSearchChange?.("");
              }}
              size={searchSize}
            />
          </div>
        )}

        {/* ── Right / Center Area: Selects, Filters, View Switcher & Actions ── */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Custom Filter Selects / Controls */}
          {filters}
          {children}

          {/* Built-in Sort Menu */}
          {sortOptions.length > 0 && onSortChange && (
            <div className="w-36">
              <UISelect
                value={sortBy}
                onChange={onSortChange}
                options={sortOptions}
                placeholder={sortPlaceholder}
                size={searchSize}
              />
            </div>
          )}

          {/* Reset Action */}
          {hasActiveFilters && onClearFilters && (
            <UIButton
              type="button"
              variant="ghost"
              size="xs"
              startIcon={<RotateCcw className="size-3 text-text-muted" />}
              onClick={onClearFilters}
            >
              {resetLabel}
            </UIButton>
          )}

          {/* Segmented View Switcher */}
          {showViewSwitcher && onViewModeChange && (
            <div className="flex items-center rounded-lg border border-border bg-surface-alt/75 p-0.5 ml-0.5">
              {viewOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isActive = viewMode === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onViewModeChange(opt.id)}
                    className={cn(
                      "flex items-center justify-center p-1.5 rounded-md transition-all text-xs cursor-pointer",
                      isActive
                        ? "bg-surface text-primary shadow-xs font-bold"
                        : "text-text-muted hover:text-text"
                    )}
                    title={opt.label}
                    aria-label={opt.label}
                  >
                    <IconComponent className="size-4" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Extra Action Slot */}
          {actions}
        </div>
      </div>
    );
  }
);

UIFilterToolbar.displayName = "UIFilterToolbar";

export default UIFilterToolbar;
