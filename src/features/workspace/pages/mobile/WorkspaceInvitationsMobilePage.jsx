// src/features/workspace/pages/mobile/WorkspaceInvitationsMobilePage.jsx

import React from "react";
import {
  Mail,
  Plus,
  RotateCcw,
  Copy,
  Check,
  Send,
  XCircle,
  Shield,
  GitBranch,
} from "lucide-react";

import {
  UIButton,
  UIIconButton,
  UISearchInput,
  UISelect,
  UIBadge,
  UIEmptyState,
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

export default function WorkspaceInvitationsMobilePage({
  workspace,
  invitations = [],
  paginatedInvitations = [],
  filters,
  statusOptions = [],
  isLoading = false,
  copiedId = null,

  filteredInvitationsCount = 0,
  hasFilteredInvitations = false,

  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,
  handleInviteMember,
  handleCancelInvitation,
  handleResendInvitation,
  handleCopyLink,
}) {
  return (
    <div className="min-h-screen bg-bg text-text p-3 pb-24 space-y-3.5">
      {/* Header */}
      <div className="bg-surface rounded-2xl p-4 border border-border/60 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Mail className="size-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text">Invitations</h1>
              <span className="text-[11px] text-text-muted">{workspace?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <UIIconButton
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              aria-label="Refresh"
            >
              <RotateCcw className="size-3.5 text-text-muted" />
            </UIIconButton>

            <UIButton
              variant="primary"
              size="sm"
              onClick={handleInviteMember}
              startIcon={<Plus className="size-3.5" />}
            >
              Invite
            </UIButton>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-2 pt-1 border-t border-border/40">
          <UISearchInput
            placeholder="Search email or role..."
            value={filters.search}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange({ target: { value: "" } })}
            size="sm"
          />

          <UISelect
            size="sm"
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Invitation Cards */}
      {hasFilteredInvitations ? (
        <div className="space-y-3">
          {invitations.map((invitation) => {
            const statusMeta = statusBadgeVariant(invitation.effectiveStatus);
            const isPending = invitation.effectiveStatus === "pending";
            const isCopied = copiedId === invitation._id;

            return (
              <div
                key={invitation._id}
                className="bg-surface rounded-2xl p-4 border border-border/60 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-text block truncate">
                      {invitation.displayEmail}
                    </span>
                    <span className="text-[11px] text-text-muted block mt-0.5">
                      Invited by {invitation.displayInvitedBy}
                    </span>
                  </div>

                  <UIBadge
                    variant={statusMeta.variant}
                    color={statusMeta.color}
                    size="xs"
                  >
                    {statusMeta.label}
                  </UIBadge>
                </div>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="inline-flex items-center gap-1 font-semibold text-text">
                    <Shield className="size-3 text-primary" />
                    <span>{invitation.displayRole}</span>
                  </span>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1 text-text-muted">
                    <GitBranch className="size-3" />
                    <span>{invitation.storeFootprint}</span>
                  </span>
                </div>

                <div className="text-[11px] text-text-muted border-t border-border/30 pt-2 flex items-center justify-between">
                  <span>Sent {invitation.displayCreatedAt}</span>
                  {isPending && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(invitation)}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        {isCopied ? "Copied" : "Copy Link"}
                      </button>
                      <span className="text-border">|</span>
                      <button
                        type="button"
                        onClick={() => handleResendInvitation(invitation)}
                        className="text-xs text-text-muted hover:text-text font-semibold hover:underline"
                      >
                        Resend
                      </button>
                      <span className="text-border">|</span>
                      <button
                        type="button"
                        onClick={() => handleCancelInvitation(invitation)}
                        className="text-xs text-destructive font-semibold hover:underline"
                      >
                        Revoke
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl p-6 border border-border/60 shadow-2xs text-center space-y-3">
          <UIEmptyState
            icon={<Mail className="size-8 text-text-muted/60" />}
            title="No Invitations Found"
            description="No invitations match your current search or filter."
            action={
              <UIButton variant="outline" size="sm" onClick={handleClearFilters}>
                Reset Filters
              </UIButton>
            }
          />
        </div>
      )}
    </div>
  );
}
