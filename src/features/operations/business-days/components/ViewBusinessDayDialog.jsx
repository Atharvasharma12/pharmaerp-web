// src/features/operations/business-days/components/ViewBusinessDayDialog.jsx

import React, { useEffect, useState } from "react";
import { apiClient } from "@/services";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIBadge,
} from "@/components/ui";
import {
  CalendarDays,
  Clock,
  ArrowLeftRight,
  BarChart3,
  UploadCloud,
  Eye,
  CheckCircle2,
  XCircle,
  User,
  Activity,
  Layers,
} from "lucide-react";
import { ShiftFundTransferPanel } from "../../shifts/components/ShiftFundTransferPanel";
import { ViewShiftDialog } from "../../shifts/components/ViewShiftDialog";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "shifts", label: "Shifts", icon: Clock },
  { id: "transfers", label: "Fund Transfers", icon: ArrowLeftRight },
];

const InfoRow = ({ label, value, mono = false, color = "" }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0 text-xs">
    <span className="text-text-muted font-medium">{label}</span>
    <span className={`font-bold ${mono ? "font-mono" : ""} ${color}`}>{value}</span>
  </div>
);

const StatCard = ({ label, value, sub, icon: Icon, colorClass }) => (
  <div className={`rounded-xl p-3 border shadow-2xs ${colorClass}`}>
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">
      {Icon && <Icon className="size-3.5" />}
      {label}
    </div>
    <p className="font-mono font-black text-xl">{value}</p>
    {sub && <p className="text-[10px] opacity-70 mt-0.5">{sub}</p>}
  </div>
);

