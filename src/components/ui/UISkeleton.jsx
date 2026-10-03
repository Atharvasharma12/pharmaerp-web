import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * UISkeleton Suite (#35)
 *
 * Professional loading placeholder system providing zero-CLS (Cumulative Layout Shift = 0)
 * loading states that mimic final content layouts instead of generic spinners.
 *
 * Includes:
 * 1. `UISkeleton` - Core atomic base element with shapes and dimensions
 * 2. `UISkeletonText` - Multi-line paragraph skeleton with randomized realistic line widths
 * 3. `UISkeletonAvatar` - Circular / rounded user/vendor profile placeholder
 * 4. `UISkeletonButton` - CTA action button placeholder
 * 5. `UISkeletonCard` - Full card skeleton with header, avatar, text lines, and footer
 * 6. `UISkeletonTable` - Full data table grid skeleton with column headers and rows
 * 7. `UISkeletonForm` - Form layout skeleton with label and input boxes
 * 8. `UISkeletonKpi` - Metric KPI card placeholder
 */

/**
 * 1. Base UISkeleton Atomic Primitive
 */
export const UISkeleton = forwardRef(
  (
    {
      variant = "rounded", // "text" | "rectangular" | "circular" | "rounded"
      animation = "shimmer", // "shimmer" | "pulse" | "none"
      width,
      height,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      text: "h-4 rounded-md",
      rectangular: "rounded-none",
      rounded: "rounded-xl",
      circular: "rounded-full",
    };

    const animationClasses = {
      shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent bg-surface-alt/80",
      pulse: "animate-pulse bg-surface-alt/90",
      none: "bg-surface-alt/80",
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "shrink-0 select-none",
          variantClasses[variant] || variantClasses.rounded,
          animationClasses[animation] || animationClasses.shimmer,
          className
        )}
        style={{
          width: width,
          height: height,
          ...style,
        }}
        {...props}
      />
    );
  }
);
UISkeleton.displayName = "UISkeleton";

/**
 * 2. UISkeletonText - Multi-line paragraph loader
 */
export const UISkeletonText = forwardRef(
  (
    {
      lines = 3,
      gap = "gap-2.5",
      lastLineWidth = "65%",
      height = "h-3.5",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("flex flex-col w-full", gap, className)}
        {...props}
      >
        {Array.from({ length: lines }).map((_, idx) => {
          const isLast = idx === lines - 1;
          return (
            <UISkeleton
              key={idx}
              variant="rounded"
              height={height}
              style={{
                width: isLast && lines > 1 ? lastLineWidth : "100%",
              }}
            />
          );
        })}
      </div>
    );
  }
);
UISkeletonText.displayName = "UISkeletonText";

/**
 * 3. UISkeletonAvatar - Profile & Icon Circle
 */
export const UISkeletonAvatar = forwardRef(
  (
    {
      size = "md", // "sm" | "md" | "lg" | "xl"
      shape = "circular", // "circular" | "rounded"
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
      xl: "size-16",
    };

    return (
      <UISkeleton
        ref={ref}
        variant={shape}
        className={cn(sizeClasses[size] || sizeClasses.md, className)}
        {...props}
      />
    );
  }
);
UISkeletonAvatar.displayName = "UISkeletonAvatar";

/**
 * 4. UISkeletonButton - Interactive button placeholder
 */
export const UISkeletonButton = forwardRef(
  (
    {
      size = "md", // "sm" | "md" | "lg"
      width = "w-28",
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 rounded-lg",
      md: "h-10 rounded-xl",
      lg: "h-12 rounded-xl",
    };

    return (
      <UISkeleton
        ref={ref}
        variant="rounded"
        className={cn(sizeClasses[size] || sizeClasses.md, width, className)}
        {...props}
      />
    );
  }
);
UISkeletonButton.displayName = "UISkeletonButton";

/**
 * 5. UISkeletonCard - Compound Card Loading Placeholder
 */
export const UISkeletonCard = forwardRef(
  (
    {
      hasHeader = true,
      hasFooter = true,
      lines = 3,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "w-full p-5 rounded-2xl border border-border bg-surface flex flex-col gap-4 font-sans",
          className
        )}
        {...props}
      >
        {hasHeader && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <UISkeletonAvatar size="md" />
              <div className="flex flex-col gap-1.5 flex-1 max-w-[180px]">
                <UISkeleton height="h-4" width="80%" />
                <UISkeleton height="h-3" width="50%" />
              </div>
            </div>
            <UISkeleton height="h-6" width="60px" variant="rounded" />
          </div>
        )}

        <UISkeletonText lines={lines} gap="gap-2.5" />

        {hasFooter && (
          <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-1">
            <UISkeleton height="h-3.5" width="100px" />
            <UISkeletonButton size="sm" width="w-20" />
          </div>
        )}
      </div>
    );
  }
);
UISkeletonCard.displayName = "UISkeletonCard";

