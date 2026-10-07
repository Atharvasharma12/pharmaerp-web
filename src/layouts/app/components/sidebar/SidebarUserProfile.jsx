import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { LogOut, Settings } from "lucide-react";
import { UIIconButton } from "@/components/ui";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";

const SidebarUserProfile = ({
  user,
  collapsed = false,
  onLogout,
}) => {
  const userName = user?.name || user?.fullName || "John Wilson";

  const userInitials = userName
    ?.split(" ")
    ?.map((word) => word?.[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase() || "JW";

  const [tooltipPos, setTooltipPos] = useState(null);
  const profileRef = useRef(null);

  const handleMouseEnter = () => {
    if (!collapsed || !profileRef.current) return;
    const rect = profileRef.current.getBoundingClientRect();
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
      <div
        ref={profileRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex flex-col items-center gap-2 border-t border-border p-2"
      >
        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary shadow-2xs">
          {userInitials}
        </div>

        <Link to={ROUTES.SETTINGS}>
          <UIIconButton
            type="button"
            title="Settings"
            aria-label="Settings"
            variant="ghost"
            size="xs"
            className="text-text-muted hover:bg-surface-hover hover:text-text"
          >
            <Settings className="size-3.5" />
          </UIIconButton>
        </Link>

        {onLogout && (
          <UIIconButton
            type="button"
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            variant="ghost"
            size="xs"
            className="text-text-muted hover:bg-error/10 hover:text-error"
          >
            <LogOut className="size-3.5" />
          </UIIconButton>
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
              className="pointer-events-none rounded-[6px] border border-border bg-surface px-2.5 py-1.5 shadow-[var(--app-shadow-lg)] whitespace-nowrap"
            >
              <p className="text-[12px] font-bold text-text">{userName}</p>
            </div>,
            document.body
          )}
      </div>
    );
  }

  return (
    <div className="border-t border-border p-2">
      <div className="flex items-center gap-2.5 rounded-[8px] p-1.5 transition hover:bg-surface-hover">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary shadow-2xs">
          {userInitials}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="truncate text-[13px] font-bold text-text leading-tight">
            {userName}
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <Link to={ROUTES.SETTINGS}>
            <UIIconButton
              type="button"
              title="Settings"
              aria-label="Settings"
              variant="ghost"
              size="xs"
              className="text-text-muted hover:bg-surface-hover hover:text-text"
            >
              <Settings className="size-3.5" />
            </UIIconButton>
          </Link>

          {onLogout && (
            <UIIconButton
              type="button"
              onClick={onLogout}
              title="Log out"
              aria-label="Log out"
              variant="ghost"
              size="xs"
              className="text-text-muted hover:bg-error/10 hover:text-error"
            >
              <LogOut className="size-3.5" />
            </UIIconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
