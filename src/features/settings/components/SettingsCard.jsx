const SettingsCard = ({
  title,
  description,
  action,
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
}) => {
  return (
    <div
      className={`rounded-[14px] border border-border bg-surface p-4 sm:p-5 shadow-[var(--app-shadow-sm)] transition-all ${className}`}
    >
      {(title || description || action) && (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 ${headerClassName}`}>
          <div>
            {title && (
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-text">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-text-muted leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`${(title || description || action) ? "pt-3.5" : ""} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default SettingsCard;
