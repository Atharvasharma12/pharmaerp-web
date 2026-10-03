import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts";
import { cn } from "@/lib/utils";
import { UISwitch } from "@/components/ui";

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

      <UISwitch
        id="sidebar-theme-toggle"
        checked={isDarkMode}
        onChange={toggleTheme}
      />
    </div>
  );
};

export default SidebarThemeToggle;
