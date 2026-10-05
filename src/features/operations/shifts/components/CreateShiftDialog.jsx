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
  UIBadge,
} from "@/components/ui";
import { Clock, Banknote, Calendar, Layers, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { createShift, listShifts } from "../store/shiftThunk";
import { API_STATUS } from "@/constants";
import useBranchCash from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";
import { getOpenBusinessDay } from "@/features/operations/business-days/store/businessDayThunk";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CreateShiftDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createShiftStatus, error } = useSelector((state) => state.shift);
  const { openBusinessDay, getOpenBusinessDayStatus } = useSelector(
    (state) => state.businessDay
  );
  const { currentBranch } = useBranch();

  const hour = new Date().getHours();
  const autoShiftName =
    hour < 12
      ? "Morning Shift"
      : hour < 17
      ? "Afternoon Shift"
      : "Evening Shift";
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
      dispatch(getOpenBusinessDay(currentBranch._id));
    }
  }, [isOpen, currentBranch?._id, dispatch, getBranchCash]);

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
      const newCounts = DENOMINATIONS.reduce(
        (acc, note) => ({ ...acc, [note]: "" }),
        {}
      );
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
      await dispatch(
        createShift({
          openingFloatAmount: totalAmount,
          openingDenominations,
        })
      ).unwrap();
      dispatch(listShifts());
      onClose();
    } catch {
      // Managed by slice error
    }
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <UIModalHeader>
        <UIModalTitle>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <Clock className="h-5.5 w-5.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-text tracking-tight">
                Initialize POS Shift & Cash Drawer
              </h3>
              <p className="text-xs font-medium text-text-muted mt-0.5">
                Set opening float balance and start counter billing session
              </p>
            </div>
          </div>
        </UIModalTitle>
      </UIModalHeader>

      <UIModalBody className="max-h-[72vh] overflow-y-auto">
        <div className="space-y-5 py-1">
          {error && <UIAlert intent="danger" title="Error" description={error} />}

          {!loadingCash && !branchCash ? (
            <div className="py-2">
              <UIAlert
                intent="warning"
                title="Branch Cash Not Initialized"
                description="You must initialize the branch cash balance before opening a shift. Navigate to Treasury > Branch Cash to set up initial drawer funds."
              />
            </div>
          ) : (
            <>
              {/* ── Top Session Meta Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Business Date */}
                <div className="bg-surface-alt/70 border border-border/70 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                      <Calendar className="size-3 text-primary" />
                      Session Date
                    </span>
                    {openBusinessDay && (
                      <UIBadge variant="soft" color="success" className="text-[10px] py-0 px-1.5 font-bold">
                        OPEN
                      </UIBadge>
                    )}
                  </div>
                  <div className="mt-2">
                    {getOpenBusinessDayStatus === API_STATUS.LOADING ? (
                      <p className="text-xs text-text-muted font-medium">Checking date...</p>
                    ) : openBusinessDay ? (
                      <p className="text-sm font-bold text-text font-mono">
                        {new Date(openBusinessDay.businessDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    ) : (
                      <p className="text-xs text-error font-semibold flex items-center gap-1">
                        <AlertCircle className="size-3" /> No Day Open
                      </p>
                    )}
                  </div>
                </div>

                {/* Shift Number */}
                <div className="bg-surface-alt/70 border border-border/70 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                    <Layers className="size-3 text-primary" />
                    Shift Number
                  </span>
                  <p className="text-xs font-mono font-semibold text-text-muted mt-2 truncate">
                    {autoShiftNo}
                  </p>
                </div>

                {/* Shift Name */}
                <div className="bg-surface-alt/70 border border-border/70 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                    <Clock className="size-3 text-primary" />
                    Shift Session
                  </span>
                  <p className="text-sm font-bold text-text mt-2 truncate">
                    {autoShiftName}
                  </p>
                </div>
              </div>

              {/* ── Cash Float Section Header ── */}
              <div className="border-t border-border/60 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 bg-surface-alt/50 border border-border/70 rounded-xl p-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="text-sm font-bold text-text">Opening Cash Float</h4>
                      {isFromDrawer && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Drawer Carry-Forward
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      Counter cash partition balance automatically calculated from notes
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                      Total Opening Float
                    </span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      {loadingCash ? "Loading..." : `₹${totalAmount.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>

                {/* ── Denominations Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DENOMINATIONS.map((note) => {
                    const countVal = counts[note];
                    const hasValue = countVal !== "" && Number(countVal) > 0;
                    return (
                      <div
                        key={note}
                        className={`flex items-center justify-between border rounded-xl p-2 px-3 transition-all duration-150 ${
                          hasValue
                            ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20 shadow-2xs"
                            : "border-border/70 bg-surface-alt/40 opacity-80 hover:opacity-100"
                        } ${isFromDrawer ? "cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold font-mono ${
                              hasValue ? "text-primary" : "text-text"
                            }`}
                          >
                            ₹{note}
                          </span>
                          <span className="text-text-muted/60 text-xs">×</span>
                        </div>

                        <input
                          type="number"
                          min="0"
                          readOnly={isFromDrawer}
                          disabled={isFromDrawer}
                          value={countVal}
                          onChange={(e) => handleCountChange(note, e.target.value)}
                          className={`w-16 text-right text-xs font-mono font-bold p-1 outline-none transition ${
                            isFromDrawer
                              ? "cursor-not-allowed text-text font-bold"
                              : "cursor-text text-text focus:ring-1 focus:ring-primary focus:border-primary bg-surface border border-border/80 rounded-md"
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
          disabled={!branchCash || loadingCash || !openBusinessDay}
        >
          <span>Open Shift Session</span>
          <ArrowRight className="size-4 ml-1 opacity-70" />
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default CreateShiftDialog;
