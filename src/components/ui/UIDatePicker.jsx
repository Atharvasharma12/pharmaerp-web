import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useId,
} from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const datePickerSizes = {
  sm: {
    trigger: "h-8.5 text-xs px-2.5 rounded-lg",
    iconSize: "size-3.5",
    fontSize: "text-[13px]",
  },
  md: {
    trigger: "h-10 text-sm px-3 rounded-lg",
    iconSize: "size-4",
    fontSize: "text-sm",
  },
  lg: {
    trigger: "h-11.5 text-base px-3.5 rounded-xl",
    iconSize: "size-4.5",
    fontSize: "text-[15px]",
  },
};

const DEFAULT_PRESETS = [
  { label: "Today", getValue: () => dayjs().format("YYYY-MM-DD") },
  { label: "Yesterday", getValue: () => dayjs().subtract(1, "day").format("YYYY-MM-DD") },
  { label: "+30D Expiry", getValue: () => dayjs().add(30, "day").format("YYYY-MM-DD") },
  { label: "+90D", getValue: () => dayjs().add(90, "day").format("YYYY-MM-DD") },
  { label: "+1 Year", getValue: () => dayjs().add(1, "year").format("YYYY-MM-DD") },
];

export const UIDatePicker = forwardRef(
  (
    {
      id,
      label,
      error,
      helperText,
      required = false,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "Select date...",
      format = "YYYY-MM-DD",
      displayFormat = "DD MMM YYYY",
      presets = true,
      customPresets,
      minDate,
      maxDate,
      isClearable = true,
      disabled = false,
      size = "md",
      placement = "auto", // "auto" | "bottom" | "top"
      align = "auto", // "auto" | "left" | "right"
      className,
      triggerClassName,
      popoverClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const rawValue = isControlled ? controlledValue : internalValue;
    const activeDate = rawValue ? dayjs(rawValue) : null;

    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() =>
      activeDate && activeDate.isValid() ? activeDate : dayjs()
    );

    // 4-Way Boundary & Collision Auto-Flipping State
    const [resolvedPlacement, setResolvedPlacement] = useState("bottom");
    const [resolvedAlign, setResolvedAlign] = useState("left");

    const containerRef = useRef(null);
    const triggerRef = useRef(null);

    const currentSize = datePickerSizes[size] || datePickerSizes.md;
    const activePresets = customPresets || (presets ? DEFAULT_PRESETS : null);

    // Smart 4-Way Collision Detection (Top/Bottom, Left/Right)
    const calculatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.left;
      const spaceLeft = rect.right;

      const popoverWidth = 280; // Compact width
      const popoverHeight = 310; // Safe threshold for calendar

      // 1. Vertical Auto-Flipping (Top <-> Bottom)
      if (placement === "top") {
        if (spaceAbove < popoverHeight && spaceBelow > spaceAbove) {
          setResolvedPlacement("bottom");
        } else {
          setResolvedPlacement("top");
        }
      } else if (placement === "bottom") {
        if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
          setResolvedPlacement("top");
        } else {
          setResolvedPlacement("bottom");
        }
      } else {
        // placement === "auto"
        if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
          setResolvedPlacement("top");
        } else {
          setResolvedPlacement("bottom");
        }
      }

      // 2. Horizontal Auto-Flipping (Left <-> Right)
      if (align === "left") {
        if (spaceRight < popoverWidth && spaceLeft > spaceRight) {
          setResolvedAlign("right");
        } else {
          setResolvedAlign("left");
        }
      } else if (align === "right") {
        if (spaceLeft < popoverWidth && spaceRight > spaceLeft) {
          setResolvedAlign("left");
        } else {
          setResolvedAlign("right");
        }
      } else {
        // align === "auto"
        if (spaceRight < popoverWidth && spaceLeft > spaceRight) {
          setResolvedAlign("right");
        } else {
          setResolvedAlign("left");
        }
      }
    };

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

    // Sync viewDate when popover opens or value changes
    useEffect(() => {
      if (activeDate && activeDate.isValid()) {
        setViewDate(activeDate);
      }
    }, [rawValue]);

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;

      const handleOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, [isOpen]);

    const handleSelectDate = (date) => {
      if (isDateDisabled(date)) return;

      const formattedVal = date.format(format);
      if (!isControlled) {
        setInternalValue(formattedVal);
      }
      if (onChange) {
        onChange(formattedVal, date);
      }
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const handleClear = (e) => {
      e.stopPropagation();
      if (!isControlled) {
        setInternalValue("");
      }
      if (onChange) {
        onChange("", null);
      }
    };

    const isDateDisabled = (date) => {
      if (minDate && date.isBefore(dayjs(minDate), "day")) return true;
      if (maxDate && date.isAfter(dayjs(maxDate), "day")) return true;
      return false;
    };

    // Calendar matrix generator
    const startOfMonth = viewDate.startOf("month");
    const endOfMonth = viewDate.endOf("month");
    const startDay = startOfMonth.day(); // 0 = Sun, 1 = Mon ...
    const daysInMonth = viewDate.daysInMonth();

    // Adjust for Monday-first week
    const leadingOffset = (startDay + 6) % 7;

    const days = [];
    const prevMonth = viewDate.subtract(1, "month");
    const daysInPrevMonth = prevMonth.daysInMonth();
    for (let i = leadingOffset - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.date(daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: viewDate.date(i),
        isCurrentMonth: true,
      });
    }

    const nextMonth = viewDate.add(1, "month");
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: nextMonth.date(i),
        isCurrentMonth: false,
      });
    }

    const displayText = activeDate && activeDate.isValid() ? activeDate.format(displayFormat) : "";
    const isTop = resolvedPlacement === "top";
    const isRight = resolvedAlign === "right";

    return (
      <div ref={containerRef} className={cn("w-full flex flex-col font-sans relative", isOpen ? "z-50" : "z-10", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-1 text-[13px] font-medium text-text mb-1.5 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-error font-bold leading-none">*</span>}
          </label>
        )}

        {/* Trigger Button */}
        <button
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          id={inputId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={cn(
            "relative flex items-center justify-between w-full bg-surface border border-border text-left select-none cursor-pointer",
            "transition-all duration-150 ease-out",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            isOpen && "border-primary ring-2 ring-primary/20",
            error && "border-error focus-visible:border-error focus-visible:ring-error/20",
            disabled && "opacity-60 bg-surface-alt/70 cursor-not-allowed pointer-events-none",
            currentSize.trigger,
            triggerClassName
          )}
          {...props}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <Calendar className={cn("shrink-0 text-text-muted", currentSize.iconSize)} />
            <span
              className={cn(
                "truncate",
                displayText ? "text-text font-medium" : "text-text-muted/60"
              )}
            >
              {displayText || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-text-muted">
            {isClearable && displayText && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                aria-label="Clear date"
                className="p-0.5 hover:text-text rounded hover:bg-surface-hover transition-colors"
              >
                <X className={currentSize.iconSize} />
              </span>
            )}
          </div>
        </button>

        {/* Responsive, Animated Fluid Calendar Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isTop ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isTop ? 6 : -6 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute z-50 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden w-[280px]",
                isTop ? "bottom-full mb-1.5" : "top-full mt-1.5",
                isRight ? "right-0" : "left-0",
                popoverClassName
              )}
            >
              {/* Compact Quick Presets Chips */}
              {activePresets && (
                <div className="p-2 border-b border-border/80 bg-surface-alt/40">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {activePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSelectDate(dayjs(preset.getValue()))}
                        className="shrink-0 text-[11px] font-semibold text-text-muted hover:text-primary bg-surface hover:bg-primary-soft/50 border border-border/70 py-1 px-2 rounded-lg transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar Grid */}
              <div className="p-3 w-full">
                {/* Header: Month / Year Navigation */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => setViewDate((prev) => prev.subtract(1, "month"))}
                    className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  <span className="text-xs sm:text-[13px] font-bold text-text select-none">
                    {viewDate.format("MMMM YYYY")}
                  </span>

                  <button
                    type="button"
                    onClick={() => setViewDate((prev) => prev.add(1, "month"))}
                    className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
                    aria-label="Next month"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                {/* Day Headers (Mo, Tu, We, Th, Fr, Sa, Su) */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <span key={d} className="text-[10.5px] font-semibold text-text-muted/70 py-0.5 select-none">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map(({ date, isCurrentMonth }, idx) => {
                    const isSelected = activeDate && activeDate.isSame(date, "day");
                    const isToday = dayjs().isSame(date, "day");
                    const isDisabled = isDateDisabled(date);

                    return (
                      <button
                        key={date.toString() + idx}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelectDate(date)}
                        className={cn(
                          "size-7 sm:size-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all duration-100 cursor-pointer select-none",
                          isSelected
                            ? "bg-primary text-primary-contrast font-bold shadow-xs scale-105"
                            : isToday
                            ? "border border-primary text-primary font-bold hover:bg-primary-soft"
                            : isCurrentMonth
                            ? "text-text hover:bg-surface-hover"
                            : "text-text-muted/40 hover:bg-surface-hover/50",
                          isDisabled && "opacity-25 cursor-not-allowed pointer-events-none hover:bg-transparent"
                        )}
                      >
                        {date.date()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error / Helper text */}
        {(error || helperText) && (
          <div className="mt-1.5 text-xs transition-opacity duration-150">
            {typeof error === "string" ? (
              <p className="text-error font-medium flex items-center gap-1">{error}</p>
            ) : helperText ? (
              <p className="text-text-muted">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

UIDatePicker.displayName = "UIDatePicker";
export default UIDatePicker;
