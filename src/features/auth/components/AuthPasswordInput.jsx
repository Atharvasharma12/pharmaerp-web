import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const AuthPasswordInput = ({
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
  const [show, setShow] = useState(false);
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
          type={show ? "text" : "password"}
          className={cn(
            // Dimensions & Radius: 44px height, rounded-[12px] per DESIGN_STANDARDS §4 & §8.2
            "h-11 w-full rounded-[12px] border border-border bg-surface",
            "text-sm text-text placeholder:text-text-muted/60",
            "outline-none transition-all duration-150 ease-out",
            "hover:border-border-strong",
            "focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt",
            error && "border-error focus:border-error focus:ring-error/20",
            icon ? "pl-10 pr-10" : "pl-3.5 pr-10",
            inputClassName
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...inputProps}
        />
        <button
          type="button"
          tabIndex={0}
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 flex size-7 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition-all duration-150 hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <Eye size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {hint && !error && (
        <span className="text-xs text-text-muted leading-[1.4]">{hint}</span>
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

export default AuthPasswordInput;
