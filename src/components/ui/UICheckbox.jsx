import React, { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const checkboxSizes = {
  sm: {
    box: "size-4 rounded",
    icon: "size-3",
    label: "text-xs",
    desc: "text-[11px]",
  },
  md: {
    box: "size-4.5 rounded-md",
    icon: "size-3.5",
    label: "text-[13px]",
    desc: "text-xs",
  },
  lg: {
    box: "size-5.5 rounded-md",
    icon: "size-4",
    label: "text-sm",
    desc: "text-xs",
  },
};

const checkboxColors = {
  primary: "bg-primary border-primary text-primary-contrast focus-visible:ring-primary/40",
  success: "bg-success border-success text-success-contrast focus-visible:ring-success/40",
  error: "bg-error border-error text-error-contrast focus-visible:ring-error/40",
  warning: "bg-warning border-warning text-warning-contrast focus-visible:ring-warning/40",
};

export const UICheckbox = forwardRef(
  (
    {
      id,
      name,
      checked: controlledChecked,
      defaultChecked,
      indeterminate = false,
      onChange,
      label,
      description,
      error,
      disabled = false,
      color = "primary",
      size = "md",
      className,
      boxClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const isControlled = controlledChecked !== undefined;
    const isChecked = Boolean(isControlled ? controlledChecked : defaultChecked);
    const active = isChecked || indeterminate;

    const currentSize = checkboxSizes[size] || checkboxSizes.md;
    const currentColor = checkboxColors[color] || checkboxColors.primary;

    const handleChange = (e) => {
      if (disabled) return;
      if (onChange) {
        onChange(e.target.checked, e);
      }
    };

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "group relative inline-flex items-start gap-2.5 font-sans select-none",
          disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
          className
        )}
      >
        <div className="relative flex items-center justify-center pt-0.5">
          {/* Real hidden input for accessibility */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="checkbox"
            checked={isChecked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only peer"
            {...props}
          />

          {/* Visual Custom Box with Tactile Tap Spring */}
          <motion.div
            whileTap={!disabled ? { scale: 0.9 } : undefined}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={cn(
              "flex items-center justify-center border border-border bg-surface transition-colors duration-150 ease-out",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface",
              active ? currentColor : "hover:border-border-strong group-hover:bg-surface-hover",
              error && "border-error focus-visible:ring-error/30",
              currentSize.box,
              boxClassName
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {indeterminate ? (
                <motion.span
                  key="minus"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 30 }}
                  className="inline-flex items-center justify-center"
                >
                  <Minus className={cn("stroke-[3]", currentSize.icon)} />
                </motion.span>
              ) : isChecked ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 30 }}
                  className="inline-flex items-center justify-center"
                >
                  <Check className={cn("stroke-[3]", currentSize.icon)} />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Label & Description */}
        {(label || description) && (
          <div className="flex flex-col min-w-0">
            {label && (
              <span className={cn("font-medium text-text transition-colors", currentSize.label)}>
                {label}
              </span>
            )}
            {description && (
              <span className={cn("text-text-muted transition-colors leading-relaxed", currentSize.desc)}>
                {description}
              </span>
            )}
            {error && typeof error === "string" && (
              <span className="text-error text-xs font-medium mt-0.5">{error}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

UICheckbox.displayName = "UICheckbox";
export default UICheckbox;
