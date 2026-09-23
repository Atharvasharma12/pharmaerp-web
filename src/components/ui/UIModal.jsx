import React, { forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const modalSizes = {
  sm: "max-w-md", // ~448px
  md: "max-w-lg", // ~512px (default)
  lg: "max-w-2xl", // ~672px
  xl: "max-w-4xl", // ~896px
  "2xl": "max-w-5xl", // ~1024px
  "3xl": "max-w-7xl", // ~1280px
  full: "max-w-[calc(100vw-2rem)] min-h-[calc(100vh-2rem)]",
};

export const UIModal = forwardRef(
  (
    {
      isOpen = false,
      onClose,
      size = "md",
      closeOnBackdrop = true,
      closeOnEsc = true,
      showCloseButton = true,
      children,
      className,
      overlayClassName,
      ...props
    },
    ref
  ) => {
    // Body scroll lock
    useEffect(() => {
      if (isOpen) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }, [isOpen]);

    // Esc key listener
    useEffect(() => {
      if (!isOpen || !closeOnEsc) return;

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose?.();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeOnEsc, onClose]);

    const appliedSize = modalSizes[size] || modalSizes.md;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={closeOnBackdrop ? onClose : undefined}
              className={cn(
                "fixed inset-0 bg-neutral-950/50 dark:bg-neutral-950/70 backdrop-blur-sm",
                overlayClassName
              )}
            />

            {/* Modal Dialog Card with Spring Physics */}
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 28,
              }}
              className={cn(
                "relative w-full bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans",
                appliedSize,
                className
              )}
              {...props}
            >
              {/* Optional Top-Right Close Button */}
              {showCloseButton && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-4.5 right-4.5 p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-hover transition-colors z-20 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              )}

              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);
UIModal.displayName = "UIModal";

export const UIModalHeader = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 pt-6 pb-2 flex flex-col space-y-1 pr-12", className)}
      {...props}
    >
      {children}
    </div>
  )
);
UIModalHeader.displayName = "UIModalHeader";

export const UIModalTitle = forwardRef(
  ({ children, as: Tag = "h2", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn("text-lg sm:text-xl font-bold tracking-tight text-text leading-tight", className)}
      {...props}
    >
      {children}
    </Tag>
  )
);
UIModalTitle.displayName = "UIModalTitle";

export const UIModalDescription = forwardRef(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs sm:text-sm text-text-muted leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
);
UIModalDescription.displayName = "UIModalDescription";

export const UIModalBody = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 overflow-y-auto overflow-x-hidden max-h-[70vh] space-y-4 text-sm text-text", className)}
      {...props}
    >
      {children}
    </div>
  )
);
UIModalBody.displayName = "UIModalBody";

export const UIModalFooter = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 bg-surface-alt/60 border-t border-border/80 flex items-center justify-end gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
UIModalFooter.displayName = "UIModalFooter";

export default UIModal;
