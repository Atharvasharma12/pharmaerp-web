import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const UIDropdownContext = createContext(null);

export const UIDropdown = forwardRef(
  (
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      placement = "auto", // "auto" | "bottom" | "top"
      align = "auto", // "auto" | "right" | "left"
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    const setIsOpen = (valueOrUpdater) => {
      const nextOpen =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(isOpen)
          : valueOrUpdater;
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    };

    const [resolvedPlacement, setResolvedPlacement] = useState("bottom");
    const [resolvedAlign, setResolvedAlign] = useState("right");
    const containerRef = useRef(null);

    // Smart 4-Way Viewport & Boundary Collision Detection (Top/Bottom, Left/Right)
    const calculatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.left;
      const spaceLeft = rect.right;

      const estimatedHeight = 220; // Safe threshold for dropdown menus
      const estimatedWidth = 180; // Safe width threshold

      // 1. Vertical Auto-Flipping (Top <-> Bottom)
      if (placement === "top") {
        if (spaceAbove < estimatedHeight && spaceBelow > spaceAbove) {
          setResolvedPlacement("bottom"); // Flip to bottom if not enough space at top
        } else {
          setResolvedPlacement("top");
        }
      } else if (placement === "bottom") {
        if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
          setResolvedPlacement("top"); // Flip to top if not enough space at bottom
        } else {
          setResolvedPlacement("bottom");
        }
      } else {
        // placement === "auto"
        if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
          setResolvedPlacement("top");
        } else {
          setResolvedPlacement("bottom");
        }
      }

      // 2. Horizontal Auto-Flipping (Left <-> Right)
      if (align === "left") {
        if (spaceRight < estimatedWidth && spaceLeft > spaceRight) {
          setResolvedAlign("right"); // Flip to right if overflowing right edge
        } else {
          setResolvedAlign("left");
        }
      } else if (align === "right") {
        if (spaceLeft < estimatedWidth && spaceRight > spaceLeft) {
          setResolvedAlign("left"); // Flip to left if overflowing left edge
        } else {
          setResolvedAlign("right");
        }
      } else {
        // align === "auto"
        if (spaceRight >= estimatedWidth) {
          setResolvedAlign("left");
        } else if (spaceLeft >= estimatedWidth) {
          setResolvedAlign("right");
        } else {
          setResolvedAlign(spaceRight > spaceLeft ? "left" : "right");
        }
      }
    };

    // Recalculate on open, window resize, and scroll
    useLayoutEffect(() => {
      if (isOpen) {
        calculatePosition();
        window.addEventListener("resize", calculatePosition, { passive: true });
        window.addEventListener("scroll", calculatePosition, { passive: true, capture: true });
        return () => {
          window.removeEventListener("resize", calculatePosition);
          window.removeEventListener("scroll", calculatePosition, true);
        };
      }
    }, [isOpen, placement, align]);

    // Outside click detection
    useEffect(() => {
      if (!isOpen) return;

      const handleOutsideClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    return (
      <UIDropdownContext.Provider
        value={{
          isOpen,
          setIsOpen,
          placement: resolvedPlacement,
          align: resolvedAlign,
        }}
      >
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn("relative inline-flex font-sans z-30", className)}
          {...props}
        >
          {children}
        </div>
      </UIDropdownContext.Provider>
    );
  }
);
UIDropdown.displayName = "UIDropdown";

export const UIDropdownTrigger = forwardRef(
  ({ children, asChild = false, className, ...props }, ref) => {
    const context = useContext(UIDropdownContext);
    const isOpen = context?.isOpen ?? false;
    const setIsOpen = context?.setIsOpen;

    const handleClick = (e) => {
      e.stopPropagation();
      setIsOpen?.((prev) => !prev);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        onClick: (e) => {
          children.props.onClick?.(e);
          handleClick(e);
        },
        "aria-expanded": isOpen,
        "aria-haspopup": "menu",
      });
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn("cursor-pointer inline-flex items-center", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
UIDropdownTrigger.displayName = "UIDropdownTrigger";

export const UIDropdownMenu = forwardRef(
  (
    {
      children,
      align: explicitAlign,
      placement: explicitPlacement,
      width = "w-52",
      className,
      ...props
    },
    ref
  ) => {
    const context = useContext(UIDropdownContext);
    const isOpen = context?.isOpen ?? false;
    const setIsOpen = context?.setIsOpen;

    const appliedPlacement = explicitPlacement || context?.placement || "bottom";
    const appliedAlign = explicitAlign || context?.align || "right";
    const isTop = appliedPlacement === "top";

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: isTop ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isTop ? 6 : -6 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute z-50 bg-surface border border-border rounded-2xl shadow-xl p-1.5 space-y-0.5 overflow-hidden",
              isTop ? "bottom-full mb-1.5" : "top-full mt-1.5",
              appliedAlign === "right" ? "right-0" : "left-0",
              width,
              className
            )}
            {...props}
          >
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;
              return React.cloneElement(child, {
                onClick: (e) => {
                  child.props.onClick?.(e);
                  if (!child.props.disabled && child.type?.displayName === "UIDropdownItem") {
                    setIsOpen?.(false);
                  }
                },
              });
            })}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
UIDropdownMenu.displayName = "UIDropdownMenu";

export const UIDropdownItem = forwardRef(
  (
    {
      children,
      icon,
      shortcut,
      destructive = false,
      disabled = false,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        role="menuitem"
        type="button"
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-xs sm:text-[13px] font-medium rounded-xl cursor-pointer select-none",
          "transition-colors duration-100 ease-out",
          destructive
            ? "text-error hover:bg-error/10 active:bg-error/20"
            : "text-text hover:bg-surface-hover hover:text-text active:bg-surface-active",
          disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon && (
            <span
              className={cn(
                "shrink-0 size-4 flex items-center justify-center",
                destructive ? "text-error" : "text-text-muted"
              )}
            >
              {icon}
            </span>
          )}
          <span className="truncate">{children}</span>
        </div>

        {shortcut && (
          <span className="font-mono text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-surface-alt px-1.5 py-0.5 rounded border border-border/60">
            {shortcut}
          </span>
        )}
      </button>
    );
  }
);
UIDropdownItem.displayName = "UIDropdownItem";

export const UIDropdownDivider = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("h-px bg-border/80 my-1 -mx-1.5", className)} {...props} />
));
UIDropdownDivider.displayName = "UIDropdownDivider";

export const UIDropdownLabel = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted select-none", className)}
    {...props}
  >
    {children}
  </div>
));
UIDropdownLabel.displayName = "UIDropdownLabel";

export default UIDropdown;
