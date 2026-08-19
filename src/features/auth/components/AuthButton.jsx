import { cn } from "@/lib/utils";

const variants = {
  primary: [
    "bg-primary text-primary-contrast font-bold",
    "hover:bg-primary-hover active:scale-[0.97]",
    "shadow-[var(--app-shadow-sm)] hover:shadow-[var(--app-shadow-md)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
  ].join(" "),

  outlined: [
    "border border-border bg-surface text-text font-semibold",
    "hover:bg-surface-hover hover:border-border-strong active:scale-[0.97]",
    "shadow-[var(--app-shadow-xs)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
  ].join(" "),

  ghost: [
    "bg-transparent text-primary font-semibold",
    "hover:bg-primary-soft active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
  ].join(" "),
};

const AuthButton = ({
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  children,
  className,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        // Sizing & Radius: 46px height (lg), rounded-[8px] per DESIGN_STANDARDS §4 & §8.1
        "inline-flex items-center justify-center gap-2",
        "h-[46px] rounded-[8px] px-6 text-[15px] font-bold",
        "cursor-pointer select-none",
        "transition-all duration-120 ease-out",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100",
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {!loading && icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

export default AuthButton;
