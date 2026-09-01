// src/features/access-control/pages/mobile/AccessControlMobilePage.jsx

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
} from "lucide-react";

import {
  UIButton,
  UIIconButton,
  UISearchInput,
  UIBadge,
  UIEmptyState,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export default function AccessControlMobilePage({
  stats = [],
  roles = [],
  paginatedRoles = [],
  permissions = [],

  search = "",
  setSearch,

  isLoading = false,
  hasError = false,
  error = null,

  handleRefresh,
  handleCreateRole,
  handleViewRoles,
  handleViewPermissions,
  handleViewRole,
  handleEditRole,
}) {
  return (
    <div className="min-h-screen bg-bg text-text p-3 pb-24 space-y-3.5">
      {/* Header */}
      <div className="bg-surface rounded-2xl p-4 border border-border/60 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Shield className="size-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text">Access Control</h1>
            <span className="text-[11px] text-text-muted">Security Hub</span>
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
            size="xs"
            onClick={handleCreateRole}
            startIcon={<Plus className="size-3" />}
          >
            New
          </UIButton>
        </div>
      </div>

      {/* Stats 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-surface rounded-2xl p-3 border border-border/60 shadow-2xs space-y-0.5"
          >
            <span className="text-[11px] text-text-muted font-medium block">
              {stat.title}
            </span>
            <span className="text-lg font-bold text-text font-mono block">
              {stat.value}
            </span>
            <span className="text-[10px] text-text-muted block">
              {stat.description}
            </span>
          </div>
        ))}
      </div>

      {/* Nav Cards */}
      <div className="space-y-2">
        <div
          onClick={handleViewRoles}
          className="bg-surface rounded-2xl p-3.5 border border-border/60 shadow-2xs flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="size-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-text block">Manage Roles</span>
              <span className="text-[10.5px] text-text-muted block">
                {roles.length} Roles configured
              </span>
            </div>
          </div>
          <ArrowRight className="size-3.5 text-text-muted" />
        </div>

        <div
          onClick={handleViewPermissions}
          className="bg-surface rounded-2xl p-3.5 border border-border/60 shadow-2xs flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
              <FileKey className="size-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-text block">Permission Catalog</span>
              <span className="text-[10.5px] text-text-muted block">
                {permissions.length} System capabilities
              </span>
            </div>
          </div>
          <ArrowRight className="size-3.5 text-text-muted" />
        </div>
      </div>

      {/* Roles List */}
      <div className="bg-surface rounded-2xl p-4 border border-border/60 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-text uppercase tracking-wider">
              Roles Directory
            </h2>
            <span className="text-[10.5px] text-text-muted">
              Highest assigned members first
            </span>
          </div>
        </div>

        <UISearchInput
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          size="sm"
        />

        <div className="space-y-2">
          {roles.map((role) => {
            const isSystem = Boolean(role.isSystem);
            const canEdit = role.isEditable !== false && !isSystem;
            const memberCount = role.membersCount ?? 0;

            return (
              <div
                key={role._id}
                className="p-3 rounded-xl border border-border/60 bg-surface-alt/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-text truncate">
                      {role.name}
                    </span>
                    {isSystem && <Lock className="size-3 text-text-muted" />}
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-primary/10 text-primary border border-primary/20 font-mono">
                    {memberCount} {memberCount === 1 ? "Member" : "Members"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/30">
                  <span className="font-mono">{role.permissions?.length || 0} permissions</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewRole(role._id)}
                      className="text-primary font-semibold hover:underline"
                    >
                      View
                    </button>
                    {canEdit && (
                      <>
                        <span className="text-border">|</span>
                        <button
                          type="button"
                          onClick={() => handleEditRole(role._id)}
                          className="text-text font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
