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
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import useBranch from "@/features/branch/hooks/useBranch";
import { apiClient } from "@/services";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CreateShiftDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createShiftStatus, error } = useSelector((state) => state.shift);
  const { currentBranch } = useBranch();
  
  const [todayStr] = useState(new Date().toISOString().split("T")[0]);
  
  const getTomorrowStr = () => {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    return tm.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [todayDCDone, setTodayDCDone] = useState(false);
  const [loadingDC, setLoadingDC] = useState(false);

  const autoShiftName = new Date().getHours() < 12 ? "Morning Shift" : new Date().getHours() < 17 ? "Afternoon Shift" : "Evening Shift";
  const autoShiftNo = "Auto-generated on save";

  const { cashAccounts, getCashAccounts } = useCashAccount();
  const [loadingCash, setLoadingCash] = useState(false);

  // Denominations State
  const [counts, setCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {})
  );

  // Only use the PRIMARY/default cash account for the current branch in shifts
  const defaultCashAccount = useMemo(() => {
    return cashAccounts?.find((ca) => ca.isPrimary) || cashAccounts?.[0] || null;
  }, [cashAccounts]);

  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      setLoadingCash(true);
      getCashAccounts({
        branchId: currentBranch._id,
        isSystemDefault: "true",
        all: "true",
      }).finally(() => setLoadingCash(false));

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

  useEffect(() => {
    if (defaultCashAccount && defaultCashAccount.denominationBalance?.denominations) {
      const denomArray = defaultCashAccount.denominationBalance.denominations;
      const newCounts = DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {});
      denomArray.forEach((d) => {
        if (DENOMINATIONS.includes(Number(d.denomination))) {
          newCounts[Number(d.denomination)] = d.quantity || 0;
        }
      });
      setCounts(newCounts);
    } else {
      setCounts(DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {}));
    }
  }, [defaultCashAccount]);

  const totalAmount = useMemo(() => {
    return DENOMINATIONS.reduce((sum, note) => {
      const cnt = Number(counts[note]) || 0;
      return sum + cnt * note;
    }, 0);
  }, [counts]);

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
                <h4 className="text-sm font-semibold">Opening Cash Balance</h4>
                  <p className="text-xs text-text-muted">
                    Branch Operating Cash Drawer: {defaultCashAccount ? `"${defaultCashAccount.accountName}"` : "Default Cash Account"}
                  </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Total Float</p>
                <p className="text-lg font-bold text-success">
                  {loadingCash ? "Loading..." : `₹${totalAmount}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DENOMINATIONS.map((note) => (
                <div key={note} className="flex items-center gap-2 bg-surface-secondary border border-border rounded p-2 opacity-80 cursor-not-allowed">
                  <div className="w-12 text-center text-sm font-medium text-text-muted">₹{note}</div>
                  <div className="text-text-muted">×</div>
                  <input
                    type="number"
                    readOnly
                    disabled
                    value={counts[note]}
                    className="w-full bg-transparent text-text text-sm p-1.5 outline-none cursor-not-allowed"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
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
        >
          Open Shift
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
