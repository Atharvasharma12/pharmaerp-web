import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownLabel,
} from "./UIDropdown";
import { cn } from "@/lib/utils";

export const UIPagination = forwardRef(
  (
    {
      page = 1,
      totalPages = 1,
      totalItems,
      pageSize = 10,
      pageSizeOptions = [10, 25, 50, 100],
      onPageChange,
      onPageSizeChange,
      siblingCount = 1,
      showPageSize = true,
      showSummary = true,
      className,
      ...props
    },
    ref
  ) => {
    // Generate page items array with smart ellipsis
    const generatePages = () => {
      const totalPageNumbers = siblingCount * 2 + 5;

      if (totalPages <= totalPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const leftSiblingIndex = Math.max(page - siblingCount, 1);
      const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, "...", totalPages];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        );
        return [1, "...", ...rightRange];
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        );
        return [1, "...", ...middleRange, "...", totalPages];
      }

      return Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    const pages = generatePages();
    const startRecord = totalItems ? Math.min((page - 1) * pageSize + 1, totalItems) : (page - 1) * pageSize + 1;
    const endRecord = totalItems ? Math.min(page * pageSize, totalItems) : page * pageSize;

    return (
      <div
        ref={ref}
        className={cn(
          "relative z-20 overflow-visible flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border/80 bg-surface/40 text-xs sm:text-sm text-text-muted font-sans select-none",
          className
        )}
        {...props}
      >
        {/* Left Info: Total Records & Custom UIDropdown Page Size Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {showSummary && totalItems !== undefined && (
            <span className="text-text-muted">
              Showing <strong className="text-text font-mono tabular-nums">{startRecord}</strong> to{" "}
              <strong className="text-text font-mono tabular-nums">{endRecord}</strong> of{" "}
              <strong className="text-text font-mono tabular-nums">{totalItems.toLocaleString()}</strong> results
            </span>
          )}

          {showPageSize && onPageSizeChange && (
            <div className="flex items-center gap-2 ml-0 sm:ml-2">
              <span className="text-xs text-text-muted hidden md:inline">Rows:</span>
              <UIDropdown placement="auto" align="left">
                <UIDropdownTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 bg-surface border border-border hover:border-border-strong hover:bg-surface-hover rounded-lg text-xs font-semibold text-text shadow-2xs transition-colors cursor-pointer"
                  >
                    <span className="font-mono tabular-nums">{pageSize}</span>
                    <span className="text-text-muted font-normal text-[11px]">/ page</span>
                    <ChevronDown className="size-3 text-text-muted transition-transform" />
                  </button>
                </UIDropdownTrigger>
                <UIDropdownMenu width="w-32">
                  <UIDropdownLabel>Page size</UIDropdownLabel>
                  {pageSizeOptions.map((opt) => (
                    <UIDropdownItem
                      key={opt}
                      onClick={() => onPageSizeChange(Number(opt))}
                      className={cn(
                        "font-mono tabular-nums",
                        opt === pageSize && "bg-primary/10 text-primary font-bold"
                      )}
                    >
                      <span className="flex items-center justify-between w-full">
                        <span>{opt} rows</span>
                        {opt === pageSize && <Check className="size-3 text-primary stroke-[3]" />}
                      </span>
                    </UIDropdownItem>
                  ))}
                </UIDropdownMenu>
              </UIDropdown>
            </div>
          )}
        </div>

        {/* Right Page Controls */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          <motion.button
            type="button"
            disabled={page <= 1}
            whileTap={page > 1 ? { scale: 0.94 } : undefined}
            onClick={() => onPageChange?.(1)}
            aria-label="First page"
            className="size-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronsLeft className="size-4" />
          </motion.button>

          {/* Previous Page */}
          <motion.button
            type="button"
            disabled={page <= 1}
            whileTap={page > 1 ? { scale: 0.94 } : undefined}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Previous page"
            className="size-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </motion.button>

          {/* Dynamic Page Buttons */}
          <div className="flex items-center gap-1 px-1">
            {pages.map((p, idx) => {
              if (p === "...") {
                return (
                  <span key={`dots-${idx}`} className="size-8 flex items-center justify-center text-text-muted font-mono">
                    ...
                  </span>
                );
              }

              const isCurrent = p === page;
              return (
                <motion.button
                  key={`page-${p}`}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onPageChange?.(p)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-bold font-mono tabular-nums flex items-center justify-center transition-all cursor-pointer",
                    isCurrent
                      ? "bg-primary text-primary-contrast shadow-2xs scale-105 border border-primary/30"
                      : "border border-border bg-surface text-text hover:bg-surface-hover hover:border-border-strong"
                  )}
                >
                  {p}
                </motion.button>
              );
            })}
          </div>

          {/* Next Page */}
          <motion.button
            type="button"
            disabled={page >= totalPages}
            whileTap={page < totalPages ? { scale: 0.94 } : undefined}
            onClick={() => onPageChange?.(page + 1)}
            aria-label="Next page"
            className="size-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </motion.button>

          {/* Last Page */}
          <motion.button
            type="button"
            disabled={page >= totalPages}
            whileTap={page < totalPages ? { scale: 0.94 } : undefined}
            onClick={() => onPageChange?.(totalPages)}
            aria-label="Last page"
            className="size-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronsRight className="size-4" />
          </motion.button>
        </div>
      </div>
    );
  }
);

UIPagination.displayName = "UIPagination";
export default UIPagination;
