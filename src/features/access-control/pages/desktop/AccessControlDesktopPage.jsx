// src/features/access-control/pages/desktop/AccessControlDesktopPage.jsx

import React from "react";
import {
  Shield,
  FileKey,
  Users,
  Plus,
  RotateCcw,
  Search,
  ArrowRight,
  Eye,
  Edit2,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";

import {
  UIButton,
  UIIconButton,
  UISearchInput,
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
  UIAlert,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export default function AccessControlDesktopPage({
  stats = [],
  roles = [],
  paginatedRoles = [],
  permissions = [],

  search = "",
  setSearch,
  currentPage = 1,
  pageSize = 5,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,

  totalRolesCount = 0,
  filteredRolesCount = 0,

  isLoading = false,
  hasError = false,
  error = null,
  message = null,

  handleRefresh,
  handleCreateRole,
  handleViewRoles,
  handleViewPermissions,
  handleViewRole,
  handleEditRole,

  clearMessage,
}) {
  const shouldShowPagination = filteredRolesCount > pageSize;

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
              <Shield className="size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Access Control & Security Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted pl-0.5">
            Configure workspace security roles, govern permission catalogs, and manage operational authorities.
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
            onClick={handleViewPermissions}
            startIcon={<FileKey className="size-3.5 text-text-muted" />}
          >
            Permission Catalog
          </UIButton>

          <UIButton
            variant="primary"
            size="sm"
            onClick={handleCreateRole}
            startIcon={<Plus className="size-4" />}
          >
            Create Role
          </UIButton>
        </div>
      </div>

      {/* 2. Top Metric Stat Capsules */}
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

      {/* 3. Core Modules Fast-Nav Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Module 1: Roles */}
        <div
          onClick={handleViewRoles}
          className="bg-surface rounded-2xl p-5 border border-border/60 shadow-2xs hover:border-primary/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-text-inverse transition-colors">
                <Shield className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                  Role Management
                </h3>
                <span className="text-[11px] text-text-muted">
                  {totalRolesCount} configured roles in workspace
                </span>
              </div>
            </div>

            <ArrowRight className="size-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Create customized security roles, adjust feature permissions, and allocate access across your team.
          </p>
        </div>

        {/* Module 2: Permissions */}
        <div
          onClick={handleViewPermissions}
          className="bg-surface rounded-2xl p-5 border border-border/60 shadow-2xs hover:border-primary/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileKey className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text group-hover:text-purple-600 transition-colors">
                  Permission Matrix
                </h3>
                <span className="text-[11px] text-text-muted">
                  {permissions.length} total system capability keys
                </span>
              </div>
            </div>

            <ArrowRight className="size-4 text-text-muted group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Explore granular capability keys across inventory, sales, POS checkouts, reports, and governance.
          </p>
        </div>
      </div>

      {/* 4. Active Roles Table (Sorted by Highest Members First) */}
      <div className="bg-surface rounded-2xl border border-border/60 shadow-2xs overflow-hidden space-y-0">
        {/* Table Top Toolbar */}
        <div className="p-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-text">Configured Roles Directory</h2>
            <span className="text-xs text-text-muted">
              Ranked by total assigned staff members
            </span>
          </div>

          <div className="w-full sm:w-64">
            <UISearchInput
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              size="sm"
            />
          </div>
        </div>

        {/* Table Content */}
        {isLoading && roles.length === 0 ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <UISkeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : paginatedRoles.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <UITable>
                <UITableHeader>
                  <UITableRow className="bg-surface-alt/50">
                    <UITableHead className="min-w-[200px]">Role Name & Code</UITableHead>
                    <UITableHead className="min-w-[140px]">Tier & Scope</UITableHead>
                    <UITableHead className="min-w-[130px]">Assigned Members</UITableHead>
                    <UITableHead className="min-w-[140px]">Permissions</UITableHead>
                    <UITableHead className="min-w-[100px]">Status</UITableHead>
                    <UITableHead className="text-right min-w-[140px]">Actions</UITableHead>
                  </UITableRow>
                </UITableHeader>

                <UITableBody>
                  {paginatedRoles.map((role) => {
                    const isSystem = Boolean(role.isSystem);
                    const canEdit = role.isEditable !== false && !isSystem;
                    const permCount = role.permissionCount || (role.permissions?.length ?? 0);
                    const memberCount = role.membersCount ?? 0;

                    return (
                      <UITableRow key={role._id} className="hover:bg-surface-alt/30 transition-colors">
                        {/* Role Name */}
                        <UITableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                              <Shield className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs text-text truncate">
                                  {role.name}
                                </span>
                                {isSystem && (
                                  <Lock className="size-3 text-text-muted shrink-0" />
                                )}
                              </div>
                              <span className="text-[10.5px] font-mono text-text-muted block">
                                {role.code}
                              </span>
                            </div>
                          </div>
                        </UITableCell>

                        {/* Scope */}
                        <UITableCell>
                          <UIBadge
                            variant="soft"
                            color={isSystem ? "primary" : "neutral"}
                            size="xs"
                          >
                            {isSystem ? "Organization" : "Workspace"}
                          </UIBadge>
                        </UITableCell>

                        {/* Member Count Pill */}
                        <UITableCell>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 font-mono">
                            <Users className="size-3" />
                            <span>{memberCount} {memberCount === 1 ? "Member" : "Members"}</span>
                          </span>
                        </UITableCell>

                        {/* Permissions */}
                        <UITableCell>
                          <span className="text-xs font-mono font-medium text-text">
                            {permCount} capabilities
                          </span>
                        </UITableCell>

                        {/* Status */}
                        <UITableCell>
                          <UIBadge
                            variant="soft"
                            color={role.status === "active" ? "success" : "neutral"}
                            size="xs"
                          >
                            {role.status || "active"}
                          </UIBadge>
                        </UITableCell>

                        {/* Actions */}
                        <UITableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <UIButton
                              variant="ghost"
                              size="xs"
                              onClick={() => handleViewRole(role._id)}
                              startIcon={<Eye className="size-3" />}
                            >
                              View
                            </UIButton>

                            {canEdit && (
                              <UIButton
                                variant="outline"
                                size="xs"
                                onClick={() => handleEditRole(role._id)}
                                startIcon={<Edit2 className="size-3" />}
                              >
                                Edit
                              </UIButton>
                            )}
                          </div>
                        </UITableCell>
                      </UITableRow>
                    );
                  })}
                </UITableBody>
              </UITable>
            </div>

            {/* Pagination Controls (Hidden if not enough rows per user requirement) */}
            {shouldShowPagination && (
              <div className="p-3 border-t border-border/40 flex items-center justify-between">
                <div className="text-xs text-text-muted">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredRolesCount)} of{" "}
                  {filteredRolesCount} roles
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
              icon={<Shield className="size-10 text-text-muted/60" />}
              title="No Roles Found"
              description="No roles match your search query."
              action={
                search ? (
                  <UIButton variant="outline" size="sm" onClick={() => setSearch("")}>
                    Clear Search
                  </UIButton>
                ) : null
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
