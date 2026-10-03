import React, { useState, useEffect, useMemo } from "react";
import { UIModal, UIModalHeader, UIModalTitle, UIModalBody, UIModalFooter, AppButton, AppSelect } from "@/components";
import { UIAlert, UIButton } from "@/components/ui";
import { FiSave, FiAlertCircle } from "react-icons/fi";
import { HandCoins, AlertTriangle, LockKeyhole } from "lucide-react";
import { useBranchCash } from "../hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const WithdrawModal = ({ isOpen, onClose }) => {
  const { currentBranch } = useBranch();
  const { currentBranchCash, withdrawCash, withdrawStatus, error: apiError, resetStatus } = useBranchCash();

  const [source, setSource] = useState("frozen");
  const [denominations, setDenominations] = useState(
    DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 }))
  );
  const [narration, setNarration] = useState("");
  const [error, setError] = useState("");

  const isSubmitting = withdrawStatus === "loading";
  const isShiftOpen = Boolean(currentBranchCash?.currentShiftId);

  // ── Available sources (bank slip removed — only running/frozen, both require shift) ──
  const availableSources = useMemo(() => {
    const sources = [];
    if (isShiftOpen) {
      sources.push({
        value: "running",
        label: `Running Cash (Shift) — ₹${(currentBranchCash?.runningCash || 0).toLocaleString("en-IN")}`,
      });
    }
    sources.push({
      value: "frozen",
      label: `Frozen Reserve — ₹${(currentBranchCash?.frozenCash || 0).toLocaleString("en-IN")}`,
    });
    return sources;
  }, [isShiftOpen, currentBranchCash?.runningCash, currentBranchCash?.frozenCash]);

  useEffect(() => {
    if (isOpen) {
      setSource("frozen");
      setDenominations(DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 })));
      setNarration("");
      setError("");
      resetStatus();
    }
  }, [isOpen, resetStatus]);

  useEffect(() => {
    if (withdrawStatus === "success") {
      onClose();
      resetStatus();
    }
  }, [withdrawStatus, onClose, resetStatus]);

  const getAvailableCount = (denom) => {
    if (!currentBranchCash) return 0;
    if (source === "running") {
      const arr = currentBranchCash.denominationBalance?.runningDenominations || [];
      const item = arr.find((d) => Number(d.denomination) === Number(denom));
      return item ? item.quantity ?? item.count : 0;
    }
    if (source === "frozen") {
      const arr =
        currentBranchCash.denominationBalance?.frozenDenominations ||
        currentBranchCash.balance?.frozenDenominations || [];
      const item = arr.find((d) => Number(d.denomination) === Number(denom));
      return item ? item.quantity ?? item.count : 0;
    }
    return 0;
  };

  const totalAmount = denominations.reduce(
    (sum, d) => sum + d.denomination * (d.quantity || 0),
    0
  );

  const handleQuantityChange = (index, val) => {
    const denom = denominations[index].denomination;
    const available = getAvailableCount(denom);
    let newVal = Math.max(0, parseInt(val) || 0);
    if (newVal > available) newVal = available;
    const newDenoms = [...denominations];
    newDenoms[index].quantity = newVal;
    setDenominations(newDenoms);
  };

  const handleSubmit = async () => {
    if (!currentBranch?._id) {
      setError("No branch selected.");
      return;
    }
    if (!isShiftOpen) {
      setError("A shift must be open to withdraw cash.");
      return;
    }
    if (totalAmount <= 0) {
      setError("Withdrawal amount must be greater than zero.");
      return;
    }
    if (!narration.trim()) {
      setError("Narration is required for withdrawals.");
      return;
    }

    const withdrawDenominations = denominations.filter((d) => d.quantity > 0);

    const payload = {
      branchId: currentBranch._id,
      source,
      amount: totalAmount,
      denominations: withdrawDenominations,
      narration,
    };

    try {
      await withdrawCash(payload).unwrap();
      onClose();
    } catch (err) {
      // Error handled by redux
    }
  };

  if (!isOpen) return null;

  return (
    <UIModal isOpen={isOpen} onClose={isSubmitting ? undefined : onClose} size="lg">
      <UIModalHeader>
        <UIModalTitle>Withdraw Cash</UIModalTitle>
      </UIModalHeader>
      <UIModalBody>
        <div className="flex flex-col gap-5 p-1">
          {/* Shift Gate Warning */}
          {!isShiftOpen && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-300/50 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30">
              <div className="mt-0.5 p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20">
                <LockKeyhole className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Shift Required</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  No shift is currently open. All cash operations (withdrawal from running or frozen) 
                  must happen during an open shift for full audit traceability. Please open a shift first.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <AppSelect
                label="Withdraw From"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={isSubmitting || !isShiftOpen}
                options={availableSources}
                placeholder="Select source..."
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-muted mb-1">
                  Narration <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  disabled={isSubmitting || !isShiftOpen}
                  placeholder="Reason for withdrawal..."
                  className="w-full text-sm bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-primary transition min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Shift info card */}
              {isShiftOpen && (
                <div className="p-3 rounded-lg border border-border bg-surface-secondary text-xs space-y-1">
                  <p className="font-semibold text-text-muted uppercase tracking-widest text-[10px]">Current Balances</p>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Running Cash</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{(currentBranchCash?.runningCash || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Frozen Reserve</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      ₹{(currentBranchCash?.frozenCash || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-border rounded-xl bg-surface overflow-hidden flex flex-col">
              <div className="bg-surface-alt px-4 py-2 border-b border-border flex justify-between items-center">
                <span className="text-sm font-bold">Denominations</span>
                <span className="text-xs text-text-muted">
                  {source === "running" ? "Running Drawer" : "Frozen Reserve"}
                </span>
              </div>

              <div className="overflow-auto max-h-[300px]">
                <div className="grid grid-cols-4 gap-2 px-4 py-2 text-[10px] font-bold text-text-muted uppercase bg-surface-alt/50 border-b border-border">
                  <div>Note</div>
                  <div className="text-center">Available</div>
                  <div className="text-center">Withdraw</div>
                  <div className="text-right">Subtotal</div>
                </div>

                {denominations.map((item, index) => {
                  const availableCount = getAvailableCount(item.denomination);
                  const count = item.quantity || 0;
                  const subtotal = item.denomination * count;

                  return (
                    <div
                      key={item.denomination}
                      className={`grid grid-cols-4 gap-2 items-center px-4 py-1.5 border-b border-border/40 transition ${
                        availableCount === 0 ? "opacity-40 bg-surface-alt/10" : "hover:bg-surface-alt/30"
                      }`}
                    >
                      <div className="font-mono text-sm font-bold">₹{item.denomination}</div>
                      <div className="text-center font-mono text-xs font-medium text-text-muted bg-surface-alt/50 rounded py-0.5">
                        {availableCount}
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          max={availableCount}
                          value={count === 0 ? "" : count}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          disabled={isSubmitting || availableCount === 0 || !isShiftOpen}
                          placeholder="0"
                          className="w-full text-center font-mono text-sm border border-border rounded py-1 bg-surface focus:border-primary outline-none disabled:bg-surface-alt disabled:cursor-not-allowed"
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
                <span className="text-xs font-bold text-text-muted uppercase">Withdraw Amount</span>
                <span className="text-xl font-black font-mono text-red-500">
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
          Confirm Withdrawal
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default WithdrawModal;
