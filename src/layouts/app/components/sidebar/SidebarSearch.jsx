import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarSearch = ({ value, onChange, onClear, className }) => {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        size={14}
        className="pointer-events-none absolute left-3 text-text-muted"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search navigation..."
        className={cn(
          "h-8.5 w-full rounded-[8px] border border-border bg-surface-alt/60 pl-8 pr-7",
          "text-xs text-text placeholder:text-text-muted/60",
          "outline-none transition-all duration-150",
          "focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 flex size-5 cursor-pointer items-center justify-center rounded-full text-text-muted transition hover:bg-surface hover:text-text"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default SidebarSearch;
