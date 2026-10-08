import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  X,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UIIconButton } from "./UIIconButton";

const colorThemes = {
  primary: {
    accent: "border-l-primary",
    soft: "bg-primary-soft/40 border-primary/20 text-text",
    iconBg: "bg-primary-soft text-primary",
    title: "text-primary",
  },
  success: {
    accent: "border-l-success",
    soft: "bg-success-soft/40 border-success/20 text-text",
    iconBg: "bg-success-soft text-success",
    title: "text-success",
  },
  warning: {
    accent: "border-l-warning",
    soft: "bg-warning-soft/40 border-warning/20 text-text",
    iconBg: "bg-warning-soft text-warning",
    title: "text-warning",
  },
  error: {
    accent: "border-l-error",
    soft: "bg-error-soft/40 border-error/20 text-text",
    iconBg: "bg-error-soft text-error",
    title: "text-error",
  },
  info: {
    accent: "border-l-info",
    soft: "bg-info-soft/40 border-info/20 text-text",
    iconBg: "bg-info-soft text-info",
    title: "text-info",
  },
  purple: {
    accent: "border-l-purple-500",
    soft: "bg-purple-500/10 border-purple-500/20 text-text",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    title: "text-purple-600 dark:text-purple-400",
  },
  neutral: {
    accent: "border-l-neutral-400",
    soft: "bg-surface-alt/80 border-border text-text",
    iconBg: "bg-surface-alt text-text-muted",
    title: "text-text",
  },
};

/**
 * ============================================================================
 * UIInfoCard (#30 Primary Component)
 * ============================================================================
 * Display structured information, compliance notices, customer/vendor info,
 * and expandable highlighted detail cards.
 */
export const UIInfoCard = forwardRef(
  (
    {
      title,
      description,
      icon = <Info className="size-4" />,
      color = "primary", // "primary" | "success" | "warning" | "error" | "info" | "purple" | "neutral"
      variant = "default", // "default" | "accent" | "soft" | "outlined"
      badge,
      items = [], // Array<{ label: string, value: string | ReactNode, icon?: ReactNode, mono?: boolean }>
      actions,
      onDismiss,
      collapsible = false,
      defaultExpanded = true,
      isExpanded: controlledExpanded,
      onToggle,
      footer,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isControlled = controlledExpanded !== undefined;
    const isExpanded = isControlled ? controlledExpanded : internalExpanded;

    const handleToggle = () => {
      if (!collapsible) return;
      const next = !isExpanded;
      if (!isControlled) {
        setInternalExpanded(next);
      }
      onToggle?.(next);
    };

    const curTheme = colorThemes[color] || colorThemes.primary;

    const variantClasses = {
      default: "bg-surface border border-border rounded-2xl shadow-xs",
      accent: cn("bg-surface border border-border rounded-2xl shadow-xs border-l-4", curTheme.accent),
      soft: cn("rounded-2xl border shadow-2xs", curTheme.soft),
      outlined: "bg-transparent border border-border rounded-2xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full p-4 sm:p-5 font-sans text-text transition-colors duration-150 flex flex-col gap-3.5 select-none",
          variantClasses[variant] || variantClasses.default,
          className
        )}
        {...props}
      >
        {/* Header Row */}
        <div
          onClick={collapsible ? handleToggle : undefined}
          className={cn(
            "flex items-start justify-between gap-3",
            collapsible && "cursor-pointer group"
          )}
        >
          {/* Left: Icon + Title + Badge + Description */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {icon && (
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-transparent shadow-2xs transition-transform duration-150 group-hover:scale-105",
                  curTheme.iconBg
                )}
              >
                {React.isValidElement(icon)
                  ? icon
                  : typeof icon === "function" || typeof icon === "object"
                  ? React.createElement(icon, { className: "size-4" })
                  : icon}
              </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {title && (
                  <h4 className="text-sm sm:text-base font-bold text-text tracking-tight leading-tight group-hover:text-primary transition-colors">
                    {title}
                  </h4>
                )}
                {badge && <div className="shrink-0">{badge}</div>}
              </div>

              {description && (
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions, Accordion Trigger, Dismiss button */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 shrink-0"
          >
            {actions}

            {collapsible && (
              <button
                type="button"
                onClick={handleToggle}
                aria-expanded={isExpanded}
                aria-label="Toggle section"
                className="size-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
            )}

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss info card"
                className="size-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Body */}
        {collapsible ? (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="info-card-body"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: {
                    height: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.2, ease: "easeOut", delay: 0.03 },
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    opacity: { duration: 0.12, ease: "easeIn" },
                    height: { duration: 0.22, ease: [0.16, 1, 0.3, 1], delay: 0.02 },
                  },
                }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-3">
                  {/* Key-Value Items Grid */}
                  {items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col p-2.5 rounded-xl bg-surface-alt/50 border border-border/60"
                        >
                          <span className="text-[11px] font-medium text-text-muted select-none truncate">
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              "text-xs sm:text-[13px] font-semibold text-text mt-0.5 truncate",
                              item.mono && "font-mono tabular-nums"
                            )}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="space-y-3 pt-1">
            {/* Key-Value Items Grid */}
            {items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col p-2.5 rounded-xl bg-surface-alt/50 border border-border/60"
                  >
                    <span className="text-[11px] font-medium text-text-muted select-none truncate">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "text-xs sm:text-[13px] font-semibold text-text mt-0.5 truncate",
                        item.mono && "font-mono tabular-nums"
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="pt-2.5 border-t border-border/70 text-xs text-text-muted">
            {footer}
          </div>
        )}
      </div>
    );
  }
);
UIInfoCard.displayName = "UIInfoCard";

export default UIInfoCard;
