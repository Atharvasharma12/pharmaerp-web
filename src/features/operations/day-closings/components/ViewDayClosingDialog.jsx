// src/features/operations/day-closings/components/ViewDayClosingDialog.jsx

import React, { useEffect, useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIBadge,
  UIStatCard,
  UIInfoCard,
  UIDetailRow,
} from "@/components/ui";
import {
  IndianRupee,
  QrCode,
  FileText,
  Eye,
  ArrowLeftRight,
  Banknote,
  Snowflake,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  ChevronRight,
  Building2,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";
import { apiClient } from "@/services";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

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

  const getStatusColor = (st) => {
    switch (st?.toLowerCase()) {
      case "closed":
      case "locked":
        return "emerald";
      case "draft":
        return "indigo";
      case "cancelled":
        return "rose";
      default:
        return "slate";
    }
  };

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="xl">
        <UIModalHeader>
          <UIModalTitle>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
                <FileText className="h-5.5 w-5.5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-text tracking-tight">
                    Day Closing Summary
                  </h3>
                  {dayClosing?.dayClosingNo && (
                    <UIBadge variant="soft" color="indigo" className="text-[10px] py-0 px-2 font-mono font-bold">
                      {dayClosing.dayClosingNo}
                    </UIBadge>
                  )}
                  {summary?.status && (
                    <UIBadge variant="soft" color={getStatusColor(summary.status)} className="text-[10px] py-0 px-2 font-bold uppercase">
                      {summary.status}
                    </UIBadge>
                  )}
                </div>
                <p className="text-xs font-medium text-text-muted mt-0.5">
                  Full audit breakdown and daily shift consolidation log
                </p>
              </div>
            </div>
          </UIModalTitle>
        </UIModalHeader>

        <UIModalBody className="max-h-[76vh] overflow-y-auto space-y-5 py-4">
          {loading ? (
            <div className="py-16 text-center text-text-muted">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-3" />
              <p className="text-xs font-medium">Loading day closing summary…</p>
            </div>
          ) : !summary ? (
            <div className="py-12 text-center text-text-muted bg-surface-alt/40 border border-border/60 rounded-xl">
              <p className="text-xs font-medium">No day closing summary available.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Header Info Banner */}
              <div className="bg-surface-alt/70 border border-border/70 rounded-xl p-4 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <UIDetailRow
                    label="Business Date"
                    value={new Date(summary.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  />
                  <UIDetailRow
                    label="Total Shifts Included"
                    value={`${summary.shifts?.length || 0} counter shifts`}
                  />
                  <UIDetailRow
                    label="Processed By"
                    value={summary.createdBy?.fullName || summary.createdBy?.name || "System Admin"}
                  />
                </div>
              </div>

              {/* Day Cash Stat Cards Overview */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                  <IndianRupee className="size-3.5 text-primary" /> Day Cash Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <UIStatCard
                    title="Opening Float"
                    value={`₹${fmt(summary.openingFloatAmount)}`}
                    subtext="Start of day balance"
                    color="slate"
                  />
                  <UIStatCard
                    title="Expected Closing"
                    value={`₹${fmt(summary.expectedClosingCashAmount)}`}
                    subtext="Opening + Net Cash"
                    color="blue"
                  />
                  <UIStatCard
                    title="Actual Closing"
                    value={summary.status === "closed" ? `₹${fmt(summary.actualClosingCashAmount)}` : "Pending"}
                    subtext="Physical count total"
                    color="emerald"
                  />
                  {summary.status === "closed" && (
                    <UIStatCard
                      title="Discrepancy / Variance"
                      value={`${diff > 0 ? "+" : ""}₹${fmt(diff)}`}
                      subtext={diff === 0 ? "Exact balance match" : diff > 0 ? "Overage recorded" : "Shortage recorded"}
                      color={diff === 0 ? "emerald" : diff > 0 ? "amber" : "rose"}
                    />
                  )}
                </div>
              </div>

              {/* Payment Breakdown Cards */}
              {(summary.totalCashNet !== undefined || summary.totalQrNet !== undefined) && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                    <QrCode className="size-3.5 text-primary" /> Payment Method Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                        <Banknote className="size-3.5" /> Cash Collections
                      </div>
                      <p className="font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400">
                        ₹{fmt(summary.totalCashNet)}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                        {summary.totalCashInvoiceCount || 0} cash bills
                      </p>
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                        <QrCode className="size-3.5" /> UPI / QR Digital
                      </div>
                      <p className="font-mono font-bold text-xl text-indigo-600 dark:text-indigo-400">
                        ₹{fmt(summary.totalQrNet)}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                        {summary.totalPaymentQrCount || 0} QR invoices
                      </p>
                    </div>
                  </div>

                  {summary.totalNetSales !== undefined && (
                    <div className="mt-2.5 bg-surface-alt/70 border border-border/70 rounded-xl p-3.5 flex justify-between items-center">
                      <span className="text-xs font-bold text-text">Total Net Sales (All Shifts Combined)</span>
                      <span className="font-mono font-bold text-lg text-primary">₹{fmt(summary.totalNetSales)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Included Shifts Breakdown */}
              {(summary.cashByShift?.length > 0 || summary.shiftSummaries?.length > 0) && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" /> Shifts Breakdown ({summary.shifts?.length || 0})
                  </h4>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {(summary.cashByShift?.length > 0 ? summary.cashByShift : summary.shiftSummaries || []).map((s) => (
                      <div
                        key={s.shiftId || s._id}
                        className="bg-surface-alt/60 border border-border/70 rounded-xl p-3.5 hover:border-primary/40 transition duration-150 shadow-2xs"
                      >
                        <div className="flex justify-between items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <p className="font-bold text-xs text-text">{s.shiftName || s.shiftNo || "Shift Session"}</p>
                            {s.shiftNo && (
                              <span className="text-[10px] font-mono text-text-muted bg-surface p-0.5 px-1.5 rounded border border-border/60">
                                {s.shiftNo}
                              </span>
                            )}
                          </div>
                          <UIButton
                            variant="outline"
                            size="xs"
                            onClick={() => setSelectedShiftForView({ _id: s.shiftId || s._id, shiftNo: s.shiftNo })}
                            className="flex items-center gap-1 text-[11px] h-7 px-2.5 font-medium"
                          >
                            <Eye className="size-3 text-primary" /> View Shift
                          </UIButton>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                          {[
                            ["Opening Float", fmt(s.openingFloat || s.openingFloatAmount)],
                            ["Cash Sales", fmt(s.cashSales || s.cashNet)],
                            ["Expected Cash", fmt(s.expectedCash || s.expectedClosingCashAmount)],
                            ["Actual Cash", fmt(s.actualCash || s.actualClosingCashAmount)],
                          ].map(([label, val]) => (
                            <div key={label} className="bg-surface/80 rounded-lg p-2 border border-border/60">
                              <p className="text-[10px] text-text-muted font-medium">{label}</p>
                              <p className="font-mono font-bold text-xs text-text mt-0.5">₹{val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Branch Cash Snapshot */}
              {(summary.currentRunningCash !== undefined || summary.currentFrozenCash !== undefined) && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" /> Current Branch Cash Status
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <UIStatCard
                      title="Running Cash"
                      value={`₹${fmt(summary.currentRunningCash)}`}
                      subtext="Active in counter drawer"
                      color="emerald"
                      icon={Banknote}
                    />
                    <UIStatCard
                      title="Frozen Reserve"
                      value={`₹${fmt(summary.currentFrozenCash)}`}
                      subtext="Locked for bank deposit"
                      color="blue"
                      icon={Snowflake}
                    />
                  </div>
                </div>
              )}

              {/* Note / Remarks */}
              {summary.note && (
                <UIInfoCard
                  title="Closing Remarks / Supervisor Notes"
                  description={summary.note}
                  intent="neutral"
                />
              )}
            </div>
          )}
        </UIModalBody>

        <UIModalFooter>
          <UIButton variant="ghost" onClick={onClose}>
            Close Window
          </UIButton>
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

export default ViewDayClosingDialog;

