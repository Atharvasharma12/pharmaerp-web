import React, { forwardRef } from "react";
import { ChevronRight, Slash, ArrowRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
} from "./UIDropdown";

const separatorIcons = {
  chevron: ChevronRight,
  slash: Slash,
  arrow: ArrowRight,
  dot: null,
};

/**
 * ============================================================================
 * 1. UIBreadcrumbSeparator
 * ============================================================================
 */
const UIBreadcrumbSeparator = forwardRef(
  ({ children, type = "chevron", className, ...props }, ref) => {
    const IconComponent = separatorIcons[type];

    return (
      <li
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn("inline-flex items-center text-text-muted/40 select-none shrink-0", className)}
        {...props}
      >
        {children ? (
          children
        ) : type === "dot" ? (
          <span className="size-1 rounded-full bg-text-muted/50 mx-0.5" />
        ) : IconComponent ? (
          <IconComponent
            className={cn(
              type === "slash" ? "size-3 -rotate-12" : "size-3.5",
              "text-text-muted/50"
            )}
          />
        ) : (
          <ChevronRight className="size-3.5 text-text-muted/50" />
        )}
      </li>
    );
  }
);
UIBreadcrumbSeparator.displayName = "UIBreadcrumbSeparator";

/**
 * ============================================================================
 * 2. UIBreadcrumbLink
 * ============================================================================
 */
const UIBreadcrumbLink = forwardRef(
  ({ href, onClick, icon, children, className, ...props }, ref) => {
    const isInteractive = Boolean(href || onClick);

    if (!isInteractive) {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1.5 text-text-muted font-medium truncate",
            className
          )}
          {...props}
        >
          {icon && <span className="shrink-0 text-text-muted/70 flex items-center">{icon}</span>}
          <span>{children}</span>
        </span>
      );
    }

    return (
      <a
        ref={ref}
        href={href || "#"}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
        className={cn(
          "inline-flex items-center gap-1.5 text-text-muted hover:text-text font-medium truncate transition-colors duration-150 active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0 text-text-muted/70 flex items-center">{icon}</span>}
        <span>{children}</span>
      </a>
    );
  }
);
UIBreadcrumbLink.displayName = "UIBreadcrumbLink";

/**
 * ============================================================================
 * 3. UIBreadcrumbPage (Active Item)
 * ============================================================================
 */
const UIBreadcrumbPage = forwardRef(
  ({ icon, children, className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "inline-flex items-center gap-1.5 text-text font-semibold truncate cursor-default",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-primary flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  )
);
UIBreadcrumbPage.displayName = "UIBreadcrumbPage";

/**
 * ============================================================================
 * 4. UIBreadcrumbItem
 * ============================================================================
 */
const UIBreadcrumbItem = forwardRef(
  ({ children, className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-1.5 min-w-0 max-w-[200px] sm:max-w-[280px]", className)}
      {...props}
    >
      {children}
    </li>
  )
);
UIBreadcrumbItem.displayName = "UIBreadcrumbItem";

/**
 * ============================================================================
 * 5. UIBreadcrumbList
 * ============================================================================
 */
const UIBreadcrumbList = forwardRef(
  ({ children, className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px] text-text-muted list-none p-0 m-0",
        className
      )}
      {...props}
    >
      {children}
    </ol>
  )
);
UIBreadcrumbList.displayName = "UIBreadcrumbList";

/**
 * ============================================================================
 * 6. UIBreadcrumbEllipsis (Dropdown Menu for collapsed items)
 * ============================================================================
 */
