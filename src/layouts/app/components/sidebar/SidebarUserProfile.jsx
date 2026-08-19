import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

const SidebarUserProfile = ({
  user,
  collapsed = false,
  onLogout,
}) => {
  const userName = user?.name || user?.fullName || "John Wilson";
  const userEmail = user?.email || "Wilson@gmail.com";
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
        <div className="relative">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-medium text-xs text-primary">
            {userInitials}
          </div>
          <span className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-surface bg-emerald-500" />
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            className="flex size-6 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-error/10 hover:text-error"
          >
            <LogOut className="size-3.5" />
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
              className="pointer-events-none rounded-[6px] border border-border bg-surface px-2.5 py-1.5 shadow-[var(--app-shadow-lg)] whitespace-nowrap"
            >
              <p className="text-[12px] font-medium text-text">{userName}</p>
              <p className="text-[10px] text-text-muted">{userEmail}</p>
            </div>,
            document.body
          )}
      </div>
    );
  }

  return (
    <div className="border-t border-border p-2">
      <div className="flex items-center gap-2.5 rounded-[8px] p-1.5 transition hover:bg-surface-hover">
        <div className="relative shrink-0">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-medium text-xs text-primary">
            {userInitials}
          </div>
          <span className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-surface bg-emerald-500" />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="truncate text-[13px] font-medium text-text leading-tight">
            {userName}
          </div>
          <div className="truncate text-[11px] text-text-muted leading-tight">
            {userEmail}
          </div>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-error/10 hover:text-error"
          >
            <LogOut className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarUserProfile;
