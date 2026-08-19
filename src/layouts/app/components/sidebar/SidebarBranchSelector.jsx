// src/layouts/app/components/sidebar/SidebarBranchSelector.jsx

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Check,
  Plus,
  ExternalLink,
  Store,
} from "lucide-react";

import { ROUTES } from "@/constants";
import useBranch from "@/features/branch/hooks/useBranch";
import useCompany from "@/features/company/hooks/useCompany";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useUser from "@/features/user/hooks/useUser";

const SidebarBranchSelector = ({ collapsed = false }) => {
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const { currentWorkspace } = useWorkspace();
  const { currentCompany } = useCompany();
  const {
    branches = [],
    currentBranch,
    setCurrentBranch,
  } = useBranch();
  const { updateActiveContext } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({
    top: 0,
    left: 0,
    width: 230,
  });
  const [collapsedTooltip, setCollapsedTooltip] = useState(null);

  // Position calculation for portal floating dropdown
  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    if (collapsed) {
      setDropdownCoords({
        top: Math.max(10, Math.min(rect.top, window.innerHeight - 340)),
        left: rect.right + 10,
        width: 250,
      });
    } else {
      const calculatedWidth = Math.max(rect.width, 230);
      const spaceBelow = window.innerHeight - rect.bottom;
      const topPos = spaceBelow < 280 ? rect.top - 260 : rect.bottom + 4;

      setDropdownCoords({
        top: topPos,
        left: rect.left,
        width: calculatedWidth,
      });
    }
  }, [collapsed]);

  // Recalculate on open, scroll, or resize
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      const handleScrollOrResize = () => updateDropdownPosition();
      window.addEventListener("resize", handleScrollOrResize, { passive: true });
      window.addEventListener("scroll", handleScrollOrResize, true);
      return () => {
        window.removeEventListener("resize", handleScrollOrResize);
        window.removeEventListener("scroll", handleScrollOrResize, true);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Click outside and escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handle branch switch
  const handleSelectBranch = async (branch) => {
    if (!branch?._id) return;
    setIsOpen(false);

    if (branch._id === currentBranch?._id) return;

    setCurrentBranch(branch);

    try {
      if (currentWorkspace?._id && currentCompany?._id) {
        await updateActiveContext({
          workspaceId: currentWorkspace._id,
          companyId: currentCompany._id,
          branchId: branch._id,
        });
      }
    } catch (error) {
      console.error("Failed to update active branch context:", error);
    }
  };

  // Hover tooltip for collapsed mode
  const handleMouseEnter = () => {
    if (!collapsed || !triggerRef.current || isOpen) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCollapsedTooltip({
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  };

  const handleMouseLeave = () => {
    setCollapsedTooltip(null);
  };

  const activeBranchName = currentBranch?.name || "Select Branch";
  const activeBranchCity = currentBranch?.city || currentBranch?.addressLine1 || "Dispensary / Hub";

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. COLLAPSED MINI-RAIL VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <div className="relative flex justify-center py-1">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            setCollapsedTooltip(null);
            setIsOpen(!isOpen);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={activeBranchName}
          aria-expanded={isOpen}
          className={`flex size-7 cursor-pointer items-center justify-center rounded-[6px] transition-all active:scale-[0.95] ${
            isOpen
              ? "bg-primary-soft text-primary ring-1 ring-primary/40"
              : "text-text-muted hover:bg-surface-hover hover:text-text"
          }`}
        >
          <MapPin className="size-3.5" />
        </button>

        {/* Floating Tooltip when Hovered */}
        {collapsedTooltip &&
          !isOpen &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: collapsedTooltip.top,
                left: collapsedTooltip.left,
                transform: "translateY(-50%)",
                zIndex: 9999,
              }}
              className="pointer-events-none rounded-[6px] border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-text shadow-[var(--app-shadow-lg)] whitespace-nowrap"
            >
              <span>{activeBranchName}</span>
              <span className="ml-1.5 text-[10px] text-text-muted">({activeBranchCity})</span>
            </div>,
            document.body
          )}

        {/* Floating Portal Dropdown */}
        {createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.96, x: -4 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: -4 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                style={{
                  position: "fixed",
                  top: dropdownCoords.top,
                  left: dropdownCoords.left,
                  width: dropdownCoords.width,
                  zIndex: 9999,
                }}
                className="overflow-hidden rounded-[14px] border border-border bg-surface p-1.5 shadow-[var(--app-shadow-xl)]"
              >
                <div className="px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-text-muted/70">
                  Switch Branch / Location
                </div>

                <div className="max-h-[220px] overflow-y-auto space-y-0.5">
                  {branches?.length ? (
                    branches.map((br) => {
                      const isSelected = br?._id === currentBranch?._id;
                      return (
                        <button
                          key={br?._id}
                          type="button"
                          onClick={() => handleSelectBranch(br)}
                          className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] p-2 text-left transition-all active:scale-[0.98] ${
                            isSelected
                              ? "bg-primary-soft/60 text-primary font-semibold"
                              : "text-text hover:bg-surface-hover"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-primary/10 text-primary">
                              <Store className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-[12px] font-medium leading-tight">
                                {br?.name}
                              </div>
                              <div className="truncate text-[10px] text-text-muted leading-tight mt-0.5">
                                {br?.city || "Dispensary"}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="size-3.5 shrink-0 text-primary stroke-[2.5]" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-text-muted">
                      No branches found
                    </div>
                  )}
                </div>

                <div className="my-1 border-t border-border/70" />

                <Link
                  to={ROUTES.CREATE_BRANCH}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98]"
                >
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>New Branch</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. EXPANDED VIEW (Desktop & Mobile Drawer)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative px-2.5 pt-1.5 pb-2">
      {/* Sleek Sub-Header Pill */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Branch"
        aria-expanded={isOpen}
        className={`group flex w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] border border-border/70 bg-surface-alt/50 px-2 py-1.5 text-left text-xs transition-all active:scale-[0.98] ${
          isOpen
            ? "border-primary/40 bg-primary-soft/30 shadow-xs"
            : "hover:border-border-strong hover:bg-surface-hover"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-primary-soft text-primary group-hover:scale-105 transition-transform">
            <MapPin className="size-3" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="block truncate text-[11.5px] font-semibold text-text leading-tight">
              {activeBranchName}
            </span>
            <span className="block truncate text-[10px] text-text-muted leading-tight mt-0.5">
              {activeBranchCity}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`size-3 shrink-0 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "group-hover:text-text"
          }`}
        />
      </button>

      {/* Floating Portal Dropdown */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.97, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: "fixed",
                top: dropdownCoords.top,
                left: dropdownCoords.left,
                width: dropdownCoords.width,
                zIndex: 9999,
              }}
              className="overflow-hidden rounded-[14px] border border-border bg-surface p-1.5 shadow-[var(--app-shadow-xl)]"
            >
              <div className="flex items-center justify-between px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-text-muted/70">
                <span>Switch Branch</span>
                <span className="text-[10px] lowercase font-normal text-text-muted">
                  {branches?.length || 0} active
                </span>
              </div>

              <div className="max-h-[200px] overflow-y-auto space-y-0.5 pr-0.5">
                {branches?.length ? (
                  branches.map((br) => {
                    const isSelected = br?._id === currentBranch?._id;
                    return (
                      <button
                        key={br?._id}
                        type="button"
                        onClick={() => handleSelectBranch(br)}
                        className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-[8px] p-2 text-left transition-all active:scale-[0.98] ${
                          isSelected
                            ? "bg-primary-soft/60 text-primary font-semibold"
                            : "text-text hover:bg-surface-hover"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-primary/10 text-primary">
                            <Store className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[12px] font-semibold leading-tight text-text">
                              {br?.name || "Untitled Branch"}
                            </div>
                            <div className="truncate text-[10px] text-text-muted leading-tight mt-0.5 font-normal">
                              {br?.city || br?.addressLine1 || "Branch Location"}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="size-3.5 shrink-0 text-primary stroke-[2.5]" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-4 text-center text-xs text-text-muted">
                    <Store className="size-5 mx-auto mb-1 opacity-40" />
                    <p>No branches registered</p>
                  </div>
                )}
              </div>

              <div className="my-1 border-t border-border/70" />

              <div className="space-y-0.5">
                <Link
                  to={ROUTES.CREATE_BRANCH}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98]"
                >
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>New Branch</span>
                </Link>

                <Link
                  to={ROUTES.BRANCHES}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-between rounded-[8px] px-2.5 py-1.5 text-xs font-medium text-text-muted transition hover:bg-surface-hover hover:text-text active:scale-[0.98]"
                >
                  <span>Manage Branches</span>
                  <ExternalLink className="size-3 opacity-60" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default SidebarBranchSelector;