const UIBreadcrumbEllipsis = forwardRef(
  ({ items = [], className, ...props }, ref) => {
    if (!items || items.length === 0) {
      return (
        <span
          ref={ref}
          role="presentation"
          aria-hidden="true"
          className={cn("flex size-6 items-center justify-center text-text-muted/60", className)}
          {...props}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">More pages</span>
        </span>
      );
    }

    return (
      <UIDropdown>
        <UIDropdownTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex size-6 items-center justify-center rounded-md hover:bg-surface-hover hover:text-text text-text-muted transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary",
              className
            )}
            aria-label="Toggle collapsed breadcrumbs menu"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </UIDropdownTrigger>
        <UIDropdownMenu align="left" width="w-56">
          {items.map((item, idx) => (
            <UIDropdownItem
              key={idx}
              icon={item.icon}
              onClick={(e) => {
                if (item.onClick) {
                  item.onClick(e);
                } else if (item.href) {
                  window.location.href = item.href;
                }
              }}
            >
              <span className="truncate">{item.label}</span>
            </UIDropdownItem>
          ))}
        </UIDropdownMenu>
      </UIDropdown>
    );
  }
);
UIBreadcrumbEllipsis.displayName = "UIBreadcrumbEllipsis";

/**
 * ============================================================================
 * 7. UIBreadcrumb / UIBreadcrumbs (Main Component)
 * ============================================================================
 * Supports both props array API (`items`) with automatic truncation dropdown,
 * and composable children composition.
 */
const UIBreadcrumbs = forwardRef(
  (
    {
      items = [],
      separator = "chevron",
      customSeparator,
      maxItems = 0,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      variant = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    // If children are supplied, render composable mode
    if (children) {
      return (
        <nav
          ref={ref}
          aria-label="Breadcrumb"
          className={cn(
            "font-sans transition-all duration-150",
            variant === "pills" && "p-1.5 px-3 rounded-xl bg-surface-alt/60 border border-border/70 w-fit",
            className
          )}
          {...props}
        >
          {children}
        </nav>
      );
    }

    if (!items || items.length === 0) return null;

    // Handle auto-collapse when maxItems is specified and items.length > maxItems
    let visibleBefore = items;
    let collapsed = [];
    let visibleAfter = [];

    const shouldCollapse = maxItems > 0 && items.length > maxItems && items.length > (itemsBeforeCollapse + itemsAfterCollapse);

    if (shouldCollapse) {
      visibleBefore = items.slice(0, itemsBeforeCollapse);
      collapsed = items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse);
      visibleAfter = items.slice(items.length - itemsAfterCollapse);
    }

    const renderItem = (item, isLast, key) => (
      <React.Fragment key={key}>
        <UIBreadcrumbItem>
          {isLast || item.active ? (
            <UIBreadcrumbPage icon={item.icon}>{item.label}</UIBreadcrumbPage>
          ) : (
            <UIBreadcrumbLink
              href={item.href}
              onClick={item.onClick}
              icon={item.icon}
            >
              {item.label}
            </UIBreadcrumbLink>
          )}
        </UIBreadcrumbItem>
        {!isLast && (
          <UIBreadcrumbSeparator type={separator}>
            {customSeparator}
          </UIBreadcrumbSeparator>
        )}
      </React.Fragment>
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(
          "font-sans transition-all duration-150",
          variant === "pills" && "p-1.5 px-3 rounded-xl bg-surface-alt/60 border border-border/70 w-fit",
          className
        )}
        {...props}
      >
        <UIBreadcrumbList>
          {!shouldCollapse ? (
            items.map((item, index) =>
              renderItem(item, index === items.length - 1, index)
            )
          ) : (
            <>
              {visibleBefore.map((item, index) =>
                renderItem(item, false, `before-${index}`)
              )}

              {/* Collapsed Dropdown Item */}
              <UIBreadcrumbItem>
                <UIBreadcrumbEllipsis items={collapsed} />
              </UIBreadcrumbItem>
              <UIBreadcrumbSeparator type={separator}>
                {customSeparator}
              </UIBreadcrumbSeparator>

              {visibleAfter.map((item, index) =>
                renderItem(
                  item,
                  index === visibleAfter.length - 1,
                  `after-${index}`
                )
              )}
            </>
          )}
        </UIBreadcrumbList>
      </nav>
    );
  }
);
UIBreadcrumbs.displayName = "UIBreadcrumbs";

export {
  UIBreadcrumbs,
  UIBreadcrumbList,
  UIBreadcrumbItem,
  UIBreadcrumbLink,
  UIBreadcrumbPage,
  UIBreadcrumbSeparator,
  UIBreadcrumbEllipsis,
};

export default UIBreadcrumbs;
