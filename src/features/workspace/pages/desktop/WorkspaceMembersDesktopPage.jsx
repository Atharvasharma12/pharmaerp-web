// src/features/workspace/pages/desktop/WorkspaceMembersDesktopPage.jsx

import React, { useState } from "react";
import {
  Plus,
  Upload,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Key,
  MapPin,
  UserCheck,
  Clock,
  Shield,
  UserMinus,
  Users,
  Search,
  RotateCcw,
  Eye,
  Building2,
  GitBranch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import {
  UIButton,
  UIIconButton,
  UISearchInput,
  UISelect,
  UIPagination,
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
  UIEmptyState,
  UISkeleton,
  UIAlert,
  PermissionGate,
} from "@/components/ui";
import { usePermission } from "@/hooks";
import { cn } from "@/lib/utils";

export default function WorkspaceMembersDesktopPage({
  workspace,
  members = [],
  paginatedMembers = [],
  stats = [],
  filters,
  activeFilterChips = [],
  statusOptions = [],
  roleOptions = [],
  isLoading,
  hasError,
  error,
  message,
  totalMembers = 0,
  filteredMembersCount = 0,
  hasMembers,
  hasFilteredMembers,
  hasCompanies = true,
  hasBranches = true,
  currentPage = 1,
  pageSize = 6,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
  handleRefresh,
  handleInviteMember,
  handleViewInvitations,
  handleViewMemberDetails,
  handleExportCSV,
  handleChangeMemberStatus,
  handleRemoveMember,
  handleManageAccess,
  handleOpenResetPassword,
  clearMessage,
}) {
  const navigate = useNavigate();
  const { can } = usePermission();
  const [activeDropdownMemberId, setActiveDropdownMemberId] = useState(null);

  const activeCount =
    stats.find((s) => s.id === "active")?.value ??
    members.filter((m) => m.status === "active").length;
  const inactiveCount =
    (stats.find((s) => s.id === "inactive")?.value || 0) +
    (stats.find((s) => s.id === "suspended")?.value || 0);

  // Condition to hide pagination when total records don't exceed single page
  const shouldShowPagination = hasFilteredMembers && filteredMembersCount > pageSize;

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-5 max-w-[1440px] mx-auto space-y-3.5">
      {/* Feedback Toast */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <UIAlert
            intent="success"
            title={message}
            onClose={clearMessage}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Global Error Banner */}
      {error && !hasError && (
        <UIAlert
          intent="danger"
          title="Something went wrong"
          description={error}
          onClose={clearMessage}
        />
      )}

      {/* Prerequisite Alert Banners for Owner / Member Management */}
      {!hasCompanies && !isLoading && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
                <Building2 className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Operating Company Required</h3>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Before you can add or invite team members, you must first create at least one company. Staff members require assigned company clearances.
                </p>
              </div>
            </div>
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.CREATE_COMPANY)}
              startIcon={<Building2 className="size-3.5" />}
              className="shrink-0"
            >
              Create Company
            </UIButton>
          </div>
        </div>
      )}

      {hasCompanies && !hasBranches && !isLoading && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-cyan-900 dark:text-cyan-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-600 dark:text-cyan-400 shrink-0">
                <GitBranch className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Dispensary Branch Required</h3>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  You have created a company, but you need at least one dispensary branch before adding staff so they can be granted store access.
                </p>
              </div>
            </div>
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.CREATE_BRANCH)}
              startIcon={<GitBranch className="size-3.5" />}
              className="shrink-0"
            >
              Create Branch
            </UIButton>
          </div>
        </div>
      )}

      {/* 1. Header Area with Minimal Padding */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-text tracking-tight flex items-center gap-2">
            <span className="font-mono tabular-nums">{totalMembers}</span> Members
          </h1>
          <div className="flex items-center gap-3.5 text-xs font-semibold mt-1">
            <span className="inline-flex items-center gap-1.5 text-text">
              <span className="size-2.5 rounded-full bg-success ring-2 ring-success/20" />
              Active{" "}
              <strong className="font-mono tabular-nums text-text font-bold">
                {activeCount}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-text">
              <span className="size-2.5 rounded-full bg-error ring-2 ring-error/20" />
              Inactive{" "}
              <strong className="font-mono tabular-nums text-text font-bold">
                {inactiveCount}
              </strong>
            </span>
          </div>
        </div>

        {/* Action Buttons: Import, Export, Add Member */}
        <div className="flex items-center gap-2 shrink-0">
          <UIButton
            type="button"
            variant="outline"
            size="sm"
            startIcon={<Upload className="size-3.5 text-text-muted" />}
            onClick={handleViewInvitations}
          >
            Import
          </UIButton>

          <UIButton
            type="button"
            variant="outline"
            size="sm"
            startIcon={<Download className="size-3.5 text-text-muted" />}
            onClick={handleExportCSV}
          >
            Export
          </UIButton>

          <PermissionGate permission="workspace-member:create">
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              startIcon={<Plus className="size-4" />}
              onClick={handleInviteMember}
            >
              Add Member
            </UIButton>
          </PermissionGate>
        </div>
      </div>

      {/* 2. Compact Search & Filter Toolbar */}
      <div className="bg-surface border border-border/60 rounded-xl p-2.5 px-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        <div className="flex-1 min-w-[220px]">
          <UISearchInput
            placeholder="Search member name, email or phone..."
            value={filters.search}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange("")}
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-32">
            <UISelect
              value={filters.role}
              onChange={(val) => handleFilterChange({ role: val })}
              options={roleOptions}
              placeholder="All Roles"
              size="sm"
            />
          </div>

          <div className="w-32">
            <UISelect
              value={filters.status}
              onChange={(val) => handleFilterChange({ status: val })}
              options={statusOptions}
              placeholder="All Status"
              size="sm"
            />
          </div>

          {activeFilterChips.length > 0 && (
            <UIButton
              type="button"
              variant="ghost"
              size="xs"
              startIcon={<RotateCcw className="size-3 text-text-muted" />}
              onClick={handleClearFilters}
            >
              Reset
            </UIButton>
          )}
        </div>
      </div>

      {/* 3. Main Card Grid Stream */}
      {isLoading && !hasMembers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-2xl p-4 flex flex-col items-center space-y-3 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
            >
              <UISkeleton className="size-18 rounded-full" />
              <UISkeleton className="h-4 w-28 rounded" />
              <UISkeleton className="h-3 w-20 rounded" />
              <div className="w-full pt-3 border-t border-border/30 grid grid-cols-2 gap-3">
                <UISkeleton className="h-6 rounded" />
                <UISkeleton className="h-6 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasMembers ? (
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Users className="size-9 text-primary" />}
            title="No workspace members yet"
            description="Start building your pharmacy team roster by adding or inviting members."
            primaryAction={
              <UIButton
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={handleInviteMember}
              >
                Add Member
              </UIButton>
            }
          />
        </div>
      ) : !hasFilteredMembers ? (
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Search className="size-9 text-text-muted" />}
            title="No matching members found"
            description="Try changing your search query, status, or role filter criteria."
            primaryAction={
              <UIButton variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </UIButton>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {paginatedMembers.map((member) => {
            const isDropdownOpen = activeDropdownMemberId === member._id;
            const hasAnyDropdownOpen = activeDropdownMemberId !== null;

            return (
              <MemberCard
                key={member._id}
                member={member}
                isDropdownOpen={isDropdownOpen}
                hasAnyDropdownOpen={hasAnyDropdownOpen}
                onDropdownOpenChange={(open) => {
                  setActiveDropdownMemberId(open ? member._id : null);
                }}
                onCardClick={() => {
                  if (!hasAnyDropdownOpen) {
                    handleViewMemberDetails?.(member);
                  }
                }}
                onViewDetails={() => {
                  setActiveDropdownMemberId(null);
                  handleViewMemberDetails?.(member);
                }}
                onChangeStatus={(m, status) => {
                  setActiveDropdownMemberId(null);
                  handleChangeMemberStatus(m, status);
                }}
                onRemove={(m) => {
                  setActiveDropdownMemberId(null);
                  handleRemoveMember(m);
                }}
                onManageAccess={(m) => {
                  setActiveDropdownMemberId(null);
                  handleViewMemberDetails?.(m);
                }}
                onResetPassword={(m) => {
                  setActiveDropdownMemberId(null);
                  handleOpenResetPassword(m);
                }}
              />
            );
          })}
        </div>
      )}

      {/* 4. Bottom Pagination Module (Shown ONLY when records exceed page size) */}
      {shouldShowPagination && (
        <div className="bg-surface rounded-xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden">
          <UIPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredMembersCount}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24, 48]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSummary
            showPageSize
          />
        </div>
      )}
    </div>
  );
}

