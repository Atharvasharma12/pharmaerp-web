import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Banknote,
  QrCode,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Building2,
  ArrowRight
} from "lucide-react";
import { UISelect, UIButton, UIBadge } from "@/components/ui";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import usePaymentQr from "@/features/finance/treasury/payment-qr/hooks/usePaymentQr";
import useBranch from "@/features/branch/hooks/useBranch";
import { CashBreakdownModal, decomposeAmount } from "@/features/sales/components/CashBreakdownModal";
import { cn } from "@/lib/utils";

export const INDIAN_DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

/** Convert a denominations array [{denomination, quantity}] into a {denom: qty} map + total */
const denomsToMap = (list = []) => {
  const map = {};
  let total = 0;
  (list || []).forEach((d) => {
    const qty = Number(d?.quantity) || 0;
    const denom = Number(d?.denomination) || 0;
    if (qty > 0 && denom > 0) {
      map[denom] = (map[denom] || 0) + qty;
      total += denom * qty;
    }
  });
  return { map, total };
};

/**
 * CustomerPaymentMethodPanel
 * Reusable payment panel mirroring Invoice Creation (SalesCheckoutModal):
 * - Cash: Shift drawer balance card, 1-click "Exact ₹X" decompose button,
 *   "Drawer Notes *" button triggering CashBreakdownModal, captured note badges (₹500×2, etc.)
 * - UPI: 2-column layout (UISelect with account/primary QR + Txn Ref No / UTR) with Shift Hold guarantee.
 */
