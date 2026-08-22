import React, { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * UITooltip (#38)
 *
 * Micro-interaction tooltip providing contextual guidance, action explanations,
 * and keyboard shortcut hints across table icons and form buttons.
 *
 * Features:
 * - Placements: "top" | "bottom" | "left" | "right" (auto collision detection)
 * - Hotkey shortcut badge (e.g. `shortcut="⌘K"` or `shortcut="Esc"`)
 * - Arrow pointer
 * - Hover & focus accessibility (aria-describedby)
 * - Configurable delay (default: 150ms)
 */
export const UITooltip = forwardRef(
  (
    {
      content,
      shortcut,
      placement = "top", // "top" | "bottom" | "left" | "right"
      delay = 150,
      disabled = false,
      arrow = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [resolvedPlacement, setResolvedPlacement] = useState(placement);
    const timerRef = useRef(null);
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);

    const showTooltip = () => {
      if (disabled || !content) return;
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const hideTooltip = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsVisible(false);
    };

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    // Collision detection check on show
    useEffect(() => {
      if (isVisible && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let targetPlacement = placement;

        // Auto flip if near screen borders
        if (placement === "top" && rect.top < 40) targetPlacement = "bottom";
        if (placement === "bottom" && window.innerHeight - rect.bottom < 40) targetPlacement = "top";
        if (placement === "left" && rect.left < 80) targetPlacement = "right";
        if (placement === "right" && window.innerWidth - rect.right < 80) targetPlacement = "left";

        setResolvedPlacement(targetPlacement);
      }
    }, [isVisible, placement]);

    const placementStyles = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowStyles = {
      top: "top-full left-1/2 -translate-x-1/2 border-t-zinc-900 border-x-transparent border-b-transparent border-t-4 border-x-4 border-b-0",
      bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-900 border-x-transparent border-t-transparent border-b-4 border-x-4 border-t-0",
      left: "left-full top-1/2 -translate-y-1/2 border-l-zinc-900 border-y-transparent border-r-transparent border-l-4 border-y-4 border-r-0",
      right: "right-full top-1/2 -translate-y-1/2 border-r-zinc-900 border-y-transparent border-l-transparent border-r-4 border-y-4 border-l-0",
    };

    return (
      <div
        ref={ref}
        className="relative inline-flex items-center"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        {...props}
      >
        {/* Trigger target */}
        <div ref={triggerRef} className="inline-flex">
          {children}
        </div>

        {/* Floating Tooltip Bubble */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              role="tooltip"
              className={cn(
                "absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-100 text-[11.5px] font-medium shadow-md flex items-center gap-1.5 select-none font-sans border border-zinc-800",
                placementStyles[resolvedPlacement] || placementStyles.top,
                className
              )}
            >
              <span>{content}</span>
              {shortcut && (
                <kbd className="px-1 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 font-bold border border-zinc-700">
                  {shortcut}
                </kbd>
              )}
              {arrow && (
                <span
                  className={cn(
                    "absolute size-0 border-solid",
                    arrowStyles[resolvedPlacement] || arrowStyles.top
                  )}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
UITooltip.displayName = "UITooltip";

export default UITooltip;
