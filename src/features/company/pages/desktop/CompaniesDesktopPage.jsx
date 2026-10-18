// src/features/company/pages/desktop/CompaniesDesktopPage.jsx

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  GitBranch,
  ShieldCheck,
  Settings,
  Edit3,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Calendar,
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
import useCompany from "@/features/company/hooks/useCompany";
import { cn } from "@/lib/utils";

import { CompanyEmployeesDrawer } from "../../components";

export const CompaniesDesktopPage = ({
  companies = [],
  isLoading,
  hasError,
  error,
  message,
  handleRefresh,
  handleCreateCompany,
  handleViewCompany,
  handleEditCompany,
  handleOpenSettings,
  handleViewEmployees,
  handleDeleteCompany,
  selectedCompanyForEmployees,
  isEmployeeDrawerOpen,
  handleCloseEmployeesDrawer,
  clearMessage,
}) => {
  const navigate = useNavigate();
  const { currentCompany, setCurrentCompany } = useCompany();

  const handleCopy = useCallback((text, label) => {
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text);
    uiToast.success(`${label} Copied`, `"${text}" copied to clipboard.`);
  }, []);

  const handleSwitchCompany = useCallback(
    (company) => {
      if (!company?._id) return;
      if (currentCompany?._id === company._id) return;
      setCurrentCompany(company);
      uiToast.success(
        "Active Company Switched",
        `Now operating under "${company.displayName || company.name}".`
      );
    },
    [currentCompany?._id, setCurrentCompany]
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
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-text tracking-tight">
                Company Entities & Legal Profiles
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-[11px] font-semibold text-text font-mono">
                {companies.length} {companies.length === 1 ? "Entity" : "Entities"}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Manage legal business registrations, tax credentials, and operational company units
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
            title="Refresh company profiles"
          >
            <RefreshCw
              className={cn(
                "size-3.5 mr-1.5",
                isLoading && "animate-spin text-primary"
              )}
            />
            Refresh
          </UIButton>

          <PermissionGate permission="company:create">
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              startIcon={<Plus className="size-4" />}
              onClick={handleCreateCompany}
              className="h-9 px-3.5 text-xs font-semibold shadow-xs"
            >
              Add Company
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
              Unable to load company profiles
            </h3>
            <p className="text-xs text-text-muted">
              {error || "An error occurred while connecting to the workspace servers. Please retry."}
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
        ) : isLoading && !companies.length ? (
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
        ) : companies.length === 0 ? (
          /* Empty State */
          <div className="m-auto py-16">
            <UIEmptyState
              icon={<Building2 className="size-12 text-primary" />}
              title="No company profiles found"
              description="Register your primary pharmacy legal entity to unlock billing, inventory, and regulatory reporting."
              primaryAction={
                <PermissionGate permission="company:create">
                  <UIButton
                    variant="primary"
                    size="sm"
                    startIcon={<Plus className="size-4" />}
                    onClick={handleCreateCompany}
                  >
                    Register First Company
                  </UIButton>
                </PermissionGate>
              }
            />
          </div>
        ) : (
          /* ── Executive Company Hub Cards ── */
          <div
            className={cn(
              "grid gap-4",
              companies.length === 1
                ? "grid-cols-1 max-w-4xl mx-auto"
                : "grid-cols-1 xl:grid-cols-2"
            )}
          >
            {companies.map((company) => {
              const isCurrent = currentCompany?._id === company._id;
              const name = company.displayName || company.name || "Untitled Company";
              const code = company.companyCode || "N/A";
              const type = company.displayType || company.type || "Proprietorship";
              const gstin = company.displayGstin || company.gstin || "-";
              const pan = company.displayPan || company.pan || "-";
              const email = company.displayEmail || company.email || "-";
              const phone = company.displayPhone || company.phones?.mobile || "-";
              const owner = company.displayOwnerName || company.owner?.name || "-";
              const location =
                company.locationSummary ||
                company.addressLine1 ||
                [company.address?.city, company.address?.state].filter(Boolean).join(", ") ||
                "Registered Office Not Set";
              const memberCount = company.memberCount ?? company.membersCount ?? 0;
              const branchesCount = company.branchesCount ?? company.branches?.length ?? null;

              return (
                <div
                  key={company._id}
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
                      {/* Avatar / Brand Icon */}
                      <div className="size-11 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20 shadow-2xs uppercase">
                        {name.charAt(0) || "C"}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            onClick={() => handleViewCompany?.(company)}
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
                            {type}
                          </UIBadge>
                        </div>

                        {/* Status Strip & Active Context Indicator */}
                        <div className="flex items-center gap-2 mt-1">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active Workspace Company
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-alt text-text-muted text-[11px] font-medium border border-border/60">
                              Secondary Entity
                            </span>
                          )}

                          <span className="text-[11px] text-text-muted">
                            • Status:{" "}
                            <strong className="text-text capitalize font-semibold">
                              {company.status || "active"}
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
                          onClick={() => handleEditCompany?.(company)}
                        >
                          Edit Company Profile
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Users className="size-4" />}
                          onClick={() => handleViewEmployees?.(company)}
                        >
                          Manage Staff Access
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Settings className="size-4" />}
                          onClick={() => handleOpenSettings?.(company)}
                        >
                          Company Settings
                        </UIDropdownItem>
                        <UIDropdownDivider />
                        <UIDropdownItem
                          destructive
                          icon={<Trash2 className="size-4" />}
                          onClick={() => handleDeleteCompany?.(company)}
                        >
                          Delete Company
                        </UIDropdownItem>
                      </UIDropdownMenu>
                    </UIDropdown>
                  </div>

                  {/* Operational Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-border/60 border-b border-border/60 bg-surface-alt/40 text-xs">
                    {/* Metric 1: Branches */}
                    <div
                      onClick={() => navigate("/branches")}
                      className="p-3 text-center cursor-pointer hover:bg-surface-hover/70 transition-colors group"
                      title="Click to view company branches"
                    >
                      <div className="text-[11px] font-medium text-text-muted flex items-center justify-center gap-1 group-hover:text-primary">
                        <GitBranch className="size-3.5" />
                        Branches
                      </div>
                      <div className="text-base font-bold text-text font-mono tabular-nums mt-0.5 group-hover:text-primary">
                        {branchesCount !== null ? branchesCount : "View"}
                      </div>
                    </div>

                    {/* Metric 2: Staff */}
                    <div
                      onClick={() => handleViewEmployees?.(company)}
                      className="p-3 text-center cursor-pointer hover:bg-surface-hover/70 transition-colors group"
                      title="Click to view staff members"
                    >
                      <div className="text-[11px] font-medium text-text-muted flex items-center justify-center gap-1 group-hover:text-primary">
                        <Users className="size-3.5" />
                        Team Access
                      </div>
                      <div className="text-base font-bold text-text font-mono tabular-nums mt-0.5 group-hover:text-primary">
                        {memberCount} {memberCount === 1 ? "User" : "Users"}
                      </div>
                    </div>

                    {/* Metric 3: Created */}
                    <div className="p-3 text-center col-span-2 sm:col-span-1 border-t sm:border-t-0 border-border/60">
                      <div className="text-[11px] font-medium text-text-muted flex items-center justify-center gap-1">
                        <Calendar className="size-3.5" />
                        Profile Age
                      </div>
                      <div className="text-xs font-semibold text-text mt-1 truncate">
                        {company.displayCreatedAt || "Active"}
                      </div>
                    </div>
                  </div>

                  {/* Two-Column Structured Intel Section */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 text-xs">
                    {/* Column 1: Statutory & Tax Compliance */}
                    <div className="space-y-3 bg-surface-alt/30 p-3.5 rounded-xl border border-border/50">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 pb-1 border-b border-border/40">
                        <ShieldCheck className="size-3.5 text-primary" />
                        Tax & Compliance
                      </div>

                      {/* GSTIN */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium">GSTIN:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-text select-all">
                            {gstin}
                          </span>
                          {gstin !== "-" && (
                            <button
                              type="button"
                              onClick={() => handleCopy(gstin, "GSTIN")}
                              className="p-1 rounded hover:bg-surface text-text-muted hover:text-primary transition-colors cursor-pointer"
                              title="Copy GSTIN"
                            >
                              <Copy className="size-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* PAN */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium">PAN Number:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-text select-all">
                            {pan}
                          </span>
                          {pan !== "-" && (
                            <button
                              type="button"
                              onClick={() => handleCopy(pan, "PAN")}
                              className="p-1 rounded hover:bg-surface text-text-muted hover:text-primary transition-colors cursor-pointer"
                              title="Copy PAN"
                            >
                              <Copy className="size-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Owner / Director */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium">Director / Owner:</span>
                        <span className="font-semibold text-text truncate max-w-[160px]">
                          {owner}
                        </span>
                      </div>
                    </div>

                    {/* Column 2: Registered Office & Contact */}
                    <div className="space-y-3 bg-surface-alt/30 p-3.5 rounded-xl border border-border/50">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 pb-1 border-b border-border/40">
                        <MapPin className="size-3.5 text-info" />
                        Registered Office
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

                      {/* Phone */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted font-medium flex items-center gap-1">
                          <Phone className="size-3 text-text-muted" /> Phone:
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
                          Currently Active
                        </div>
                      ) : (
                        <UIButton
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSwitchCompany(company)}
                          className="h-8 px-3 text-xs font-semibold hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
                        >
                          Switch to this Company
                        </UIButton>
                      )}

                      <UIButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEmployees?.(company)}
                        startIcon={<Users className="size-3.5 text-text-muted" />}
                        className="h-8 px-2.5 text-xs text-text-muted hover:text-text cursor-pointer"
                      >
                        Staff Access
                      </UIButton>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <UIButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/branches")}
                        startIcon={<GitBranch className="size-3.5 text-text-muted" />}
                        className="h-8 px-2.5 text-xs text-text-muted hover:text-text cursor-pointer"
                      >
                        Branches
                      </UIButton>

                      <UIButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenSettings?.(company)}
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

      {/* ── Slide-over Company Employees & Access Drawer ── */}
      <CompanyEmployeesDrawer
        isOpen={isEmployeeDrawerOpen}
        onClose={handleCloseEmployeesDrawer}
        company={selectedCompanyForEmployees}
      />
    </div>
  );
};

export default CompaniesDesktopPage;
