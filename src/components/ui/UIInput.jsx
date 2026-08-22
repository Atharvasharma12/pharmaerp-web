import React, { forwardRef, useState, useId } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

const inputSizes = {
  sm: {
    container: "h-8.5 text-xs px-2.5 rounded-lg",
    iconSize: "size-3.5",
    fontSize: "text-[13px]",
  },
  md: {
    container: "h-10 text-sm px-3 rounded-lg",
    iconSize: "size-4",
    fontSize: "text-sm",
  },
  lg: {
    container: "h-11.5 text-base px-3.5 rounded-xl",
    iconSize: "size-4.5",
    fontSize: "text-[15px]",
  },
};

const inputVariants = {
  outline:
    "bg-surface border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
  filled:
    "bg-surface-alt border border-transparent hover:border-border focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/20",
  flushed:
    "bg-transparent border-b border-border rounded-none px-0 focus-within:border-primary focus-within:ring-0",
};

export const UIInput = forwardRef(
  (
    {
      id,
      name,
      label,
      error,
      helperText,
      required = false,
      startIcon,
      prefix,
      endIcon,
      suffix,
      isClearable = false,
      onClear,
      type = "text",
      showPasswordToggle = true,
      size = "md",
      variant = "outline",
      disabled = false,
      readOnly = false,
      value,
      defaultValue,
      onChange,
      placeholder,
      className,
      inputClassName,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    const currentSize = inputSizes[size] || inputSizes.md;
    const currentVariant = inputVariants[variant] || inputVariants.outline;

    const hasValue = value !== undefined ? Boolean(value) : undefined;

    const handleClear = (e) => {
      e.stopPropagation();
      if (onClear) {
        onClear();
      } else if (onChange) {
        onChange({ target: { value: "", name } });
      }
    };

    return (
      <div className={cn("w-full flex flex-col font-sans", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-1 text-[13px] font-medium text-text mb-1.5 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-error font-bold leading-none">*</span>}
          </label>
        )}

        <div
          className={cn(
            "group relative flex items-center w-full transition-all duration-150 ease-out",
            currentSize.container,
            currentVariant,
            error &&
              "border-error focus-within:border-error focus-within:ring-2 focus-within:ring-error/20",
            disabled &&
              "opacity-60 bg-surface-alt/70 border-border cursor-not-allowed pointer-events-none",
            readOnly && "bg-surface-alt/40 cursor-default",
            containerClassName
          )}
        >
          {/* Start Icon / Prefix */}
          {(startIcon || prefix) && (
            <div className="flex items-center text-text-muted shrink-0 mr-2 select-none">
              {startIcon && (
                <span className={cn("inline-flex items-center justify-center", currentSize.iconSize)}>
                  {startIcon}
                </span>
              )}
              {prefix && (
                <span className="text-xs font-medium text-text-muted tracking-tight ml-1">
                  {prefix}
                </span>
              )}
            </div>
          )}

          {/* Core HTML Input */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={actualType}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            className={cn(
              "w-full h-full bg-transparent border-0 outline-none text-text placeholder:text-text-muted/60",
              "transition-colors duration-100",
              currentSize.fontSize,
              inputClassName
            )}
            {...props}
          />

          {/* Actions & Suffix Area */}
          <div className="flex items-center gap-1.5 shrink-0 ml-2 select-none">
            {/* Clear Button */}
            {isClearable && !disabled && !readOnly && hasValue && (
              <button
                type="button"
                tabIndex={-1}
                onClick={handleClear}
                aria-label="Clear input"
                className="p-1 text-text-muted hover:text-text rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <X className={currentSize.iconSize} />
              </button>
            )}

            {/* Password Peek Toggle */}
            {isPassword && showPasswordToggle && !disabled && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="p-1 text-text-muted hover:text-text rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className={currentSize.iconSize} />
                ) : (
                  <Eye className={currentSize.iconSize} />
                )}
              </button>
            )}

            {/* End Icon / Suffix */}
            {suffix && (
              <span className="text-xs font-medium text-text-muted tracking-tight">
                {suffix}
              </span>
            )}
            {endIcon && (
              <span className={cn("text-text-muted inline-flex items-center justify-center", currentSize.iconSize)}>
                {endIcon}
              </span>
            )}
          </div>
        </div>

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

UIInput.displayName = "UIInput";
export default UIInput;
