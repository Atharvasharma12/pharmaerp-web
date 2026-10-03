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
import { createShift, listShifts } from "../store/shiftThunk";
import { API_STATUS } from "@/constants";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";
import { apiClient } from "@/services";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CreateShiftDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createShiftStatus, error } = useSelector((state) => state.shift);
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

  const autoShiftName = new Date().getHours() < 12 ? "Morning Shift" : new Date().getHours() < 17 ? "Afternoon Shift" : "Evening Shift";
  const autoShiftNo = "Auto-generated on save";

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

          {!loadingCash && !branchCash ? (
            <div className="py-4">
              <UIAlert 
                intent="warning" 
                title="Branch Cash Not Initialized" 
                description="You must initialize the branch cash before opening a shift. Please go to Treasury > Branch Cash to set up the initial balance."
              />
            </div>
          ) : (
            <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-secondary p-3 rounded-lg border border-border">
              <p className="text-xs text-text-muted mb-1">Business Date</p>
              {loadingDC ? (
                <p className="text-sm font-medium text-text-muted">Checking…</p>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold font-mono">{selectedDate}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    todayDCDone
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-300/50"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300/50"
                  }`}>
                    {todayDCDone ? "TOMORROW" : "TODAY"}
                  </span>
                </div>
              )}
              <p className="text-[10px] text-text-muted mt-1">Auto-assigned · cannot be changed</p>
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
            </>
          )}
        </div>
      </UIModalBody>
      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose}>
          Cancel
        </UIButton>
        <UIButton
          variant="primary"
          onClick={handleCreate}
          isLoading={createShiftStatus === API_STATUS.LOADING}
          disabled={!branchCash || loadingCash}
        >
          Open Shift
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
