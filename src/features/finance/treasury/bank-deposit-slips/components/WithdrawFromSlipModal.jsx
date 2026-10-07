import React, { useState, useEffect } from "react";
import { UIModal, UIModalHeader, UIModalTitle, UIModalBody, UIModalFooter, AppButton, AppInput } from "@/components";
import { FiSave, FiAlertCircle } from "react-icons/fi";
import { HandCoins } from "lucide-react";
import useBankDepositSlip from "../hooks/useBankDepositSlip";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const WithdrawFromSlipModal = ({ isOpen, onClose, slip }) => {
  const { withdrawFromBankDepositSlip, withdrawFromSlipStatus, error: apiError, clearError } = useBankDepositSlip();

  const [denominations, setDenominations] = useState(
    DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 }))
  );
  const [narration, setNarration] = useState("");
  const [error, setError] = useState("");

  const isSubmitting = withdrawFromSlipStatus === "loading";

  useEffect(() => {
    if (isOpen) {
      setDenominations(DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 })));
      setNarration("");
      setError("");
      clearError();
    }
  }, [isOpen, clearError]);

  useEffect(() => {
    if (withdrawFromSlipStatus === "success") {
      onClose();
    }
  }, [withdrawFromSlipStatus, onClose]);

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
    if (!slip?._id) {
      setError("No bank slip selected.");
      return;
    }
    if (totalAmount <= 0) {
      setError("Withdrawal amount must be greater than zero.");
      return;
    }
    if (!narration.trim()) {
      setError("Narration is required.");
      return;
    }
    
    const withdrawDenominations = denominations.filter(d => d.quantity > 0);

    const payload = {
      amount: totalAmount,
      denominations: withdrawDenominations,
      narration,
    };

    try {
      await withdrawFromBankDepositSlip(slip._id, payload);
    } catch (err) {
      // Error handled by redux
    }
  };

  if (!isOpen || !slip) return null;

  return (
    <UIModal
      isOpen={isOpen}
      onClose={isSubmitting ? undefined : onClose}
      size="lg"
    >
      <UIModalHeader>
        <UIModalTitle>Withdraw from Bank Slip</UIModalTitle>
      </UIModalHeader>
      <UIModalBody>
        <div className="flex flex-col gap-5 p-1">
        {(error || apiError) && (
          <div className="p-3 bg-danger-soft text-danger rounded-lg flex items-start gap-2 text-sm border border-danger/20">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <div>{error || apiError}</div>
          </div>
        )}

        <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/30 text-primary-800 dark:text-primary-300 p-3 rounded-lg text-sm flex gap-3 items-center">
          <HandCoins className="w-5 h-5 shrink-0" />
          <div>
            <strong>Partial Withdrawal:</strong> You are withdrawing cash back to <strong>Frozen Reserve</strong> from Slip ID {slip.slipId?.slice(-6) || slip._id.slice(-6)}.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            
            <div>
              <label className="text-xs font-semibold text-text-muted mb-1 block">
                Available on Slip
              </label>
              <div className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm font-bold text-success font-mono">
                ₹{(slip.remainingAmount || slip.totalAmount || 0).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-muted mb-1">
                Narration <span className="text-danger">*</span>
              </label>
              <textarea
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                disabled={isSubmitting}
                placeholder="Reason for partial withdrawal..."
                className="w-full text-sm bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-primary transition min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="border border-border rounded-xl bg-surface overflow-hidden flex flex-col">
            <div className="bg-surface-alt px-4 py-2 border-b border-border flex justify-between items-center">
              <span className="text-sm font-bold">Denominations</span>
            </div>
            
            <div className="overflow-auto max-h-[300px]">
              <div className="grid grid-cols-3 gap-2 px-4 py-2 text-[10px] font-bold text-text-muted uppercase bg-surface-alt/50 border-b border-border">
                <div>Note</div>
                <div className="text-center">Count</div>
                <div className="text-right">Subtotal</div>
              </div>
              
              {denominations.map((item, index) => {
                const subtotal = item.denomination * (item.quantity || 0);
                return (
                  <div key={item.denomination} className="grid grid-cols-3 gap-2 items-center px-4 py-1.5 border-b border-border/40 hover:bg-surface-alt/30 transition">
                    <div className="font-mono text-sm font-bold">₹{item.denomination}</div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity === 0 ? "" : item.quantity}
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
              <span className="text-xs font-bold text-text-muted uppercase">Withdraw Amount</span>
              <span className="text-xl font-black font-mono text-danger">
                ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        </div>
      </UIModalBody>
      <UIModalFooter>
        <AppButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </AppButton>
        <AppButton onClick={handleSubmit} isLoading={isSubmitting} icon={<FiSave />} disabled={totalAmount <= 0}>
          Confirm Withdrawal
        </AppButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default WithdrawFromSlipModal;
