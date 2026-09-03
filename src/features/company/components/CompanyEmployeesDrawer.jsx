// src/features/company/components/CompanyEmployeesDrawer.jsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  Crown,
  Mail,
  Phone,
  Building2,
  RefreshCw,
  Globe,
  Lock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  UIDrawer,
  UISearchInput,
  UIBadge,
  UIButton,
  UIEmptyState,
  UISkeleton,
} from "@/components/ui";
import useCompany from "../hooks/useCompany";

export const CompanyEmployeesDrawer = ({
  isOpen,
  onClose,
  company,
}) => {
  const navigate = useNavigate();
  const { companyEmployees, getCompanyEmployees } = useCompany();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterScope, setFilterScope] = useState("all"); // "all" | "full" | "scoped"
  const [loading, setLoading] = useState(false);

  const companyId = company?._id;
  const employees = companyEmployees?.[companyId] || [];

  const fetchEmployees = useCallback(() => {
    if (!companyId) return;
    setLoading(true);
    getCompanyEmployees(companyId)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [companyId, getCompanyEmployees]);

  useEffect(() => {
    if (isOpen && companyId) {
      fetchEmployees();
    }
  }, [isOpen, companyId, fetchEmployees]);

  // Metric counts
  const stats = useMemo(() => {
    const total = employees.length;
    const full = employees.filter((e) => e.accessAllCompanies || e.isOwner).length;
    const scoped = total - full;
    return { total, full, scoped };
  }, [employees]);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();

    return employees.filter((emp) => {
      const name = (
        emp?.displayName ||
        emp?.userId?.name ||
        emp?.userId?.fullName ||
        emp?.user?.name ||
        emp?.name ||
        ""
      ).toLowerCase();

      const email = (
        emp?.displayEmail ||
        emp?.userId?.email ||
        emp?.user?.email ||
        emp?.email ||
        ""
      ).toLowerCase();

      const phone = (
        emp?.displayPhone ||
        emp?.userId?.phone ||
        emp?.user?.phone ||
        ""
      ).toLowerCase();

      const role = (
        emp?.roleName ||
        emp?.workspaceMemberId?.roleId?.name ||
        emp?.role?.name ||
        emp?.role ||
        ""
      ).toLowerCase();

      const matchesSearch =
        !q || name.includes(q) || email.includes(q) || phone.includes(q) || role.includes(q);

      if (!matchesSearch) return false;

      if (filterScope === "full") {
        return Boolean(emp.accessAllCompanies || emp.isOwner);
      }
      if (filterScope === "scoped") {
        return !emp.accessAllCompanies && !emp.isOwner;
      }

      return true;
    });
  }, [employees, searchQuery, filterScope]);

  const handleManageAccess = () => {
    onClose?.();
    navigate("/access-control/member-access");
  };

  const handleMemberClick = (emp) => {
    const memberId =
      emp?.workspaceMemberId?._id ||
      emp?.workspaceMemberId ||
      emp?.userId?._id ||
      emp?.userId ||
      emp?._id ||
      emp?.id;

    if (!memberId) return;
    onClose?.();
    navigate(`/members/${memberId}`);
  };

  const companyTitle = company?.displayName || company?.name || "Company Profile";

  return (
    <UIDrawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
      title={companyTitle}
      description={`Active staff members and workspace credentials with access to this company.`}
      badge={
        <UIBadge variant="soft" color="primary" size="sm" className="font-mono tabular-nums">
          {stats.total} {stats.total === 1 ? "Member" : "Members"}
        </UIBadge>
      }
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <UIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchEmployees}
            disabled={loading}
            startIcon={
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            }
            className="text-text-muted hover:text-text h-8 px-2.5 text-xs whitespace-nowrap shrink-0"
          >
            Sync
          </UIButton>

          <div className="flex items-center gap-2 shrink-0">
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 px-3 text-xs whitespace-nowrap"
            >
              Done
            </UIButton>
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleManageAccess}
              endIcon={<ExternalLink className="size-3.5" />}
              className="h-8 px-3 text-xs font-medium whitespace-nowrap"
            >
              Manage Access
            </UIButton>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5">
        {/* Search & Filter Toolbar */}
        <div className="space-y-2">
          <UISearchInput
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="w-full"
          />

          {/* Scope Filters */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => setFilterScope("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                filterScope === "all"
                  ? "bg-primary text-primary-contrast"
                  : "bg-surface-alt text-text-muted hover:text-text hover:bg-surface-hover"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterScope("full")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                filterScope === "full"
                  ? "bg-primary text-primary-contrast"
                  : "bg-surface-alt text-text-muted hover:text-text hover:bg-surface-hover"
              }`}
            >
              Full Access ({stats.full})
            </button>
            <button
              type="button"
              onClick={() => setFilterScope("scoped")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                filterScope === "scoped"
                  ? "bg-primary text-primary-contrast"
                  : "bg-surface-alt text-text-muted hover:text-text hover:bg-surface-hover"
              }`}
            >
              Scoped ({stats.scoped})
            </button>
          </div>
        </div>

        {/* Member List Content */}
        {loading && employees.length === 0 ? (
          <div className="space-y-2 pt-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface"
              >
                <UISkeleton variant="avatar" size="sm" className="rounded-lg" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <UISkeleton variant="text" width="45%" height={14} />
                  <UISkeleton variant="text" width="65%" height={10} />
                </div>
                <UISkeleton variant="badge" width={60} height={18} />
              </div>
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <UIEmptyState
            icon={<Users className="size-8 text-text-muted" />}
            title={searchQuery ? "No matching members" : "No members assigned"}
            description={
              searchQuery
                ? "Try searching with different keywords."
                : "Assign members to this company in Workspace Access Control."
            }
            action={
              searchQuery ? (
                <UIButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterScope("all");
                  }}
                  className="mt-1.5 text-xs h-7"
                >
                  Clear Filter
                </UIButton>
              ) : (
                <UIButton
                  variant="primary"
                  size="sm"
                  onClick={handleManageAccess}
                  className="mt-1.5 text-xs h-8 gap-1.5"
                >
                  <span>Assign Members</span>
                  <ExternalLink className="size-3" />
                </UIButton>
              )
            }
          />
        ) : (
          <div className="space-y-2 pt-1">
            {filteredEmployees.map((emp, idx) => {
              const name =
                emp?.displayName ||
                emp?.userId?.name ||
                emp?.userId?.fullName ||
                emp?.user?.name ||
                emp?.name ||
                `Member #${idx + 1}`;

              const email =
                emp?.displayEmail ||
                emp?.userId?.email ||
                emp?.user?.email ||
                emp?.email ||
                "-";

              const roleName =
                emp?.roleName ||
                emp?.workspaceMemberId?.roleId?.name ||
                emp?.role?.name ||
                emp?.role ||
                "Staff Member";

              const isOwner = Boolean(emp?.isOwner || emp?.workspaceMemberId?.isOwner);
              const isAllCompanies = Boolean(emp?.accessAllCompanies || isOwner);
              const status = emp?.status || emp?.workspaceMemberId?.status || "active";

              const initials = name
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U";

              return (
                <div
                  key={emp._id || emp.id || idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleMemberClick(emp)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleMemberClick(emp);
                    }
                  }}
                  className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface hover:border-primary/40 hover:bg-surface-hover/80 hover:shadow-2xs transition-all cursor-pointer select-none active:scale-[0.99]"
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className={`flex size-9 items-center justify-center rounded-lg font-bold text-xs text-white ${
                          isOwner
                            ? "bg-gradient-to-br from-amber-500 to-orange-600"
                            : "bg-gradient-to-br from-primary to-primary-hover"
                        }`}
                      >
                        {initials}
                      </div>
                      {/* Active indicator dot */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface ${
                          status === "active" ? "bg-emerald-500" : "bg-neutral-400"
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-text truncate group-hover:text-primary transition-colors">
                          {name}
                        </span>
                        {isOwner && (
                          <Crown className="size-3 text-amber-500 shrink-0 fill-amber-500/20" />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted truncate mt-0.5">
                        <Mail className="size-3 shrink-0 opacity-70" />
                        <span className="truncate">{email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges, Scope & Chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <UIBadge
                        variant="soft"
                        color={isOwner ? "warning" : "primary"}
                        size="sm"
                        className="text-[10px] font-semibold py-0 px-1.5"
                      >
                        {roleName}
                      </UIBadge>

                      <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                        {isAllCompanies ? (
                          <>
                            <Globe className="size-2.5 text-primary" />
                            <span>All Companies</span>
                          </>
                        ) : (
                          <>
                            <Lock className="size-2.5 text-text-muted" />
                            <span>Scoped</span>
                          </>
                        )}
                      </span>
                    </div>

                    <ChevronRight className="size-4 text-text-muted/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UIDrawer>
  );
};

export default CompanyEmployeesDrawer;