/**
 * MemberCard Component
 * - Displays Companies and Branches assigned to member
 * - Soft borderless elevation with two-tone background shading
 * - Active dropdown stacking and hover isolation
 */
function MemberCard({
  member,
  isDropdownOpen,
  hasAnyDropdownOpen,
  onDropdownOpenChange,
  onCardClick,
  onViewDetails,
  onChangeStatus,
  onRemove,
  onManageAccess,
  onResetPassword,
}) {
  const { can } = usePermission();
  const isOwner = Boolean(member?.isOwner);
  const status = member?.status || "inactive";

  const getStatusDotColor = () => {
    switch (status) {
      case "active":
        return "bg-success ring-success/20";
      case "suspended":
        return "bg-error ring-error/20";
      default:
        return "bg-warning ring-warning/20";
    }
  };

  const getInitials = (name) => {
    return String(name || "M")
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  };

  // Company and Branch Access counts / labels
  const companyAccessLabel = isOwner
    ? "All Companies"
    : member?.accessAllCompanies
    ? "All Companies"
    : member?.companyCount !== undefined
    ? `${member.companyCount} ${member.companyCount === 1 ? "Company" : "Companies"}`
    : member?.companies?.length !== undefined
    ? `${member.companies.length} ${member.companies.length === 1 ? "Company" : "Companies"}`
    : member?.companyIds?.length !== undefined
    ? `${member.companyIds.length} ${member.companyIds.length === 1 ? "Company" : "Companies"}`
    : "No Companies";

  const branchAccessLabel = isOwner
    ? "All Branches"
    : member?.accessAllBranches
    ? "All Branches"
    : member?.branchCount !== undefined
    ? `${member.branchCount} ${member.branchCount === 1 ? "Branch" : "Branches"}`
    : member?.branches?.length !== undefined
    ? `${member.branches.length} ${member.branches.length === 1 ? "Branch" : "Branches"}`
    : member?.branchIds?.length !== undefined
    ? `${member.branchIds.length} ${member.branchIds.length === 1 ? "Branch" : "Branches"}`
    : "No Branches";

  return (
    <div
      onClick={onCardClick}
      className={cn(
        "bg-surface rounded-2xl shadow-xs transition-all duration-200 flex flex-col relative border-0",
        isDropdownOpen
          ? "z-50 ring-2 ring-primary/40 shadow-xl"
          : hasAnyDropdownOpen
          ? "z-0 ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
          : "z-10 ring-1 ring-black/[0.04] dark:ring-white/[0.06] hover:z-20 hover:ring-primary/40 hover:shadow-md cursor-pointer group active:scale-[0.99]"
      )}
    >
      {/* Top Section: Avatar, Name, Role (bg-surface, rounded-t-2xl) */}
      <div className="bg-surface p-4 pt-3.5 relative flex flex-col items-center text-center rounded-t-2xl">
        {/* Enlarged Three-Dots Context Menu (z-50) */}
        <div
          className="absolute top-3 right-3 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <UIDropdown
            open={isDropdownOpen}
            onOpenChange={onDropdownOpenChange}
            align="right"
            placement="bottom"
          >
            <UIDropdownTrigger asChild>
              <button
                type="button"
                aria-label={`Actions for ${member.displayName}`}
                className={cn(
                  "size-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer border-0",
                  isDropdownOpen
                    ? "bg-primary-soft text-primary"
                    : "text-text-muted hover:text-text hover:bg-surface-hover"
                )}
              >
                <MoreHorizontal className="size-5" />
              </button>
            </UIDropdownTrigger>
            <UIDropdownMenu width="w-52" className="shadow-2xl border border-border/60">
              <UIDropdownItem
                icon={<Eye className="size-4 text-primary" />}
                onClick={(e) => {
                  e?.stopPropagation?.();
                  onViewDetails?.();
                }}
              >
                View Member Details
              </UIDropdownItem>
              <UIDropdownItem
                icon={<MapPin className="size-4" />}
                onClick={(e) => {
                  e?.stopPropagation?.();
                  onManageAccess?.(member);
                }}
              >
                Manage Access & Roles
              </UIDropdownItem>
              <UIDropdownItem
                icon={<Key className="size-4" />}
                onClick={(e) => {
                  e?.stopPropagation?.();
                  onResetPassword?.(member);
                }}
                disabled={isOwner}
              >
                Reset Password / PIN
              </UIDropdownItem>

              {can("member-access:update") && (
                <>
                  <UIDropdownItem
                    icon={<UserCheck className="size-4 text-success" />}
                    onClick={(e) => {
                      e?.stopPropagation?.();
                      onChangeStatus?.(member, "active");
                    }}
                    disabled={isOwner || status === "active"}
                  >
                    Mark Active
                  </UIDropdownItem>
                  <UIDropdownItem
                    icon={<Clock className="size-4 text-warning" />}
                    onClick={(e) => {
                      e?.stopPropagation?.();
                      onChangeStatus?.(member, "inactive");
                    }}
                    disabled={isOwner || status === "inactive"}
                  >
                    Mark Inactive
                  </UIDropdownItem>
                  <UIDropdownItem
                    icon={<Shield className="size-4 text-error" />}
                    onClick={(e) => {
                      e?.stopPropagation?.();
                      onChangeStatus?.(member, "suspended");
                    }}
                    disabled={isOwner || status === "suspended"}
                  >
                    Suspend Member
                  </UIDropdownItem>
                  <UIDropdownDivider />
                </>
              )}

              {can("workspace-member:delete") && (
                <UIDropdownItem
                  icon={<UserMinus className="size-4 text-error" />}
                  onClick={(e) => {
                    e?.stopPropagation?.();
                    onRemove?.(member);
                  }}
                  disabled={isOwner}
                  destructive
                >
                  Remove Member
                </UIDropdownItem>
              )}
            </UIDropdownMenu>
          </UIDropdown>
        </div>

        {/* Circular Avatar with Status Dot */}
        <div className="relative mt-1">
          {member?.user?.avatar || member?.avatar ? (
            <img
              src={member?.user?.avatar || member?.avatar}
              alt={member.displayName}
              className="size-18 rounded-full object-cover border-2 border-surface shadow-xs"
            />
          ) : (
            <div className="size-18 rounded-full bg-primary-soft text-primary font-extrabold text-lg flex items-center justify-center border-2 border-surface shadow-xs select-none">
              {getInitials(member.displayName)}
            </div>
          )}

          <span
            className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-surface ring-2 ${getStatusDotColor()}`}
            title={`Status: ${status}`}
          />
        </div>

        {/* Member Name & Role */}
        <div className="mt-2.5 space-y-0.5 max-w-full">
          <h3
            className={cn(
              "text-base font-bold text-text tracking-tight truncate px-2 transition-colors",
              !hasAnyDropdownOpen && "group-hover:text-primary"
            )}
          >
            {member.displayName}
          </h3>
          <p className="text-xs text-text-muted font-medium truncate">
            {member.displayRole || "Staff Member"}
          </p>
        </div>
      </div>

      {/* Bottom Section: Shaded Color Background (bg-surface-alt/75, rounded-b-2xl) */}
      <div className="bg-surface-alt/75 border-t border-border/30 p-3.5 space-y-2 text-left flex-1 flex flex-col justify-between rounded-b-2xl">
        {/* 2-Column Metadata Grid: Company Access & Branch Access */}
        <div className="w-full grid grid-cols-2 gap-2 text-left">
          <div className="min-w-0 pr-1">
            <span className="block text-[10.5px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Building2 className="size-3 text-text-muted/70 shrink-0" />
              Companies
            </span>
            <span className="block text-xs font-semibold text-text truncate mt-0.5">
              {companyAccessLabel}
            </span>
          </div>

          <div className="min-w-0 pl-1">
            <span className="block text-[10.5px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <GitBranch className="size-3 text-text-muted/70 shrink-0" />
              Branches
            </span>
            <span className="block text-xs font-semibold text-text truncate mt-0.5">
              {branchAccessLabel}
            </span>
          </div>
        </div>

        {/* Contact Details List (Email & Phone) */}
        <div className="w-full space-y-1.5 pt-1.5 border-t border-border/30 text-left">
          <div className="flex items-center gap-2 text-xs text-text-muted hover:text-text truncate transition-colors">
            <Mail className="size-3.5 shrink-0 text-text-muted" />
            <span className="truncate">{member.displayEmail || "-"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted hover:text-text truncate transition-colors">
            <Phone className="size-3.5 shrink-0 text-text-muted" />
            <span className="font-mono tabular-nums truncate">
              {member.displayPhone || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
