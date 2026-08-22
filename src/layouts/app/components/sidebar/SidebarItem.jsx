import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UIBadge } from "@/components/ui";

/**
 * Check if a path or any child paths match the active pathname
 */
const isBranchActive = (item, pathname) => {
  if (item.path && pathname === item.path) return true;
  if (item.children) {
    return item.children.some((child) => isBranchActive(child, pathname));
  }
  return false;
};

const SidebarItem = ({
  item,
  level = 1,
  collapsed = false,
  onItemClick,
  onExpand,
}) => {
  const location = useLocation();
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const activeInBranch = isBranchActive(item, location.pathname);

  // Auto-expand if active route is inside this branch
  const [isOpen, setIsOpen] = useState(activeInBranch);

  // Tooltip coordinates for unclipped portal tooltip in collapsed rail mode
  const [tooltipPos, setTooltipPos] = useState(null);
  const itemRef = useRef(null);

  useEffect(() => {
    if (activeInBranch) {
      setIsOpen(true);
    }
  }, [location.pathname, activeInBranch]);

  const handleMouseEnter = () => {
    if (!collapsed || !itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setTooltipPos({
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
  };

  const Icon = item.icon;

  // ── Collapsed Rail Mode ────────────────────────────────────────────
  if (collapsed) {
    const handleCollapsedParentClick = (e) => {
      setTooltipPos(null);
      if (hasChildren) {
        // Only open sidebar if the clicked item has children
        if (onExpand) {
          onExpand();
        }
        setIsOpen(true);

        // Instant direct alignment without any smooth scrolling animation
        requestAnimationFrame(() => {
          itemRef.current?.scrollIntoView({
            behavior: "instant",
            block: "nearest",
          });
        });
      } else {
        // Leaf item without children: DO NOT open sidebar, just navigate
        onItemClick?.(e);
      }
    };

    return (
      <div
        ref={itemRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex justify-center py-0.5"
      >
        {item.path ? (
          <NavLink
            to={item.path}
            onClick={(e) => {
              setTooltipPos(null);
              if (hasChildren) {
                if (onExpand) {
                  onExpand();
                }
                setIsOpen(true);
                requestAnimationFrame(() => {
                  itemRef.current?.scrollIntoView({
                    behavior: "instant",
                    block: "nearest",
                  });
                });
              }
              onItemClick?.(e);
            }}
            title={item.label}
            className={({ isActive }) =>
              cn(
                "flex size-9 items-center justify-center rounded-[8px] transition-colors duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text hover:bg-surface-hover"
              )
            }
          >
            {Icon && <Icon className="size-4" />}
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={handleCollapsedParentClick}
            title={item.label}
            className={cn(
              "flex size-9 items-center justify-center rounded-[8px] transition-colors duration-150 cursor-pointer",
              activeInBranch
                ? "bg-primary/10 text-primary"
                : "text-text hover:bg-surface-hover"
            )}
          >
            {Icon && <Icon className="size-4" />}
          </button>
        )}

        {/* Unclipped Portal Floating Tooltip */}
        {tooltipPos &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: tooltipPos.top,
                left: tooltipPos.left,
                transform: "translateY(-50%)",
                zIndex: 9999,
              }}
              className="pointer-events-none flex items-center gap-1.5 rounded-[6px] border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-text shadow-[var(--app-shadow-lg)] whitespace-nowrap"
            >
              <span>{item.label}</span>
              {item.children && (
                <span className="text-[10px] text-text-muted font-normal">
                  ({item.children.length})
                </span>
              )}
            </div>,
            document.body
          )}
      </div>
    );
  }

  // ── Expanded Mode: Strictly 13px font size across ALL levels ─────────
  return (
    <div ref={itemRef} className="flex flex-col">
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2.5 rounded-[8px] px-2.5",
            "text-[13px] font-medium text-text transition-colors duration-150 cursor-pointer select-none",
            "hover:bg-surface-hover",
            activeInBranch && "text-text"
          )}
        >
          {/* Left: Icon + Label */}
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  activeInBranch ? "text-primary" : "text-text-muted"
                )}
              />
            )}
            <span className="truncate text-[13px] font-medium text-text">{item.label}</span>
          </div>

          {/* Right: Expand/Collapse Arrow */}
          <span className="shrink-0 text-text-muted transition-transform duration-150">
            {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </span>
        </button>
      ) : (
        <NavLink
          to={item.path}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              "flex h-9 items-center justify-between gap-2.5 rounded-[8px] px-2.5",
              "text-[13px] font-medium transition-colors duration-150 select-none",
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/15 font-medium"
                : "text-text hover:bg-surface-hover"
            )
          }
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  "text-current"
                )}
              />
            )}
            <span className="truncate text-[13px] font-medium text-current">{item.label}</span>
          </div>

          {item.badge && (
            <UIBadge variant="primary" size="xs">
              {item.badge}
            </UIBadge>
          )}
        </NavLink>
      )}

      {/* Nested Children Tree */}
      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="relative ml-4 pl-2.5 pt-0.5 space-y-0.5 border-l border-border/80">
              {item.children.map((child) => (
                <SidebarItem
                  key={child.id || child.label}
                  item={child}
                  level={level + 1}
                  collapsed={false}
                  onItemClick={onItemClick}
                  onExpand={onExpand}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarItem;
