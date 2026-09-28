// src/layouts/app/components/sidebar/SidebarCompanySelector.jsx

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronsUpDown,
  Check,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  Store,
  Building2,
} from "lucide-react";

import { ROUTES, API_STATUS } from "@/constants";
import useCompany from "@/features/company/hooks/useCompany";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";
import { usePermission } from "@/hooks";
import { useSetupStatus } from "@/features/setup/hooks/useSetupStatus";
import { UITabs, UISkeleton } from "@/components/ui";


const ALL_SELECTOR_TABS = [
  { id: "company", label: "Company", icon: <Building2 className="size-3.5" /> },
  { id: "branch", label: "Branch", icon: <Store className="size-3.5" /> },
];

/**
 * Clean Company Initial / Logo Badge
 */
const CompanyAvatar = ({ company, size = "md", className = "", isSetupPending = false }) => {
  const sizeClasses = {
    sm: "size-6 text-[11px] rounded-[5px]",
    md: "size-7.5 text-xs rounded-[7px]",
    lg: "size-8.5 text-[13px] rounded-[8px]",
  };

  if (isSetupPending) {
    return (
      <div
        className={`${sizeClasses[size] || sizeClasses.md} flex shrink-0 items-center justify-center bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs ${className}`}
      >
        <Building2 className="size-4" />
      </div>
    );
  }

  const name = company?.name || "Company";
  const initial = name.charAt(0).toUpperCase();

  if (company?.logo) {
    return (
      <img
        src={company.logo}
        alt={name}
        className={`${sizeClasses[size] || sizeClasses.md} shrink-0 object-cover border border-border/60 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} flex shrink-0 items-center justify-center bg-primary-soft text-primary font-bold border border-primary/20 shadow-2xs ${className}`}
    >
      {initial}
    </div>
  );
};

/**
 * Shimmering Skeleton List for Company & Branch Tabs
 */
const SelectorSkeletonList = ({ count = 3, iconType = "avatar" }) => {
  return (
    <div className="space-y-1 py-0.5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-2.5 rounded-[8px] px-2.5 py-2 bg-surface-alt/40"
        >
          <div className="flex min-w-0 items-center gap-2.5 flex-1">
            {iconType === "avatar" ? (
              <UISkeleton className="size-6 rounded-[5px] shrink-0" />
            ) : (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-border/80">
                <Store className="size-3.5 opacity-30" />
              </div>
            )}
            <UISkeleton className={`h-3.5 ${index % 2 === 0 ? "w-28" : "w-36"} rounded-[4px]`} />
          </div>
          <UISkeleton className="size-3.5 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
};

const SidebarCompanySelector = ({
  collapsed = false,
  onToggleCollapse,
  onClose,
  showClose = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const { currentWorkspace } = useWorkspace();
  const { isOwner, can } = usePermission();
  const {
    companies = [],
    currentCompany,
    setCurrentCompany,
    getWorkspaceCompaniesStatus,
  } = useCompany();
  const {
    branches = [],
    currentBranch,
    setCurrentBranch,
    clearCurrentBranch,
    getCompanyBranches,
    getCompanyBranchesStatus,
  } = useBranch();
  const { updateActiveContext } = useUser();
  const { isSetupComplete, companyCompleted, branchCompleted } = useSetupStatus();

  // Active Tab inside dropdown: "company" | "branch"
  const [activeTab, setActiveTab] = useState("company");
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitchingBranch, setIsSwitchingBranch] = useState(false);

  const canCreateCompany = isOwner || can("company:create");
  const canCreateBranch = isOwner || can("branch:create");

  const isCompanyLoading =
    getWorkspaceCompaniesStatus === API_STATUS.LOADING ||
    (!companies?.length && getWorkspaceCompaniesStatus !== API_STATUS.SUCCESS);

  const isBranchLoading =
    isSwitchingBranch ||
    getCompanyBranchesStatus === API_STATUS.LOADING;

  const hasNoCompanyAccess = !isOwner && !isCompanyLoading && companies.length === 0;
  const hasNoBranchAccess = !isOwner && !isBranchLoading && companies.length > 0 && branches.length === 0;

  // Filter available tabs based on setup completion and access
  const availableTabs = useMemo(() => {
    if (hasNoCompanyAccess) {
      return [{ id: "company", label: "Company", icon: <Building2 className="size-3.5" /> }];
    }
    if (!companyCompleted && isOwner) {
      return [{ id: "company", label: "Company", icon: <Building2 className="size-3.5" /> }];
    }
    return ALL_SELECTOR_TABS;
  }, [hasNoCompanyAccess, companyCompleted, isOwner]);

  // Ensure active tab doesn't get stuck on branch if company is incomplete or has no access
  useEffect(() => {
    if ((!companyCompleted || hasNoCompanyAccess) && activeTab !== "company") {
      setActiveTab("company");
    }
  }, [companyCompleted, hasNoCompanyAccess, activeTab]);


  const [dropdownCoords, setDropdownCoords] = useState({
    top: 0,
    left: 0,
    width: 235,
  });
  const [collapsedTooltip, setCollapsedTooltip] = useState(null);


  // Rock-solid position calculation without subpixel jitter
  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    if (collapsed) {
      setDropdownCoords({
        top: Math.max(8, Math.min(Math.round(rect.top), window.innerHeight - 360)),
        left: Math.round(rect.right + 8),
        width: 250,
      });
    } else {
      const roundedLeft = Math.round(rect.left);
      const targetWidth = Math.min(235, Math.max(220, Math.round(rect.width)));
      const spaceBelow = window.innerHeight - rect.bottom;
      const topPos =
        spaceBelow < 320
          ? Math.max(8, Math.round(rect.top - 300))
          : Math.round(rect.bottom + 6);

      setDropdownCoords({
        top: topPos,
        left: roundedLeft,
        width: targetWidth,
      });
    }
  }, [collapsed]);

  // Recalculate on open or window resize
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();

      const handleResize = () => updateDropdownPosition();
      window.addEventListener("resize", handleResize, { passive: true });
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Click outside and escape listener
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

  // Switch Company Handler: Immediately open Branch tab if branch is completed
  const handleSelectCompany = async (company) => {
    if (!company?._id) return;

    if (company._id !== currentCompany?._id) {
      dispatch({ type: "APP/RESET_STATE" });
      setCurrentCompany(company);
      clearCurrentBranch();
      setIsSwitchingBranch(true);

      if (branchCompleted) {
        setActiveTab("branch");
      }

      try {
        if (currentWorkspace?._id) {
          await updateActiveContext({
            workspaceId: currentWorkspace._id,
            companyId: company._id,
            branchId: null,
          });
        }
        await getCompanyBranches();
      } catch (error) {
        console.error("Failed to update company context:", error);
      } finally {
        setIsSwitchingBranch(false);
      }
    } else if (branchCompleted) {
      setActiveTab("branch");
    }
  };

  // Switch Branch Handler
  const handleSelectBranch = async (branch) => {
    if (!branch?._id) return;
    setIsOpen(false);

    if (branch._id === currentBranch?._id) return;

    dispatch({ type: "APP/RESET_STATE" });
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
      console.error("Failed to update branch context:", error);
    }
  };

  // Tooltip for collapsed mode
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

  // Clean dynamic names reflecting setup rules without parenthetical steps
  const companyName = hasNoCompanyAccess
    ? "You don't have any company."
    : !companyCompleted && isOwner
    ? "Create Company"
    : currentCompany?.name || "Select Company";

  const branchName = hasNoCompanyAccess
    ? "No Company Access"
    : hasNoBranchAccess
    ? "No Branch Access"
    : !companyCompleted
    ? "Create Company First"
    : !branchCompleted && isOwner
      ? "Create Branch"
      : currentBranch?.name || "Select Branch";


  // ─────────────────────────────────────────────────────────────────────────────
  // 1. COLLAPSED MINI-RAIL VIEW (68px)
  // ─────────────────────────────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <div className="relative flex flex-col items-center justify-center border-b border-border p-2">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            setCollapsedTooltip(null);
            setIsOpen(!isOpen);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={`${companyName} - ${branchName}`}
          aria-expanded={isOpen}
          className={`flex size-9 cursor-pointer items-center justify-center rounded-[8px] transition-all active:scale-[0.96] ${
            isOpen
              ? "ring-2 ring-primary ring-offset-1 bg-primary-soft text-primary"
              : "hover:bg-surface-hover hover:ring-1 hover:ring-border"
          }`}
        >
          <CompanyAvatar
            company={currentCompany}
            size="md"
            isSetupPending={!companyCompleted}
          />
        </button>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="mt-2 flex size-6 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-surface-hover hover:text-text active:scale-[0.95]"
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}

        {/* Floating Tooltip */}
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
              className="pointer-events-none rounded-[6px] border border-border bg-surface px-2.5 py-1.5 text-xs text-text shadow-[var(--app-shadow-lg)] whitespace-nowrap space-y-0.5"
            >
              <p className="font-bold text-text">{companyName}</p>
              <p className="text-[10.5px] text-text-muted">{branchName}</p>
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
                className="overflow-hidden rounded-[14px] border border-border bg-surface p-2 shadow-[var(--app-shadow-xl)]"
              >
                {/* Reusable UITabs Primitive */}
                <div className="mb-2">
                  <UITabs
                    tabs={availableTabs}
                    activeTab={activeTab}
                    onChange={(tabId) => setActiveTab(tabId)}
                    variant="segmented"
                    size="xs"
                    fullWidth={true}
                  />
                </div>

                {/* Animated Tab Content with Smooth Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === "company" ? -4 : 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === "company" ? 4 : -4 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full"
                  >
                    {/* Tab 1: Company List */}
                    {activeTab === "company" && (
                      <div>
                        <div className="max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-0.5">
                          {isCompanyLoading ? (
                            <SelectorSkeletonList count={3} iconType="avatar" />
                          ) : companies?.length ? (
                            companies.map((comp) => {
                              const isSelected = comp?._id === currentCompany?._id;
                              return (
                                <button
                                  key={comp?._id}
                                  type="button"
                                  onClick={() => handleSelectCompany(comp)}
                                  className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2 py-1.5 text-left transition-all active:scale-[0.98] ${
                                    isSelected
                                      ? "bg-primary-soft/60 text-primary font-bold"
                                      : "text-text hover:bg-surface-hover"
                                  }`}
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    <CompanyAvatar company={comp} size="sm" />
                                    <span className="truncate text-[12.5px]">
                                      {comp?.name}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <Check className="size-4 shrink-0 text-primary stroke-[2.5]" />
                                  )}
                                </button>
                              );
                            })
                          ) : hasNoCompanyAccess ? (
                            <div className="p-3 text-center text-xs text-text-muted space-y-1 bg-surface-alt/40 rounded-[8px] border border-dashed border-border/70">
                              <p className="font-semibold text-text">You don't have any company.</p>
                              <p className="text-[11px]">No company access is granted for your account in this workspace.</p>
                            </div>
                          ) : (
                            <div className="p-3 text-center text-xs text-text-muted space-y-1">
                              <p className="font-semibold text-text">No companies created yet</p>
                              <p className="text-[11px]">Set up your legal entity to continue.</p>
                            </div>
                          )}
                        </div>

                        {canCreateCompany && (
                          <>
                            <div className="my-1.5 border-t border-border/70" />
                            <Link
                              to={ROUTES.CREATE_COMPANY}
                              onClick={() => setIsOpen(false)}
                              className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98]"
                            >
                              <Plus className="size-3.5 stroke-[2.5]" />
                              <span>{companyCompleted ? "New Company" : "Create First Company"}</span>
                            </Link>
                          </>
                        )}
                      </div>
                    )}

                    {/* Tab 2: Branch List (Only accessible if company is completed) */}
                    {activeTab === "branch" && companyCompleted && (
                      <div>
                        <div className="max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-0.5">
                          {isBranchLoading ? (
                            <SelectorSkeletonList count={3} iconType="branch" />
                          ) : branches?.length ? (
                            branches.map((br) => {
                              const isSelected = br?._id === currentBranch?._id;
                              return (
                                <button
                                  key={br?._id}
                                  type="button"
                                  onClick={() => handleSelectBranch(br)}
                                  className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2 py-1.5 text-left transition-all active:scale-[0.98] ${
                                    isSelected
                                      ? "bg-primary-soft/60 text-primary font-bold"
                                      : "text-text hover:bg-surface-hover"
                                  }`}
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    <div className="flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-primary/10 text-primary">
                                      <Store className="size-3.5" />
                                    </div>
                                    <span className="truncate text-[12.5px]">
                                      {br?.name}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <Check className="size-4 shrink-0 text-primary stroke-[2.5]" />
                                  )}
                                </button>
                              );
                            })
                          ) : hasNoBranchAccess ? (
                            <div className="p-3 text-center text-xs text-text-muted space-y-1 bg-surface-alt/40 rounded-[8px] border border-dashed border-border/70">
                              <p className="font-semibold text-text">No branch access</p>
                              <p className="text-[11px]">No branches are assigned to your account under this company.</p>
                            </div>
                          ) : (
                            <div className="p-3 text-center text-xs text-text-muted space-y-1">
                              <p className="font-semibold text-text">No branch created yet</p>
                              <p className="text-[11px]">Add your primary branch to complete setup.</p>
                            </div>
                          )}
                        </div>

                        {canCreateBranch && (
                          <>
                            <div className="my-1.5 border-t border-border/70" />
                            <Link
                              to={ROUTES.CREATE_BRANCH}
                              onClick={() => setIsOpen(false)}
                              className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98]"
                            >
                              <Plus className="size-3.5 stroke-[2.5]" />
                              <span>{branchCompleted ? "New Branch" : "Create First Branch"}</span>
                            </Link>
                          </>
                        )}
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. EXPANDED VIEW (Desktop 240px & Mobile Drawer)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex h-13 shrink-0 items-center justify-between border-b border-border px-2.5">
      {/* Interactive Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Company or Branch"
        aria-expanded={isOpen}
        className={`flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 rounded-[9px] p-1.5 text-left transition-all active:scale-[0.98] ${
          isOpen
            ? "bg-surface-hover ring-1 ring-border shadow-xs"
            : "hover:bg-surface-hover"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <CompanyAvatar
            company={currentCompany}
            size="md"
            isSetupPending={!companyCompleted}
          />

          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-text leading-tight">
              {companyName}
            </div>
            <div className="truncate text-[11px] font-medium text-text-muted leading-tight mt-0.5">
              {branchName}
            </div>
          </div>
        </div>

        <ChevronsUpDown
          className={`size-3.5 shrink-0 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-text" : ""
          }`}
        />
      </button>

      {/* Collapse button on desktop */}
      {onToggleCollapse && !showClose && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="ml-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-surface-hover hover:text-text active:scale-[0.95]"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      {/* Close button on mobile */}
      {showClose && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="ml-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-text-muted transition hover:bg-surface-hover hover:text-text active:scale-[0.95]"
        >
          <X className="size-4" />
        </button>
      )}

      {/* Floating Portal Dropdown Menu */}
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
              className="overflow-hidden rounded-[14px] border border-border bg-surface p-2 shadow-[var(--app-shadow-xl)]"
            >
              {/* Reusable UITabs Primitive */}
              <div className="mb-2">
                <UITabs
                  tabs={availableTabs}
                  activeTab={activeTab}
                  onChange={(tabId) => setActiveTab(tabId)}
                  variant="segmented"
                  size="xs"
                  fullWidth={true}
                />
              </div>

              {/* Fluid Animated Tab Content with Smooth Transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "company" ? -4 : 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "company" ? 4 : -4 }}
                  transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full"
                >
                  {/* TAB 1: Company List (Scrollbar hidden) */}
                  {activeTab === "company" && (
                    <div>
                      <div className="max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-0.5 pr-0.5">
                        {isCompanyLoading ? (
                          <SelectorSkeletonList count={3} iconType="avatar" />
                        ) : companies?.length ? (
                          companies.map((comp) => {
                            const isSelected = comp?._id === currentCompany?._id;
                            return (
                              <button
                                key={comp?._id}
                                type="button"
                                onClick={() => handleSelectCompany(comp)}
                                className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2.5 py-2 text-left transition-all active:scale-[0.98] ${
                                  isSelected
                                    ? "bg-primary-soft/60 text-primary font-bold"
                                    : "text-text hover:bg-surface-hover"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <CompanyAvatar company={comp} size="sm" />
                                  <span className="truncate text-[13px] font-semibold text-text">
                                    {comp?.name}
                                  </span>
                                </div>

                                {isSelected && (
                                  <Check className="size-4 shrink-0 text-primary stroke-[2.5]" />
                                )}
                              </button>
                            );
                          })
                          ) : hasNoCompanyAccess ? (
                            <div className="py-4 px-3 text-center text-xs text-text-muted space-y-1 bg-surface-alt/40 rounded-[10px] border border-dashed border-border/70">
                              <p className="font-semibold text-text">You don't have any company.</p>
                              <p className="text-[11px]">No company access is granted for your account in this workspace.</p>
                            </div>
                          ) : (
                            <div className="py-4 text-center text-xs text-text-muted space-y-1">
                              <p className="font-semibold text-text">No companies created yet</p>
                              <p className="text-[11px]">Set up your legal entity to continue.</p>
                            </div>
                          )}
                        </div>

                        {canCreateCompany && (
                          <>
                            <div className="my-1.5 border-t border-border/70" />
                            <Link
                              to={ROUTES.CREATE_COMPANY}
                              onClick={() => setIsOpen(false)}
                              className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98]"
                            >
                              <Plus className="size-3.5 stroke-[2.5]" />
                              <span>{companyCompleted ? "New Company" : "Create First Company"}</span>
                            </Link>
                          </>
                        )}
                      </div>
                    )}

                    {/* TAB 2: Branch List (Only accessible if company is completed) */}
                    {activeTab === "branch" && companyCompleted && (
                      <div>
                        <div className="max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-0.5 pr-0.5">
                          {isBranchLoading ? (
                            <SelectorSkeletonList count={3} iconType="branch" />
                          ) : branches?.length ? (
                            branches.map((br) => {
                              const isSelected = br?._id === currentBranch?._id;
                              return (
                                <button
                                  key={br?._id}
                                  type="button"
                                  onClick={() => handleSelectBranch(br)}
                                  className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2.5 py-2 text-left transition-all active:scale-[0.98] ${
                                    isSelected
                                      ? "bg-primary-soft/60 text-primary font-bold"
                                      : "text-text hover:bg-surface-hover"
                                  }`}
                                >
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-primary/10 text-primary">
                                      <Store className="size-3.5" />
                                    </div>
                                    <span className="truncate text-[13px] font-semibold text-text">
                                      {br?.name}
                                    </span>
                                  </div>

                                  {isSelected && (
                                    <Check className="size-4 shrink-0 text-primary stroke-[2.5]" />
                                  )}
                                </button>
                              );
                            })
                          ) : hasNoBranchAccess ? (
                            <div className="py-4 px-3 text-center text-xs text-text-muted space-y-1 bg-surface-alt/40 rounded-[10px] border border-dashed border-border/70">
                              <p className="font-semibold text-text">No branch access</p>
                              <p className="text-[11px]">No branches are assigned to your account under this company.</p>
                            </div>
                          ) : (
                            <div className="py-4 text-center text-xs text-text-muted space-y-1">
                              <p className="font-semibold text-text">No branch created yet</p>
                              <p className="text-[11px]">Add your first branch location.</p>
                            </div>
                          )}
                        </div>

                        {canCreateBranch && (
                          <>
                            <div className="my-1.5 border-t border-border/70" />
                            <Link
                              to={ROUTES.CREATE_BRANCH}
                              onClick={() => setIsOpen(false)}
                              className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98]"
                            >
                              <Plus className="size-3.5 stroke-[2.5]" />
                              <span>{branchCompleted ? "New Branch" : "Create First Branch"}</span>
                            </Link>
                          </>
                        )}
                      </div>
                    )}

                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default SidebarCompanySelector;
