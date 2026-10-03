import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const selectSizes = {
  sm: {
    trigger: "h-8.5 text-xs px-2.5 rounded-lg",
    iconSize: "size-3.5",
    fontSize: "text-[13px]",
    optionPadding: "py-1.5 px-2.5 text-xs",
  },
  md: {
    trigger: "h-10 text-sm px-3 rounded-lg",
    iconSize: "size-4",
    fontSize: "text-sm",
    optionPadding: "py-2 px-3 text-sm",
  },
  lg: {
    trigger: "h-11.5 text-base px-3.5 rounded-xl",
    iconSize: "size-4.5",
    fontSize: "text-[15px]",
    optionPadding: "py-2.5 px-3.5 text-base",
  },
};

export const UISelect = forwardRef(
  (
    {
      id,
      name,
      label,
      error,
      helperText,
      required = false,
      options = [],
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "Select an option",
      isSearchable = false,
      isClearable = false,
      disabled = false,
      size = "md",
      placement = "auto", // "auto" | "bottom" | "top"
      align = "auto", // "auto" | "left" | "right"
      className,
      triggerClassName,
      popoverClassName,
      renderOption,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const currentValue = isControlled ? controlledValue : internalValue;

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [resolvedPlacement, setResolvedPlacement] = useState("bottom");
    const [resolvedAlign, setResolvedAlign] = useState("left");

    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const currentSize = selectSizes[size] || selectSizes.md;

    // Smart 4-Way Boundary & Collision Detection (Top/Bottom, Left/Right)
    const calculatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.left;
      const spaceLeft = rect.right;

      const estimatedHeight = 220; // Safe threshold for options list
      const estimatedWidth = 200;

      // 1. Vertical Auto-Flipping
      if (placement === "top") {
        if (spaceAbove < estimatedHeight && spaceBelow > spaceAbove) {
          setResolvedPlacement("bottom");
        } else {
          setResolvedPlacement("top");
        }
      } else if (placement === "bottom") {
        if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
          setResolvedPlacement("top");
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

      // 2. Horizontal Auto-Flipping
      if (align === "left") {
        if (spaceRight < estimatedWidth && spaceLeft > spaceRight) {
          setResolvedAlign("right");
        } else {
          setResolvedAlign("left");
        }
      } else if (align === "right") {
        if (spaceLeft < estimatedWidth && spaceRight > spaceLeft) {
          setResolvedAlign("left");
        } else {
          setResolvedAlign("right");
        }
      } else {
        // align === "auto"
        if (spaceRight < estimatedWidth && spaceLeft > spaceRight) {
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

    // Normalize options
    const normalizedOptions = options.map((opt) => {
      if (typeof opt === "object" && opt !== null) {
        return {
          label: opt.label !== undefined ? opt.label : String(opt.value),
          value: opt.value,
          disabled: opt.disabled || false,
          icon: opt.icon,
          description: opt.description,
        };
      }
      return {
        label: String(opt),
        value: opt,
        disabled: false,
      };
    });

    const filteredOptions = isSearchable
      ? normalizedOptions.filter((opt) =>
          String(opt.label).toLowerCase().includes(searchQuery.toLowerCase()) ||
          (opt.description && String(opt.description).toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : normalizedOptions;

    const selectedOption = normalizedOptions.find((opt) => opt.value === currentValue);

    // Outside click listener
    useEffect(() => {
      if (!isOpen) return;

      const handleOutsideClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    // Auto-focus search input on open
    useEffect(() => {
      if (isOpen && isSearchable) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
      if (isOpen) {
        const idx = filteredOptions.findIndex((opt) => opt.value === currentValue);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      } else {
        setHighlightedIndex(-1);
      }
    }, [isOpen]);

    const handleSelect = (option) => {
      if (option.disabled) return;

      if (!isControlled) {
        setInternalValue(option.value);
      }
      if (onChange) {
        onChange(option.value, option);
      }
      setIsOpen(false);
      setSearchQuery("");
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
      setSearchQuery("");
    };

    const handleKeyDown = (e) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery("");
          triggerRef.current?.focus();
          break;

        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => {
            let next = prev + 1;
            while (next < filteredOptions.length && filteredOptions[next]?.disabled) {
              next++;
            }
            return next < filteredOptions.length ? next : prev;
          });
          break;

        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && filteredOptions[next]?.disabled) {
              next--;
            }
            return next >= 0 ? next : prev;
          });
          break;

        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;

        default:
          break;
      }
    };

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('[role="option"]');
        const activeItem = items[highlightedIndex];
        if (activeItem) {
          activeItem.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex]);

    const isTop = resolvedPlacement === "top";

    return (
      <div ref={containerRef} className={cn("w-full flex flex-col font-sans relative", isOpen ? "z-50" : "z-10", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
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
          id={selectId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
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
          {/* Selected value or placeholder */}
          <div className="flex items-center gap-2 truncate pr-2">
            {selectedOption?.icon && (
              <span className={cn("shrink-0 text-text-muted", currentSize.iconSize)}>
                {selectedOption.icon}
              </span>
            )}
            <span
              className={cn(
                "truncate",
                selectedOption ? "text-text font-medium" : "text-text-muted/60"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          {/* Action indicators */}
          <div className="flex items-center gap-1 shrink-0 text-text-muted">
            {isClearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                aria-label="Clear selection"
                className="p-0.5 hover:text-text rounded hover:bg-surface-hover transition-colors"
              >
                <X className={currentSize.iconSize} />
              </span>
            )}
            <ChevronDown
              className={cn(
                "transition-transform duration-200 ease-out",
                isOpen && "rotate-180 text-primary",
                currentSize.iconSize
              )}
            />
          </div>
        </button>

        {/* Responsive, Animated Fluid Dropdown Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isTop ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isTop ? 6 : -6 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute left-0 right-0 w-full z-50 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden",
                isTop ? "bottom-full mb-1.5" : "top-full mt-1.5",
                popoverClassName
              )}
            >
              {/* Search Input in Popover */}
              {isSearchable && (
                <div className="p-2 border-b border-border/80 bg-surface-alt/50">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface border border-border rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                    <Search className="size-3.5 text-text-muted shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search options..."
                      className="w-full bg-transparent border-0 outline-none text-xs text-text placeholder:text-text-muted/60"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="p-0.5 text-text-muted hover:text-text rounded"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <ul
                ref={listRef}
                role="listbox"
                aria-multiselectable="false"
                className="max-h-56 overflow-y-auto p-1.5 space-y-0.5"
              >
                {filteredOptions.length === 0 ? (
                  <li className="py-4 text-center text-xs text-text-muted">
                    No options found matching &quot;{searchQuery}&quot;
                  </li>
                ) : (
                  filteredOptions.map((opt, index) => {
                    const isSelected = opt.value === currentValue;
                    const isHighlighted = index === highlightedIndex;

                    if (renderOption) {
                      return (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={opt.disabled}
                          onClick={() => handleSelect(opt)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          {renderOption(opt, { isSelected, isHighlighted })}
                        </li>
                      );
                    }

                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={opt.disabled}
                        onClick={() => handleSelect(opt)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={cn(
                          "flex items-center justify-between rounded-xl cursor-pointer transition-colors duration-100 ease-out select-none",
                          currentSize.optionPadding,
                          isSelected
                            ? "bg-primary/10 text-primary font-semibold"
                            : isHighlighted
                            ? "bg-surface-hover text-text"
                            : "text-text",
                          opt.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {opt.icon && (
                            <span
                              className={cn(
                                "shrink-0",
                                isSelected ? "text-primary" : "text-text-muted",
                                currentSize.iconSize
                              )}
                            >
                              {opt.icon}
                            </span>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="truncate leading-snug">{opt.label}</span>
                            {opt.description && (
                              <span className="text-[11px] text-text-muted truncate leading-tight mt-0.5">
                                {opt.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="size-4 shrink-0 text-primary stroke-[2.5]" />
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
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

UISelect.displayName = "UISelect";
export default UISelect;
