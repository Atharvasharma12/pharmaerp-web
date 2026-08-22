import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const indicatorColors = {
  primary: "bg-primary shadow-xs shadow-primary/40",
  success: "bg-success shadow-xs shadow-success/40",
  warning: "bg-warning shadow-xs shadow-warning/40",
  error: "bg-error shadow-xs shadow-error/40",
  info: "bg-info shadow-xs shadow-info/40",
  purple: "bg-purple-500 shadow-xs shadow-purple-500/40",
  neutral: "bg-text-muted/60",
};

/**
 * ============================================================================
 * 1. UISectionTitle (#20 Component)
 * ============================================================================
 * Desktop: 20px, Weight 700, Line Height 1.3
 * Mobile:  16px, Weight 700, Line Height 1.3
 * Default tag: <h2>
 */
const UISectionTitle = forwardRef(
  ({ children, as: Tag = "h2", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "text-base sm:text-xl font-bold tracking-tight text-text leading-tight font-sans",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
);
UISectionTitle.displayName = "UISectionTitle";

/**
 * ============================================================================
 * 2. UISectionDescription (#21 Component)
 * ============================================================================
 * Desktop: 14px, Weight 400, Line Height 1.6
 * Mobile:  13px, Weight 400, Line Height 1.55
 */
const UISectionDescription = forwardRef(
  ({ children, as: Tag = "p", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "text-[13px] sm:text-sm text-text-muted mt-0.5 sm:mt-1 leading-relaxed font-sans",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
);
UISectionDescription.displayName = "UISectionDescription";

/**
 * ============================================================================
 * 3. UISectionHeaderHeading
 * ============================================================================
 */
const UISectionHeaderHeading = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center flex-wrap gap-2 sm:gap-2.5 min-w-0", className)}
      {...props}
    >
      {children}
    </div>
  )
);
UISectionHeaderHeading.displayName = "UISectionHeaderHeading";

/**
 * ============================================================================
 * 4. UISectionActions
 * ============================================================================
 */
const UISectionActions = forwardRef(
  ({ children, className, ...props }, ref) => {
    if (!children) return null;
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center flex-wrap gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto mt-2 sm:mt-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
UISectionActions.displayName = "UISectionActions";

/**
 * ============================================================================
 * 5. UISectionHeader (#19 Component)
 * ============================================================================
 */
const UISectionHeader = forwardRef(
  (
    {
      title,
      description,
      icon,
      badge,
      indicatorColor,
      actions,
      divider = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const indicatorClass =
      indicatorColor && (indicatorColors[indicatorColor] || indicatorColors.primary);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full font-sans transition-all duration-150",
          divider && "pb-3 sm:pb-4 border-b border-border/70 mb-4 sm:mb-5",
          className
        )}
        {...props}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
          {/* Left Column: Icon/Dot + Title + Badge + Description */}
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            {icon && (
              <div className="pt-0.5 text-text-muted shrink-0 flex items-center">
                {icon}
              </div>
            )}

            {indicatorColor && !icon && (
              <div className="pt-1.5 shrink-0">
                <span className={cn("block size-2.5 rounded-full", indicatorClass)} />
              </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              {title ? (
                <>
                  <UISectionHeaderHeading>
                    <UISectionTitle>{title}</UISectionTitle>
                    {badge && <div className="shrink-0 flex items-center">{badge}</div>}
                  </UISectionHeaderHeading>
                  {description && (
                    <UISectionDescription>{description}</UISectionDescription>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* Right Column: Actions Slot */}
          {actions && <UISectionActions>{actions}</UISectionActions>}
        </div>

        {/* Children Slot for custom extensions */}
        {children && (
          <div className="w-full pt-2">
            {children}
          </div>
        )}
      </div>
    );
  }
);
UISectionHeader.displayName = "UISectionHeader";

export {
  UISectionHeader,
  UISectionTitle,
  UISectionDescription,
  UISectionActions,
  UISectionHeaderHeading,
};

export default UISectionHeader;
