import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  UISkeletonCard,
  UISkeletonTable,
  UISkeletonForm,
} from "./UISkeleton";

/**
 * UILoadingState (#25 Component)
 *
 * Configurable loading indicator with spinner, text, and skeleton proxy modes.
 */
export const UILoadingState = forwardRef(
  (
    {
      text = "Loading data...",
      subtext,
      spinner = true,
      size = "md",
      variant = "spinner", // "spinner" | "card" | "table" | "form"
      className,
      ...props
    },
    ref
  ) => {
    if (variant === "card") {
      return <UISkeletonCard ref={ref} className={className} {...props} />;
    }

    if (variant === "table") {
      return <UISkeletonTable ref={ref} className={className} {...props} />;
    }

    if (variant === "form") {
      return <UISkeletonForm ref={ref} className={className} {...props} />;
    }

    const sizeClasses = {
      sm: { spinner: "size-5", text: "text-xs font-medium" },
      md: { spinner: "size-7", text: "text-sm font-semibold" },
      lg: { spinner: "size-9", text: "text-base font-bold" },
    };

    const cur = sizeClasses[size] || sizeClasses.md;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "flex flex-col items-center justify-center p-8 sm:p-12 text-center font-sans select-none",
          className
        )}
        {...props}
      >
        {spinner && (
          <Loader2
            className={cn(
              "animate-spin text-primary mb-3.5 shrink-0",
              cur.spinner
            )}
          />
        )}

        {text && (
          <span className={cn("text-text leading-tight", cur.text)}>
            {text}
          </span>
        )}

        {subtext && (
          <span className="text-xs text-text-muted mt-1 leading-relaxed">
            {subtext}
          </span>
        )}
      </div>
    );
  }
);
UILoadingState.displayName = "UILoadingState";

export default UILoadingState;
