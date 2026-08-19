import { forwardRef } from "react";

const SettingsInput = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      value,
      onChange,
      placeholder,
      disabled = false,
      readOnly = false,
      error,
      helperText,
      icon,
      endAdornment,
      className = "",
      inputClassName = "",
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`flex w-full flex-col ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 text-[13px] font-medium text-text"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center text-text-muted">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={`w-full rounded-[12px] border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/60 transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-text-disabled ${
              icon ? "pl-10" : ""
            } ${endAdornment ? "pr-10" : ""} ${
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-border hover:border-border-strong focus:border-primary focus:ring-primary/20"
            } ${readOnly ? "bg-surface-alt" : ""} ${inputClassName}`}
            {...rest}
          />

          {endAdornment && (
            <div className="absolute right-3 flex items-center">{endAdornment}</div>
          )}
        </div>

        {error && (
          <span className="mt-1 text-xs font-medium text-error leading-[1.4]">{error}</span>
        )}
        {helperText && !error && (
          <span className="mt-1 text-xs text-text-muted leading-[1.4]">{helperText}</span>
        )}
      </div>
    );
  }
);

SettingsInput.displayName = "SettingsInput";

export default SettingsInput;
