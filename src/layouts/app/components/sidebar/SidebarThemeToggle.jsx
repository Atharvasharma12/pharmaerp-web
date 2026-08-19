import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts";
import { cn } from "@/lib/utils";

const SidebarThemeToggle = ({ className }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-[8px] border border-border/80 bg-surface-alt/60 px-3 py-2",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        {isDarkMode ? <Moon size={14} className="text-primary" /> : <Sun size={14} className="text-amber-500" />}
        <span>{isDarkMode ? "Dark Theme" : "Light Theme"}</span>
      </div>

      {/* Pill Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={isDarkMode}
        onClick={toggleTheme}
        className={cn(
          "relative flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200",
          isDarkMode ? "bg-primary" : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "size-4 rounded-full bg-white shadow-xs transition-transform duration-200",
            isDarkMode ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
};

export default SidebarThemeToggle;
