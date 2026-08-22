import React, { forwardRef, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * UIAlert (#36)
 *
 * System message banner for warnings, error callouts, success confirmations,
 * regulatory compliance notices, and discovery hints.
 *
 * Features:
 * - Types: "info" | "success" | "warning" | "error" | "purple" | "neutral"
 * - Variants:
 *   - "soft": Soft tinted background with subtle border (default)
 *   - "accent": Left accent bar with soft background
 *   - "solid": High-contrast filled banner
 *   - "outlined": Clean transparent border banner
 * - Features: Title, Description, Custom Icons, Action CTAs, Dismiss button (✕), Collapsible details
 */
export const UIAlert = forwardRef(
  (
    {
      type = "info", // "info" | "success" | "warning" | "error" | "purple" | "neutral"
      variant = "soft", // "soft" | "accent" | "solid" | "outlined"
      title,
      description,
      icon,
      showIcon = true,
      dismissible = false,
      onDismiss,
      action,
      details,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isDismissed, setIsDismissed] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleDismiss = () => {
      setIsDismissed(true);
      onDismiss?.();
    };

    const typeConfig = {
      info: {
        icon: <Info className="size-4.5 shrink-0" />,
        soft: "bg-info/12 border-info/30 text-text",
        accent: "bg-surface border border-border border-l-4 border-l-info text-text",
        solid: "bg-info text-white shadow-2xs",
        outlined: "border-info/50 text-text bg-transparent",
        iconColor: "text-info",
        titleColor: "text-info",
      },
      success: {
        icon: <CheckCircle2 className="size-4.5 shrink-0" />,
        soft: "bg-success/12 border-success/30 text-text",
        accent: "bg-surface border border-border border-l-4 border-l-success text-text",
        solid: "bg-success text-white shadow-2xs",
        outlined: "border-success/50 text-text bg-transparent",
        iconColor: "text-success",
        titleColor: "text-success",
      },
      warning: {
        icon: <AlertTriangle className="size-4.5 shrink-0" />,
        soft: "bg-warning/12 border-warning/30 text-text",
        accent: "bg-surface border border-border border-l-4 border-l-warning text-text",
        solid: "bg-warning text-white shadow-2xs",
        outlined: "border-warning/50 text-text bg-transparent",
        iconColor: "text-warning",
        titleColor: "text-warning",
      },
      error: {
        icon: <AlertCircle className="size-4.5 shrink-0" />,
        soft: "bg-error/12 border-error/30 text-text",
        accent: "bg-surface border border-border border-l-4 border-l-error text-text",
        solid: "bg-error text-white shadow-2xs",
        outlined: "border-error/50 text-text bg-transparent",
        iconColor: "text-error",
        titleColor: "text-error",
      },
      purple: {
        icon: <Sparkles className="size-4.5 shrink-0" />,
        soft: "bg-purple-500/12 border-purple-500/30 text-text",
        accent: "bg-surface border border-border border-l-4 border-l-purple-500 text-text",
        solid: "bg-purple-600 text-white shadow-2xs",
        outlined: "border-purple-500/50 text-text bg-transparent",
        iconColor: "text-purple-500",
        titleColor: "text-purple-600 dark:text-purple-400",
      },
      neutral: {
        icon: <Info className="size-4.5 shrink-0" />,
        soft: "bg-surface-alt/80 border-border text-text",
        accent: "bg-surface border border-border border-l-4 border-l-text-muted text-text",
        solid: "bg-surface-alt text-text border border-border",
        outlined: "border-border text-text bg-transparent",
        iconColor: "text-text-muted",
        titleColor: "text-text",
      },
    };

    const cur = typeConfig[type] || typeConfig.info;

    const variantClass =
      variant === "accent"
        ? cur.accent
        : variant === "solid"
        ? cur.solid
        : variant === "outlined"
        ? cn("border", cur.outlined)
        : cn("border", cur.soft);

    return (
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="alert"
            className={cn(
              "relative w-full p-4 rounded-2xl font-sans overflow-hidden transition-colors flex items-start gap-3.5 select-none",
              variantClass,
              className
            )}
            {...props}
          >
            {/* Leading Icon */}
            {showIcon && (
              <div
                className={cn(
                  "shrink-0 mt-0.5",
                  variant === "solid" ? "text-white" : cur.iconColor
                )}
              >
                {icon || cur.icon}
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 min-w-0 pr-6">
              {title && (
                <div
                  className={cn(
                    "text-sm font-bold leading-snug",
                    variant === "solid" ? "text-white" : "text-text"
                  )}
                >
                  {title}
                </div>
              )}

              {(description || children) && (
                <div
                  className={cn(
                    "text-xs sm:text-[13px] leading-relaxed mt-0.5 font-normal",
                    variant === "solid"
                      ? "text-white/90"
                      : "text-text-muted",
                    title ? "mt-1" : ""
                  )}
                >
                  {description || children}
                </div>
              )}

              {/* Expandable Technical Details */}
              {details && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer",
                      variant === "solid" ? "text-white/90" : "text-primary"
                    )}
                  >
                    <span>{isDetailsOpen ? "Hide technical details" : "View technical details"}</span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        isDetailsOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {isDetailsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2 p-2.5 rounded-xl bg-black/10 text-xs font-mono break-all"
                      >
                        {details}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Action Button */}
              {action && <div className="mt-3 flex items-center gap-2">{action}</div>}
            </div>

            {/* Dismiss ✕ Button */}
            {dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss alert"
                className={cn(
                  "absolute top-3.5 right-3.5 size-7 rounded-lg hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer shrink-0",
                  variant === "solid" ? "text-white hover:text-white" : "text-text-muted hover:text-text"
                )}
              >
                <X className="size-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
UIAlert.displayName = "UIAlert";

export default UIAlert;
