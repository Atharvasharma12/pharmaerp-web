import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pill } from "lucide-react";
import { ROUTES } from "@/constants";

const SidebarWorkspaceHeader = ({
  workspace,
  collapsed = false,
  onToggleCollapse,
  onClose,
  showClose = false,
}) => {
  const workspaceName = workspace?.name || "Overview";
  const workspaceSubtitle = workspace?.type || "PharmaERP";

  const [tooltipPos, setTooltipPos] = useState(null);
  const logoRef = useRef(null);

  const handleMouseEnter = () => {
    if (!collapsed || !logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    setTooltipPos({
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border p-2">
        <div
          ref={logoRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={ROUTES.SETUP_CENTER}
            title={workspaceName}
            className="flex size-8 items-center justify-center rounded-[8px] bg-primary/10 text-primary shadow-xs transition hover:bg-primary/20"
          >
            <Pill className="size-4" />
          </Link>
        </div>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="mt-2 flex size-6 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-surface-hover hover:text-text"
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}

        {/* Portal-based unclipped tooltip */}
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
              className="pointer-events-none rounded-[6px] border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-text shadow-[var(--app-shadow-lg)] whitespace-nowrap"
            >
              <span>{workspaceName}</span>
            </div>,
            document.body,
          )}
      </div>
    );
  }

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
      <Link
        to={ROUTES.SETUP_CENTER}
        onClick={onClose}
        className="flex min-w-0 items-center gap-2.5 transition hover:opacity-90"
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary">
          <Pill className="size-3.5" />
        </div>

        <div className="min-w-0 text-left">
          <div className="truncate text-[13px] font-semibold text-text leading-tight">
            {workspaceName}
          </div>
          <div className="truncate text-[11px] font-normal text-text-muted leading-tight">
            {workspaceSubtitle}
          </div>
        </div>
      </Link>

      {/* Collapse button on desktop */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Collapse sidebar"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-surface-hover hover:text-text"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      )}

      {/* Close button on mobile */}
      {showClose && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-surface-hover hover:text-text"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      )}
    </div>
  );
};

export default SidebarWorkspaceHeader;
