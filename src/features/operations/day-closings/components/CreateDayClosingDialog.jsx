// src/features/operations/day-closings/components/CreateDayClosingDialog.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIInput,
  UIAlert,
  UIBadge,
  UIStatCard,
  UIInfoCard,
  UIDetailRow,
} from "@/components/ui";
import { createDayClosing, listDayClosings } from "../store/dayClosingThunk";
import { apiClient } from "@/services";
import useBranch from "@/features/branch/hooks/useBranch";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import {
  Eye,
  Banknote,
  QrCode,
  Clock,
  Snowflake,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck,
} from "lucide-react";
import { ViewShiftDialog } from "@/features/operations/shifts/components/ViewShiftDialog";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

export const CreateDayClosingDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createDayClosingStatus, error } = useSelector((state) => state.dayClosing);
  const { currentBranch } = useBranch();
  const { currentBranchCash: branchCash, fetchBranchCash: getBranchCash } = useBranchCash();
  
  const getLocalTodayDateString = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalTodayDateString();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedShiftForView, setSelectedShiftForView] = useState(null);

  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      getBranchCash(currentBranch._id);
    }
  }, [isOpen, currentBranch?._id]);

  useEffect(() => {
    if (isOpen) {
      setNote("");
      setLoading(true);
      setApiError(null);
      const branchIdParam = currentBranch?._id ? `&branchId=${currentBranch._id}` : "";
      apiClient
        .get(`/operations/day-closings/draft-summary?date=${selectedDate}${branchIdParam}`)
        .then((res) => setSummary(res.data.data))
        .catch((err) => {
          console.error(err);
          setApiError(err.response?.data?.message || "Failed to fetch shift summary.");
        })
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
      setApiError(null);
    }
  }, [isOpen, selectedDate, currentBranch?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!summary || summary.shifts?.length === 0) return;

    const resultAction = await dispatch(
      createDayClosing({
        date: selectedDate,
        branchId: currentBranch?._id,
        note,
      })
    );

    if (createDayClosing.fulfilled.match(resultAction)) {
      dispatch(listDayClosings(currentBranch?._id ? { branchId: currentBranch._id } : {}));
      onClose();
    }
  };

  const hasShifts = summary && summary.shifts && summary.shifts.length > 0;

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="lg">
        <form onSubmit={handleSubmit}>
          <UIModalHeader>
            <UIModalTitle>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
                  <FileCheck className="h-5.5 w-5.5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-text tracking-tight">
                      Create Day Closing Record
                    </h3>
                    <UIBadge variant="soft" color="indigo" className="text-[10px] py-0 px-2 font-bold uppercase">
                      DRAFT RECORD
                    </UIBadge>
                  </div>
                  <p className="text-xs font-medium text-text-muted mt-0.5">
                    Consolidate completed shifts and lock financial totals for the selected business date
                  </p>
                </div>
              </div>
            </UIModalTitle>
          </UIModalHeader>

          <UIModalBody className="space-y-5 py-4 max-h-[72vh] overflow-y-auto">
            {/* Date Selection Bar */}
            <div className="bg-surface-alt/70 border border-border/70 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <label className="text-[11px] font-bold text-text uppercase tracking-wider block mb-0.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  Business Closing Date
                </label>
                <p className="text-xs text-text-muted">
                  Select the date for which all counter shifts will be audited and archived.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <UIInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={todayStr}
                  className="h-9 text-sm font-semibold w-full sm:w-44 font-mono border-border/80 focus:ring-primary"
                />
              </div>
            </div>

            {(error || apiError) && (
              <UIAlert intent="danger" title="Notice" description={error || apiError} />
            )}

            {loading ? (
              <div className="py-12 text-center text-text-muted">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-3" />
                <p className="text-xs font-medium">Fetching shift audit records for {selectedDate}...</p>
              </div>
            ) : apiError ? (
              <div className="py-10 text-center text-text-muted bg-surface-alt/40 border border-border/60 rounded-xl p-6">
                <p className="text-xs font-medium text-text-muted">
                  Please select another date or resolve pending shifts before proceeding.
                </p>
              </div>
            ) : !hasShifts ? (
              <div className="py-10 text-center text-text-muted bg-surface-alt/40 border border-border/60 rounded-xl p-6">
                <p className="text-xs font-medium text-text-muted">
                  {summary?.message || `No closed shifts available to day-close for ${selectedDate}.`}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Current Branch Cash Partition: Running & Frozen Cash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <UIStatCard
                    title="Current Running Cash"
                    value={`₹${fmt(branchCash?.runningCash ?? 0)}`}
                    subtext="Active in counter drawer"
                    color="emerald"
                    icon={Banknote}
                  />
                  <UIStatCard
                    title="Frozen Cash (Reserve)"
                    value={`₹${fmt(branchCash?.frozenCash ?? 0)}`}
                    subtext="Locked cash awaiting deposit"
                    color="blue"
                    icon={Snowflake}
                  />
                </div>

                {/* Payment Breakdown Cards */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                    <QrCode className="size-3.5 text-primary" /> Payment Breakdown
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
                        {summary.totalCashInvoiceCount || 0} cash invoices
                      </p>
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                        <QrCode className="size-3.5" /> UPI / Digital QR
                      </div>
                      <p className="font-mono font-bold text-xl text-indigo-600 dark:text-indigo-400">
                        ₹{fmt(summary.totalQrNet)}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                        {summary.totalPaymentQrCount || 0} digital payments
                      </p>
                    </div>
                  </div>
                </div>

                {/* Per-Shift Cards */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary" /> Included Shifts ({summary.shifts.length})
                    </h4>
                    <span className="text-[11px] text-text-muted font-medium">Click view to audit shift details</span>
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {summary.shifts.map((s) => (
                      <div
                        key={s._id}
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
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => setSelectedShiftForView(s)}
                            className="flex items-center gap-1 text-[11px] h-7 px-2.5 font-medium"
                          >
                            <Eye className="size-3 text-primary" /> View Details
                          </UIButton>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                          {[
                            ["Opening Float", fmt(s.openingFloatAmount || 0)],
                            ["Cash Sales", fmt(s.cashNet || 0)],
                            ["Expected Cash", fmt(s.expectedClosingCashAmount || 0)],
                            ["Actual Cash", fmt(s.actualClosingCashAmount || 0)],
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

                <UIInput
                  label="Closing Notes / Remarks (Optional)"
                  placeholder="Add any supervisor notes or audit comments..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="text-xs"
                />
              </div>
            )}
          </UIModalBody>

          <UIModalFooter>
            <UIButton variant="ghost" type="button" onClick={onClose}>
              Cancel
            </UIButton>
            <UIButton
              type="submit"
              variant="primary"
              isLoading={createDayClosingStatus === "loading"}
              disabled={!hasShifts}
            >
              <span>Create Day Closing</span>
              <ArrowRight className="size-4 ml-1 opacity-70" />
            </UIButton>
          </UIModalFooter>
        </form>
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

export default CreateDayClosingDialog;

