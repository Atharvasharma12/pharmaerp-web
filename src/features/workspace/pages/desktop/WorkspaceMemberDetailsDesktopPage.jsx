// src/features/workspace/pages/desktop/WorkspaceMemberDetailsDesktopPage.jsx

import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Key,
  MapPin,
  UserCheck,
  UserMinus,
  Building2,
  GitBranch,
  Settings,
  ChevronRight,
  Copy,
  Check,
  Activity,
  MoreVertical,
  Store,
  FileText,
  Lock,
} from "lucide-react";
import {
  UIButton,
  UIIconButton,
  UIBadge,
  UISkeleton,
  uiToast,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export default function WorkspaceMemberDetailsDesktopPage({
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
  const [activeChartTab, setActiveChartTab] = useState("Weekly");
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

  // Mocked activity data for Weekly, Monthly, Daily view
  const activityData = {
    Weekly: [
      { day: "Mon", value: 6, max: 8, label: "6 Operations" },
      { day: "Tues", value: 7, max: 8, label: "7 Operations" },
      { day: "Wed", value: 8, max: 8, label: "8 Operations" },
      { day: "Thu", value: 6, max: 8, label: "6 Operations" },
      { day: "Fri", value: 5, max: 8, label: "5 Operations" },
      { day: "Sat", value: 3, max: 8, label: "3 Operations" },
      { day: "Sun", value: 7, max: 8, label: "7 Operations" },
    ],
    Monthly: [
      { day: "W1", value: 32, max: 40, label: "32 Operations" },
      { day: "W2", value: 38, max: 40, label: "38 Operations" },
      { day: "W3", value: 27, max: 40, label: "27 Operations" },
      { day: "W4", value: 36, max: 40, label: "36 Operations" },
    ],
    Daily: [
      { day: "09:00", value: 4, max: 10, label: "4 Dispenses" },
      { day: "12:00", value: 9, max: 10, label: "9 Dispenses" },
      { day: "15:00", value: 7, max: 10, label: "7 Dispenses" },
      { day: "18:00", value: 10, max: 10, label: "10 Dispenses" },
      { day: "21:00", value: 5, max: 10, label: "5 Dispenses" },
    ],
  };

  const currentBars = activityData[activeChartTab] || activityData.Weekly;

  if (isLoading && !member) {
    return (
      <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-5 max-w-[1440px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <UISkeleton className="h-8 w-48 rounded-lg" />
          <UISkeleton className="h-8 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4 space-y-4">
            <UISkeleton className="h-64 rounded-2xl" />
            <UISkeleton className="h-32 rounded-2xl" />
            <UISkeleton className="h-40 rounded-2xl" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <UISkeleton className="h-52 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <UISkeleton className="lg:col-span-7 h-72 rounded-2xl" />
              <UISkeleton className="lg:col-span-5 h-72 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-5 max-w-[1440px] mx-auto space-y-4">
      {/* 1. Page Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-0.5">
        <div className="flex items-center gap-3">
          <UIButton
            variant="outline"
            size="sm"
            startIcon={<ArrowLeft className="size-4" />}
            onClick={onBack}
          >
            Back
          </UIButton>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-2xl font-extrabold text-text tracking-tight">
              {displayName}
            </h1>
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
        </div>

        {/* Action Buttons Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <UIButton
            variant="outline"
            size="sm"
            startIcon={<Key className="size-3.5 text-text-muted" />}
            onClick={onOpenResetPassword}
            disabled={isOwner}
          >
            Reset Password
          </UIButton>

          <UIButton
            variant="outline"
            size="sm"
            startIcon={<Shield className="size-3.5 text-text-muted" />}
            onClick={onOpenAssignRole}
            disabled={isOwner}
          >
            Change Role
          </UIButton>

          <UIButton
            variant="outline"
            size="sm"
            startIcon={<Settings className="size-3.5 text-text-muted" />}
            onClick={onOpenAccessModal}
            disabled={isOwner}
          >
            Manage Access
          </UIButton>

          {status === "active" ? (
            <UIButton
              variant="outline"
              size="sm"
              startIcon={<Clock className="size-3.5 text-warning" />}
              onClick={() => onToggleStatus("inactive")}
              disabled={isOwner}
            >
              Deactivate
            </UIButton>
          ) : (
            <UIButton
              variant="outline"
              size="sm"
              startIcon={<UserCheck className="size-3.5 text-success" />}
              onClick={() => onToggleStatus("active")}
              disabled={isOwner}
            >
              Activate
            </UIButton>
          )}

          <UIButton
            variant="destructive"
            size="sm"
            startIcon={<UserMinus className="size-3.5" />}
            onClick={onRemoveMember}
            disabled={isOwner}
          >
            Remove
          </UIButton>
        </div>
      </div>

      {/* 2. Main Dual-Column Blueprint Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Profile Identity, Quick Actions, Contact & Hierarchy (~32%) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Avatar & Identity Summary */}
          <div className="bg-surface rounded-2xl p-5 flex flex-col items-center text-center space-y-3.5 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
            {/* Centered Large Circular Avatar */}
            <div className="relative">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={displayName}
                  className="size-24 rounded-full object-cover border-4 border-surface shadow-sm"
                />
              ) : (
                <div className="size-24 rounded-full bg-primary-soft text-primary font-extrabold text-3xl flex items-center justify-center border-4 border-surface shadow-sm select-none">
                  {getInitials(displayName)}
                </div>
              )}
              <span
                className={cn(
                  "absolute bottom-1 right-1 size-4 rounded-full border-2 border-surface ring-2",
                  status === "active"
                    ? "bg-success ring-success/20"
                    : status === "suspended"
                    ? "bg-error ring-error/20"
                    : "bg-warning ring-warning/20"
                )}
                title={`Status: ${status}`}
              />
            </div>

            {/* Name & Role Designation */}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-text tracking-tight">
                {displayName}
              </h2>
              <p className="text-xs text-text-muted font-medium">
                {displayRole}
              </p>
              {userCode && (
                <div className="pt-0.5">
                  <span className="inline-block font-mono text-[11px] font-semibold tabular-nums text-text-muted bg-surface-alt px-2.5 py-0.5 rounded-full border border-border/40">
                    #USR-{userCode}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Icons: Email, Phone, Security */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => copyToClipboard(displayEmail, "email", "Email")}
                className="size-10 rounded-xl bg-surface-alt hover:bg-surface-hover transition-all flex items-center justify-center text-text-muted hover:text-text cursor-pointer border border-border/40 active:scale-95"
                title={`Copy Email: ${displayEmail}`}
              >
                {copiedKey === "email" ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Mail className="size-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(displayPhone, "phone", "Phone")}
                className="size-10 rounded-xl bg-surface-alt hover:bg-surface-hover transition-all flex items-center justify-center text-text-muted hover:text-text cursor-pointer border border-border/40 active:scale-95"
                title={`Copy Phone: ${displayPhone}`}
              >
                {copiedKey === "phone" ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Phone className="size-4" />
                )}
              </button>

              <button
                type="button"
                onClick={onOpenResetPassword}
                disabled={isOwner}
                className="size-10 rounded-xl bg-surface-alt hover:bg-surface-hover transition-all flex items-center justify-center text-text-muted hover:text-text cursor-pointer border border-border/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reset Password / PIN"
              >
                <Key className="size-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Organization & Hierarchy Navigation */}
          <div className="bg-surface rounded-2xl p-4 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] divide-y divide-border/30">
            <div className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">
                  Department
                </span>
                <span className="font-semibold text-text mt-0.5 block">
                  {displayRole === "Owner" ? "Executive Leadership" : "Pharmacy Dispensary"}
                </span>
              </div>
              <ChevronRight className="size-4 text-text-muted/60" />
            </div>

            <div className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">
                  Supervisor / Lead
                </span>
                <span className="font-semibold text-text mt-0.5 block">
                  {isOwner ? "Workspace Lead (Self)" : "Workspace Owner"}
                </span>
              </div>
              <ChevronRight className="size-4 text-text-muted/60" />
            </div>
          </div>

          {/* Card 3: Contact Information Card */}
          <div className="bg-surface rounded-2xl p-4.5 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">
              Contact Information
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] text-text-muted block">Email</span>
                  <span className="font-medium text-text block truncate mt-0.5">
                    {displayEmail}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(displayEmail, "c_email", "Email")}
                  className="text-text-muted hover:text-text p-1 rounded-md hover:bg-surface-alt transition-colors"
                  title="Copy email"
                >
                  {copiedKey === "c_email" ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-start justify-between gap-2 pt-2 border-t border-border/30">
                <div>
                  <span className="text-[11px] text-text-muted block">Phone</span>
                  <span className="font-mono tabular-nums font-medium text-text block mt-0.5">
                    {displayPhone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(displayPhone, "c_phone", "Phone")}
                  className="text-text-muted hover:text-text p-1 rounded-md hover:bg-surface-alt transition-colors"
                  title="Copy phone"
                >
                  {copiedKey === "c_phone" ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-border/30">
                <span className="text-[11px] text-text-muted block">User Code</span>
                <span className="font-mono tabular-nums font-semibold text-text block mt-0.5">
                  #USR-{userCode || "849201"}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Full Width Edit / Access CTA */}
          <UIButton
            variant="primary"
            size="md"
            className="w-full justify-center shadow-xs py-2.5 font-semibold"
            onClick={onOpenAccessModal}
            disabled={isOwner}
          >
            Manage Access & Stores
          </UIButton>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: 3-Col Staff Info + Activity Chart + Store Facilities (~68%) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-4 lg:space-y-5">
          {/* Top Card: Staff & Member Information (3-Column Grid) */}
          <div className="bg-surface rounded-2xl p-5 sm:p-6 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-4">
            <h2 className="text-base font-bold text-text tracking-tight">
              Staff & Member Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6 pt-2 border-t border-border/30">
              {/* Column 1: General Information */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  General Information
                </span>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-[11px] text-text-muted block">Full Name</span>
                    <span className="font-semibold text-text block mt-0.5">
                      {displayName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">User Code</span>
                    <span className="font-mono tabular-nums font-semibold text-text block mt-0.5">
                      #USR-{userCode || "849201"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Email</span>
                    <span className="font-medium text-text block truncate mt-0.5">
                      {displayEmail}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Joined Date</span>
                    <span className="font-mono tabular-nums font-semibold text-text block mt-0.5">
                      {joinedDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Phone</span>
                    <span className="font-mono tabular-nums font-semibold text-text block mt-0.5">
                      {displayPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: Employment & Clearance Details */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  Employment & Clearance
                </span>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-text-muted block">Job Role</span>
                      <span className="font-semibold text-text block mt-0.5">
                        {displayRole}
                      </span>
                    </div>
                    {!isOwner && (
                      <UIButton
                        variant="ghost"
                        size="xs"
                        onClick={onOpenAssignRole}
                        className="text-primary hover:text-primary-hover font-semibold"
                      >
                        Change
                      </UIButton>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Department</span>
                    <span className="font-semibold text-text block mt-0.5">
                      {displayRole === "Owner" ? "Administration" : "Pharmacy Operations"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Start Date</span>
                    <span className="font-mono tabular-nums font-semibold text-text block mt-0.5">
                      {joinedDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Tenure / Duration</span>
                    <span className="font-mono tabular-nums font-semibold text-text block mt-0.5">
                      Active Member
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Account Status</span>
                    <span
                      className={cn(
                        "font-bold capitalize flex items-center gap-1.5 mt-0.5",
                        status === "active"
                          ? "text-success"
                          : status === "suspended"
                          ? "text-error"
                          : "text-warning"
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          status === "active"
                            ? "bg-success"
                            : status === "suspended"
                            ? "bg-error"
                            : "bg-warning"
                        )}
                      />
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 3: Facility & Security Clearance */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  Facility & Security Scope
                </span>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-[11px] text-text-muted block">Company Clearance</span>
                    <span className="font-semibold text-text block mt-0.5">
                      {accessSummary?.companyLabel || "All Companies"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Branch Clearance</span>
                    <span className="font-semibold text-text block mt-0.5">
                      {accessSummary?.branchLabel || "All Branches"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Marketplace Access</span>
                    <span className="font-semibold text-text block mt-0.5">
                      {isOwner ? "Full Administrator" : "Standard Terminal"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Security Status</span>
                    <span className="font-semibold text-success block mt-0.5">
                      PIN & Password Active
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">Last Active Session</span>
                    <span className="font-mono tabular-nums font-semibold text-text block mt-0.5">
                      {lastActiveFormatted}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area: Activity Chart (Left ~60%) + Store Assignments (Right ~40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
            {/* Activity Chart Container */}
            <div className="lg:col-span-7 bg-surface rounded-2xl p-5 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] flex flex-col justify-between space-y-4">
              {/* Header with Title & Segmented Period Switcher */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text tracking-tight flex items-center gap-2">
                  Activity Chart
                </h3>

                <div className="flex items-center gap-1 bg-surface-alt p-1 rounded-xl border border-border/40">
                  {["Monthly", "Weekly", "Daily"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveChartTab(tab)}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer",
                        activeChartTab === tab
                          ? "bg-primary text-primary-contrast shadow-xs"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Visualizer with Y-Axis and Vertical Capsule Bars */}
              <div className="pt-2">
                <div className="flex items-end gap-3 h-44 w-full">
                  {/* Y-Axis Scale (08 to 00) */}
                  <div className="flex flex-col justify-between h-full text-[10px] font-mono tabular-nums text-text-muted pb-6 shrink-0 select-none">
                    <span>08</span>
                    <span>06</span>
                    <span>04</span>
                    <span>02</span>
                    <span>00</span>
                  </div>

                  {/* Bars Strip */}
                  <div className="flex-1 grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 items-end h-full">
                    {currentBars.map((item, idx) => {
                      const heightPercent = Math.min(100, Math.max(15, (item.value / item.max) * 100));
                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                        >
                          {/* Bar Container */}
                          <div className="w-full max-w-[28px] h-full flex items-end justify-center rounded-full bg-surface-alt/70 p-1 relative">
                            {/* Hover Tooltip */}
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-text text-bg text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-20">
                              {item.label}
                            </div>

                            {/* Animated Value Capsule Bar */}
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={cn(
                                "w-full rounded-full transition-all duration-500 ease-out shadow-xs",
                                idx % 2 === 0
                                  ? "bg-gradient-to-t from-primary to-primary-hover"
                                  : "bg-gradient-to-t from-primary/80 to-primary"
                              )}
                            />
                          </div>

                          {/* Day Label */}
                          <span className="text-[11px] font-medium text-text-muted group-hover:text-text transition-colors">
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chart Footnote */}
              <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-text-muted">
                <span>Weekly Operational Log Activity</span>
                <span className="font-mono font-semibold tabular-nums text-text">
                  Average 6.2 daily actions
                </span>
              </div>
            </div>

            {/* Assigned Store Facilities / Projects Card */}
            <div className="lg:col-span-5 bg-surface rounded-2xl p-5 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] flex flex-col justify-between space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text tracking-tight">
                  Assigned Store Facilities
                </h3>
                <UIButton
                  variant="ghost"
                  size="xs"
                  onClick={onOpenAccessModal}
                  disabled={isOwner}
                >
                  Edit
                </UIButton>
              </div>

              {/* Main Ongoing Store Card */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  Active Facility Deployment
                </span>

                <div className="bg-surface-alt/70 rounded-xl p-3.5 border border-border/40 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-text">
                        {assignedCompanies[0]?.name || "Central Pharmacy Store"}
                      </h4>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {assignedBranches[0]?.name || "Main Dispensary & Inventory"}
                      </p>
                    </div>
                    <span className="size-2 rounded-full bg-success ring-2 ring-success/20 shrink-0 mt-1" />
                  </div>

                  {/* Progress / Status Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-text-muted">Store Clearance</span>
                      <span className="font-mono font-bold tabular-nums text-primary">
                        {isOwner || accessSummary?.isAllCompanies ? "100%" : "Authorized"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{
                          width: isOwner || accessSummary?.isAllCompanies ? "100%" : "75%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Overlapping Coworker Avatar Stack */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center -space-x-2">
                      <div className="size-6 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center border-2 border-surface">
                        RD
                      </div>
                      <div className="size-6 rounded-full bg-success/20 text-success font-bold text-[10px] flex items-center justify-center border-2 border-surface">
                        JB
                      </div>
                      <div className="size-6 rounded-full bg-warning/20 text-warning font-bold text-[10px] flex items-center justify-center border-2 border-surface">
                        +2
                      </div>
                    </div>
                    <span className="text-[10.5px] text-text-muted">
                      Active Shift Team
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Assigned List Preview */}
              <div className="pt-2 border-t border-border/30 space-y-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  Authorized Facilities ({assignedCompanies.length || 1})
                </span>

                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {assignedCompanies.length > 0 ? (
                    assignedCompanies.slice(0, 2).map((c) => (
                      <div
                        key={c._id}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-surface-alt/40"
                      >
                        <span className="font-medium text-text truncate">
                          {c.name}
                        </span>
                        <UIBadge variant="soft" color="primary" size="xs">
                          Store
                        </UIBadge>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-text-muted">
                      All workspace stores authorized.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