/**
 * 6. UISkeletonTable - Compound Data Grid Loading Placeholder
 */
export const UISkeletonTable = forwardRef(
  (
    {
      rows = 5,
      columns = 4,
      hasToolbar = true,
      hasPagination = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "w-full rounded-2xl border border-border bg-surface overflow-hidden flex flex-col font-sans",
          className
        )}
        {...props}
      >
        {/* Optional Filter/Toolbar Header */}
        {hasToolbar && (
          <div className="p-4 border-b border-border/70 flex items-center justify-between gap-3">
            <UISkeleton height="h-9" width="220px" variant="rounded" />
            <div className="flex items-center gap-2">
              <UISkeleton height="h-9" width="100px" variant="rounded" />
              <UISkeleton height="h-9" width="110px" variant="rounded" />
            </div>
          </div>
        )}

        {/* Table Header Row */}
        <div className="grid grid-cols-4 gap-4 p-3.5 bg-surface-alt/50 border-b border-border/70">
          {Array.from({ length: columns }).map((_, i) => (
            <UISkeleton
              key={`th-${i}`}
              height="h-4"
              width={i === 0 ? "70%" : i === columns - 1 ? "40%" : "60%"}
            />
          ))}
        </div>

        {/* Table Body Rows */}
        <div className="divide-y divide-border/60">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className="grid grid-cols-4 gap-4 p-4 items-center"
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <UISkeleton
                  key={`cell-${rowIdx}-${colIdx}`}
                  height="h-4"
                  width={
                    colIdx === 0
                      ? "85%"
                      : colIdx === 1
                      ? "60%"
                      : colIdx === 2
                      ? "45%"
                      : "70%"
                  }
                />
              ))}
            </div>
          ))}
        </div>

        {/* Optional Pagination Footer */}
        {hasPagination && (
          <div className="p-3.5 border-t border-border/70 flex items-center justify-between">
            <UISkeleton height="h-4" width="120px" />
            <div className="flex items-center gap-1.5">
              <UISkeleton height="h-8" width="32px" variant="rounded" />
              <UISkeleton height="h-8" width="32px" variant="rounded" />
              <UISkeleton height="h-8" width="32px" variant="rounded" />
            </div>
          </div>
        )}
      </div>
    );
  }
);
UISkeletonTable.displayName = "UISkeletonTable";

/**
 * 7. UISkeletonForm - Compound Form Fields Placeholder
 */
export const UISkeletonForm = forwardRef(
  (
    {
      fields = 4,
      columns = 2,
      hasActions = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "w-full p-5 sm:p-6 rounded-2xl border border-border bg-surface flex flex-col gap-5 font-sans",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-1.5 pb-2 border-b border-border/60 max-w-[240px]">
          <UISkeleton height="h-5" width="80%" />
          <UISkeleton height="h-3.5" width="60%" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: fields }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <UISkeleton height="h-3.5" width="35%" />
              <UISkeleton height="h-10" width="100%" variant="rounded" />
            </div>
          ))}
        </div>

        {hasActions && (
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60">
            <UISkeletonButton size="md" width="w-20" />
            <UISkeletonButton size="md" width="w-28" />
          </div>
        )}
      </div>
    );
  }
);
UISkeletonForm.displayName = "UISkeletonForm";

/**
 * 8. UISkeletonKpi - Metric Stat Card Placeholder
 */
export const UISkeletonKpi = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "p-5 rounded-2xl border border-border bg-surface flex flex-col gap-3 font-sans",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <UISkeleton height="h-3.5" width="40%" />
          <UISkeletonAvatar size="sm" />
        </div>
        <UISkeleton height="h-8" width="65%" />
        <div className="flex items-center justify-between pt-1">
          <UISkeleton height="h-3" width="45%" />
          <UISkeleton height="h-4" width="25%" variant="rounded" />
        </div>
      </div>
    );
  }
);
UISkeletonKpi.displayName = "UISkeletonKpi";

export default UISkeleton;
