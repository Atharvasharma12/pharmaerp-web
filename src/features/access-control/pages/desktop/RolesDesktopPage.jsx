// src/features/access-control/pages/desktop/RolesDesktopPage.jsx

import React, { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  RotateCcw,
  Download,
  MoreHorizontal,
  ExternalLink,
  Edit2,
  Trash2,
  Users,
  Lock,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileKey,
  Layers,
} from "lucide-react";

import {
  UIButton,
  UIIconButton,
  UISearchInput,
  UISelect,
  UIBadge,
  UISkeleton,
  UIEmptyState,
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
  UIAlert,
  PermissionGate,
} from "@/components/ui";
import { usePermission } from "@/hooks";
import { cn } from "@/lib/utils";

export default function RolesDesktopPage({
  roles = [],
  stats = [],
  roleHelp,

  filters = { search: "", status: "all", type: "all" },
  activeFilterChips = [],
  statusOptions = [],
  typeOptions = [],

  isLoading = false,
  hasError = false,
  error = null,
  message = null,

  totalRoles = 0,
  filteredRolesCount = 0,
  hasRoles = false,
  hasFilteredRoles = false,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleBackToAccessControl,
  handleCreateRole,
  handleViewPermissions,
  handleExportRoles,
  handleViewRole,
  handleEditRole,
  handleDeleteRole,

  clearMessage,
}) {
  const { can } = usePermission();
  const [activeMenuRoleId, setActiveMenuRoleId] = useState(null);

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

      {/* 1. Header Banner Card (matches user reference image) */}
      <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border/60 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Shield className="size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Roles & Permissions
            </h1>
            <UIBadge variant="soft" color="primary" size="sm">
              {totalRoles} {totalRoles === 1 ? "Role" : "Roles"}
            </UIBadge>
          </div>
          <p className="text-xs sm:text-sm text-text-muted pl-0.5">
            Review your members roles and allocate permissions across workspace facilities.
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
            startIcon={<FileKey className="size-4 text-primary" />}
          >
            Permission Catalog
          </UIButton>

          <PermissionGate permission="role:create">
            <UIButton
              variant="primary"
              size="sm"
              onClick={handleCreateRole}
              startIcon={<Plus className="size-4" />}
            >
              Create Role
            </UIButton>
          </PermissionGate>

          <UIDropdown>
            <UIDropdownTrigger asChild>
              <UIIconButton variant="outline" size="sm" aria-label="More options">
                <MoreHorizontal className="size-4 text-text-muted" />
              </UIIconButton>
            </UIDropdownTrigger>
            <UIDropdownMenu align="end" className="w-52">
              <UIDropdownItem
                icon={<FileKey className="size-4" />}
                onClick={handleViewPermissions}
              >
                View Permissions Matrix
              </UIDropdownItem>
              <UIDropdownItem
                icon={<Download className="size-4" />}
                onClick={handleExportRoles}
              >
                Export Roles CSV
              </UIDropdownItem>
              {can("role:create") && (
                <>
                  <UIDropdownDivider />
                  <UIDropdownItem
                    icon={<Plus className="size-4 text-primary" />}
                    onClick={handleCreateRole}
                    className="text-primary font-medium"
                  >
                    Create New Role
                  </UIDropdownItem>
                </>
              )}
            </UIDropdownMenu>
          </UIDropdown>
        </div>
      </div>

      {/* 2. Filter, Search & Quick Metric Strip */}
      <div className="bg-surface rounded-2xl p-3 sm:p-4 border border-border/60 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <UISearchInput
              placeholder="Search roles by title, code or permissions..."
              value={filters.search}
              onChange={handleSearchChange}
              onClear={() => handleSearchChange({ target: { value: "" } })}
              size="sm"
            />
          </div>

          {/* Filter Selects & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-36 sm:w-40">
              <UISelect
                size="sm"
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                options={statusOptions}
              />
            </div>

            <div className="w-36 sm:w-40">
              <UISelect
                size="sm"
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value })}
                options={typeOptions}
              />
            </div>

            {(filters.search || filters.status !== "all" || filters.type !== "all") && (
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

        {/* Active Filter Chips */}
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

      {/* 3. Main Role Cards Grid (Crafted 2-Column Blueprint Layout) */}
      {isLoading && !hasRoles ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl p-5 border border-border/60 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1.5 flex-1">
                  <UISkeleton className="h-5 w-40 rounded" />
                  <UISkeleton className="h-3 w-28 rounded" />
                </div>
                <UISkeleton className="h-6 w-20 rounded-full" />
              </div>
              <UISkeleton className="h-10 w-full rounded" />
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <UISkeleton className="h-8 w-24 rounded-lg" />
                <UISkeleton className="h-8 w-32 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : hasFilteredRoles ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const isSystem = Boolean(role.isSystem);
            const memberCount = role.membersCount || 0;
            const permissionCount = role.permissionCount || (role.permissions?.length || 0);

            return (
              <div
                key={role._id}
                className="bg-surface rounded-2xl p-5 sm:p-5.5 border border-border/60 shadow-2xs hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Header: Title & Member Count Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-text group-hover:text-primary transition-colors truncate">
                          {role.displayName}
                        </h3>
                        {isSystem ? (
                          <span
                            title="System Protected Role"
                            className="inline-flex items-center text-text-muted/70 hover:text-text-muted"
                          >
                            <Lock className="size-3.5 shrink-0" />
                          </span>
                        ) : null}
                      </div>

                      {/* Scope & Metadata Tag */}
                      <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-text-muted font-medium flex-wrap">
                        <span>Scope: {isSystem ? "Organization" : "Workspace"}</span>
                        <span>•</span>
                        <span>{permissionCount} Permissions</span>
                        {role.displayStatus === "inactive" && (
                          <>
                            <span>•</span>
                            <span className="text-warning font-semibold">Inactive</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Member Count Pill Capsule (matches design image) */}
                    <div className="shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-alt border border-border/50 text-text-muted shadow-2xs inline-flex items-center gap-1.5">
                        <Users className="size-3 text-text-muted/80" />
                        <span>{memberCount} {memberCount === 1 ? "Member" : "Members"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Role Description */}
                  <p className="text-xs text-text-muted mt-3 leading-relaxed line-clamp-2 min-h-[36px]">
                    {role.displayDescription || "Full access to manage members, billing, and organization-wide settings."}
                  </p>
                </div>

                {/* Card Footer: Action Buttons (matches design image) */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-border/40">
                  <UIButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewRole(role)}
                    className="text-xs font-medium"
                  >
                    View Role
                  </UIButton>

                  <div className="flex items-center gap-1.5">
                    {can("role:update") && (
                      <UIButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                        disabled={!role.canEdit}
                        className={cn(
                          "text-xs font-semibold",
                          role.canEdit
                            ? "text-primary hover:text-primary-hover hover:border-primary/40 hover:bg-primary/5"
                            : "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {role.canEdit ? `Edit ${role.displayName.split(" ")[0]}` : "Locked Role"}
                      </UIButton>
                    )}

                    {can("role:delete") && role.canDelete && (
                      <UIDropdown>
                        <UIDropdownTrigger asChild>
                          <UIIconButton
                            variant="ghost"
                            size="sm"
                            aria-label="More role actions"
                          >
                            <MoreHorizontal className="size-3.5 text-text-muted" />
                          </UIIconButton>
                        </UIDropdownTrigger>
                        <UIDropdownMenu align="end" className="w-44">
                          <UIDropdownItem
                            icon={<Edit2 className="size-3.5" />}
                            onClick={() => handleEditRole(role)}
                          >
                            Edit Permissions
                          </UIDropdownItem>
                          <UIDropdownDivider />
                          <UIDropdownItem
                            icon={<Trash2 className="size-3.5 text-destructive" />}
                            onClick={() => handleDeleteRole(role)}
                            className="text-destructive font-medium focus:text-destructive"
                          >
                            Delete Role
                          </UIDropdownItem>
                        </UIDropdownMenu>
                      </UIDropdown>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 4. "Create New Role" Dashed Placeholder Card (matches design image) */}
          <div
            onClick={handleCreateRole}
            className="border-2 border-dashed border-border/80 hover:border-primary/60 bg-surface/30 hover:bg-surface/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 transition-all min-h-[185px] cursor-pointer group shadow-2xs select-none"
          >
            <div className="size-11 rounded-full bg-surface-alt group-hover:bg-primary/10 border border-border/60 group-hover:border-primary/30 flex items-center justify-center text-text-muted group-hover:text-primary transition-all duration-200">
              <Plus className="size-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-text group-hover:text-primary transition-colors">
              Create New Role
            </span>
            <span className="text-[11px] text-text-muted text-center max-w-[220px]">
              Define custom permissions, facility limits, and access scopes
            </span>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface rounded-2xl p-8 border border-border/60 shadow-2xs text-center space-y-3">
          <UIEmptyState
            icon={<Shield className="size-10 text-text-muted/60" />}
            title="No Roles Found"
            description={
              filters.search || filters.status !== "all" || filters.type !== "all"
                ? "No roles match your current search and filter criteria. Try resetting filters."
                : "No custom roles created yet in this workspace."
            }
            action={
              filters.search || filters.status !== "all" || filters.type !== "all" ? (
                <UIButton variant="outline" size="sm" onClick={handleClearFilters}>
                  Reset Filters
                </UIButton>
              ) : (
                <UIButton variant="primary" size="sm" onClick={handleCreateRole} startIcon={<Plus className="size-4" />}>
                  Create First Role
                </UIButton>
              )
            }
          />
        </div>
      )}
    </div>
  );
}
