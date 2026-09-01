// src/features/workspace/pages/desktop/WorkspaceInvitationsDesktopPage.jsx

import React from "react";
import {
  Mail,
  UserPlus,
  Plus,
  RotateCcw,
  Search,
  Copy,
  Check,
  Send,
  XCircle,
  Clock,
  CheckCircle2,
  Users,
  Shield,
  Building2,
  GitBranch,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

import {
  UIButton,
  UIIconButton,
  UISearchInput,
  UISelect,
  UIBadge,
  UIPagination,
  UITable,
  UITableHeader,
  UITableBody,
  UITableRow,
  UITableHead,
  UITableCell,
  UIEmptyState,
  UISkeleton,
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
  UIAlert,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const statusBadgeVariant = (status) => {
  switch (status) {
    case "accepted":
      return { variant: "soft", color: "success", label: "Accepted" };
    case "pending":
      return { variant: "soft", color: "warning", label: "Pending" };
    case "expired":
      return { variant: "soft", color: "neutral", label: "Expired" };
    case "cancelled":
      return { variant: "soft", color: "neutral", label: "Cancelled" };
    default:
      return { variant: "soft", color: "neutral", label: status };
  }
};

export default function WorkspaceInvitationsDesktopPage({
  workspace,
  invitations = [],
  paginatedInvitations = [],
  stats = [],

  filters,
  activeFilterChips = [],
  statusOptions = [],

  isLoading = false,
  hasError = false,
  error = null,
  message = null,
  copiedId = null,

  currentPage = 1,
  pageSize = 8,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,

  totalInvitations = 0,
  filteredInvitationsCount = 0,
  hasInvitations = false,
  hasFilteredInvitations = false,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleInviteMember,
  handleViewMembers,
  handleCancelInvitation,
  handleResendInvitation,
  handleCopyLink,

  clearMessage,
}) {
  const shouldShowPagination = hasFilteredInvitations && filteredInvitationsCount > pageSize;

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-5 max-w-[1440px] mx-auto space-y-4">
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

      {/* 1. Header Banner Card */}
      <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Mail className="size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Workspace Invitations
            </h1>
            <UIBadge variant="soft" color="primary" size="sm">
              {workspace?.name || "Workspace"}
            </UIBadge>
          </div>
          <p className="text-xs sm:text-sm text-text-muted pl-0.5">
            Track, resend, and manage onboarding invitation links sent to team members.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <UIButton
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            startIcon={<RotateCcw className={cn("size-3.5", isLoading && "animate-spin")} />}
          >
            Refresh
          </UIButton>

          <UIButton
            variant="outline"
            size="sm"
            onClick={handleViewMembers}
            startIcon={<Users className="size-3.5 text-text-muted" />}
          >
            View Members
          </UIButton>

          <UIButton
            variant="primary"
            size="sm"
            onClick={handleInviteMember}
            startIcon={<Plus className="size-4" />}
          >
            Invite Member
          </UIButton>
        </div>
      </div>

      {/* 2. Quick Stat Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-surface rounded-2xl p-4 border border-border/60 shadow-2xs space-y-1"
          >
            <div className="text-xs font-semibold text-text-muted">{stat.title}</div>
            <div className="text-xl sm:text-2xl font-bold text-text font-mono">
              {stat.value}
            </div>
            <div className="text-[11px] text-text-muted">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="bg-surface rounded-2xl p-3 sm:p-4 border border-border/60 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <UISearchInput
              placeholder="Search invitee email, role or notes..."
              value={filters.search}
              onChange={handleSearchChange}
              onClear={() => handleSearchChange({ target: { value: "" } })}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-36 sm:w-44">
              <UISelect
                size="sm"
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                options={statusOptions}
              />
            </div>

            {(filters.search || filters.status !== "all") && (
              <UIButton
                variant="ghost"
                size="xs"
                onClick={handleClearFilters}
                className="text-text-muted hover:text-text"
              >
                Clear Filters
              </UIButton>
            )}
          </div>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/30">
            <span className="text-[11px] font-semibold text-text-muted mr-1">Active filters:</span>
            {activeFilterChips.map((chip) => (
              <UIBadge
                key={chip.key}
                variant="soft"
                color="neutral"
                size="xs"
                className="gap-1 cursor-pointer hover:bg-surface-hover"
                onClick={() => handleRemoveFilter(chip.key)}
              >
                <span>{chip.label}</span>
                <span className="text-text-muted hover:text-text ml-0.5">×</span>
              </UIBadge>
            ))}
          </div>
        )}
      </div>

      {/* 4. UITable Component with Responsive Layout */}
      <div className="bg-surface rounded-2xl border border-border/60 shadow-2xs overflow-hidden">
        {isLoading && !hasInvitations ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <UISkeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : hasFilteredInvitations ? (
          <>
            <div className="overflow-x-auto">
              <UITable>
                <UITableHeader>
                  <UITableRow className="bg-surface-alt/50">
                    <UITableHead className="min-w-[220px]">Invitee & Credentials</UITableHead>
                    <UITableHead className="min-w-[150px]">Designated Role</UITableHead>
                    <UITableHead className="min-w-[160px]">Branch Clearance</UITableHead>
                    <UITableHead className="min-w-[120px]">Status</UITableHead>
                    <UITableHead className="min-w-[150px]">Sent & Expiry</UITableHead>
                    <UITableHead className="text-right min-w-[160px]">Actions</UITableHead>
                  </UITableRow>
                </UITableHeader>

                <UITableBody>
                  {paginatedInvitations.map((invitation) => {
                    const statusMeta = statusBadgeVariant(invitation.effectiveStatus);
                    const isPending = invitation.effectiveStatus === "pending";
                    const isCopied = copiedId === invitation._id;

                    return (
                      <UITableRow key={invitation._id} className="hover:bg-surface-alt/30 transition-colors">
                        {/* Invitee Email */}
                        <UITableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                              {invitation.displayEmail.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-text block truncate">
                                {invitation.displayEmail}
                              </span>
                              <span className="text-[10.5px] text-text-muted block">
                                Invited by {invitation.displayInvitedBy}
                              </span>
                            </div>
                          </div>
                        </UITableCell>

                        {/* Role */}
                        <UITableCell>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-surface-alt border border-border/50 text-text">
                            <Shield className="size-3 text-primary" />
                            <span>{invitation.displayRole}</span>
                          </span>
                        </UITableCell>

                        {/* Scope */}
                        <UITableCell>
                          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                            <GitBranch className="size-3.5 text-text-muted shrink-0" />
                            <span>{invitation.storeFootprint}</span>
                          </span>
                        </UITableCell>

                        {/* Status */}
                        <UITableCell>
                          <UIBadge
                            variant={statusMeta.variant}
                            color={statusMeta.color}
                            size="xs"
                          >
                            {statusMeta.label}
                          </UIBadge>
                        </UITableCell>

                        {/* Timestamps */}
                        <UITableCell>
                          <div className="text-xs">
                            <span className="text-text font-medium block">
                              {invitation.displayCreatedAt}
                            </span>
                            <span className="text-[10.5px] text-text-muted block">
                              Expires {invitation.displayExpiresAt}
                            </span>
                          </div>
                        </UITableCell>

                        {/* Actions */}
                        <UITableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending ? (
                              <>
                                <UIButton
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleCopyLink(invitation)}
                                  startIcon={isCopied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                                  title="Copy invite link"
                                >
                                  {isCopied ? "Copied" : "Copy"}
                                </UIButton>

                                <UIButton
                                  variant="outline"
                                  size="xs"
                                  onClick={() => handleResendInvitation(invitation)}
                                  startIcon={<Send className="size-3 text-primary" />}
                                  className="text-primary hover:text-primary-hover hover:border-primary/40"
                                >
                                  Resend
                                </UIButton>

                                <UIButton
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleCancelInvitation(invitation)}
                                  className="text-destructive hover:bg-destructive/10"
                                  title="Revoke invitation"
                                >
                                  Revoke
                                </UIButton>
                              </>
                            ) : (
                              <span className="text-xs text-text-muted italic pr-2">
                                {invitation.effectiveStatus === "accepted" ? "Member Active" : "Closed"}
                              </span>
                            )}
                          </div>
                        </UITableCell>
                      </UITableRow>
                    );
                  })}
                </UITableBody>
              </UITable>
            </div>

            {/* Pagination Controls (Hidden when rows <= pageSize per user requirement) */}
            {shouldShowPagination && (
              <div className="p-3 border-t border-border/40 flex items-center justify-between">
                <div className="text-xs text-text-muted">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredInvitationsCount)} of{" "}
                  {filteredInvitationsCount} invitations
                </div>
                <UIPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  size="sm"
                />
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center space-y-3">
            <UIEmptyState
              icon={<Mail className="size-10 text-text-muted/60" />}
              title="No Invitations Found"
              description={
                filters.search || filters.status !== "all"
                  ? "No invitations match your current filter criteria."
                  : "No pending or past invitations found in this workspace."
              }
              action={
                filters.search || filters.status !== "all" ? (
                  <UIButton variant="outline" size="sm" onClick={handleClearFilters}>
                    Clear Filters
                  </UIButton>
                ) : (
                  <UIButton variant="primary" size="sm" onClick={handleInviteMember} startIcon={<Plus className="size-4" />}>
                    Send First Invitation
                  </UIButton>
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
