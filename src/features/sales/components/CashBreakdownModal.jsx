import React, { useState, useEffect, useMemo } from "react";
import { UIModal, UIButton } from "@/components/ui";
import { PlusCircle, MinusCircle, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

const DENOMS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export function CashBreakdownModal({
  isOpen,
  onClose,
  onConfirm,
  targetAmount = 0,
  initialReceived = {},
  initialReturned = {},
  availableDenominations = [],
  availableBalance = 0,
  cashAccountName = "Cash Account"
}) {
  const [received, setReceived] = useState(initialReceived);
  const [returned, setReturned] = useState(initialReturned);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setReceived(initialReceived || {});
      setReturned(initialReturned || {});
      setError(null);
    }
  }, [isOpen]); // Only initialize on open to prevent resetting on parent re-renders

  const receivedTotal = useMemo(() => 
    Object.entries(received).reduce((sum, [d, q]) => sum + Number(d) * q, 0),
  [received]);

  const returnedTotal = useMemo(() => 
    Object.entries(returned).reduce((sum, [d, q]) => sum + Number(d) * q, 0),
  [returned]);

  const expectedChange = Math.max(0, receivedTotal - targetAmount);
  const netApplied = receivedTotal - returnedTotal;

  const availableDenomsMap = useMemo(() => {
    const map = {};
    if (availableDenominations) {
      availableDenominations.forEach(d => {
        map[d.denomination] = d.quantity;
      });
    }
    return map;
  }, [availableDenominations]);

  const canMakeChange = useMemo(() => {
    if (expectedChange === 0) return true;
    let remaining = expectedChange;
    // Greedy algorithm for checking
    for (const d of DENOMS) {
      const avail = (availableDenomsMap[d] || 0) + (received[d] || 0);
      if (avail > 0 && remaining >= d) {
        const take = Math.min(avail, Math.floor(remaining / d));
        remaining -= take * d;
      }
    }
    return remaining === 0;
  }, [expectedChange, availableDenomsMap, received]);

  // Auto-calculate returned denominations based on expected change
  useEffect(() => {
    if (expectedChange > 0) {
      const autoReturned = {};
      let remaining = expectedChange;
      for (const d of DENOMS) {
        const avail = (availableDenomsMap[d] || 0) + (received[d] || 0);
        if (avail > 0 && remaining >= d) {
          const take = Math.min(avail, Math.floor(remaining / d));
          if (take > 0) {
            autoReturned[d] = take;
            remaining -= take * d;
          }
        }
      }
      setReturned(autoReturned);
    } else {
      setReturned({});
    }
  }, [expectedChange, availableDenomsMap, received]);

  const handleUpdate = (type, denom, delta) => {
    const setter = type === 'received' ? setReceived : setReturned;
    setter(prev => {
      const next = { ...prev };
      const current = next[denom] || 0;
      const nextVal = Math.max(0, current + delta);
      if (nextVal === 0) {
        delete next[denom];
      } else {
        next[denom] = nextVal;
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (receivedTotal < targetAmount) {
      setError(`Received cash (₹${receivedTotal}) is less than target (₹${targetAmount})`);
      return;
    }
    if (returnedTotal !== expectedChange) {
      setError(`Returned change (₹${returnedTotal}) does not match expected (₹${expectedChange})`);
      return;
    }
    setError(null);
    onConfirm({
      received,
      returned,
      receivedTotal,
      returnedTotal,
      netApplied
    });
  };

  if (!isOpen) return null;

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="xl" title="Exact Cash Breakdown">
      <div className="p-5 font-sans space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-surface-alt rounded-xl border border-border">
            <p className="text-xs text-text-muted">Target Amount</p>
            <p className="text-lg font-bold text-text">₹{targetAmount.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-primary-soft/30 rounded-xl border border-primary/20">
            <p className="text-xs text-text-muted">Received Cash</p>
            <p className="text-lg font-bold text-primary">₹{receivedTotal.toFixed(2)}</p>
          </div>
          <div className={`p-3 rounded-xl border ${returnedTotal === expectedChange ? 'bg-success-soft/30 border-success/20' : 'bg-warning-soft/30 border-warning/20'}`}>
            <p className="text-xs text-text-muted">Expected Change</p>
            <p className={`text-lg font-bold ${returnedTotal === expectedChange ? 'text-success' : 'text-warning'}`}>
              ₹{expectedChange.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{cashAccountName} Bal</p>
            <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">₹{availableBalance.toFixed(2)}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-error-soft text-error text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </div>
        )}

        {!canMakeChange && receivedTotal > targetAmount && (
          <div className="p-4 bg-error-soft border border-error/30 text-error rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">No change available in the counter.</p>
              <p className="text-xs opacity-90 mt-1">You do not have the exact physical denominations required to return ₹{expectedChange}. The customer must pay via UPI or provide exact change.</p>
            </div>
          </div>
        )}

        {/* Dual Pane Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Received Pane */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-text">Received from Customer</h3>
              <button 
                onClick={() => setReceived({})}
                className="text-xs text-text-muted hover:text-error flex items-center gap-1"
              >
                <RefreshCw className="size-3" /> Clear
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DENOMS.map(d => {
                const count = received[d] || 0;
                return (
                  <div key={`rec-${d}`} className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${count > 0 ? 'border-primary bg-primary-soft/20' : 'border-border bg-surface-alt/40'}`}>
                    <span className="text-[11px] font-bold text-text-muted mb-1.5">₹{d}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleUpdate('received', d, -1)} className="text-text-muted hover:text-error" disabled={count === 0}>
                        <MinusCircle className="size-4" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{count}</span>
                      <button type="button" onClick={() => handleUpdate('received', d, 1)} className="text-text-muted hover:text-success">
                        <PlusCircle className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Returned Pane */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-text">Returned as Change</h3>
              <button 
                onClick={() => setReturned({})}
                className="text-xs text-text-muted hover:text-error flex items-center gap-1"
              >
                <RefreshCw className="size-3" /> Clear
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DENOMS.map(d => {
                const count = returned[d] || 0;
                const availableCount = (availableDenomsMap[d] || 0) + (received[d] || 0);
                return (
                  <div key={`ret-${d}`} className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${count > 0 ? 'border-success bg-success-soft/10' : 'border-border bg-surface-alt/40'}`}>
                    <div className="flex justify-between w-full items-center mb-1.5 px-1">
                      <span className="text-[11px] font-bold text-text-muted">₹{d}</span>
                      <span className="text-[9px] text-text-muted opacity-70 border border-border px-1 rounded-sm bg-surface">Avail: {availableCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleUpdate('returned', d, -1)} className="text-text-muted hover:text-error" disabled={count === 0}>
                        <MinusCircle className="size-4" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{count}</span>
                      <button type="button" onClick={() => handleUpdate('returned', d, 1)} className="text-text-muted hover:text-success" disabled={count >= availableCount}>
                        <PlusCircle className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <UIButton variant="ghost" onClick={onClose}>Cancel</UIButton>
          <UIButton variant="primary" onClick={handleConfirm} className="gap-2" disabled={!canMakeChange && receivedTotal > targetAmount}>
            <CheckCircle className="size-4" />
            Confirm Cash
          </UIButton>
        </div>
      </div>
    </UIModal>
  );
}