export const ViewBusinessDayDialog = ({ isOpen, onClose, businessDay }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewShift, setViewShift] = useState(null);

  useEffect(() => {
    if (isOpen && businessDay?._id) {
      setLoading(true);
      setActiveTab("overview");
      apiClient
        .get(`/operations/business-days/${businessDay._id}/summary`)
        .then((res) => setSummary(res.data?.data || res.data))
        .catch(() => setSummary(null))
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
    }
  }, [isOpen, businessDay]);

  if (!businessDay) return null;

  const bd = summary || businessDay;
  const isClosed = bd.status === "closed";
  const isOpen_ = bd.status === "open";

  const displayDate = bd.businessDate
    ? new Date(bd.businessDate).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const openedAt = bd.actualOpenedAt
    ? new Date(bd.actualOpenedAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const closedAt = bd.actualClosedAt
    ? new Date(bd.actualClosedAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const shifts = bd.shifts || [];

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Hero Session Card */}
      <div
        className={`rounded-xl border p-4 shadow-2xs ${
          isOpen_
            ? "bg-emerald-500/5 border-emerald-500/20"
            : isClosed
            ? "bg-surface-alt/60 border-border/80"
            : "bg-rose-500/5 border-rose-500/20"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
              Business Day Session
            </span>
            <p className="font-mono font-black text-xl text-text mt-0.5">
              {bd.businessDayNo || "—"}
            </p>
            <p className="text-xs font-medium text-text-muted mt-0.5">{displayDate}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <UIBadge
              variant="soft"
              color={isOpen_ ? "success" : isClosed ? "neutral" : "error"}
              className="text-[10px] font-bold uppercase py-0.5 px-2.5"
            >
              {bd.status?.toUpperCase()}
            </UIBadge>
            {isOpen_ && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Live Session
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Card */}
      <div className="bg-surface-alt/60 border border-border/80 rounded-xl overflow-hidden p-3.5 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block border-b border-border/60 pb-1.5 mb-1">
          Session Audit Trail
        </span>
        <InfoRow label="Opened At" value={openedAt} />
        <InfoRow
          label="Closed At"
          value={closedAt || (isOpen_ ? "Session active" : "—")}
          color={closedAt ? "" : isOpen_ ? "text-emerald-600 dark:text-emerald-400" : ""}
        />
        <InfoRow label="Created By" value={bd.createdBy?.fullName || bd.createdBy?.name || "System"} />
        {bd.closedBy && (
          <InfoRow label="Closed By" value={bd.closedBy?.fullName || bd.closedBy?.name || "—"} />
        )}
      </div>

      {/* Shifts Breakdown Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard
          label="Total Shifts"
          value={shifts.length}
          sub="this session"
          icon={Clock}
          colorClass="bg-surface-alt/60 border-border/80 text-text"
        />
        <StatCard
          label="Completed"
          value={shifts.filter((s) => s.status === "closed").length}
          icon={CheckCircle2}
          colorClass="bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Active Shifts"
          value={shifts.filter((s) => s.status === "open").length}
          icon={XCircle}
          colorClass="bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400"
        />
      </div>

      {bd.note && (
        <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            {isClosed ? "Closing Note" : "Session Note"}
          </span>
          <p className="text-xs text-text">{bd.note}</p>
        </div>
      )}
    </div>
  );

  const renderShifts = () => (
    <div className="space-y-2.5">
      {shifts.length === 0 ? (
        <div className="py-12 text-center text-text-muted text-xs bg-surface-alt/40 border border-border/60 rounded-xl">
          No shifts have been opened under this session yet.
        </div>
      ) : (
        [...shifts].reverse().map((shift, i) => {
          const openT = shift.openedAt
            ? new Date(shift.openedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—";
          const closeT = shift.closedAt
            ? new Date(shift.closedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;
          return (
            <div
              key={shift._id || i}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl border transition-all duration-150 ${
                shift.status === "open"
                  ? "bg-emerald-500/5 border-emerald-500/20 shadow-2xs"
                  : "bg-surface-alt/50 border-border/70 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    shift.status === "open"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-surface border border-border/60 text-text-muted"
                  }`}
                >
                  <Clock className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xs text-text truncate">
                      {shift.shiftName || `Shift ${shifts.length - i}`}
                    </p>
                    <span className="font-mono text-[10px] text-text-muted font-semibold">
                      {shift.shiftNo}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted font-mono mt-0.5">
                    {openT} {closeT ? `→ ${closeT}` : "→ Ongoing"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <UIBadge
                  variant="soft"
                  color={shift.status === "open" ? "success" : "neutral"}
                  className="text-[10px] font-bold uppercase py-0 px-2"
                >
                  {shift.status?.toUpperCase()}
                </UIBadge>

                <button
                  type="button"
                  onClick={() => setViewShift(shift)}
                  className="p-1.5 rounded-lg bg-surface border border-border/80 text-text-muted hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
                  title="View Shift Details"
                >
                  <Eye className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderTransfers = () => {
    const bankSlips = bd.bankSlips || [];
    const hasAnyTransfers =
      bd.withdrawals?.length > 0 ||
      bd.deposits?.length > 0 ||
      bankSlips.length > 0;

    return (
      <div className="space-y-3.5">
        {!hasAnyTransfers ? (
          <div className="py-12 text-center text-text-muted text-xs bg-surface-alt/40 border border-border/60 rounded-xl">
            No fund transfers or bank deposit slips recorded for this session.
          </div>
        ) : (
          <>
            {(bd.withdrawals?.length > 0 || bd.deposits?.length > 0) && (
              <div className="border border-border/80 rounded-xl p-3.5 bg-surface-alt/50 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <ArrowLeftRight className="size-3.5 text-primary" />
                  Branch Cash Movements
                </span>
                <ShiftFundTransferPanel
                  withdrawals={bd.withdrawals || []}
                  deposits={bd.deposits || []}
                  totalWithdrawals={bd.totalWithdrawals || 0}
                  totalDeposits={bd.totalDeposits || 0}
                />
              </div>
            )}

            {bankSlips.length > 0 && (
              <div className="border border-border/80 rounded-xl p-3.5 bg-surface-alt/50 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <UploadCloud className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Bank Deposit Slips ({bankSlips.length})
                </span>
                <div className="space-y-1.5">
                  {bankSlips.map((slip) => (
                    <div
                      key={slip._id}
                      className="flex justify-between items-center bg-surface border border-border/60 rounded-lg p-2.5 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-text font-mono">
                            {slip.slipNumber || "N/A"}
                          </p>
                          <UIBadge variant="soft" color="success" className="text-[10px] uppercase font-bold py-0 px-1.5">
                            {slip.status}
                          </UIBadge>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-text">
                        ₹{fmt(slip.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="lg">
        <UIModalHeader>
          <UIModalTitle>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <CalendarDays className="h-5.5 w-5.5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-text tracking-tight font-mono">
                    {bd.businessDayNo || "Business Session"}
                  </h3>
                  <UIBadge
                    variant="soft"
                    color={isOpen_ ? "success" : isClosed ? "neutral" : "error"}
                    className="text-[10px] font-bold uppercase py-0 px-2"
                  >
                    {bd.status?.toUpperCase()}
                  </UIBadge>
                </div>
                <p className="text-xs font-medium text-text-muted mt-0.5">
                  {displayDate}
                </p>
              </div>
            </div>
          </UIModalTitle>
        </UIModalHeader>

        <UIModalBody className="max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-text-muted space-y-2">
              <div className="size-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium">Loading session analytics...</p>
            </div>
          ) : (
            <div className="space-y-4 py-1">
              {/* Segmented Tab Bar */}
              <div className="flex items-center gap-1 p-1 bg-surface-alt/80 border border-border/70 rounded-xl overflow-x-auto">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-1 cursor-pointer ${
                      activeTab === id
                        ? "bg-surface text-primary shadow-2xs border border-border/80"
                        : "text-text-muted hover:text-text hover:bg-surface/50"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Body */}
              <div className="min-h-[260px] pt-1">
                {activeTab === "overview" && renderOverview()}
                {activeTab === "shifts" && renderShifts()}
                {activeTab === "transfers" && renderTransfers()}
              </div>
            </div>
          )}
        </UIModalBody>

        <UIModalFooter>
          <UIButton variant="ghost" onClick={onClose}>
            Close
          </UIButton>
        </UIModalFooter>
      </UIModal>

      {/* Shift details overlay */}
      {viewShift && (
        <ViewShiftDialog
          isOpen={!!viewShift}
          onClose={() => setViewShift(null)}
          shift={viewShift}
        />
      )}
    </>
  );
};

export default ViewBusinessDayDialog;
