import { cn } from "@/lib/utils";

const AuthInput = ({
  label,
  hint,
  error,
  required,
  id,
  icon,
  className,
  inputClassName,
  ...inputProps
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("group flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-text leading-[1.4]"
        >
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 flex items-center text-text-muted transition-colors duration-150 group-focus-within:text-primary">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            // Dimensions & Radius: 44px height, rounded-[12px] per DESIGN_STANDARDS §4 & §8.2
            "h-11 w-full rounded-[12px] border border-border bg-surface",
            "text-sm text-text placeholder:text-text-muted/60",
            "outline-none transition-all duration-150 ease-out",
            "hover:border-border-strong",
            "focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt",
            error && "border-error focus:border-error focus:ring-error/20",
            icon ? "pl-10 pr-3.5" : "px-3.5",
            inputClassName
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...inputProps}
        />
      </div>

      {hint && !error && (
        <span id={`${inputId}-hint`} className="text-xs text-text-muted leading-[1.4]">
          {hint}
        </span>
      )}
      {error && (
        <span
          id={`${inputId}-error`}
          className="flex items-center gap-1.5 text-xs font-medium text-error leading-[1.4]"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default AuthInput;
