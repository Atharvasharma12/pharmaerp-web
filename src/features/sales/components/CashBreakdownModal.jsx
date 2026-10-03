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

  const handleSetCount = (type, denom, val) => {
    const setter = type === 'received' ? setReceived : setReturned;
    const num = Math.max(0, parseInt(val, 10) || 0);
    setter(prev => {
      const next = { ...prev };
      if (num === 0) {
        delete next[denom];
      } else {
        next[denom] = num;
      }
      return next;
    });
  };

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

  const totalReceivedNotes = useMemo(() =>
    Object.values(received).reduce((sum, q) => sum + (Number(q) || 0), 0),
    [received]
  );

  const totalReturnedNotes = useMemo(() =>
    Object.values(returned).reduce((sum, q) => sum + (Number(q) || 0), 0),
    [returned]
  );

  const isConfirmDisabled = useMemo(() => {
    if (receivedTotal <= 0) return true;
    if (receivedTotal < targetAmount) return true;
    if (returnedTotal !== expectedChange) return true;
    if (!canMakeChange && receivedTotal > targetAmount) return true;
    return false;
  }, [receivedTotal, targetAmount, returnedTotal, expectedChange, canMakeChange]);

  const handleConfirm = () => {
    if (receivedTotal <= 0) {
      setError("Please select the denominations received from customer.");
      return;
    }
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
            <p className="text-xs text-text-muted">Received Cash ({totalReceivedNotes} notes)</p>
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
              <h3 className="text-sm font-bold text-text">
                Received from Customer ({totalReceivedNotes} notes)
              </h3>
              <button 
                onClick={() => setReceived({})}
                className="text-xs text-text-muted hover:text-error flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="size-3" /> Clear
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DENOMS.map(d => {
                const count = received[d] || 0;
                return (
                  <div key={`rec-${d}`} className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${count > 0 ? 'border-primary bg-primary-soft/20 shadow-xs' : 'border-border bg-surface-alt/40'}`}>
                    <div className="flex justify-between items-center w-full mb-1">
                      <span className="text-xs font-bold text-text">₹{d}</span>
                      {count > 0 && (
                        <span className="text-[10px] font-mono font-bold text-primary">₹{d * count}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 w-full justify-center">
                      <button type="button" onClick={() => handleUpdate('received', d, -1)} className="text-text-muted hover:text-error p-0.5" disabled={count === 0}>
                        <MinusCircle className="size-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={count || ""}
                        onChange={(e) => handleSetCount('received', d, e.target.value)}
                        className="w-12 text-center font-mono font-bold text-xs bg-surface border border-border rounded px-1 py-0.5 focus:border-primary focus:outline-none"
                        placeholder="0"
                      />
                      <button type="button" onClick={() => handleUpdate('received', d, 1)} className="text-text-muted hover:text-success p-0.5">
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
            <div className="flex items-center justify-between pb-2 border-b border-warning/30">
              <h3 className="text-sm font-bold text-warning">
                Returned as Change ({totalReturnedNotes} notes)
              </h3>
              <button 
                onClick={() => setReturned({})}
                className="text-xs text-text-muted hover:text-error flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="size-3" /> Clear
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DENOMS.map(d => {
                const count = returned[d] || 0;
                const availableCount = (availableDenomsMap[d] || 0) + (received[d] || 0);
                return (
                  <div key={`ret-${d}`} className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${count > 0 ? 'border-warning bg-warning-soft/50 shadow-xs' : 'border-warning/30 bg-warning-soft/20'}`}>
                    <div className="flex justify-between w-full items-center mb-1">
                      <span className={`text-xs font-bold ${count > 0 ? 'text-warning' : 'text-text'}`}>₹{d}</span>
                      <span className="text-[9px] text-text-muted border border-border px-1 rounded-sm bg-surface">Avail: {availableCount}</span>
                    </div>
                    <div className="flex items-center gap-1 w-full justify-center">
                      <button type="button" onClick={() => handleUpdate('returned', d, -1)} className="text-text-muted hover:text-error p-0.5" disabled={count === 0}>
                        <MinusCircle className="size-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        max={availableCount}
                        value={count || ""}
                        onChange={(e) => handleSetCount('returned', d, Math.min(availableCount, parseInt(e.target.value, 10) || 0))}
                        className="w-12 text-center font-mono font-bold text-xs bg-surface border border-border rounded px-1 py-0.5 focus:border-primary focus:outline-none"
                        placeholder="0"
                      />
                      <button type="button" onClick={() => handleUpdate('returned', d, 1)} className="text-text-muted hover:text-success p-0.5" disabled={count >= availableCount}>
                        <PlusCircle className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Validation Guidance */}
        <div className="pt-2">
          {receivedTotal <= 0 ? (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-amber-500" />
              <span>Select the exact denominations given by the customer to enable confirmation.</span>
            </div>
          ) : receivedTotal < targetAmount ? (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-amber-500" />
                <span>Received amount (₹{receivedTotal.toFixed(2)}) is less than required (₹{targetAmount.toFixed(2)}).</span>
              </div>
              <span className="font-mono font-bold text-error">
                Short by ₹{(targetAmount - receivedTotal).toFixed(2)}
              </span>
            </div>
          ) : returnedTotal !== expectedChange ? (
            <div className="p-2.5 rounded-lg bg-error-soft border border-error/30 text-error text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>Returned change (₹{returnedTotal.toFixed(2)}) does not match expected change (₹{expectedChange.toFixed(2)}).</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-success-soft border border-success/30 text-success text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 shrink-0 text-success" />
                <span>Exact denomination matched: Received ₹{receivedTotal.toFixed(2)} − Return ₹{returnedTotal.toFixed(2)} = Net ₹{netApplied.toFixed(2)}</span>
              </div>
              <span className="font-mono font-bold text-success">✓ Ready to Confirm</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <UIButton variant="ghost" onClick={onClose}>Cancel</UIButton>
          <UIButton
            variant="primary"
            onClick={handleConfirm}
            className="gap-2"
            disabled={isConfirmDisabled}
          >
            <CheckCircle className="size-4" />
            Confirm Cash
          </UIButton>
        </div>
      </div>
    </UIModal>
  );
}
