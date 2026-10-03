import React, { useState, useEffect } from "react";
import { UIModal, UIModalHeader, UIModalTitle, UIModalBody, UIModalFooter, AppButton, AppInput } from "@/components";
import { FiSave, FiAlertCircle } from "react-icons/fi";
import { useBranchCash } from "../hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const InitializeBranchCashModal = ({ isOpen, onClose }) => {
  const { currentBranch } = useBranch();
  const { initializeBranchCash, initializeStatus, error: apiError, resetStatus } = useBranchCash();

  const [denominations, setDenominations] = useState(
    DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 }))
  );
  const [narration, setNarration] = useState("");
  const [error, setError] = useState("");

  const isSubmitting = initializeStatus === "loading";

  useEffect(() => {
    if (isOpen) {
      setDenominations(DENOMINATIONS.map((d) => ({ denomination: d, quantity: 0 })));
      setNarration("");
      setError("");
      resetStatus();
    }
  }, [isOpen, resetStatus]);

  useEffect(() => {
    if (initializeStatus === "success") {
      onClose();
      resetStatus();
    }
  }, [initializeStatus, onClose, resetStatus]);

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
      setError("Opening amount must be greater than zero.");
      return;
    }
    
    // Filter out zero quantities for payload
    const openingDenominations = denominations.filter(d => d.quantity > 0);

    const payload = {
      branchId: currentBranch._id,
      branchName: currentBranch.name || currentBranch.branchName || "",
      openingAmount: totalAmount,
      openingDenominations,
      narration,
    };

    try {
      await initializeBranchCash(payload).unwrap();
      onClose();
    } catch (err) {
      // Error is handled by Redux state, shown below
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
        <UIModalTitle>Initialize Branch Cash</UIModalTitle>
      </UIModalHeader>
      <UIModalBody>
        <div className="flex flex-col gap-5 p-1">
        {(error || apiError) && (
          <div className="p-3 bg-danger-soft text-danger rounded-lg flex items-start gap-2 text-sm border border-danger/20">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <div>{error || apiError}</div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm">
          <strong>Note:</strong> Initializing branch cash will set the opening balance in the <strong>RUNNING</strong> partition. Ensure the physical cash matches this amount.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: General Info */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted mb-1 block">
                Branch
              </label>
              <div className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm font-medium">
                {currentBranch?.name || "Unknown Branch"}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-muted mb-1">
                Narration (Optional)
              </label>
              <textarea
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                disabled={isSubmitting}
                placeholder="Initial setup notes..."
                className="w-full text-sm bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-primary transition min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Right: Denominations */}
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
              <span className="text-xs font-bold text-text-muted uppercase">Total Opening</span>
              <span className="text-xl font-black font-mono text-success">
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
        <AppButton onClick={handleSubmit} isLoading={isSubmitting} icon={<FiSave />}>
          Initialize Cash
        </AppButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default InitializeBranchCashModal;