export default function CustomerPaymentMethodPanel({
  paymentMethod = "Cash",
  onChangePaymentMethod,
  allowedMethods = ["Cash", "UPI"],
  requiredAmount = 0,
  onCashChange,
  onUpiChange,
  initialDenominations = [],
  initialReturnedDenominations = [],
  initialPaymentQrId = "",
  initialUtr = "",
  className = "",
}) {
  const { currentBranch } = useBranch();
  const { paymentQrs, getPaymentQrs } = usePaymentQr();
  const { fetchBranchCash, runningCash, runningDenominations } = useBranchCash();
  const activeShift = useSelector((state) => state.shift?.activeShift);

  const [cashDetails, setCashDetails] = useState(() => {
    if (initialDenominations && initialDenominations.length > 0) {
      const rec = denomsToMap(initialDenominations);
      const ret = denomsToMap(initialReturnedDenominations);
      return {
        received: rec.map,
        receivedTotal: rec.total,
        returned: ret.map,
        returnedTotal: ret.total,
        netApplied: rec.total - ret.total,
      };
    }
    return null;
  });

  const [isCashDrawerOpen, setIsCashDrawerOpen] = useState(false);
  const [selectedQrId, setSelectedQrId] = useState(initialPaymentQrId || "");
  const [utrNumber, setUtrNumber] = useState(initialUtr || "");

  // Load branch cash and payment QRs
  useEffect(() => {
    if (currentBranch?._id) {
      getPaymentQrs({});
      fetchBranchCash(currentBranch._id);
    }
  }, [currentBranch?._id, getPaymentQrs, fetchBranchCash]);

  // Active payment QRs and auto-select primary QR
  const activeQrs = useMemo(() => {
    return (paymentQrs || []).filter((q) => q.status === "ACTIVE");
  }, [paymentQrs]);

  const primaryQr = useMemo(() => {
    if (activeQrs.length === 0) return null;
    return activeQrs.find((q) => q.isPrimary) || activeQrs[0];
  }, [activeQrs]);

  useEffect(() => {
    if (activeQrs.length > 0 && !selectedQrId) {
      const targetId = primaryQr?._id || activeQrs[0]._id;
      if (targetId) setSelectedQrId(String(targetId));
    }
  }, [activeQrs, selectedQrId, primaryQr]);

  const upiOptions = useMemo(() => {
    if (activeQrs.length === 0) {
      return [{ value: "", label: "No active UPI QR configured", disabled: true }];
    }
    return activeQrs.map((qr) => ({
      value: String(qr._id),
      label: qr.label ? `${qr.label} (${qr.upiId})${qr.isPrimary ? " ★" : ""}` : qr.upiId,
      icon: <QrCode className="size-3.5 text-purple-600" />,
    }));
  }, [activeQrs]);

  const selectedQr = useMemo(() => {
    return activeQrs.find((q) => String(q._id) === String(selectedQrId)) || null;
  }, [activeQrs, selectedQrId]);

  // When required amount changes, invalidate cashDetails if netApplied doesn't match
  const target = Math.round(Number(requiredAmount) || 0);
  useEffect(() => {
    if (cashDetails && cashDetails.netApplied !== target) {
      setCashDetails(null);
    }
  }, [target, cashDetails]);

  // Propagate Cash state to parent
  useEffect(() => {
    if (!onCashChange) return;

    if (cashDetails && cashDetails.netApplied === target && target > 0) {
      const denominations = Object.entries(cashDetails.received || {})
        .map(([d, q]) => ({ denomination: Number(d), quantity: Number(q) || 0 }))
        .filter((item) => item.quantity > 0 && item.denomination > 0);

      const returnedDenominations = Object.entries(cashDetails.returned || {})
        .map(([d, q]) => ({ denomination: Number(d), quantity: Number(q) || 0 }))
        .filter((item) => item.quantity > 0 && item.denomination > 0);

      onCashChange({
        isValid: true,
        receivedTotal: cashDetails.receivedTotal,
        returnedTotal: cashDetails.returnedTotal,
        netApplied: cashDetails.netApplied,
        denominations,
        returnedDenominations,
      });
    } else {
      onCashChange({
        isValid: false,
        receivedTotal: 0,
        returnedTotal: 0,
        netApplied: 0,
        denominations: [],
        returnedDenominations: [],
      });
    }
  }, [cashDetails, target, onCashChange]);

  // Propagate UPI state to parent
  useEffect(() => {
    if (!onUpiChange) return;
    onUpiChange({
      isValid: !!selectedQrId,
      paymentQrId: selectedQrId,
      referenceNo: utrNumber,
      selectedQr,
    });
  }, [selectedQrId, utrNumber, selectedQr, onUpiChange]);

  // Exact cash tender action
  const handleExactCash = () => {
    if (target <= 0) return;
    const exactMap = decomposeAmount(target);
    setCashDetails({
      received: exactMap,
      returned: {},
      receivedTotal: target,
      returnedTotal: 0,
      netApplied: target,
    });
  };

  // Confirm breakdown from CashBreakdownModal
  const handleConfirmCashBreakdown = (data) => {
    setCashDetails(data);
    setIsCashDrawerOpen(false);
  };

  const availableCash = runningCash || 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* ── 1. Payment Method Pills Selection (Matches Invoice Checkout) ── */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
          Select Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              id: "Cash",
              label: "Cash",
              icon: Banknote,
              color: "text-emerald-600",
              activeCls:
                "bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30",
            },
            {
              id: "UPI",
              label: "UPI / QR",
              icon: QrCode,
              color: "text-purple-600",
              activeCls:
                "bg-purple-500/15 border-purple-500/50 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30",
            },
            {
              id: "Advance",
              label: "Advance Deposit",
              icon: Wallet,
              color: "text-amber-600",
              activeCls:
                "bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30",
            },
          ]
            .filter((m) => allowedMethods.includes(m.id))
            .map((m) => {
              const Icon = m.icon;
              const isActive = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePaymentMethod && onChangePaymentMethod(m.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs",
                    isActive
                      ? m.activeCls
                      : "border-border bg-surface text-text hover:bg-surface-hover"
                  )}
                >
                  <Icon className={cn("size-4", m.color)} />
                  <span>{m.label}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* ── 2. Cash Payment Section (Matches Invoice Checkout) ── */}
      {paymentMethod === "Cash" && (
        <div className="p-3 rounded-xl border border-border bg-surface shadow-xs space-y-2.5 animate-in fade-in">
          {/* Row 1: Drawer Info (Col 1) & Stepper / Exact Button (Col 2) */}
          <div className="grid grid-cols-2 gap-2.5 items-center">
            {/* Col 1: Shift Drawer Available */}
            <div className="p-2 rounded-lg border border-success/20 bg-success-soft/10 flex items-center gap-2">
              <Wallet className="size-3.5 text-success shrink-0" />
              <div className="min-w-0">
                <span className="text-[9.5px] font-bold text-text-muted uppercase block leading-none">
                  {activeShift ? "Shift Drawer" : "Running Cash"}
                </span>
                <span className="text-[11px] font-mono font-bold text-success truncate block">
                  ₹{Number(availableCash).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Col 2: Notes / Denominations Stepper Buttons */}
            <div className="flex items-center gap-1.5">
              {!cashDetails && (
                <UIButton
                  variant="outline"
                  size="xs"
                  type="button"
                  onClick={handleExactCash}
                  disabled={target <= 0}
                  className="h-8 text-[10.5px] font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 shrink-0"
                  title="Instantly accept exact cash notes"
                >
                  Exact ₹{target}
                </UIButton>
              )}
              <UIButton
                variant={cashDetails ? "soft" : "outline"}
                size="xs"
                fullWidth={!!cashDetails}
                onClick={() => setIsCashDrawerOpen(true)}
                startIcon={<Calculator className="size-3" />}
                className={cn(
                  "h-8 text-[11px] font-bold flex-1",
                  !cashDetails ? "border-amber-400/60 text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20" : ""
                )}
              >
                {cashDetails ? "Edit Notes" : "Drawer Notes *"}
              </UIButton>
            </div>
          </div>

          {/* Row 2: Captured Denominations Summary (2-column badges) */}
          {cashDetails ? (
            (() => {
              const receivedMap = cashDetails.received || {};
              const returnedMap = cashDetails.returned || {};
              const receivedEntries = Object.entries(receivedMap)
                .filter(([, qty]) => Number(qty) > 0)
                .sort(([a], [b]) => Number(b) - Number(a));
              const returnedEntries = Object.entries(returnedMap)
                .filter(([, qty]) => Number(qty) > 0)
                .sort(([a], [b]) => Number(b) - Number(a));

              return (
                <div className="p-2 rounded-lg border border-success/30 bg-success-soft/10 text-[10.5px] font-mono space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-[10px] font-bold text-success">
                    <span>Notes Received: ₹{Number(cashDetails.receivedTotal).toLocaleString("en-IN")}</span>
                    <span>Net Applied: ₹{Number(cashDetails.netApplied || target).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {receivedEntries.map(([denom, qty]) => (
                      <span
                        key={`rec-${denom}`}
                        className="px-1.5 py-0.5 rounded bg-surface border border-success/30 text-[10px] font-bold text-text"
                      >
                        ₹{denom}×{qty}
                      </span>
                    ))}
                  </div>
                  {Number(cashDetails.returnedTotal) > 0 && (
                    <div className="pt-1 border-t border-success/20 flex items-center justify-between text-[10px] text-warning font-bold">
                      <span>Change Returned:</span>
                      <span>₹{Number(cashDetails.returnedTotal).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="p-2 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center gap-1.5 text-[10.5px] text-amber-700 dark:text-amber-300 font-medium animate-in fade-in">
              <AlertCircle className="size-3.5 text-amber-600 shrink-0" />
              <span>Exact currency denominations required for this cash payment.</span>
            </div>
          )}
        </div>
      )}

      {/* ── 3. UPI Payment Section (Matches Invoice Checkout) ── */}
      {paymentMethod === "UPI" && (
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-xs space-y-2.5 animate-in fade-in">
          {/* 2-Column: UPI Account + Txn Ref No */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                UPI Account *
              </label>
              <UISelect
                value={selectedQrId}
                onChange={(val) => setSelectedQrId(val)}
                options={upiOptions}
                size="sm"
                placeholder="Select UPI Account"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Txn Ref No / UTR (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. UPI Ref / Txn ID"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full h-8 rounded-lg border border-border bg-surface-alt text-xs focus:border-primary focus:outline-none px-2.5 font-mono"
              />
            </div>
          </div>

          {/* Shift Hold Guarantee Notice */}
          <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-500/5 flex items-center gap-2 text-[10.5px] text-text-muted">
            <QrCode className="size-4 text-purple-600 shrink-0" />
            <div>
              <span className="font-semibold text-text">Shift Hold Guarantee: </span>
              <span>
                Amount held at shift position ({activeShift ? `Shift #${activeShift.shiftNo || "Active"}` : "Shift Active"}) and automatically credited to{" "}
                <strong className="text-purple-700 dark:text-purple-300">
                  {selectedQr?.bankAccountId?.accountName || selectedQr?.label || "Bank Account"}
                </strong>{" "}
                upon closing the shift.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── 3.5 Advance Payment Section ── */}
      {paymentMethod === "Advance" && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-200 animate-in fade-in">
          <Wallet className="size-4 text-amber-600 shrink-0" />
          <span>
            Settlement amount of <strong className="font-mono font-bold">₹{target.toLocaleString("en-IN")}</strong> will be deducted directly from customer's prepaid advance balance.
          </span>
        </div>
      )}

      {/* ── 4. Reusable CashBreakdownModal (Max ₹500, exact drawer note keypad) ── */}
      <CashBreakdownModal
        isOpen={isCashDrawerOpen}
        onClose={() => setIsCashDrawerOpen(false)}
        onConfirm={handleConfirmCashBreakdown}
        targetAmount={target}
        initialReceived={cashDetails?.received || {}}
        initialReturned={cashDetails?.returned || {}}
        availableDenominations={runningDenominations || []}
        availableBalance={availableCash}
        cashAccountName="Shift Cash Drawer"
      />
    </div>
  );
}
