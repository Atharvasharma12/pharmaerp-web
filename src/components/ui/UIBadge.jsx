import React, { forwardRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  soft: {
    primary: "bg-primary-soft text-primary border-primary/25 font-semibold",
    success: "bg-success-soft text-success border-success/25 font-semibold",
    warning: "bg-warning-soft text-warning border-warning/30 font-semibold",
    error: "bg-error-soft text-error border-error/25 font-semibold",
    info: "bg-info-soft text-info border-info/25 font-semibold",
    neutral: "bg-surface-alt text-text-muted border-border font-medium",
    purple: "bg-purple-500/12 text-purple-600 dark:text-purple-400 border-purple-500/25 font-semibold",
  },
  solid: {
    primary: "bg-primary text-primary-contrast border-primary shadow-2xs font-bold",
    success: "bg-success text-success-contrast border-success shadow-2xs font-bold",
    warning: "bg-warning text-warning-contrast border-warning shadow-2xs font-bold",
    error: "bg-error text-error-contrast border-error shadow-2xs font-bold",
    info: "bg-info text-info-contrast border-info shadow-2xs font-bold",
    neutral: "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 border-transparent font-semibold",
    purple: "bg-purple-600 text-white border-purple-600 shadow-2xs font-bold",
  },
  outline: {
    primary: "bg-transparent text-primary border-primary/40 font-semibold",
    success: "bg-transparent text-success border-success/40 font-semibold",
    warning: "bg-transparent text-warning border-warning/40 font-semibold",
    error: "bg-transparent text-error border-error/40 font-semibold",
    info: "bg-transparent text-info border-info/40 font-semibold",
    neutral: "bg-transparent text-text-muted border-border font-medium",
    purple: "bg-transparent text-purple-600 dark:text-purple-400 border-purple-500/40 font-semibold",
  },
  dot: {
    primary: "bg-primary-soft text-primary border-primary/25 font-semibold",
    success: "bg-success-soft text-success border-success/25 font-semibold",
    warning: "bg-warning-soft text-warning border-warning/30 font-semibold",
    error: "bg-error-soft text-error border-error/25 font-semibold",
    info: "bg-info-soft text-info border-info/25 font-semibold",
    neutral: "bg-surface-alt text-text-muted border-border font-medium",
    purple: "bg-purple-500/12 text-purple-600 dark:text-purple-400 border-purple-500/25 font-semibold",
  },
};

const dotColors = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  neutral: "bg-neutral-500",
  purple: "bg-purple-500",
};

const badgeSizes = {
  xs: "text-[10px] px-2 py-0.5 gap-1 tracking-tight leading-none",
  sm: "text-[11px] px-2.5 py-0.5 gap-1.5 tracking-tight leading-none",
  md: "text-xs px-2.5 py-1 gap-1.5 tracking-tight leading-none",
  lg: "text-[13px] px-3 py-1.5 gap-2 tracking-tight leading-none",
};

const shapeMap = {
  pill: "rounded-full",
  rounded: "rounded-md",
  square: "rounded-xs",
};

export const UIBadge = forwardRef(
  (
    {
      children,
      label,
      variant = "soft",
      color = "primary",
      size = "md",
      shape = "pill",
      pulse = false,
      icon,
      onDismiss,
      className,
      ...props
    },
    ref
  ) => {
    const isDot = variant === "dot";
    const currentVariantMap = badgeVariants[variant] || badgeVariants.soft;
    const appliedColorClass = currentVariantMap[color] || currentVariantMap.primary;
    const appliedSize = badgeSizes[size] || badgeSizes.md;
    const appliedShape = shapeMap[shape] || shapeMap.pill;
    const dotColor = dotColors[color] || dotColors.primary;

    const content = label || children;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans select-none border whitespace-nowrap transition-colors",
          appliedColorClass,
          appliedSize,
          appliedShape,
          className
        )}
        {...props}
      >
        {/* Animated Dot with Optional Pulse Ping */}
        {isDot && (
          <span className="relative flex size-1.5 shrink-0">
            {pulse && (
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-80",
                  dotColor
                )}
              />
            )}
            <span className={cn("relative inline-flex rounded-full size-1.5", dotColor)} />
          </span>
        )}

        {/* Start Icon */}
        {!isDot && icon && (
          <span className="inline-flex shrink-0 size-3.5 items-center justify-center">
            {icon}
          </span>
        )}

        {/* Crisp Text Content */}
        <span className="truncate">{content}</span>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            aria-label="Remove badge"
            className="p-0.5 hover:opacity-75 rounded-full transition-opacity cursor-pointer ml-0.5"
          >
            <X className="size-3" />
          </button>
        )}
      </span>
    );
  }
);

UIBadge.displayName = "UIBadge";
export default UIBadge;
