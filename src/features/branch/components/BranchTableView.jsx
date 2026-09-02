// src/features/branch/components/BranchTableView.jsx

import React from "react";
import {
  GitBranch,
  Users,
  MoreHorizontal,
  Eye,
  Edit3,
  Settings,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableRow,
  UITableHead,
  UITableCell,
  UIBadge,
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
  UIIconButton,
} from "@/components/ui";

const STATUS_COLOR_MAP = {
  active: "success",
  inactive: "neutral",
  suspended: "error",
};

const formatMemberCount = (branch) => {
  const count = branch?.memberCount ?? branch?.staffCount ?? branch?.membersCount ?? 0;
  return `${count} ${count === 1 ? "Member" : "Members"}`;
};

const formatLocation = (branch) => {
  if (branch?.locationSummary) return branch.locationSummary;
  const parts = [
    branch?.address?.addressLine1 || branch?.addressLine1,
    branch?.address?.city || branch?.city,
    branch?.address?.state || branch?.state,
  ].filter(Boolean);
  if (parts.length) return parts.join(", ");
  return branch?.address?.city || branch?.city || "India";
};

export const BranchTableView = ({
  branches = [],
  onView,
  onEdit,
  onSettings,
  onViewEmployees,
  onDelete,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto rounded-2xl">
        <UITable>
          <UITableHeader>
            <UITableRow className="bg-surface-alt/60">
              <UITableHead className="min-w-[240px]">Branch</UITableHead>
              <UITableHead className="min-w-[130px]">Type / Business</UITableHead>
              <UITableHead className="min-w-[160px]">Manager / Pharmacist</UITableHead>
              <UITableHead className="min-w-[150px]">Location</UITableHead>
              <UITableHead className="min-w-[120px] text-center">Members Access</UITableHead>
              <UITableHead className="min-w-[100px]">Status</UITableHead>
              <UITableHead className="w-16 text-right">Actions</UITableHead>
            </UITableRow>
          </UITableHeader>

          <UITableBody>
            {branches.map((branch) => {
              const name = branch.displayName || branch.name || "Untitled Branch";
              const type = branch.type || "Dispensary";
              const email = branch.email || branch.contactEmail;
              const phone = branch.phones?.mobile || branch.phone;
              const manager =
                branch.displayManager ||
                branch.pharmacist?.name ||
                branch.manager?.name ||
                "-";
              const location = formatLocation(branch);
              const memberCountText = formatMemberCount(branch);
              const status = branch.displayStatus || branch.status || "active";

              return (
                <UITableRow
                  key={branch._id}
                  onClick={() => onView?.(branch)}
                  className="cursor-pointer hover:bg-surface-hover/60 transition-colors"
                >
                  {/* Branch Name & Logo */}
                  <UITableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase border border-primary/20">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text text-[13.5px] truncate">
                          {name}
                        </p>
                        {email && (
                          <p className="text-xs text-text-muted truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{email}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </UITableCell>

                  {/* Type / Business */}
                  <UITableCell>
                    <UIBadge variant="soft" color="primary" className="text-xs font-semibold capitalize">
                      {type}
                    </UIBadge>
                  </UITableCell>

                  {/* Manager / Pharmacist */}
                  <UITableCell>
                    <p className="text-xs font-semibold text-text truncate">
                      {manager}
                    </p>
                    {phone && (
                      <p className="text-[11.5px] text-text-muted truncate flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="font-mono tabular-nums">{phone}</span>
                      </p>
                    )}
                  </UITableCell>

                  {/* Location */}
                  <UITableCell>
                    <p className="text-xs text-text truncate flex items-center gap-1" title={location}>
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                      <span className="truncate">{location}</span>
                    </p>
                  </UITableCell>

                  {/* Members Access */}
                  <UITableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onViewEmployees?.(branch)}
                      title="Click to view employees in this branch"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/15 text-primary text-xs font-bold font-mono tabular-nums transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{memberCountText}</span>
                    </button>
                  </UITableCell>

                  {/* Status */}
                  <UITableCell>
                    <UIBadge
                      variant="soft"
                      color={STATUS_COLOR_MAP[status] || "neutral"}
                      className="text-xs capitalize font-semibold"
                    >
                      {status}
                    </UIBadge>
                  </UITableCell>

                  {/* Actions */}
                  <UITableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <UIDropdown align="right" usePortal={true}>
                      <UIDropdownTrigger asChild>
                        <UIIconButton
                          variant="ghost"
                          size="sm"
                          aria-label="Row actions"
                          className="h-8 w-8 text-text-muted hover:text-text hover:bg-surface-hover"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </UIIconButton>
                      </UIDropdownTrigger>

                      <UIDropdownMenu width="w-48">
                        <UIDropdownItem
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => onView?.(branch)}
                        >
                          View Details
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Edit3 className="w-4 h-4" />}
                          onClick={() => onEdit?.(branch)}
                        >
                          Edit Branch
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Users className="w-4 h-4" />}
                          onClick={() => onViewEmployees?.(branch)}
                        >
                          Staff & Access
                        </UIDropdownItem>
                        <UIDropdownItem
                          icon={<Settings className="w-4 h-4" />}
                          onClick={() => onSettings?.(branch)}
                        >
                          Module Settings
                        </UIDropdownItem>
                        <UIDropdownDivider />
                        <UIDropdownItem
                          destructive
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => onDelete?.(branch)}
                        >
                          Delete Branch
                        </UIDropdownItem>
                      </UIDropdownMenu>
                    </UIDropdown>
                  </UITableCell>
                </UITableRow>
              );
            })}
          </UITableBody>
        </UITable>
      </div>
    </div>
  );
};

export default BranchTableView;
