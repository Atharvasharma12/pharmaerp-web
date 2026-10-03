// src/components/ui/UIPageHeader.jsx

import React, { forwardRef } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { UIIconButton } from "./UIIconButton";

/**
 * ============================================================================
 * 1. UIPageTitle (#17 Component)
 * ============================================================================
 * Desktop: 28px, Weight 800, Line Height 1.2
 * Mobile:  22px, Weight 800, Line Height 1.2
 * Strict rule: Exactly one <h1> per page.
 */
const UIPageTitle = forwardRef(
  ({ children, as: Tag = "h1", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "text-[22px] sm:text-[28px] font-extrabold tracking-tight leading-tight text-text font-sans selection:bg-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
);
UIPageTitle.displayName = "UIPageTitle";

/**
 * ============================================================================
 * 2. UIPageDescription (#18 Component)
 * ============================================================================
 * Desktop: 15px, Weight 400, Line Height 1.6, max-w-3xl
 * Mobile:  14px, Weight 400, Line Height 1.55
 */
const UIPageDescription = forwardRef(
  ({ children, as: Tag = "p", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "text-sm sm:text-[15px] text-text-muted mt-1 sm:mt-1.5 leading-relaxed max-w-3xl font-sans",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
);
UIPageDescription.displayName = "UIPageDescription";

/**
 * ============================================================================
 * 3. UIPageHeaderHeading
 * ============================================================================
 */
const UIPageHeaderHeading = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center flex-wrap gap-2.5 sm:gap-3 min-w-0", className)}
      {...props}
    >
      {children}
    </div>
  )
);
UIPageHeaderHeading.displayName = "UIPageHeaderHeading";

/**
 * ============================================================================
 * 4. UIPageActions
 * ============================================================================
 */
const UIPageActions = forwardRef(
  ({ children, className, ...props }, ref) => {
    if (!children) return null;
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center flex-wrap gap-2 sm:gap-3 shrink-0 w-full sm:w-auto mt-3 sm:mt-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
UIPageActions.displayName = "UIPageActions";

/**
 * ============================================================================
 * 5. UIPageHeader Component
 * ============================================================================
 */
const UIPageHeader = forwardRef(
  (
    {
      title,
      description,
      badge,
      backButton,
      actions,
      sticky = false,
      bordered = true,
      compact = false,
      className,
      contentClassName,
      children,
      ...props
    },
    ref
  ) => {
    const hasBack = Boolean(backButton);
    const backConfig =
      typeof backButton === "object" && backButton !== null ? backButton : {};

    return (
      <header
        ref={ref}
        className={cn(
          "w-full font-sans transition-all duration-200",
          sticky && "sticky top-0 z-30 bg-surface/90 backdrop-blur-md shadow-2xs",
          bordered && "border-b border-border/80",
          compact ? "py-3 sm:py-4" : "py-4 sm:py-6",
          className
        )}
        {...props}
      >
        <div className={cn("w-full flex flex-col gap-3", contentClassName)}>
          {/* Main Top Row: Left Heading + Right Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            {/* Left Column: Back button + Title + Badges + Description */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {hasBack && (
                <div className="pt-0.5 shrink-0">
                  <UIIconButton
                    variant="outline"
                    size="sm"
                    shape="rounded"
                    tooltip={backConfig.tooltip || "Go back"}
                    aria-label={backConfig.label || "Back"}
                    icon={<ArrowLeft className="size-4" />}
                    onClick={
                      backConfig.onClick ||
                      (() => {
                        if (backConfig.href) {
                          window.location.href = backConfig.href;
                        } else if (window.history.length > 1) {
                          window.history.back();
                        }
                      })
                    }
                  />
                </div>
              )}

              <div className="flex flex-col min-w-0 flex-1">
                {title ? (
                  <>
                    <UIPageHeaderHeading>
                      <UIPageTitle>{title}</UIPageTitle>
                      {badge && <div className="shrink-0 flex items-center">{badge}</div>}
                    </UIPageHeaderHeading>
                    {description && (
                      <UIPageDescription>{description}</UIPageDescription>
                    )}
                  </>
                ) : null}
              </div>
            </div>

            {/* Right Column: Actions Slot */}
            {actions && <UIPageActions>{actions}</UIPageActions>}
          </div>

          {/* Children Slot for custom bottom row */}
          {children && (
            <div className="w-full min-w-0 pt-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden no-scrollbar">
              {children}
            </div>
          )}
        </div>
      </header>
    );
  }
);
UIPageHeader.displayName = "UIPageHeader";

export {
  UIPageHeader,
  UIPageTitle,
  UIPageDescription,
  UIPageActions,
  UIPageHeaderHeading,
  UIPageTitle as PageTitle,
  UIPageDescription as PageDescription,
  UIPageHeaderHeading as PageHeaderHeading,
};

export default UIPageHeader;
