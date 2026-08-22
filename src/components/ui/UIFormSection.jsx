import React, { forwardRef, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * 1. UIFormField
 * ============================================================================
 * Standard form field wrapper with accessible label, required asterisk,
 * helper text, error message, and optional info tooltip.
 */
const UIFormField = forwardRef(
  (
    {
      label,
      required = false,
      helperText,
      error,
      info,
      children,
      className,
      labelClassName,
      colSpan = 1,
      ...props
    },
    ref
  ) => {
    const colSpanClasses = {
      1: "col-span-1",
      2: "col-span-1 sm:col-span-2",
      3: "col-span-1 sm:col-span-2 lg:col-span-3",
      4: "col-span-1 sm:col-span-2 lg:col-span-4",
      full: "col-span-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-1.5 min-w-0 font-sans",
          colSpanClasses[colSpan] || "col-span-1",
          className
        )}
        {...props}
      >
        {label && (
          <div className="flex items-center justify-between gap-2">
            <label
              className={cn(
                "text-[13px] font-medium text-text select-none flex items-center gap-1",
                labelClassName
              )}
            >
              <span>{label}</span>
              {required && (
                <span className="text-error font-bold text-xs" title="Required field">
                  *
                </span>
              )}
            </label>

            {info && (
              <span
                className="text-text-muted/70 hover:text-text cursor-help flex items-center"
                title={typeof info === "string" ? info : undefined}
              >
                <Info className="size-3.5" />
              </span>
            )}
          </div>
        )}

        <div className="relative">{children}</div>

        {/* Zero-jump helper or error message */}
        {error ? (
          <p className="text-xs font-medium text-error mt-0.5 animate-fadeIn">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
UIFormField.displayName = "UIFormField";

/**
 * ============================================================================
 * 2. UIFormGrid
 * ============================================================================
 * Responsive CSS Grid container for form inputs.
 */
const UIFormGrid = forwardRef(
  ({ columns = 2, gap = "md", children, className, ...props }, ref) => {
    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    };

    const gapClasses = {
      sm: "gap-3 sm:gap-3.5",
      md: "gap-4 sm:gap-5",
      lg: "gap-5 sm:gap-6",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full",
          columnClasses[columns] || columnClasses[2],
          gapClasses[gap] || gapClasses.md,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
UIFormGrid.displayName = "UIFormGrid";

/**
 * ============================================================================
 * 3. UIFormSection (#22 Component)
 * ============================================================================
 * Group related form fields with header, description, icons, collapsible drawer,
 * and responsive multi-column layout.
 */
const UIFormSection = forwardRef(
  (
    {
      title,
      description,
      icon,
      badge,
      actions,
      columns = 2,
      gap = "md",
      variant = "card",
      collapsible = false,
      defaultExpanded = true,
      isExpanded: controlledExpanded,
      onToggle,
      children,
      className,
      headerClassName,
      bodyClassName,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledExpanded !== undefined;
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const expanded = isControlled ? controlledExpanded : internalExpanded;

    const handleToggle = () => {
      if (!collapsible) return;
      const next = !expanded;
      if (!isControlled) {
        setInternalExpanded(next);
      }
      if (onToggle) {
        onToggle(next);
      }
    };

    const variantClasses = {
      card: "p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs",
      flat: "p-5 sm:p-6 rounded-2xl border border-border/70 bg-surface-alt/40",
      clean: "pb-6 sm:pb-8 border-b border-border/70 last:border-b-0",
    };

    return (
      <section
        ref={ref}
        className={cn(
          "w-full font-sans transition-all duration-200",
          variantClasses[variant] || variantClasses.card,
          className
        )}
        {...props}
      >
        {/* Section Header */}
        {(title || description || actions || collapsible) && (
          <div
            onClick={collapsible ? handleToggle : undefined}
            className={cn(
              "flex items-start justify-between gap-3 mb-5 select-none",
              collapsible && "cursor-pointer group",
              headerClassName
            )}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {icon && (
                <div className="size-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                  {icon}
                </div>
              )}

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-text leading-tight group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  {badge && <div className="shrink-0">{badge}</div>}
                </div>

                {description && (
                  <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {actions && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2"
                >
                  {actions}
                </div>
              )}

              {collapsible && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  className="size-8 rounded-lg hover:bg-surface-hover flex items-center justify-center text-text-muted hover:text-text transition-colors"
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      expanded ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section Body */}
        {collapsible ? (
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transitionEnd: { overflow: "visible" },
                }}
                exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className={cn("pt-1", bodyClassName)}>
                  {typeof children === "function" ? (
                    children()
                  ) : (
                    <UIFormGrid columns={columns} gap={gap}>
                      {children}
                    </UIFormGrid>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className={cn("w-full", bodyClassName)}>
            <UIFormGrid columns={columns} gap={gap}>
              {children}
            </UIFormGrid>
          </div>
        )}
      </section>
    );
  }
);
UIFormSection.displayName = "UIFormSection";

export { UIFormSection, UIFormGrid, UIFormField };
export default UIFormSection;
