import React, { forwardRef, useId } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const switchSizes = {
  sm: {
    track: "w-8 h-4.5 p-0.5",
    thumb: "size-3.5",
    translateX: 14,
    label: "text-xs",
    desc: "text-[11px]",
    iconSize: "size-2.5",
  },
  md: {
    track: "w-10 h-5.5 p-0.5",
    thumb: "size-4.5",
    translateX: 18,
    label: "text-[13px]",
    desc: "text-xs",
    iconSize: "size-3",
  },
  lg: {
    track: "w-12 h-6.5 p-0.5",
    thumb: "size-5.5",
    translateX: 22,
    label: "text-sm",
    desc: "text-xs",
    iconSize: "size-3.5",
  },
};

const switchColors = {
  primary: "bg-primary border-primary",
  success: "bg-success border-success",
  warning: "bg-warning border-warning",
  error: "bg-error border-error",
};

export const UISwitch = forwardRef(
  (
    {
      id,
      name,
      checked: controlledChecked,
      defaultChecked,
      onChange,
      label,
      description,
      disabled = false,
      isLoading = false,
      color = "primary",
      size = "md",
      checkedIcon,
      uncheckedIcon,
      className,
      trackClassName,
      thumbClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const isControlled = controlledChecked !== undefined;
    const isChecked = Boolean(isControlled ? controlledChecked : defaultChecked);

    const currentSize = switchSizes[size] || switchSizes.md;
    const currentColor = switchColors[color] || switchColors.primary;
    const isDisabled = disabled || isLoading;

    const handleChange = (e) => {
      if (isDisabled) return;
      if (onChange) {
        onChange(e.target.checked, e);
      }
    };

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "group relative inline-flex items-start gap-3 font-sans select-none",
          isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
          className
        )}
      >
        <div className="relative flex items-center pt-0.5">
          {/* Real hidden checkbox */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="checkbox"
            role="switch"
            aria-checked={isChecked}
            checked={isChecked}
            defaultChecked={defaultChecked}
            disabled={isDisabled}
            onChange={handleChange}
            className="sr-only peer"
            {...props}
          />

          {/* Switch Track with Fluid Color Morph */}
          <div
            className={cn(
              "relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors duration-200 ease-out",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface",
              isChecked ? currentColor : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600",
              currentSize.track,
              trackClassName
            )}
          >
            {/* Switch Thumb with Direct Horizontal Translation (No layout lag) */}
            <motion.div
              animate={{
                x: isChecked ? currentSize.translateX : 0,
              }}
              whileTap={!isDisabled ? { scaleX: 1.15 } : undefined}
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 38,
              }}
              className={cn(
                "flex items-center justify-center rounded-full bg-white dark:bg-neutral-100 shadow-sm pointer-events-none origin-left",
                currentSize.thumb,
                thumbClassName
              )}
            >
              {isLoading ? (
                <Loader2 className={cn("animate-spin text-neutral-600", currentSize.iconSize)} />
              ) : isChecked && checkedIcon ? (
                <span className={cn("text-primary inline-flex items-center justify-center", currentSize.iconSize)}>
                  {checkedIcon}
                </span>
              ) : !isChecked && uncheckedIcon ? (
                <span className={cn("text-neutral-500 inline-flex items-center justify-center", currentSize.iconSize)}>
                  {uncheckedIcon}
                </span>
              ) : null}
            </motion.div>
          </div>
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
          </div>
        )}
      </label>
    );
  }
);

UISwitch.displayName = "UISwitch";
export default UISwitch;
