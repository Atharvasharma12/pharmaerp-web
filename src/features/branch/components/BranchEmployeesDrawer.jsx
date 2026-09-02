// src/features/branch/components/BranchEmployeesDrawer.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  Search,
  ExternalLink,
  UserCheck,
  UserX,
  Mail,
  GitBranch,
  RefreshCw,
} from "lucide-react";
import {
  UIDrawer,
  UISearchInput,
  UIBadge,
  UIButton,
  UIEmptyState,
  UISkeleton,
} from "@/components/ui";
import useBranch from "../hooks/useBranch";

export const BranchEmployeesDrawer = ({
  isOpen,
  onClose,
  branch,
}) => {
  const navigate = useNavigate();
  const { branchEmployees, getBranchEmployees } = useBranch();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const branchId = branch?._id;
  const employees = branchEmployees?.[branchId] || [];

  useEffect(() => {
    if (isOpen && branchId) {
      setLoading(true);
      getBranchEmployees(branchId)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, branchId, getBranchEmployees]);

  const filteredEmployees = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) => {
      const name = (
        emp?.displayName ||
        emp?.user?.name ||
        emp?.name ||
        ""
      ).toLowerCase();
      const email = (
        emp?.displayEmail ||
        emp?.user?.email ||
        emp?.email ||
        ""
      ).toLowerCase();
      const role = (
        emp?.role?.name ||
        emp?.roleName ||
        emp?.role ||
        ""
      ).toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [employees, searchQuery]);

  const handleRefresh = () => {
    if (!branchId) return;
    setLoading(true);
    getBranchEmployees(branchId)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleManageAccess = () => {
    onClose?.();
    navigate("/access-control/member-access");
  };

  return (
    <UIDrawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
      title={branch?.displayName || branch?.name || "Branch Employees"}
      description={`Active team members and operational staff assigned to ${branch?.displayName || "this branch location"}.`}
      badge={
        <UIBadge variant="soft" color="primary" className="font-mono tabular-nums">
          {employees.length} {employees.length === 1 ? "Employee" : "Employees"}
        </UIBadge>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <UIButton
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="text-text-muted hover:text-text gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Access</span>
          </UIButton>

          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Done
            </UIButton>
            <UIButton
              variant="primary"
              size="sm"
              onClick={handleManageAccess}
              className="gap-1.5"
            >
              <span>Manage Access</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </UIButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <UISearchInput
          placeholder="Filter employees by name, email or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />

        {/* Loading shimmer */}
        {loading && employees.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface"
              >
                <UISkeleton variant="avatar" size="md" />
                <div className="flex-1 space-y-1.5">
                  <UISkeleton variant="text" width="60%" height={14} />
                  <UISkeleton variant="text" width="40%" height={11} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <UIEmptyState
            icon={<Users className="w-8 h-8 text-text-muted" />}
            title={searchQuery ? "No matching employees" : "No employees assigned yet"}
            description={
              searchQuery
                ? "Try searching with different keywords."
                : "Assign workspace team members to this branch in Access Control."
            }
            action={
              <UIButton
                variant="primary"
                size="sm"
                onClick={handleManageAccess}
                className="mt-2"
              >
                Assign Employees
              </UIButton>
            }
          />
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl bg-surface overflow-hidden">
            {filteredEmployees.map((emp, idx) => {
              const name =
                emp?.displayName || emp?.user?.name || emp?.name || `Member #${idx + 1}`;
              const email =
                emp?.displayEmail || emp?.user?.email || emp?.email || "No email";
              const roleName =
                emp?.role?.name || emp?.roleName || emp?.role || "Staff Member";
              const status = emp?.status || emp?.user?.status || "active";
              const isAllBranches = Boolean(emp?.accessAllBranches);

              return (
                <div
                  key={emp._id || emp.id || idx}
                  className="p-3.5 flex items-start justify-between gap-3 hover:bg-surface-hover/60 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase border border-primary/20">
                      {name.charAt(0) || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-text truncate">
                        {name}
                      </p>
                      <p className="text-xs text-text-muted truncate flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{email}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <UIBadge variant="soft" color="primary" className="text-[10px] py-0 px-1.5">
                          <Shield className="w-2.5 h-2.5 mr-1" />
                          {roleName}
                        </UIBadge>

                        {isAllBranches ? (
                          <span className="text-[10px] font-medium text-text-muted bg-surface-alt px-1.5 py-0.5 rounded border border-border/60">
                            All Branches
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div>
                    <UIBadge
                      variant="soft"
                      color={status === "active" ? "success" : "neutral"}
                      className="text-[10px] capitalize font-medium"
                    >
                      {status}
                    </UIBadge>
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

export default BranchEmployeesDrawer;
