// src/features/operations/shifts/components/CreateShiftDialog.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIAlert,
} from "@/components/ui";
import { Play } from "lucide-react";
import { createShift, listShifts } from "../store/shiftThunk";
import { API_STATUS } from "@/constants";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";
import { apiClient } from "@/services";

const DENOMINATIONS = [
  { note: 500, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { note: 200, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
  { note: 100, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { note: 50,  color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  { note: 20,  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { note: 10,  color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
  { note: 5,   color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800" },
  { note: 2,   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
  { note: 1,   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
];

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "₹ 0.00";
  return `₹ ${Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatFullDate = (val) => {
  if (!val) return "Wednesday, 30 April 2025";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "Wednesday, 30 April 2025";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatShortDate = (val) => {
  if (!val) return "30 Apr 2025";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "30 Apr 2025";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const CreateShiftDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createShiftStatus, error, shifts, activeShift } = useSelector(
    (state) => state.shift
  );
  const { openBusinessDay } = useSelector((state) => state.businessDay);
  const { currentBranch } = useBranch();

  const getLocalTodayDateString = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalTodayDateString();

  const getTomorrowStr = () => {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    return getLocalTodayDateString(tm);
  };

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [todayDCDone, setTodayDCDone] = useState(false);
  const [loadingDC, setLoadingDC] = useState(false);

  const autoShiftNo = "Auto-generated on save";

  // Check if another shift is currently open
  const hasOpenShift = Boolean(
    activeShift ||
    (Array.isArray(shifts) && shifts.some((s) => s.status === "open"))
  );

  // Auto Shift Suggestion
  const hour = new Date().getHours();
  const autoShiftName =
    hour < 12
      ? "Morning Shift"
      : hour < 17
      ? "Afternoon Shift"
      : "Evening Shift";

  const currentTimeStr = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const [shiftName, setShiftName] = useState(autoShiftName);
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState(currentTimeStr);
  const [copied, setCopied] = useState(false);

  const {
    currentBranchCash: branchCash,
    runningDenominations,
    fetchBranchCash: getBranchCash,
  } = useBranchCash();
  const [loadingCash, setLoadingCash] = useState(false);

  // Denominations State
  const [counts, setCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {})
  );

  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      setLoadingCash(true);
      getBranchCash(currentBranch._id).finally(() => setLoadingCash(false));

      setLoadingDC(true);
      apiClient.get(`/operations/day-closings?date=${todayStr}&branchId=${currentBranch._id}`)
        .then(res => {
          const dcs = res.data?.data || [];
          const todayDC = dcs.find(dc => dc.status === "closed");
          if (todayDC) {
            setTodayDCDone(true);
            setSelectedDate(getTomorrowStr());
          } else {
            setTodayDCDone(false);
            setSelectedDate(todayStr);
          }
        })
        .finally(() => setLoadingDC(false));
    }
  }, [isOpen, currentBranch?._id, todayStr]);

  const activeDenoms = useMemo(() => {
    return (
      branchCash?.denominationBalance?.runningDenominations ||
      branchCash?.balance?.runningDenominations ||
      runningDenominations ||
      []
    );
  }, [branchCash, runningDenominations]);

  const isFromDrawer = useMemo(() => {
    return activeDenoms.some((d) => (Number(d.quantity ?? d.count) || 0) > 0);
  }, [activeDenoms]);

  useEffect(() => {
    if (activeDenoms.length > 0) {
      const newCounts = DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {});
      let hasAny = false;
      activeDenoms.forEach((d) => {
        const note = Number(d.denomination);
        const qty = Number(d.quantity ?? d.count) || 0;
        if (DENOMINATIONS.includes(note) && qty > 0) {
          newCounts[note] = qty;
          hasAny = true;
        }
      });
      if (hasAny) {
        setCounts(newCounts);
        return;
      }
    }
    setCounts(DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {}));
  }, [activeDenoms]);

  const totalAmount = useMemo(() => {
    return DENOMINATIONS.reduce((sum, note) => {
      const cnt = Number(counts[note]) || 0;
      return sum + cnt * note;
    }, 0);
  }, [counts]);

  const handleCountChange = (note, val) => {
    if (isFromDrawer) return;
    const num = val === "" ? "" : Math.max(0, parseInt(val, 10) || 0);
    setCounts((prev) => ({ ...prev, [note]: num }));
  };

  const handleCreate = async () => {
    const openingDenominations = DENOMINATIONS.map((note) => ({
      denomination: note,
      count: Number(counts[note]) || 0,
      amount: (Number(counts[note]) || 0) * note,
    })).filter((d) => d.count > 0);

    try {
      await dispatch(createShift({ 
        openingFloatAmount: totalAmount,
        openingDenominations,
        date: selectedDate
      })).unwrap();
      dispatch(listShifts());
      onClose();
    } catch (e) {
      // error handled by redux state
    }
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <UIModalHeader>
        <UIModalTitle>Open New Shift</UIModalTitle>
      </UIModalHeader>
      <UIModalBody className="max-h-[70vh] overflow-y-auto">
        <div className="space-y-6 py-2">
          {error && <UIAlert intent="danger" title="Error" description={error} />}
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-secondary p-3 rounded-lg border border-border">
              <p className="text-xs text-text-muted mb-1">Business Date</p>
              {loadingDC ? (
                <p className="text-sm font-medium">Checking...</p>
              ) : (
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-bg border border-border rounded px-2 py-1 text-sm font-medium"
                >
                  {!todayDCDone && <option value={todayStr}>{todayStr} (Today)</option>}
                  <option value={getTomorrowStr()}>{getTomorrowStr()} (Tomorrow)</option>
                </select>
              )}
            </div>
            <div className="bg-surface-secondary p-3 rounded-lg border border-border">
              <p className="text-xs text-text-muted">Shift Number</p>
              <p className="text-sm font-medium text-text-muted">{autoShiftNo}</p>
            </div>
            <div className="bg-surface-secondary p-3 rounded-lg border border-border">
              <p className="text-xs text-text-muted">Shift Name</p>
              <p className="text-sm font-medium">{autoShiftName}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Opening Cash Balance</h4>
                  {isFromDrawer && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      Drawer Carry-Forward
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Branch Operating Cash Drawer: Running Cash Partition
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Total Float</p>
                <p className="text-lg font-bold text-success font-mono">
                  {loadingCash ? "Loading..." : `₹${totalAmount.toLocaleString("en-IN")}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DENOMINATIONS.map((note) => {
                const countVal = counts[note];
                const hasValue = countVal !== "" && Number(countVal) > 0;
                return (
                  <div
                    key={note}
                    className={`flex items-center gap-2 bg-surface-secondary border rounded p-2 transition ${
                      hasValue
                        ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                        : "border-border opacity-70"
                    } ${isFromDrawer ? "cursor-not-allowed" : ""}`}
                  >
                    <div
                      className={`w-12 text-center text-sm font-bold font-mono ${
                        hasValue ? "text-emerald-600 dark:text-emerald-400" : "text-text-muted"
                      }`}
                    >
                      ₹{note}
                    </div>
                    <div className="text-text-muted">×</div>
                    <input
                      type="number"
                      min="0"
                      readOnly={isFromDrawer}
                      disabled={isFromDrawer}
                      value={countVal}
                      onChange={(e) => handleCountChange(note, e.target.value)}
                      className={`w-full bg-transparent text-sm p-1.5 outline-none font-mono ${
                        isFromDrawer
                          ? "cursor-not-allowed text-text font-semibold"
                          : "cursor-text text-text focus:bg-surface rounded"
                      }`}
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </UIModalBody>
      {/* Modal Footer */}
      <UIModalFooter className="border-t border-border/60 py-3.5 px-6 flex items-center justify-end gap-2.5 shrink-0">
        <UIButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-9 px-4 text-xs font-semibold"
        >
          Cancel
        </UIButton>

        <UIButton
          type="button"
          variant="primary"
          size="sm"
          onClick={handleCreate}
          isLoading={createShiftStatus === API_STATUS.LOADING}
          disabled={hasOpenShift || !branchCash || loadingCash || !openBusinessDay}
          startIcon={<Play className="size-3.5 fill-current" />}
          className="h-9 px-4.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Shift
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default CreateShiftDialog;
