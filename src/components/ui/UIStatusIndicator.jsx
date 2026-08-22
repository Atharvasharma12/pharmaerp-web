import React, { forwardRef } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Ban,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * UIStatusIndicator (#33)
 *
 * Visual status indicator system for ERP records, batch states, invoice lifecycles,
 * supplier compliance ratings, and device IoT connectivity.
 *
 * Features:
 * - Variants:
 *   - "dot": Pulsing glowing dot + text label
 *   - "badge": Soft background capsule badge with dot/icon
 *   - "solid": Vibrant solid filled badge
 *   - "outline": Clean bordered indicator
 *   - "bar": Vertical status accent bar for card borders
 * - Status Presets: "active" | "inactive" | "pending" | "draft" | "expired" | "quarantined" | "processing" | "success" | "warning" | "error" | "info"
 * - Animated ping/pulse ring for live active / processing states
 * - Sizes: "xs" | "sm" | "md" | "lg"
 */
export const UIStatusIndicator = forwardRef(
  (
    {
      status = "active", // "active" | "inactive" | "pending" | "draft" | "expired" | "quarantined" | "processing" | "success" | "warning" | "error" | "info"
      label,
      variant = "dot", // "dot" | "badge" | "solid" | "outline" | "bar"
      size = "md", // "xs" | "sm" | "md" | "lg"
      pulse = false,
      showIcon = false,
      icon,
      className,
      dotClassName,
      ...props
    },
    ref
  ) => {
    // Semantic mappings
    const statusMap = {
      active: {
        label: "Active",
        color: "success",
        icon: <CheckCircle2 className="shrink-0" />,
        dot: "bg-success shadow-[0_0_8px_var(--color-success)]",
        ring: "bg-success/40",
        badge: "bg-success/15 text-success border-success/30",
        solid: "bg-success text-white shadow-2xs",
        outline: "border-success text-success bg-transparent",
        bar: "bg-success",
      },
      success: {
        label: "Success",
        color: "success",
        icon: <ShieldCheck className="shrink-0" />,
        dot: "bg-success shadow-[0_0_8px_var(--color-success)]",
        ring: "bg-success/40",
        badge: "bg-success/15 text-success border-success/30",
        solid: "bg-success text-white shadow-2xs",
        outline: "border-success text-success bg-transparent",
        bar: "bg-success",
      },
      pending: {
        label: "Pending",
        color: "warning",
        icon: <Clock className="shrink-0" />,
        dot: "bg-warning shadow-[0_0_8px_var(--color-warning)]",
        ring: "bg-warning/40",
        badge: "bg-warning/15 text-warning border-warning/30",
        solid: "bg-warning text-white shadow-2xs",
        outline: "border-warning text-warning bg-transparent",
        bar: "bg-warning",
      },
      warning: {
        label: "Warning",
        color: "warning",
        icon: <AlertTriangle className="shrink-0" />,
        dot: "bg-warning shadow-[0_0_8px_var(--color-warning)]",
        ring: "bg-warning/40",
        badge: "bg-warning/15 text-warning border-warning/30",
        solid: "bg-warning text-white shadow-2xs",
        outline: "border-warning text-warning bg-transparent",
        bar: "bg-warning",
      },
      expired: {
        label: "Expired",
        color: "error",
        icon: <AlertCircle className="shrink-0" />,
        dot: "bg-error shadow-[0_0_8px_var(--color-error)]",
        ring: "bg-error/40",
        badge: "bg-error/15 text-error border-error/30",
        solid: "bg-error text-white shadow-2xs",
        outline: "border-error text-error bg-transparent",
        bar: "bg-error",
      },
      error: {
        label: "Error",
        color: "error",
        icon: <XCircle className="shrink-0" />,
        dot: "bg-error shadow-[0_0_8px_var(--color-error)]",
        ring: "bg-error/40",
        badge: "bg-error/15 text-error border-error/30",
        solid: "bg-error text-white shadow-2xs",
        outline: "border-error text-error bg-transparent",
        bar: "bg-error",
      },
      quarantined: {
        label: "Quarantined",
        color: "purple",
        icon: <Ban className="shrink-0" />,
        dot: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]",
        ring: "bg-purple-500/40",
        badge: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        solid: "bg-purple-600 text-white shadow-2xs",
        outline: "border-purple-500 text-purple-600 dark:text-purple-400 bg-transparent",
        bar: "bg-purple-500",
      },
      processing: {
        label: "Processing",
        color: "info",
        icon: <Sparkles className="shrink-0" />,
        dot: "bg-info shadow-[0_0_8px_var(--color-info)]",
        ring: "bg-info/40",
        badge: "bg-info/15 text-info border-info/30",
        solid: "bg-info text-white shadow-2xs",
        outline: "border-info text-info bg-transparent",
        bar: "bg-info",
      },
      info: {
        label: "Info",
        color: "info",
        icon: <AlertCircle className="shrink-0" />,
        dot: "bg-info shadow-[0_0_8px_var(--color-info)]",
        ring: "bg-info/40",
        badge: "bg-info/15 text-info border-info/30",
        solid: "bg-info text-white shadow-2xs",
        outline: "border-info text-info bg-transparent",
        bar: "bg-info",
      },
      draft: {
        label: "Draft",
        color: "neutral",
        icon: <Clock className="shrink-0" />,
        dot: "bg-text-muted/60",
        ring: "bg-text-muted/30",
        badge: "bg-surface-alt text-text-muted border-border",
        solid: "bg-surface-alt text-text-muted border border-border",
        outline: "border-border text-text-muted bg-transparent",
        bar: "bg-text-muted/40",
      },
      inactive: {
        label: "Inactive",
        color: "neutral",
        icon: <XCircle className="shrink-0" />,
        dot: "bg-text-muted/50",
        ring: "bg-text-muted/20",
        badge: "bg-surface-alt text-text-muted border-border",
        solid: "bg-surface-alt text-text-muted border border-border",
        outline: "border-border text-text-muted bg-transparent",
        bar: "bg-text-muted/40",
      },
    };

    const config = statusMap[status] || statusMap.active;
    const displayText = label || config.label;
    const isLivePulsing = pulse || status === "processing" || (pulse === undefined && status === "active");

    const sizeStyles = {
      xs: {
        text: "text-[10px]",
        badge: "px-1.5 py-0.5 rounded-md gap-1",
        dot: "size-1.5",
        icon: "size-3",
        bar: "w-1 h-3 rounded-full",
      },
      sm: {
        text: "text-xs",
        badge: "px-2 py-0.5 rounded-md gap-1.5",
        dot: "size-2",
        icon: "size-3.5",
        bar: "w-1.5 h-4 rounded-full",
      },
      md: {
        text: "text-xs sm:text-[13px]",
        badge: "px-2.5 py-1 rounded-lg gap-2 font-medium",
        dot: "size-2.5",
        icon: "size-4",
        bar: "w-1.5 h-5 rounded-full",
      },
      lg: {
        text: "text-sm sm:text-base",
        badge: "px-3 py-1.5 rounded-xl gap-2.5 font-semibold",
        dot: "size-3",
        icon: "size-4.5",
        bar: "w-2 h-6 rounded-full",
      },
    };

    const curSize = sizeStyles[size] || sizeStyles.md;

    // Render Dot (inline text + glowing pulsing circle)
    const renderDotIcon = () => (
      <span className={cn("relative flex shrink-0 items-center justify-center", curSize.dot)}>
        {isLivePulsing && (
          <span
            className={cn(
              "absolute inline-flex size-full rounded-full animate-ping opacity-75",
              config.ring
            )}
          />
        )}
        <span className={cn("relative inline-flex size-full rounded-full", config.dot, dotClassName)} />
      </span>
    );

    if (variant === "bar") {
      return (
        <div
          ref={ref}
          className={cn("inline-flex items-center gap-2 select-none font-sans", className)}
          {...props}
        >
          <span className={cn("shrink-0", curSize.bar, config.bar)} />
          <span className={cn("font-medium text-text", curSize.text)}>{displayText}</span>
        </div>
      );
    }

    if (variant === "badge") {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-flex items-center border font-sans select-none tracking-tight",
            config.badge,
            curSize.badge,
            curSize.text,
            className
          )}
          {...props}
        >
          {showIcon ? (
            icon ? (
              <span className={curSize.icon}>{icon}</span>
            ) : (
              <span className={curSize.icon}>{config.icon}</span>
            )
          ) : (
            renderDotIcon()
          )}
          <span>{displayText}</span>
        </span>
      );
    }

    if (variant === "solid") {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-flex items-center font-sans font-semibold select-none tracking-tight",
            config.solid,
            curSize.badge,
            curSize.text,
            className
          )}
          {...props}
        >
          {showIcon && (icon ? <span className={curSize.icon}>{icon}</span> : <span className={curSize.icon}>{config.icon}</span>)}
          <span>{displayText}</span>
        </span>
      );
    }

    if (variant === "outline") {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-flex items-center border font-sans font-medium select-none tracking-tight",
            config.outline,
            curSize.badge,
            curSize.text,
            className
          )}
          {...props}
        >
          {renderDotIcon()}
          <span>{displayText}</span>
        </span>
      );
    }

    // Default: Dot + Text
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2 select-none font-sans", className)}
        {...props}
      >
        {renderDotIcon()}
        <span className={cn("font-medium text-text", curSize.text)}>{displayText}</span>
      </div>
    );
  }
);
UIStatusIndicator.displayName = "UIStatusIndicator";

export default UIStatusIndicator;
