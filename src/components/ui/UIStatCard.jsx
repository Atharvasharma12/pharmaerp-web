import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UISkeleton } from "./UISkeleton";

const iconBgMap = {
  primary: "bg-primary-soft text-primary border-primary/20",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  error: "bg-error-soft text-error border-error/20",
  info: "bg-info-soft text-info border-info/20",
  purple: "bg-purple-500/12 text-purple-600 dark:text-purple-400 border-purple-500/20",
  neutral: "bg-surface-alt text-text-muted border-border",
};

const trendColorMap = {
  up: "text-success bg-success-soft border-success/20",
  down: "text-error bg-error-soft border-error/20",
  neutral: "text-text-muted bg-surface-alt border-border",
};

/**
 * ============================================================================
 * UIStatCard (#28 Primary Component)
 * ============================================================================
 * High-impact KPI metric card with trend badges, comparative period subtitles,
 * icon badge containers, sparkline previews, and loading skeletons.
 */
export const UIStatCard = forwardRef(
  (
    {
      title,
      value,
      prefix,
      suffix,
      subtitle,
      icon,
      trend, // { value: "+12.4%", direction: "up" | "down" | "neutral", label?: "vs last month" }
      color = "primary",
      variant = "default", // "default" | "elevated" | "flat" | "interactive"
      badge,
      sparklineData, // Array<number> for mini SVG trendline
      progress, // { value: number (0-100), label?: string }
      isLoading = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const isInteractive = variant === "interactive" || Boolean(onClick);

    const variantClasses = {
      default: "bg-surface border border-border rounded-2xl shadow-xs",
      elevated: "bg-surface border border-border/80 rounded-2xl shadow-md",
      flat: "bg-surface-alt/60 border border-border/70 rounded-2xl",
      interactive:
        "bg-surface border border-border rounded-2xl shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]",
    };

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            "p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4 font-sans",
            className
          )}
          {...props}
        >
          <div className="flex items-center justify-between gap-3">
            <UISkeleton className="h-4 w-28" />
            <UISkeleton className="size-10 rounded-xl shrink-0" />
          </div>
          <div className="space-y-2">
            <UISkeleton className="h-8 w-36" />
            <UISkeleton className="h-3.5 w-24" />
          </div>
        </div>
      );
    }

    // Mini SVG sparkline generator
    const renderSparkline = () => {
      if (!Array.isArray(sparklineData) || sparklineData.length < 2) return null;
      const min = Math.min(...sparklineData);
      const max = Math.max(...sparklineData);
      const range = max - min || 1;
      const height = 32;
      const width = 80;

      const points = sparklineData
        .map((d, i) => {
          const x = (i / (sparklineData.length - 1)) * width;
          const y = height - ((d - min) / range) * (height - 6) - 3;
          return `${x},${y}`;
        })
        .join(" ");

      const strokeColor =
        trend?.direction === "down"
          ? "var(--color-error, #ef4444)"
          : "var(--color-primary, #0ea5e9)";

      return (
        <svg
          width={width}
          height={height}
          className="overflow-visible shrink-0 ml-auto"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      );
    };

    const CardTag = isInteractive ? motion.div : "div";
    const motionProps = isInteractive
      ? {
          whileHover: { y: -2 },
          whileTap: { scale: 0.98 },
          transition: { type: "spring", stiffness: 450, damping: 25 },
        }
      : {};

    return (
      <CardTag
        ref={ref}
        onClick={onClick}
        className={cn(
          "relative p-5 sm:p-6 font-sans text-text transition-all duration-200 flex flex-col justify-between overflow-hidden",
          variantClasses[variant] || variantClasses.default,
          isInteractive && variantClasses.interactive,
          className
        )}
        {...motionProps}
        {...props}
      >
        {/* Top Row: Title + Icon / Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-[13px] font-semibold text-text-muted tracking-tight truncate select-none">
              {title}
            </span>
            {badge && <div className="mt-1">{badge}</div>}
          </div>

          {icon && (
            <div
              className={cn(
                "size-10 sm:size-11 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 select-none",
                iconBgMap[color] || iconBgMap.primary
              )}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(icon, {
                    className: cn("size-5", icon.props.className),
                  })
                : icon}
            </div>
          )}
        </div>

        {/* Middle Row: Big Metric Value + Sparkline */}
        <div className="flex items-baseline justify-between gap-2 my-1">
          <div className="flex items-baseline gap-1 min-w-0">
            {prefix && (
              <span className="text-lg sm:text-xl font-bold text-text-muted/80 font-mono select-none">
                {prefix}
              </span>
            )}
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-text tabular-nums">
              {value}
            </span>
            {suffix && (
              <span className="text-xs sm:text-sm font-medium text-text-muted ml-0.5 select-none truncate">
                {suffix}
              </span>
            )}
          </div>

          {renderSparkline()}
        </div>

        {/* Progress Bar (Optional) */}
        {progress && (
          <div className="mt-2 space-y-1">
            {progress.label && (
              <div className="flex justify-between text-[11px] text-text-muted font-medium">
                <span>{progress.label}</span>
                <span className="font-mono">{progress.value}%</span>
              </div>
            )}
            <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom Row: Trend Badge + Subtitle */}
        {(trend || subtitle) && (
          <div className="flex items-center flex-wrap gap-2 mt-3 pt-2.5 border-t border-border/60 text-xs select-none">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-mono font-bold text-[11px] px-2 py-0.5 rounded-md border tabular-nums shrink-0",
                  trendColorMap[trend.direction] || trendColorMap.neutral
                )}
              >
                {trend.direction === "up" ? (
                  <ArrowUpRight className="size-3 stroke-[2.5]" />
                ) : trend.direction === "down" ? (
                  <ArrowDownRight className="size-3 stroke-[2.5]" />
                ) : (
                  <Minus className="size-3 stroke-[2.5]" />
                )}
                <span>{trend.value}</span>
              </span>
            )}

            {subtitle && (
              <span className="text-text-muted text-[11.5px] truncate font-medium">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </CardTag>
    );
  }
);
UIStatCard.displayName = "UIStatCard";

export default UIStatCard;
