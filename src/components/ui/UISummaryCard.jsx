import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * UISummaryCard (#29 Primary Component)
 * ============================================================================
 * Display compact financial summaries, multi-stat horizontal metric strips,
 * invoice order breakdowns, and calculation summaries.
 */
export const UISummaryCard = forwardRef(
  (
    {
      title,
      subtitle,
      items = [], // Array<{ label: string, value: string | number, subtext?: string, icon?: ReactNode, isHighlight?: boolean, isDeduction?: boolean, color?: string }>
      total, // { label: string, value: string | number, subtext?: string, badge?: ReactNode }
      variant = "card", // "card" | "strip" | "compact" | "flat"
      action,
      footer,
      className,
      children,
      ...props
    },
    ref
  ) => {
    /* ========================================================================
     * 1. HORIZONTAL STRIP VARIANT (Multi-metric condensed row)
     * ======================================================================== */
    if (variant === "strip") {
      return (
        <div
          ref={ref}
          className={cn(
            "w-full bg-surface border border-border rounded-2xl p-3 sm:p-4 shadow-xs font-sans",
            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60",
            className
          )}
          {...props}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-col min-w-0 pt-2 sm:pt-0 sm:px-3 first:pl-0 last:pr-0",
                item.isHighlight && "font-bold text-primary"
              )}
            >
              <div className="flex items-center gap-1.5 text-xs text-text-muted select-none">
                {item.icon && <span className="size-3.5 shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className={cn(
                    "text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums truncate",
                    item.isHighlight ? "text-primary" : "text-text",
                    item.isDeduction && "text-error"
                  )}
                >
                  {item.value}
                </span>
              </div>
              {item.subtext && (
                <span className="text-[11px] text-text-muted truncate select-none mt-0.5">
                  {item.subtext}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    /* ========================================================================
     * 2. STANDARD VERTICAL SUMMARY CARD (Invoice, Breakdown, Totals)
     * ======================================================================== */
    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs font-sans text-text space-y-4",
          variant === "flat" && "bg-surface-alt/60 border-border/70 shadow-none",
          variant === "compact" && "p-4 space-y-3",
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/70 select-none">
            <div className="flex flex-col min-w-0">
              {title && (
                <h4 className="text-base font-bold text-text tracking-tight leading-tight">
                  {title}
                </h4>
              )}
              {subtitle && (
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Breakdown Items List */}
        {items.length > 0 && (
          <div className="space-y-2.5 text-xs sm:text-sm">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between gap-4 py-0.5",
                  item.isHighlight && "font-semibold text-text"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 select-none">
                  {item.icon && (
                    <span className="text-text-muted size-4 shrink-0 flex items-center justify-center">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-text-muted truncate">{item.label}</span>
                </div>

                <div className="flex items-baseline gap-1.5 shrink-0 text-right">
                  <span
                    className={cn(
                      "font-mono font-semibold tabular-nums text-text",
                      item.isDeduction && "text-error",
                      item.isHighlight && "text-primary font-bold"
                    )}
                  >
                    {item.isDeduction && typeof item.value === "string" && !item.value.startsWith("-")
                      ? `- ${item.value}`
                      : item.value}
                  </span>
                  {item.subtext && (
                    <span className="text-[11px] text-text-muted hidden sm:inline">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {children}

        {/* Highlighted Grand Total Footer */}
        {total && (
          <div className="pt-3.5 border-t border-border mt-3 space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-text select-none">
                  {total.label || "Total Amount"}
                </span>
                {total.badge && <div>{total.badge}</div>}
              </div>

              <span className="text-lg sm:text-xl font-extrabold font-mono text-primary tabular-nums tracking-tight">
                {total.value}
              </span>
            </div>

            {total.subtext && (
              <p className="text-[11.5px] text-text-muted text-right select-none">
                {total.subtext}
              </p>
            )}
          </div>
        )}

        {/* Action Button Slot (e.g. Checkout, Pay Now, Submit PO) */}
        {action && <div className="pt-2">{action}</div>}

        {/* Optional Custom Footer */}
        {footer && (
          <div className="pt-2 text-xs text-text-muted border-t border-border/60">
            {footer}
          </div>
        )}
      </div>
    );
  }
);
UISummaryCard.displayName = "UISummaryCard";

export default UISummaryCard;
