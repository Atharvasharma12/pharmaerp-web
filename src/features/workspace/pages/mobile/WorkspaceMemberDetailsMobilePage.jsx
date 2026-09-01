// src/features/workspace/pages/mobile/WorkspaceMemberDetailsMobilePage.jsx

import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Key,
  Settings,
  UserCheck,
  UserMinus,
  Building2,
  GitBranch,
  ChevronRight,
  Copy,
  Check,
  Activity,
  Store,
} from "lucide-react";
import {
  UIButton,
  UIBadge,
  UISkeleton,
  uiToast,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export default function WorkspaceMemberDetailsMobilePage({
  member,
  user,
  displayName,
  displayEmail,
  displayPhone,
  displayRole,
  userCode,
  isOwner,
  status,
  joinedDate,
  lastActiveFormatted,
  assignedCompanies = [],
  assignedBranches = [],
  accessSummary,
  isLoading,
  onBack,
  onOpenResetPassword,
  onOpenAssignRole,
  onOpenAccessModal,
  onToggleStatus,
  onRemoveMember,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, activity, access
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key, label) => {
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    uiToast.success("Copied to clipboard", `${label || "Value"} copied.`);
    setTimeout(() => setCopiedKey(null), 2000);
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

  if (isLoading && !member) {
    return (
      <div className="min-h-screen bg-bg text-text p-3 space-y-4 pb-20">
        <div className="flex items-center gap-3">
          <UISkeleton className="h-9 w-9 rounded-lg" />
          <UISkeleton className="h-6 w-36 rounded" />
        </div>
        <UISkeleton className="h-56 rounded-2xl" />
        <UISkeleton className="h-44 rounded-2xl" />
        <UISkeleton className="h-44 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 space-y-3.5 pb-24 max-w-lg mx-auto">
      {/* 1. Top Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <UIButton
            variant="outline"
            size="sm"
            startIcon={<ArrowLeft className="size-4" />}
            onClick={onBack}
            className="min-h-[40px] min-w-[40px] p-0 flex items-center justify-center"
            aria-label="Back to members"
          />
          <div className="min-w-0">
            <h1 className="text-base font-bold text-text truncate">
              {displayName}
            </h1>
            <p className="text-[11px] text-text-muted truncate">
              {displayRole}
            </p>
          </div>
        </div>

        <UIBadge
          variant="soft"
          color={
            status === "active"
              ? "success"
              : status === "suspended"
              ? "error"
              : "warning"
          }
        >
          <span className="capitalize">{status}</span>
        </UIBadge>
      </div>

      {/* 2. Mobile Profile Hero Card */}
      <div className="bg-surface rounded-2xl p-4.5 flex flex-col items-center text-center space-y-3 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
        <div className="relative">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={displayName}
              className="size-20 rounded-full object-cover border-3 border-surface shadow-xs"
            />
          ) : (
            <div className="size-20 rounded-full bg-primary-soft text-primary font-extrabold text-2xl flex items-center justify-center border-3 border-surface shadow-xs select-none">
              {getInitials(displayName)}
            </div>
          )}
          <span
            className={cn(
              "absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-surface ring-2",
              status === "active"
                ? "bg-success ring-success/20"
                : status === "suspended"
                ? "bg-error ring-error/20"
                : "bg-warning ring-warning/20"
            )}
          />
        </div>

        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-text tracking-tight">
            {displayName}
          </h2>
          <p className="text-xs text-text-muted font-medium">
            {displayRole} • Joined {joinedDate}
          </p>
          {userCode && (
            <div className="pt-1">
              <span className="font-mono text-[10.5px] font-semibold tabular-nums text-text-muted bg-surface-alt px-2.5 py-0.5 rounded-full border border-border/40">
                #USR-{userCode}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: 3 Round Buttons */}
        <div className="flex items-center justify-center gap-3 pt-1 w-full">
          <button
            type="button"
            onClick={() => copyToClipboard(displayEmail, "m_email", "Email")}
            className="flex-1 py-2 px-3 rounded-xl bg-surface-alt hover:bg-surface-hover flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border/40 active:scale-95 transition-all min-h-[44px]"
          >
            {copiedKey === "m_email" ? (
              <Check className="size-4 text-success" />
            ) : (
              <Mail className="size-4 text-text-muted" />
            )}
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(displayPhone, "m_phone", "Phone")}
            className="flex-1 py-2 px-3 rounded-xl bg-surface-alt hover:bg-surface-hover flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border/40 active:scale-95 transition-all min-h-[44px]"
          >
            {copiedKey === "m_phone" ? (
              <Check className="size-4 text-success" />
            ) : (
              <Phone className="size-4 text-text-muted" />
            )}
            <span>Call</span>
          </button>

          <button
            type="button"
            onClick={onOpenResetPassword}
            disabled={isOwner}
            className="py-2 px-3 rounded-xl bg-surface-alt hover:bg-surface-hover flex items-center justify-center text-xs font-semibold text-text border border-border/40 active:scale-95 transition-all min-h-[44px] disabled:opacity-40"
            title="Reset Password"
          >
            <Key className="size-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* 3. Segmented Tab Selector */}
      <div className="flex items-center bg-surface-alt p-1 rounded-xl border border-border/40">
        {[
          { key: "overview", label: "Information" },
          { key: "activity", label: "Activity" },
          { key: "access", label: "Stores & Scope" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center min-h-[38px]",
              activeTab === tab.key
                ? "bg-surface text-text shadow-xs"
                : "text-text-muted hover:text-text"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-3.5">
          {/* General Info Card */}
          <div className="bg-surface rounded-2xl p-4 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">
              General & Contact Details
            </h3>
            <div className="space-y-2.5 text-xs divide-y divide-border/30">
              <div className="pt-1 first:pt-0 flex items-center justify-between">
                <span className="text-text-muted">Full Name</span>
                <span className="font-semibold text-text">{displayName}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-text-muted">Email</span>
                <span className="font-medium text-text truncate max-w-[180px]">{displayEmail}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-text-muted">Phone</span>
                <span className="font-mono tabular-nums font-medium text-text">{displayPhone}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-text-muted">Joined Date</span>
                <span className="font-mono tabular-nums font-semibold text-text">{joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Employment & Clearance Card */}
          <div className="bg-surface rounded-2xl p-4 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">
              Employment & Role Scope
            </h3>
            <div className="space-y-2.5 text-xs divide-y divide-border/30">
              <div className="pt-1 first:pt-0 flex items-center justify-between">
                <span className="text-text-muted">Job Role</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text">{displayRole}</span>
                  {!isOwner && (
                    <button
                      type="button"
                      onClick={onOpenAssignRole}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-text-muted">Department</span>
                <span className="font-semibold text-text">
                  {displayRole === "Owner" ? "Leadership" : "Pharmacy Dispensary"}
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-text-muted">Status</span>
                <span className="font-bold capitalize text-success">{status}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-text-muted">Last Active</span>
                <span className="font-mono tabular-nums font-semibold text-text">{lastActiveFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-surface rounded-2xl p-4 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-4">
          <h3 className="text-xs font-bold text-text uppercase tracking-wider">
            Weekly Operational Activity
          </h3>
          <div className="flex items-end justify-between gap-2 h-36 pt-2 pb-2">
            {[
              { day: "Mon", h: 75 },
              { day: "Tue", h: 88 },
              { day: "Wed", h: 100 },
              { day: "Thu", h: 75 },
              { day: "Fri", h: 62 },
              { day: "Sat", h: 38 },
              { day: "Sun", h: 88 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full max-w-[20px] h-full flex items-end justify-center rounded-full bg-surface-alt/70 p-0.5">
                  <div
                    style={{ height: `${bar.h}%` }}
                    className="w-full bg-primary rounded-full"
                  />
                </div>
                <span className="text-[10px] font-medium text-text-muted">{bar.day}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-text-muted pt-2 border-t border-border/30 text-center">
            Average 6.2 daily operational sessions logged.
          </p>
        </div>
      )}

      {activeTab === "access" && (
        <div className="space-y-3.5">
          <div className="bg-surface rounded-2xl p-4 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                Store Facility Clearance
              </h3>
              <UIButton
                variant="outline"
                size="xs"
                onClick={onOpenAccessModal}
                disabled={isOwner}
              >
                Edit
              </UIButton>
            </div>

            <div className="bg-surface-alt/70 rounded-xl p-3 border border-border/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text">
                  {assignedCompanies[0]?.name || "Central Pharmacy Store"}
                </span>
                <span className="size-2 rounded-full bg-success" />
              </div>
              <p className="text-[11px] text-text-muted">
                {assignedBranches[0]?.name || "Main Dispensary & Store Branch"}
              </p>
              <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: isOwner || accessSummary?.isAllCompanies ? "100%" : "75%" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Fixed Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-surface/90 backdrop-blur-md border-t border-border/60 z-40 flex items-center gap-2 max-w-lg mx-auto">
        <UIButton
          variant="primary"
          size="md"
          className="flex-1 justify-center min-h-[44px] font-semibold"
          onClick={onOpenAccessModal}
          disabled={isOwner}
        >
          Manage Access
        </UIButton>

        {status === "active" ? (
          <UIButton
            variant="outline"
            size="md"
            className="min-h-[44px]"
            onClick={() => onToggleStatus("inactive")}
            disabled={isOwner}
          >
            Deactivate
          </UIButton>
        ) : (
          <UIButton
            variant="outline"
            size="md"
            className="min-h-[44px]"
            onClick={() => onToggleStatus("active")}
            disabled={isOwner}
          >
            Activate
          </UIButton>
        )}

        <UIButton
          variant="destructive"
          size="md"
          className="min-h-[44px] px-3"
          onClick={onRemoveMember}
          disabled={isOwner}
          aria-label="Remove member"
        >
          <UserMinus className="size-4" />
        </UIButton>
      </div>
    </div>
  );
}
