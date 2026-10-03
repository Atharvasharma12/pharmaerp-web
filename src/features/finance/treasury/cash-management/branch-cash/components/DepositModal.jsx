import React, { useState, useEffect } from "react";
import { UIModal, UIModalHeader, UIModalTitle, UIModalBody, UIModalFooter } from "@/components";
import { UIButton } from "@/components/ui";
import { FiSave, FiAlertCircle } from "react-icons/fi";
import { Banknote, LockKeyhole } from "lucide-react";
import { useBranchCash } from "../hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const DepositModal = ({ isOpen, onClose }) => {
  const { currentBranch } = useBranch();
  const { currentBranchCash, depositCash, depositStatus, error: apiError, resetStatus } = useBranchCash();

  const [denominations, setDenominations] = useState(
    DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 }))
  );
  const [narration, setNarration] = useState("");
  const [error, setError] = useState("");

  const isSubmitting = depositStatus === "loading";
  const isShiftOpen = Boolean(currentBranchCash?.currentShiftId);

  useEffect(() => {
    if (isOpen) {
      setDenominations(DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 })));
      setNarration("");
      setError("");
      resetStatus();
    }
  }, [isOpen, resetStatus]);

  useEffect(() => {
    if (depositStatus === "success") {
      onClose();
      resetStatus();
    }
  }, [depositStatus, onClose, resetStatus]);

  const getCurrentCount = (denom) => {
    if (!currentBranchCash || !isShiftOpen) return 0;
    const arr = currentBranchCash.denominationBalance?.runningDenominations || [];
    const item = arr.find(d => Number(d.denomination) === Number(denom));
    return item ? item.quantity ?? item.count : 0;
  };

  const totalAmount = denominations.reduce(
    (sum, d) => sum + d.denomination * (d.quantity || 0),
    0
  );

  const handleQuantityChange = (index, val) => {
    const newVal = Math.max(0, parseInt(val) || 0);
    const newDenoms = [...denominations];
    newDenoms[index].quantity = newVal;
    setDenominations(newDenoms);
  };

  const handleSubmit = async () => {
    if (!currentBranch?._id) {
      setError("No branch selected.");
      return;
    }
    if (totalAmount <= 0) {
      setError("Deposit amount must be greater than zero.");
      return;
    }
    if (!narration.trim()) {
      setError("Narration is required for external deposits.");
      return;
    }
    
    const depositDenominations = denominations.filter(d => d.quantity > 0);

    const payload = {
      branchId: currentBranch._id,
      amount: totalAmount,
      denominations: depositDenominations,
      narration,
    };

    try {
      await depositCash(payload).unwrap();
      onClose();
    } catch (err) {
      // Error handled by redux
    }
  };

  if (!isOpen) return null;

  return (
    <UIModal
      isOpen={isOpen}
      onClose={isSubmitting ? undefined : onClose}
      size="lg"
    >
      <UIModalHeader>
        <UIModalTitle>External Deposit</UIModalTitle>
      </UIModalHeader>
      <UIModalBody>
        <div className="flex flex-col gap-5 p-1">

          {/* Shift Gate — inline warning if no shift */}
          {!isShiftOpen && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-300/50 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30">
              <div className="mt-0.5 p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20">
                <LockKeyhole className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Shift Required</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  No shift is currently open. Deposits into running cash require an active shift.
                  Please open a shift first.
                </p>
              </div>
            </div>
          )}

          {(error || apiError) && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm border border-red-200 dark:border-red-500/30">
              <FiAlertCircle className="mt-0.5 shrink-0" />
              <div>{error || apiError}</div>
            </div>
          )}

          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-lg text-sm flex gap-3">
            <Banknote className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <strong>Deposit to Running Cash</strong>
              <span className="font-mono bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded font-bold border border-success/10 text-xs">
                Available: ₹{(currentBranchCash?.runningCash || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-xs opacity-90">This cash will be added to the active operational balance. Requires an open shift.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-muted mb-1">
                Narration <span className="text-danger">*</span>
              </label>
              <textarea
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                disabled={isSubmitting}
                placeholder="Source of funds (e.g., 'From HQ via courier')..."
                className="w-full text-sm bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-primary transition min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="border border-border rounded-xl bg-surface overflow-hidden flex flex-col">
            <div className="bg-surface-alt px-4 py-2 border-b border-border flex justify-between items-center">
              <span className="text-sm font-bold">Denominations</span>
            </div>
            
            <div className="overflow-auto max-h-[300px]">
              <div className="grid grid-cols-4 gap-2 px-4 py-2 text-[10px] font-bold text-text-muted uppercase bg-surface-alt/50 border-b border-border">
                <div>Note</div>
                <div className="text-center">Current</div>
                <div className="text-center">Deposit</div>
                <div className="text-right">Subtotal</div>
              </div>
              
              {denominations.map((item, index) => {
                const currentCount = getCurrentCount(item.denomination);
                const count = item.quantity || 0;
                const subtotal = item.denomination * count;

                return (
                  <div key={item.denomination} className="grid grid-cols-4 gap-2 items-center px-4 py-1.5 border-b border-border/40 hover:bg-surface-alt/30 transition">
                    <div className="font-mono text-sm font-bold">₹{item.denomination}</div>
                    <div className="text-center font-mono text-xs font-medium text-text-muted bg-surface-alt/50 rounded py-0.5">
                      {currentCount}
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={count === 0 ? "" : count}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        disabled={isSubmitting}
                        placeholder="0"
                        className="w-full text-center font-mono text-sm border border-border rounded py-1 bg-surface focus:border-primary outline-none"
                      />
                    </div>
                    <div className="text-right font-mono text-sm font-medium">
                      {subtotal > 0 ? `₹${subtotal}` : "—"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-surface-alt px-4 py-3 border-t border-border flex justify-between items-center">
              <span className="text-xs font-bold text-text-muted uppercase">Deposit Amount</span>
              <span className="text-xl font-black font-mono text-success">
                ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        </div>
      </UIModalBody>
      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </UIButton>
        <UIButton
          variant="primary"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={totalAmount <= 0 || !isShiftOpen}
        >
          Confirm Deposit
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default DepositModal;

