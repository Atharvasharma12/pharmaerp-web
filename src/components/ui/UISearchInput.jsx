import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const searchSizes = {
  sm: {
    container: "h-8.5 text-xs px-2.5 rounded-lg",
    iconSize: "size-3.5",
    fontSize: "text-[13px]",
    badgeSize: "text-[10px] px-1 py-0.5",
  },
  md: {
    container: "h-10 text-sm px-3 rounded-lg",
    iconSize: "size-4",
    fontSize: "text-sm",
    badgeSize: "text-[11px] px-1.5 py-0.5",
  },
  lg: {
    container: "h-11.5 text-base px-3.5 rounded-xl",
    iconSize: "size-4.5",
    fontSize: "text-[15px]",
    badgeSize: "text-xs px-2 py-0.5",
  },
};

export const UISearchInput = forwardRef(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      onSearch,
      debounceMs = 300,
      placeholder = "Search...",
      shortcut = "⌘K",
      enableShortcutListener = true,
      size = "md",
      isLoading = false,
      isClearable = true,
      disabled = false,
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    const inputRef = useRef(null);
    useImperativeHandle(ref, () => inputRef.current);

    const currentSize = searchSizes[size] || searchSizes.md;

    // Debounced search trigger
    useEffect(() => {
      if (!onSearch) return;

      const timer = setTimeout(() => {
        onSearch(currentValue);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [currentValue, debounceMs, onSearch]);

    // Keyboard shortcut listener (e.g. Cmd+K or /)
    useEffect(() => {
      if (!enableShortcutListener || disabled) return;

      const handleKeyDown = (e) => {
        // If user pressed Ctrl+K / Cmd+K or "/" when not typing in another input
        const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
        const isSlash = e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);

        if (isCmdK || isSlash) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enableShortcutListener, disabled]);

    const handleChange = (e) => {
      const val = e.target.value;
      if (!isControlled) {
        setInternalValue(val);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      if (onChange) {
        onChange({ target: { value: "" } });
      }
      if (onSearch) {
        onSearch("");
      }
      inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && currentValue) {
        e.preventDefault();
        handleClear();
      }
    };

    return (
      <div
        className={cn(
          "group relative flex items-center w-full bg-surface border border-border rounded-lg",
          "transition-all duration-150 ease-out",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          disabled && "opacity-60 bg-surface-alt/70 cursor-not-allowed pointer-events-none",
          currentSize.container,
          className
        )}
      >
        {/* Search / Loading Icon */}
        <div className="flex items-center text-text-muted shrink-0 mr-2 select-none">
          {isLoading ? (
            <Loader2 className={cn("animate-spin text-primary", currentSize.iconSize)} />
          ) : (
            <Search className={cn("text-text-muted group-focus-within:text-primary transition-colors", currentSize.iconSize)} />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full h-full bg-transparent border-0 outline-none text-text placeholder:text-text-muted/60",
            currentSize.fontSize,
            inputClassName
          )}
          {...props}
        />

        {/* Clear Button or Keyboard Shortcut */}
        <div className="flex items-center gap-1 shrink-0 ml-2 select-none">
          {isClearable && currentValue && !disabled ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 text-text-muted hover:text-text rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <X className={currentSize.iconSize} />
            </button>
          ) : shortcut ? (
            <kbd
              className={cn(
                "hidden sm:inline-flex items-center font-mono font-semibold text-text-muted bg-surface-alt border border-border/80 rounded-md tracking-wider shadow-2xs select-none",
                currentSize.badgeSize
              )}
            >
              {shortcut}
            </kbd>
          ) : null}
        </div>
      </div>
    );
  }
);

UISearchInput.displayName = "UISearchInput";
export default UISearchInput;
