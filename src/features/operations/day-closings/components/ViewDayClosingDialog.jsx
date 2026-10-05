import React, { useEffect, useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import {
  IndianRupee, QrCode, FileText, Eye, ArrowLeftRight,
  Banknote, Snowflake, TrendingUp, TrendingDown, Minus,
  Clock, ChevronRight, Building2
} from "lucide-react";
import { apiClient } from "@/services";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

const StatusBadge = ({ status }) => {
  const cfg = {
    closed: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30",
    draft:  "bg-primary/10 text-primary border-primary/30",
    cancelled: "bg-error-soft text-error border-error/30 dark:bg-error-soft0/10 dark:text-error dark:border-red-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${cfg[status] || cfg.draft}`}>
      {status?.toUpperCase()}
    </span>
  );
};

export const ViewDayClosingDialog = ({ isOpen, onClose, dayClosing }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedShiftForView, setSelectedShiftForView] = useState(null);

  useEffect(() => {
    if (isOpen && dayClosing?._id) {
      setLoading(true);
      setSelectedShiftForView(null);
      apiClient
        .get(`/operations/day-closings/${dayClosing._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
      setSelectedShiftForView(null);
    }
  }, [isOpen, dayClosing]);

  const diff = (summary?.actualClosingCashAmount || 0) - (summary?.expectedClosingCashAmount || 0);

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="xl">
        <UIModalHeader>
          <UIModalTitle>
            <span>Day Closing</span>
            <span className="text-sm font-normal text-text-muted ml-2">· {dayClosing?.dayClosingNo}</span>
          </UIModalTitle>
        </UIModalHeader>

        <UIModalBody className="max-h-[78vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-text-muted">Loading day closing summary…</div>
          ) : !summary ? (
            <div className="py-16 text-center text-text-muted">No summary available.</div>
          ) : (
            <div className="space-y-6">

              {/* ── Header meta ─────────────────────────────────────────────── */}
              <div className="flex flex-wrap gap-4 items-center justify-between bg-surface-secondary rounded-xl border border-border p-4">
                <div className="flex flex-wrap gap-6">
                  {[
                    ["Business Date", new Date(summary.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
                    ["Total Shifts", summary.shifts?.length || 0],
                    ["Processed By", summary.createdBy?.fullName || summary.createdBy?.name || "System"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">{label}</p>
                      <p className="text-sm font-semibold mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                <StatusBadge status={summary.status} />
              </div>

              {/* ── Day Cash Overview ────────────────────────────────────────── */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                  <IndianRupee className="size-3.5" /> Day Cash Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-surface-secondary border border-border rounded-xl p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">Opening Float</p>
                    <p className="font-mono font-bold text-xl mt-1">₹{fmt(summary.openingFloatAmount)}</p>
                  </div>
                  <div className="bg-surface-secondary border border-border rounded-xl p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">Expected Closing</p>
                    <p className="font-mono font-bold text-xl text-primary mt-1">₹{fmt(summary.expectedClosingCashAmount)}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Opening + Sales
                      {(summary.totalManualDeposits || summary.totalDeposits || 0) > 0 && " + Deposits"}
                      {(summary.totalManualWithdrawals || summary.totalWithdrawals || 0) > 0 && " − Withdrawals"}
                    </p>
                  </div>
                  <div className="bg-surface-secondary border border-border rounded-xl p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">Actual Closing</p>
                    <p className="font-mono font-bold text-xl mt-1">
                      {summary.status === "closed" ? `₹${fmt(summary.actualClosingCashAmount)}` : "Pending"}
                    </p>
                  </div>
                  {summary.status === "closed" && (
                    <div className={`border rounded-xl p-3 ${
                      diff === 0
                        ? "bg-success-soft border-success/30"
                        : diff > 0
                        ? "bg-warning-soft border-warning/30"
                        : "bg-error-soft border-error/30"
                    }`}>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">Difference</p>
                      <div className={`flex items-center gap-1 font-mono font-bold text-xl mt-1 ${
                        diff === 0 ? "text-success" : diff > 0 ? "text-warning" : "text-error"
                      }`}>
                        {diff > 0 ? <TrendingUp className="size-4" /> : diff < 0 ? <TrendingDown className="size-4" /> : <Minus className="size-4" />}
                        {diff > 0 ? "+" : ""}₹{fmt(diff)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deposit / Withdrawal impact */}
                {((summary.totalManualDeposits || 0) > 0 || (summary.totalManualWithdrawals || 0) > 0) && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {(summary.totalManualDeposits || 0) > 0 && (
                      <div className="bg-success-soft border border-success/30 rounded-xl p-3">
                        <p className="text-[10px] text-success font-bold uppercase tracking-widest">Manual Deposits</p>
                        <p className="font-mono font-bold text-lg text-success mt-0.5">+₹{fmt(summary.totalManualDeposits)}</p>
                      </div>
                    )}
                    {(summary.totalManualWithdrawals || 0) > 0 && (
                      <div className="bg-error-soft border border-error/30 rounded-xl p-3">
                        <p className="text-[10px] text-error font-bold uppercase tracking-widest">Manual Withdrawals</p>
                        <p className="font-mono font-bold text-lg text-error mt-0.5">−₹{fmt(summary.totalManualWithdrawals)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Per-Shift Cards ──────────────────────────────────────────── */}
              {(summary.cashByShift?.length > 0 || summary.shiftSummaries?.length > 0) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                    <Clock className="size-3.5" /> Shifts This Day ({summary.shifts?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {/* Use cashByShift (new) if available, fallback to shiftSummaries (legacy) */}
                    {(summary.cashByShift?.length > 0 ? summary.cashByShift : summary.shiftSummaries || []).map((s) => {
                      const shiftDiff = (s.actualCash || s.actualClosingCashAmount || 0) - (s.expectedCash || s.expectedClosingCashAmount || 0);
                      return (
                        <div
                          key={s.shiftId || s._id}
                          className="bg-surface border border-border rounded-xl p-3.5 hover:border-primary/30 transition"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-3">
                            <div>
                              <p className="font-semibold text-sm">{s.shiftName || s.shiftNo || "Shift"}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">{s.shiftNo || ""}</p>
                            </div>
                            <UIButton
                              variant="outline"
                              size="xs"
                              onClick={() => setSelectedShiftForView({ _id: s.shiftId || s._id, shiftNo: s.shiftNo })}
                              className="flex items-center gap-1 text-xs h-7 px-2"
                            >
                              <Eye className="size-3" /> View
                            </UIButton>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                            {[
                              ["Opening", fmt(s.openingFloat || s.openingFloatAmount)],
                              ["Cash Sales", fmt(s.cashSales || s.cashNet)],
                              ["Expected", fmt(s.expectedCash || s.expectedClosingCashAmount)],
                              ["Actual", fmt(s.actualCash || s.actualClosingCashAmount)],
                            ].map(([label, val]) => (
                              <div key={label} className="bg-surface-secondary rounded-lg p-2 border border-border">
                                <p className="text-[10px] text-text-muted">{label}</p>
                                <p className="font-mono font-semibold text-sm mt-0.5">₹{val}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Payment Breakdown ────────────────────────────────────────── */}
              {(summary.totalCashNet !== undefined || summary.totalQrNet !== undefined) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                    <QrCode className="size-3.5" /> Payment Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-success-soft border border-success/30 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-success mb-1">
                        <Banknote className="size-3" /> Cash Bills
                      </div>
                      <p className="font-mono font-bold text-xl text-success">₹{fmt(summary.totalCashNet)}</p>
                      <p className="text-[11px] text-success/70 mt-0.5">{summary.totalCashInvoiceCount || 0} bills</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-1">
                        <QrCode className="size-3" /> UPI / QR
                      </div>
                      <p className="font-mono font-bold text-xl text-purple-700 dark:text-purple-400">₹{fmt(summary.totalQrNet)}</p>
                      <p className="text-[11px] text-purple-600/70 mt-0.5">{summary.totalPaymentQrCount || 0} bills</p>
                    </div>
                  </div>
                  {summary.totalNetSales !== undefined && (
                    <div className="mt-2 bg-surface-secondary border border-border rounded-xl p-3 flex justify-between items-center">
                      <p className="text-sm font-semibold">Total Net Sales (All Shifts)</p>
                      <p className="font-mono font-bold text-lg text-primary">₹{fmt(summary.totalNetSales)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Frozen Cash History ──────────────────────────────────────── */}
              {summary.frozenHistory?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                    <Snowflake className="size-3.5" /> Frozen Cash History (Today)
                  </h4>
                  <div className="relative pl-4 border-l-2 border-info/30 space-y-3">
                    {summary.frozenHistory.map((entry, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[1.15rem] top-1 size-3 rounded-full border-2 border-info bg-white dark:bg-surface" />
                        <div className="bg-surface-secondary border border-border rounded-lg px-3 py-2 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-semibold capitalize">{entry.action?.replace("_", " ")}</p>
                            <p className="text-[10px] text-text-muted">{new Date(entry.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {entry.note || ""}</p>
                          </div>
                          <span className={`font-mono font-bold text-sm ${entry.action === "freeze" ? "text-info" : "text-error"}`}>
                            {entry.action === "freeze" ? "+" : "−"}₹{fmt(entry.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Branch Cash Snapshot ─────────────────────────────────────── */}
              {(summary.currentRunningCash !== undefined || summary.currentFrozenCash !== undefined) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                    <Building2 className="size-3.5" /> Current Branch Cash
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-success-soft border border-success/30 rounded-xl p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-success">Running Cash</p>
                      <p className="font-mono font-bold text-xl text-success mt-1">₹{fmt(summary.currentRunningCash)}</p>
                    </div>
                    <div className="bg-info-soft border border-info/30 rounded-xl p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-info">Frozen Reserve</p>
                      <p className="font-mono font-bold text-xl text-info mt-1">₹{fmt(summary.currentFrozenCash)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Note */}
              {summary.note && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-text-muted font-semibold">Note / Remarks:</p>
                  <p className="text-sm text-text mt-1">{summary.note}</p>
                </div>
              )}
            </div>
          )}
        </UIModalBody>

        <UIModalFooter>
          <UIButton variant="ghost" onClick={onClose}>Close</UIButton>
        </UIModalFooter>
      </UIModal>

      {/* Nested Shift Details Modal */}
      <ViewShiftDialog
        isOpen={Boolean(selectedShiftForView)}
        onClose={() => setSelectedShiftForView(null)}
        shift={selectedShiftForView}
      />
    </>
  );
};
