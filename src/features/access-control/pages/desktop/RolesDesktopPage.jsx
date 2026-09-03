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

import { TopBarStats } from "@/layouts/app/components/header";
import { RolesTableView } from "@/features/access-control/components";

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
  UIModal,
  UIModalBody,
  UIFilterToolbar,
  UI_TOOLBAR_VIEWS,
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

  viewMode,
  onViewModeChange,

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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-0 max-w-[1440px] mx-auto space-y-2.5">
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

      <TopBarStats stats={stats} />

      {/* Action Toolbar */}
      <UIFilterToolbar
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        onSearchClear={() => handleSearchChange({ target: { value: "" } })}
        searchPlaceholder="Search roles by title, code or permissions..."
        showViewSwitcher={true}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        activeFilterChips={activeFilterChips}
        onClearFilters={handleClearFilters}
        filters={
          <UIButton
            variant="outline"
            size="sm"
            startIcon={<Sliders className="size-4" />}
            onClick={() => setIsFilterModalOpen(true)}
            className={cn(
              "w-10 px-0 sm:w-auto sm:px-3 justify-center",
              (filters.status !== "all" || filters.type !== "all") &&
                "border-primary/50 text-primary bg-primary/5",
            )}
          >
            <span className="hidden sm:inline">Filter</span>
          </UIButton>
        }
        actions={
          <div className="flex items-center gap-2 shrink-0 border-l border-border pl-2 ml-1">
            <UIIconButton
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-text h-9 w-9"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh"
            >
              <RotateCcw
                className={`size-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </UIIconButton>

            <UIButton
              variant="outline"
              size="sm"
              onClick={handleExportRoles}
              startIcon={<Download className="size-4" />}
            >
              Export
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
          </div>
        }
      />

      {/* Filter Modal */}
      <UIModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Roles"
        className="overflow-visible"
      >
        <UIModalBody className="space-y-4 overflow-visible p-4">
          <UISelect
            label="Role Status"
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            options={statusOptions}
          />
          <UISelect
            label="Role Type"
            value={filters.type}
            onChange={(e) => handleFilterChange({ type: e.target.value })}
            options={typeOptions}
          />
          {(filters.status !== "all" || filters.type !== "all") && (
            <UIButton
              variant="ghost"
              className="w-full mt-2"
              onClick={() => {
                handleFilterChange({ status: "all", type: "all" });
                setIsFilterModalOpen(false);
              }}
            >
              Clear Filters
            </UIButton>
          )}
        </UIModalBody>
      </UIModal>

      {/* 3. Main Role Cards Grid (Crafted 2-Column Blueprint Layout) */}
      {isLoading ? (
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
        <>
          {viewMode === UI_TOOLBAR_VIEWS.LIST ? (
            <RolesTableView
              roles={roles}
              onViewRole={handleViewRole}
              onEditRole={handleEditRole}
              onDeleteRole={handleDeleteRole}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => {
                const isSystem = Boolean(role.isSystem);
                const memberCount = role.membersCount || 0;
                const permissionCount =
                  role.permissionCount || role.permissions?.length || 0;

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
                            <span>
                              Scope: {isSystem ? "Organization" : "Workspace"}
                            </span>
                            <span>•</span>
                            <span>{permissionCount} Permissions</span>
                            {role.displayStatus === "inactive" && (
                              <>
                                <span>•</span>
                                <span className="text-warning font-semibold">
                                  Inactive
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Member Count Pill Capsule (matches design image) */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-alt border border-border/50 text-text-muted shadow-2xs inline-flex items-center gap-1.5">
                            <Users className="size-3 text-text-muted/80" />
                            <span>
                              {memberCount}{" "}
                              {memberCount === 1 ? "Member" : "Members"}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Role Description */}
                      <p className="text-xs text-text-muted mt-3 leading-relaxed line-clamp-2 min-h-[36px]">
                        {role.displayDescription ||
                          "Full access to manage members, billing, and organization-wide settings."}
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
                          {role.canEdit
                            ? `Edit ${role.displayName.split(" ")[0]}`
                            : "Locked Role"}
                        </UIButton>

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

              {/* "Create New Role" Dashed Placeholder Card */}
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
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-surface rounded-2xl p-8 border border-border/60 shadow-2xs text-center space-y-3">
          <UIEmptyState
            icon={<Shield className="size-10 text-text-muted/60" />}
            title="No Roles Found"
            description={
              filters.search ||
              filters.status !== "all" ||
              filters.type !== "all"
                ? "No roles match your current search and filter criteria. Try resetting filters."
                : "No custom roles created yet in this workspace."
            }
            action={
              filters.search ||
              filters.status !== "all" ||
              filters.type !== "all" ? (
                <UIButton
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Reset Filters
                </UIButton>
              ) : (
                <UIButton
                  variant="primary"
                  size="sm"
                  onClick={handleCreateRole}
                  startIcon={<Plus className="size-4" />}
                >
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
