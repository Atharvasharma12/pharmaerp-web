// src/features/branch/pages/desktop/BranchesDesktopPage.jsx

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Copy,
  MapPin,
  Mail,
  Phone,
  Users,
  ShieldCheck,
  Settings,
  Edit3,
  Trash2,
  MoreHorizontal,
  Wallet,
  Calendar,
  Store,
  Warehouse,
  Hospital,
  ArrowUpRight,
} from "lucide-react";
import {
  UIButton,
  UIBadge,
  UIEmptyState,
  UIAlert,
  UISkeleton,
  PermissionGate,
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
  UIIconButton,
  uiToast,
} from "@/components/ui";
import useBranch from "@/features/branch/hooks/useBranch";
import { cn } from "@/lib/utils";

import { BranchEmployeesDrawer } from "../../components";

const formatBranchTypeLabel = (type) => {
  if (!type) return "Retail Pharmacy";
  return String(type)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getBranchTypeIcon = (type) => {
  const lower = String(type || "").toLowerCase();
  if (lower.includes("hospital")) return Hospital;
  if (lower.includes("warehouse") || lower.includes("depot")) return Warehouse;
  return Store;
};

export const BranchesDesktopPage = ({
  branches = [],
  isLoading,
  hasError,
  error,
  message,
  handleRefresh,
  handleCreateBranch,
  handleViewBranch,
  handleEditBranch,
  handleOpenSettings,
  handleViewEmployees,
  handleDeleteBranch,
  selectedBranchForEmployees,
  isEmployeeDrawerOpen,
  handleCloseEmployeesDrawer,
  clearMessage,
}) => {
  const navigate = useNavigate();
  const { currentBranch, setCurrentBranch } = useBranch();

  const handleCopy = useCallback((text, label) => {
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text);
    uiToast.success(`${label} Copied`, `"${text}" copied to clipboard.`);
  }, []);

  const handleSwitchBranch = useCallback(
    (branch) => {
      if (!branch?._id) return;
      if (currentBranch?._id === branch._id) return;
      setCurrentBranch(branch);
      uiToast.success(
        "Active Branch Switched",
        `Now operating under "${branch.displayName || branch.name}".`
      );
    },
    [currentBranch?._id, setCurrentBranch]
  );

  return (
    <div className="w-full h-full max-h-full flex-1 flex flex-col min-h-0 bg-bg px-3 sm:px-4 lg:px-5 pt-1 pb-2 gap-3 text-text font-sans overflow-hidden select-none">
      {/* ── Global Error Banner ── */}
      {error && !hasError && (
        <UIAlert
          intent="danger"
          title="Something went wrong"
          description={error}
          onClose={clearMessage}
        />
      )}

      {/* ── Slim Executive Header Bar ── */}
      <div className="flex items-center justify-between gap-3 shrink-0 py-1 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <GitBranch className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-text tracking-tight">
                Branch Locations & Dispensing Outlets
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-[11px] font-semibold text-text font-mono">
                {branches.length} {branches.length === 1 ? "Location" : "Locations"}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Physical retail pharmacies, hospital dispensaries, and warehouse distribution centers
            </p>
          </div>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-2 ml-auto">
          <UIButton
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={handleRefresh}
            className="h-9 px-3 text-xs font-semibold text-text-muted hover:text-text cursor-pointer"
            title="Refresh branch records"
          >
            <RefreshCw
              className={cn(
                "size-3.5 mr-1.5",
                isLoading && "animate-spin text-primary"
              )}
            />
            Refresh
          </UIButton>

          <PermissionGate permission="branch:create">
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              startIcon={<Plus className="size-4" />}
              onClick={handleCreateBranch}
              className="h-9 px-3.5 text-xs font-semibold shadow-xs"
            >
              Add Branch
            </UIButton>
          </PermissionGate>
        </div>
      </div>

      {/* ── Main Scrollable Area ── */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
        {hasError ? (
          <div className="m-auto py-16 px-6 text-center space-y-3 max-w-md">
            <AlertTriangle className="size-10 text-error mx-auto" />
            <h3 className="text-base font-bold text-text">
              Unable to load branch locations
            </h3>
            <p className="text-xs text-text-muted">
              {error || "An error occurred while connecting to the branch database. Please retry."}
            </p>
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              Retry Connection
            </UIButton>
          </div>
        ) : isLoading && !branches.length ? (
          /* Shimmer Loading Cards */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <UISkeleton className="size-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <UISkeleton className="h-5 w-48 rounded" />
                    <UISkeleton className="h-3.5 w-32 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                  <UISkeleton className="h-16 rounded-xl" />
                  <UISkeleton className="h-16 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : branches.length === 0 ? (
          /* Empty State */
          <div className="m-auto py-16">
            <UIEmptyState
              icon={<GitBranch className="size-12 text-primary" />}
              title="No branch outlets configured"
              description="Register physical dispensing stores, hospital counters, or warehouse locations for this company."
              primaryAction={
                <PermissionGate permission="branch:create">
                  <UIButton
                    variant="primary"
                    size="sm"
                    startIcon={<Plus className="size-4" />}
                    onClick={handleCreateBranch}
                  >
                    Register First Branch
                  </UIButton>
                </PermissionGate>
              }
            />
          </div>
        ) : (
          /* ── Branch Operational Hub Cards ── */
          <div
            className={cn(
              "grid gap-4",
              branches.length === 1
                ? "grid-cols-1 max-w-4xl mx-auto"
                : "grid-cols-1 xl:grid-cols-2"
            )}
          >
            {branches.map((branch) => {
              const isCurrent = currentBranch?._id === branch._id;
              const name = branch.displayName || branch.name || "Untitled Branch";
              const code = branch.code || branch.branchCode || "N/A";
              const type = branch.type || "retail";
              const typeLabel = formatBranchTypeLabel(type);
              const TypeIcon = getBranchTypeIcon(type);

              const manager =
                branch.displayManager ||
                branch.pharmacist?.name ||
                branch.manager?.name ||
                "-";
              const license =
                branch.drugLicense ||
                branch.pharmacist?.regNo ||
                branch.pharmacist?.licenseNo ||
                branch.gstin ||
                "-";
              const email = branch.email || branch.contactEmail || "-";
              const phone = branch.phones?.mobile || branch.phone || "-";
              const location =
                branch.locationSummary ||
                branch.address?.addressLine1 ||
                branch.addressLine1 ||
                [branch.address?.city, branch.address?.state].filter(Boolean).join(", ") ||
                "Storefront Location Not Set";
              const memberCount =
                branch.memberCount ?? branch.staffCount ?? branch.membersCount ?? 0;

              return (
                <div
                  key={branch._id}
                  className={cn(
                    "rounded-2xl border bg-surface transition-all duration-200 flex flex-col overflow-hidden shadow-2xs hover:shadow-xs",
                    isCurrent
                      ? "border-primary/40 ring-1 ring-primary/25"
                      : "border-border hover:border-border/90"
                  )}
                >
                  {/* Card Banner / Accent Line */}
                  {isCurrent && (
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
                  )}

                  {/* Card Header */}
                  <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-border/60">
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Avatar / Branch Type Icon */}
                      <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-2xs">
                        <TypeIcon className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            onClick={() => handleViewBranch?.(branch)}
                            className="text-base sm:text-[17px] font-bold text-text truncate hover:text-primary cursor-pointer transition-colors"
                            title={name}
                          >
                            {name}
                          </h2>

                          {/* Code Badge */}
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-surface-alt border border-border text-text-muted">
                            {code}
                          </span>

                          {/* Type Pill */}
                          <UIBadge
                            variant="soft"
                            color="primary"
                            className="text-[11px] font-semibold capitalize"
                          >
                            {typeLabel}
                          </UIBadge>
                        </div>

                        {/* Status Strip & Active Context Indicator */}
                        <div className="flex items-center gap-2 mt-1">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active Branch Session
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-alt text-text-muted text-[11px] font-medium border border-border/60">
                              Secondary Location
                            </span>
                          )}

                          <span className="text-[11px] text-text-muted">
                            • Status:{" "}
                            <strong className="text-text capitalize font-semibold">
                              {branch.displayStatus || branch.status || "active"}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <UIDropdown align="right" usePortal={true}>
                      <UIDropdownTrigger asChild>
                        <UIIconButton
                          variant="ghost"
                          size="sm"
                          aria-label="Actions"
                          className="h-8 w-8 text-text-muted hover:text-text hover:bg-surface-hover shrink-0"
                        >
                          <MoreHorizontal className="size-4" />
                        </UIIconButton>
                      </UIDropdownTrigger>

                      <UIDropdownMenu width="w-48">
                        <UIDropdownItem
                          icon={<Edit3 className="size-4" />}
                          onClick={() => handleEditBranch?.(branch)}
                        >
                          Edit Branch Details
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Users className="size-4" />}
                          onClick={() => handleViewEmployees?.(branch)}
                        >
                          Manage Branch Staff
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Settings className="size-4" />}
                          onClick={() => handleOpenSettings?.(branch)}
                        >
                          Branch Settings
                        </UIDropdownItem>
                        <UIDropdownDivider />
                        <UIDropdownItem
                          destructive
                          icon={<Trash2 className="size-4" />}
                          onClick={() => handleDeleteBranch?.(branch)}
                        >
                          Delete Branch
                        </UIDropdownItem>
                      </UIDropdownMenu>
                    </UIDropdown>
                  </div>

                  {/* Operational Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-border/60 border-b border-border/60 bg-surface-alt/40 text-xs">
                    {/* Metric 1: Branch Cash Vault */}
                    <div
                      onClick={() => navigate("/finance/treasury/branch-cash")}
                      className="p-3 text-center cursor-pointer hover:bg-surface-hover/70 transition-colors group"
                      title="Jump to Branch Cash Vault"
                    >
                      <div className="text-[11px] font-medium text-text-muted flex items-center justify-center gap-1 group-hover:text-primary">
                        <Wallet className="size-3.5" />
                        Cash Vault
                      </div>
                      <div className="text-xs font-bold text-text group-hover:text-primary mt-1 flex items-center justify-center gap-1">
                        <span>Open Vault</span>
                        <ArrowUpRight className="size-3 opacity-70" />
                      </div>
                    </div>

                    {/* Metric 2: Branch Staff Access */}
                    <div
                      onClick={() => handleViewEmployees?.(branch)}
                      className="p-3 text-center cursor-pointer hover:bg-surface-hover/70 transition-colors group"
                      title="Click to view assigned staff"
                    >
                      <div className="text-[11px] font-medium text-text-muted flex items-center justify-center gap-1 group-hover:text-primary">
                        <Users className="size-3.5" />
                        Staff On Duty
                      </div>
                      <div className="text-base font-bold text-text font-mono tabular-nums mt-0.5 group-hover:text-primary">
                        {memberCount} {memberCount === 1 ? "Staff" : "Staff"}
                      </div>
                    </div>

                    {/* Metric 3: Pharmacist in Charge */}
                    <div className="p-3 text-center col-span-2 sm:col-span-1 border-t sm:border-t-0 border-border/60">
                      <div className="text-[11px] font-medium text-text-muted flex items-center justify-center gap-1">
                        <ShieldCheck className="size-3.5" />
                        Pharmacist
                      </div>
                      <div className="text-xs font-bold text-text mt-1 truncate" title={manager}>
                        {manager}
                      </div>
                    </div>
                  </div>

                  {/* Two-Column Structured Intel Section */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 text-xs">
                    {/* Column 1: Storefront & Location */}
                    <div className="space-y-3 bg-surface-alt/30 p-3.5 rounded-xl border border-border/50">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 pb-1 border-b border-border/40">
                        <MapPin className="size-3.5 text-primary" />
                        Store Location & Address
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2">
                        <span className="text-text-muted font-medium shrink-0">Address:</span>
                        <span
                          className="text-text font-medium leading-relaxed truncate"
                          title={location}
                        >
                          {location}
                        </span>
                      </div>

                      {/* City & State */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium">Jurisdiction:</span>
                        <span className="font-semibold text-text truncate">
                          {branch.address?.city || branch.city || "Urban District"}
                          {branch.address?.state ? `, ${branch.address.state}` : ""}
                        </span>
                      </div>
                    </div>

                    {/* Column 2: Licensing & Direct Communication */}
                    <div className="space-y-3 bg-surface-alt/30 p-3.5 rounded-xl border border-border/50">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 pb-1 border-b border-border/40">
                        <ShieldCheck className="size-3.5 text-info" />
                        Licensing & Direct Line
                      </div>

                      {/* Drug License / Tax ID */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium">License / ID:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-text select-all">
                            {license}
                          </span>
                          {license !== "-" && (
                            <button
                              type="button"
                              onClick={() => handleCopy(license, "License")}
                              className="p-1 rounded hover:bg-surface text-text-muted hover:text-primary transition-colors cursor-pointer"
                              title="Copy License ID"
                            >
                              <Copy className="size-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium flex items-center gap-1">
                          <Phone className="size-3 text-text-muted" /> Dispense Desk:
                        </span>
                        <span className="font-mono font-semibold text-text">
                          {phone}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium flex items-center gap-1">
                          <Mail className="size-3 text-text-muted" /> Email:
                        </span>
                        <span
                          className="font-medium text-text truncate max-w-[160px]"
                          title={email}
                        >
                          {email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Bar (Footer) */}
                  <div className="p-3 sm:px-4 bg-surface-alt/50 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isCurrent ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20 select-none">
                          <CheckCircle2 className="size-3.5" />
                          Currently Active Branch
                        </div>
                      ) : (
                        <UIButton
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSwitchBranch(branch)}
                          className="h-8 px-3 text-xs font-semibold hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
                        >
                          Switch to this Branch
                        </UIButton>
                      )}

                      <UIButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEmployees?.(branch)}
                        startIcon={<Users className="size-3.5 text-text-muted" />}
                        className="h-8 px-2.5 text-xs text-text-muted hover:text-text cursor-pointer"
                      >
                        Staff On Duty
                      </UIButton>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <UIButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/finance/treasury/branch-cash")}
                        startIcon={<Wallet className="size-3.5 text-text-muted" />}
                        className="h-8 px-3 text-xs font-semibold hover:border-primary hover:text-primary shadow-2xs"
                      >
                        Branch Cash
                      </UIButton>

                      <UIButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenSettings?.(branch)}
                        startIcon={<Settings className="size-3.5 text-text-muted" />}
                        className="h-8 px-3 text-xs font-semibold shadow-2xs"
                      >
                        Settings
                      </UIButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Slide-over Branch Employees & Access Drawer ── */}
      <BranchEmployeesDrawer
        isOpen={isEmployeeDrawerOpen}
        onClose={handleCloseEmployeesDrawer}
        branch={selectedBranchForEmployees}
      />
    </div>
  );
};

export default BranchesDesktopPage;
