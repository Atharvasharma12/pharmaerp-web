import { UISearchInput } from "@/components/ui";
import { cn } from "@/lib/utils";

const SidebarSearch = ({ value, onChange, onClear, className }) => {
  return (
    <div className={cn("w-full", className)}>
      <UISearchInput
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder="Search navigation..."
        size="sm"
        className="w-full"
      />
    </div>
  );
};

export default SidebarSearch;
