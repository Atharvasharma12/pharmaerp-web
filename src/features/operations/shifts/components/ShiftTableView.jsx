// src/features/operations/shifts/components/ShiftTableView.jsx

import React from "react";
import {
  Clock,
  Info,
  LockKeyhole,
  AlertTriangle,
} from "lucide-react";
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableRow,
  UITableHead,
  UITableCell,
  UIBadge,
  UIIconButton,
  UIButton,
} from "@/components/ui";

const getFallbackShiftName = (s) => {
  if (s?.shiftName) return s.shiftName;
  const hour = new Date(s?.openedAt || s?.createdAt || new Date()).getHours();
  if (hour < 12) return "Morning Shift";
  if (hour < 17) return "Afternoon Shift";
  if (hour < 20) return "Evening Shift";
  return "Night Shift";
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeRange = (openedAt, closedAt) => {
  const openStr = openedAt
    ? new Date(openedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  if (!closedAt) return `${openStr} → Open`;
  const closeStr = new Date(closedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${openStr} → ${closeStr}`;
};

export const ShiftTableView = ({
  shifts = [],
  onView,
  onCloseShift,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <UITable>
          <UITableHeader>
            <UITableRow className="bg-surface-alt/60">
              <UITableHead className="min-w-[220px]">Shift Details</UITableHead>
              <UITableHead className="min-w-[180px]">Date & Timing</UITableHead>
              <UITableHead className="min-w-[150px]">Opened By</UITableHead>
              <UITableHead className="min-w-[120px] text-right">Opening Float</UITableHead>
              <UITableHead className="min-w-[140px] text-right">Closing Cash</UITableHead>
              <UITableHead className="min-w-[110px]">Status</UITableHead>
              <UITableHead className="w-28 text-right">Actions</UITableHead>
            </UITableRow>
          </UITableHeader>

          <UITableBody>
            {shifts.map((shift) => {
              const shiftTitle = getFallbackShiftName(shift);
              const shiftNo = shift.shiftNo || "N/A";
              const openedByStaff =
                shift.openedBy?.fullName ||
                shift.openedBy?.name ||
                shift.openedBy?.email ||
                "System";
              const isOpen = shift.status === "open";
              const isClosed = shift.status === "closed";

              return (
                <UITableRow
                  key={shift._id}
                  onClick={() => onView?.(shift)}
                  className={`cursor-pointer transition-colors ${
                    isOpen
                      ? "bg-emerald-500/[0.06] hover:bg-emerald-500/[0.1] border-l-4 border-l-emerald-500 font-medium"
                      : "hover:bg-surface-hover/60"
                  }`}
                >
                  {/* Shift Details */}
                  <UITableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs uppercase border ${
                          isOpen
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 ring-2 ring-emerald-500/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-text text-[13.5px] truncate">
                            {shiftTitle}
                          </p>
                          {isOpen && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              ACTIVE
                            </span>
                          )}
                          {shift.isAdjusted && isClosed && (
                            <span
                              title="Shift Adjusted"
                              className="text-warning flex items-center justify-center bg-warning-soft rounded-full p-0.5 border border-warning/30 shrink-0"
                            >
                              <AlertTriangle className="size-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-text-muted truncate mt-0.5">
                          {shiftNo}
                        </p>
                      </div>
                    </div>
                  </UITableCell>

                  {/* Date & Timing */}
                  <UITableCell>
                    <p className="text-xs font-semibold text-text truncate">
                      {formatDate(shift.date || shift.openedAt)}
                    </p>
                    <p className="text-[11.5px] font-mono text-text-muted truncate mt-0.5">
                      {formatTimeRange(shift.openedAt, shift.closedAt)}
                    </p>
                  </UITableCell>

                  {/* Opened By */}
                  <UITableCell>
                    <p className="text-xs font-semibold text-text truncate" title={openedByStaff}>
                      {openedByStaff}
                    </p>
                  </UITableCell>

                  {/* Opening Float */}
                  <UITableCell className="text-right">
                    <p className="text-xs font-mono font-bold text-text tabular-nums">
                      {formatCurrency(shift.openingFloatAmount)}
                    </p>
                  </UITableCell>

                  {/* Closing Cash */}
                  <UITableCell className="text-right">
                    {isClosed ? (
                      <p className="text-xs font-mono font-bold text-primary tabular-nums">
                        {formatCurrency(shift.actualClosingCashAmount)}
                      </p>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        In Progress
                      </span>
                    )}
                  </UITableCell>

                  {/* Status */}
                  <UITableCell>
                    <UIBadge
                      variant="soft"
                      color={isOpen ? "success" : isClosed ? "neutral" : "error"}
                      className={`text-xs capitalize font-bold ${
                        isOpen ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : ""
                      }`}
                    >
                      {shift.status || "open"}
                    </UIBadge>
                  </UITableCell>

                  {/* Actions: Direct "i" button and Lock icon button */}
                  <UITableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5 shrink-0">
                      <UIIconButton
                        variant="ghost"
                        size="sm"
                        aria-label="View Shift Details"
                        title="View Shift Details"
                        onClick={() => onView?.(shift)}
                        className="h-8 w-8 text-text-muted hover:text-primary hover:bg-primary/10 shrink-0"
                      >
                        <Info className="h-4 w-4" />
                      </UIIconButton>

                      {isOpen && (
                        <UIIconButton
                          variant="ghost"
                          size="sm"
                          aria-label="Lock Shift"
                          title="Lock Shift"
                          onClick={() => onCloseShift?.(shift)}
                          className="h-8 w-8 text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 rounded-lg shrink-0 transition-colors"
                        >
                          <LockKeyhole className="h-4 w-4" />
                        </UIIconButton>
                      )}
                    </div>
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

export default ShiftTableView;
