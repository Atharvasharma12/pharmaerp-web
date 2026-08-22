import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const cardVariants = {
  default:
    "bg-surface border border-border rounded-2xl shadow-xs",
  elevated:
    "bg-surface border border-border/80 rounded-2xl shadow-md",
  flat:
    "bg-surface-alt/70 border border-transparent rounded-2xl",
  interactive:
    "bg-surface border border-border rounded-2xl shadow-xs hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer active:scale-[0.99]",
};

const cardPaddings = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export const UICard = forwardRef(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hoverable = false,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = variant === "interactive" || hoverable || Boolean(onClick);
    const appliedVariant = isInteractive
      ? cardVariants.interactive
      : cardVariants[variant] || cardVariants.default;
    const appliedPadding = cardPaddings[padding] !== undefined ? cardPaddings[padding] : cardPaddings.md;

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "font-sans text-text transition-all duration-200",
          appliedVariant,
          appliedPadding,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
UICard.displayName = "UICard";

export const UICardHeader = forwardRef(
  ({ children, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start justify-between gap-4 mb-4", className)}
      {...props}
    >
      <div className="flex flex-col min-w-0">{children}</div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  )
);
UICardHeader.displayName = "UICardHeader";

export const UICardTitle = forwardRef(
  ({ children, as: Tag = "h3", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn("text-base sm:text-lg font-bold tracking-tight text-text leading-tight", className)}
      {...props}
    >
      {children}
    </Tag>
  )
);
UICardTitle.displayName = "UICardTitle";

export const UICardDescription = forwardRef(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs sm:text-sm text-text-muted mt-1 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
);
UICardDescription.displayName = "UICardDescription";

export const UICardContent = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("min-w-0 space-y-3", className)} {...props}>
      {children}
    </div>
  )
);
UICardContent.displayName = "UICardContent";

export const UICardFooter = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between pt-4 border-t border-border/80 mt-4 text-xs text-text-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
UICardFooter.displayName = "UICardFooter";

export default UICard;
