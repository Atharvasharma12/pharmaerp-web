import { motion } from "framer-motion";

const SettingsToggle = ({
  checked = false,
  onChange,
  disabled = false,
  id,
  name,
  label,
  description,
  className = "",
}) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col pr-2">
          {label && (
            <span
              id={id ? `${id}-label` : undefined}
              className="text-[13px] font-medium text-text cursor-pointer select-none"
              onClick={handleToggle}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              id={id ? `${id}-desc` : undefined}
              className="text-xs text-text-muted leading-[1.5]"
            >
              {description}
            </span>
          )}
        </div>
      )}

      <button
        id={id}
        name={name}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label && id ? `${id}-label` : undefined}
        aria-describedby={description && id ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked
            ? "bg-primary"
            : "bg-neutral-200 dark:bg-neutral-700"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block size-4.5 rounded-full bg-white shadow-xs ${
            checked ? "translate-x-5.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsToggle;
