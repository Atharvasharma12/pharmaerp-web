import React, { useState, useEffect, useMemo } from "react";
import {
  Banknote,
  QrCode,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Percent,
  PlusCircle,
  MinusCircle,
  Calculator,
  Trash2,
  Receipt,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UIModal, UIButton } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";
import usePaymentQr from "@/features/finance/treasury/payment-qr/hooks/usePaymentQr";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import useBranch from "@/features/branch/hooks/useBranch";
import { ROUTES } from "@/constants";
import { CashBreakdownModal } from "./CashBreakdownModal";

/** Safe number parser */
const safeNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/** Compute scheme discount threshold check. */
const computeSchemeDiscount = (qty, schemePercent) => {
  const normalizedQty = safeNum(qty);
  const normalizedScheme = safeNum(schemePercent);
  if (normalizedQty <= 0 || normalizedScheme <= 0) {
    return { schemeApply: false, finalDiscountPercent: 0 };
  }
  if (normalizedScheme === 50) {
    if (normalizedQty < 2) return { schemeApply: false, finalDiscountPercent: 0 };
    return { schemeApply: true, finalDiscountPercent: normalizedScheme };
  }
  const fullFreeQty = (normalizedQty * normalizedScheme) / (100 - normalizedScheme);
  const quarterThreshold = (normalizedScheme / (100 - normalizedScheme)) / 0.4;
  if (fullFreeQty >= quarterThreshold) {
    return { schemeApply: true, finalDiscountPercent: normalizedScheme };
  }
  return { schemeApply: false, finalDiscountPercent: 0 };
};

export const SalesCheckoutModal = ({
  isOpen,
  onClose,
  customer,
  customerPhone,
  doctor,
  saleDate,
  billingMode = "B2C",
  cartSummary = {},
  onCompleteSale,
  activeShift: activeShiftProp,
}) => {
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const { paymentQrs, getPaymentQrs } = usePaymentQr();
  const { cashAccounts, getCashAccounts } = useCashAccount();
  const reduxActiveShift = useSelector((state) => state.shift?.activeShift);
  const activeShift = activeShiftProp ?? reduxActiveShift;

  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      getPaymentQrs({});
      getCashAccounts({ branchId: currentBranch._id, all: "true" });
    }
  }, [isOpen, currentBranch?._id]);

  // Main operating cash counter (Shift drawer / System default)
  const mainCashAccount = useMemo(() => {
    if (!cashAccounts || cashAccounts.length === 0) return null;
    if (activeShift?.cashAccountId) {
      const match = cashAccounts.find(
        (ca) => String(ca._id) === String(activeShift.cashAccountId)
      );
      if (match) return match;
    }
    const sysDefault = cashAccounts.find((ca) => ca.isSystemDefault);
    if (sysDefault) return sysDefault;
    const primary = cashAccounts.find((ca) => ca.isPrimary);
    if (primary) return primary;
    return cashAccounts[0] || null;
  }, [cashAccounts, activeShift?.cashAccountId]);

  const availableCash = useMemo(() => {
    return mainCashAccount?.denominationBalance?.totalBalance ?? 0;
  }, [mainCashAccount]);

  // Primary QR — pre-selected for UPI payments (zero friction for cashier)
  const primaryQr = useMemo(() => {
    if (!paymentQrs || paymentQrs.length === 0) return null;
    return paymentQrs.find((q) => q.isPrimary && q.status === "ACTIVE") ||
           paymentQrs.find((q) => q.status === "ACTIVE") ||
           paymentQrs[0] || null;
  }, [paymentQrs]);

  const [discountPercent, setDiscountPercent] = useState(customer?.defaultDiscount || 0);
  const [notes, setNotes] = useState("");

  // Detailed Billing & Tax Calculations
  const items = cartSummary?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * Math.max(1, Number(item.qty) || 1), 0);
  const isB2B = billingMode === "B2B";

  const itemDiscount = items.reduce((sum, item) => {
    return sum + ((Number(item.price) || 0) * Math.max(1, Number(item.qty) || 1) * (Number(item.disc) || 0)) / 100;
  }, 0);

  const schemeDiscount = isB2B ? items.reduce((sum, item) => {
    if (!item?.schemeDiscountPercent) return sum;
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    const schemePct = Number(item.schemeDiscountPercent) || 0;
    const schemeCheck = computeSchemeDiscount(qty, schemePct);
    if (!schemeCheck.schemeApply) return sum;
    return sum + (rate * qty * schemePct) / 100;
  }, 0) : 0;

  const subtotalAfterDiscounts = subtotal - itemDiscount - schemeDiscount;
  const extraDiscountAmt = (subtotalAfterDiscounts * (Number(discountPercent) || 0)) / 100;

  const gstSlabMap = {};
  items.forEach((item) => {
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    const discPct = Number(item.disc) || 0;
    const rawSchemePct = isB2B ? (Number(item.schemeDiscountPercent) || 0) : 0;
    const schemeCheck = computeSchemeDiscount(qty, rawSchemePct);
    const schemePct = schemeCheck.schemeApply ? rawSchemePct : 0;
    const lineSubtotal = rate * qty * (1 - discPct / 100) * (1 - schemePct / 100);
    const lineFinal = lineSubtotal * (1 - (Number(discountPercent) || 0) / 100);
    const gstPct = Number(item.gst !== undefined && item.gst !== null ? item.gst : 5);

    let taxable, taxAmt;
    if (isB2B) {
      taxable = lineFinal;
      taxAmt = lineFinal * (gstPct / 100);
    } else {
      taxable = lineFinal / (1 + gstPct / 100);
      taxAmt = lineFinal - taxable;
    }
    const halfTax = taxAmt / 2;
    if (!gstSlabMap[gstPct]) gstSlabMap[gstPct] = { gstPct, taxable: 0, cgst: 0, sgst: 0, total: 0 };
    gstSlabMap[gstPct].taxable += taxable;
    gstSlabMap[gstPct].cgst += halfTax;
    gstSlabMap[gstPct].sgst += halfTax;
    gstSlabMap[gstPct].total += taxAmt;
  });

  const gstSlabs = Object.values(gstSlabMap).sort((a, b) => a.gstPct - b.gstPct);
  const totalTaxable = gstSlabs.reduce((acc, s) => acc + s.taxable, 0);
  const totalGst = gstSlabs.reduce((acc, s) => acc + s.total, 0);
  const exactGrandTotal = Math.max(0, totalTaxable + totalGst);
  const grandTotal = Math.round(exactGrandTotal);
  const roundOff = grandTotal - exactGrandTotal;

  // Multi-Row Payments State
  const [payments, setPayments] = useState([]);
  
  // Initialize payments when modal opens
  useEffect(() => {
    if (isOpen) {
      setPayments([
        {
          id: Date.now(),
          paymentType: "Cash",
          amount: grandTotal,
          cashAccountId: mainCashAccount?._id || "",
        },
      ]);
    }
  }, [isOpen, grandTotal, mainCashAccount?._id]);

  const [cashBreakdownTarget, setCashBreakdownTarget] = useState(null); // index of row

  const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [payments]);
  const shortfall = Math.max(0, grandTotal - totalPaid);

  const handleUpdate = (index, field, value) => {
    const next = [...payments];
    const updated = { ...next[index], [field]: value };
    if (field === "paymentType" && value === "Cash") {
      updated.cashAccountId = mainCashAccount?._id || "";
      delete updated.paymentQrId;
    }
    // Auto-select primary QR when switching to UPI
    if (field === "paymentType" && (value === "UPI")) {
      if (!updated.paymentQrId && primaryQr?._id) {
        updated.paymentQrId = String(primaryQr._id);
      }
    }
    if (field === "paymentType" && value !== "Cash") {
      delete updated.cashDetails;
    }
    if (field === "amount" && updated.paymentType === "Cash" && updated.cashDetails) {
      if (Number(value) !== Number(next[index].amount)) {
        updated.cashDetails = null;
      }
    }
    next[index] = updated;
    setPayments(next);
  };

  const hasUncapturedCash = useMemo(() => {
    return payments.some((p) => {
      if (p.paymentType !== "Cash") return false;
      const target = Number(p.amount) || 0;
      if (target <= 0) return false;
      if (!p.cashDetails) return true;
      const received = Number(p.cashDetails.receivedTotal) || 0;
      const returned = Number(p.cashDetails.returnedTotal) || 0;
      const expectedChange = Math.max(0, received - target);
      return received < target || returned !== expectedChange;
    });
  }, [payments]);

  const handleAddRow = () => {
    setPayments([
      ...payments,
      {
        id: Date.now(),
        paymentType: "Cash",
        amount: shortfall,
        cashAccountId: mainCashAccount?._id || "",
        paymentQrId: undefined,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const next = [...payments];
    next.splice(index, 1);
    if (next.length === 0) next.push({ id: Date.now(), paymentType: "Cash", amount: grandTotal });
    setPayments(next);
  };

  const handleConfirmCashBreakdown = (data) => {
    if (cashBreakdownTarget !== null) {
      handleUpdate(cashBreakdownTarget, 'cashDetails', data);
      setCashBreakdownTarget(null);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleProcessSale = async () => {
    if (totalPaid < grandTotal) {
      setErrorMessage(`Cannot process sale. Collected amount (₹${totalPaid.toFixed(2)}) is less than Grand Total (₹${grandTotal.toFixed(2)}).`);
      return;
    }

    if (hasUncapturedCash) {
      setErrorMessage("Please capture the exact cash denominations given by the customer for all cash payments.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const prefix = isB2B ? "TAX-INV" : "RET-INV";
      const salePayload = {
        invoiceNo: `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: customerPhone ? { ...customer, phone: customerPhone } : customer,
        doctor: doctor || null,
        date: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
        billingMode,
        partyType: isB2B ? customer?.partyType || "wholesaler" : "retail_consumer",
        items,
        subtotal,
        itemDiscount,
        schemeDiscount,
        extraDiscount: extraDiscountAmt,
        taxableAmount: totalTaxable,
        tax: totalGst,
        roundOff,
        grandTotal,
        gstSlabs,
        paymentMethod: "Split",
        cashTendered: payments.reduce((sum, p) => p.paymentType === "Cash" ? sum + (p.cashDetails?.receivedTotal || Number(p.amount)) : sum, 0),
        changeDue: payments.reduce((sum, p) => p.paymentType === "Cash" ? sum + (p.cashDetails?.returnedTotal || 0) : sum, 0),
        denominations: [],
        payments: payments.map(p => ({
          paymentType: p.paymentType,
          amount: Number(p.amount),
          paymentQrId: p.paymentQrId,
          txnRefNo: p.txnRefNo,
          cashAccountId: p.paymentType === "Cash" ? (mainCashAccount?._id || p.cashAccountId) : undefined,
          denominations: p.cashDetails?.received 
            ? Object.entries(p.cashDetails.received).map(([val, qty]) => ({ denomination: Number(val), quantity: qty }))
            : [],
          returnedDenominations: p.cashDetails?.returned 
            ? Object.entries(p.cashDetails.returned).map(([val, qty]) => ({ denomination: Number(val), quantity: qty }))
            : [],
        })),
        notes,
      };

      await onCompleteSale(salePayload);
    } catch (err) {
      console.error("Sale invoice creation error:", err);
      setErrorMessage(err?.response?.data?.message || err.message || "Failed to create invoice in backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="3xl" title="Sale Preview & Checkout">
      <div className="p-0 font-sans flex flex-col md:flex-row h-[85vh] md:h-[700px] overflow-hidden">
        
        {/* Left Column: Receipt Preview */}
        <div className="flex-1 overflow-y-auto border-r border-border bg-surface-alt flex flex-col items-center py-6 px-4">
          <div className="bg-surface shadow-lg mx-auto w-full max-w-md p-6 font-mono text-sm text-text border-t-4 border-primary relative">
            <div className="text-center mb-6 border-b border-dashed border-border pb-4">
              <h2 className="text-xl font-bold uppercase tracking-widest">{isB2B ? 'Tax Invoice' : 'Retail Receipt'}</h2>
              <p className="text-xs text-text-muted mt-1">{new Date().toLocaleString()}</p>
            </div>

            <div className="mb-6 space-y-1 text-xs">
              <p><span className="font-bold">Billed To:</span> {customer?.name || "Walk-in Customer"}</p>
              {customer?.mobile && <p><span className="font-bold">Phone:</span> {customer.mobile}</p>}
              {customer?.gstin && <p><span className="font-bold">GSTIN:</span> {customer.gstin}</p>}
            </div>

            <div className="border-t border-b border-dashed border-border py-3 mb-4">
              <div className="flex justify-between font-bold mb-2 text-xs uppercase">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                {itemDiscount > 0 && <div className="flex justify-between"><span>Item Discount</span><span>-₹{itemDiscount.toFixed(2)}</span></div>}
                {schemeDiscount > 0 && <div className="flex justify-between"><span>Scheme Disc</span><span>-₹{schemeDiscount.toFixed(2)}</span></div>}
                {extraDiscountAmt > 0 && <div className="flex justify-between"><span>Extra Disc ({discountPercent}%)</span><span>-₹{extraDiscountAmt.toFixed(2)}</span></div>}
                <div className="flex justify-between pt-2 mt-2 border-t border-dotted border-border"><span>Taxable Value</span><span>₹{totalTaxable.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST</span><span>₹{totalGst.toFixed(2)}</span></div>
                {roundOff !== 0 && <div className="flex justify-between"><span>Round Off</span><span>{roundOff > 0 ? '+' : '-'}₹{Math.abs(roundOff).toFixed(2)}</span></div>}
              </div>
            </div>

            <div className="flex justify-between items-end bg-surface-alt p-3 rounded-lg border border-border">
              <div className="uppercase tracking-widest text-xs font-bold text-text-muted">Grand Total</div>
              <div className="text-2xl font-black text-text tabular-nums">₹{grandTotal.toFixed(2)}</div>
            </div>

            {/* Extra Discount Input within Receipt Area for convenience */}
            <div className="mt-6 pt-4 border-t border-dashed border-border space-y-3 font-sans">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block text-center">Apply Extra Discount (%)</label>
              <div className="flex gap-2 justify-center">
                {[0, 5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-3 py-1.5 rounded border text-xs font-bold transition-all ${Number(discountPercent) === pct ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-text hover:bg-surface-alt"}`}
                  >
                    {pct}%
                  </button>
                ))}
                <input
                  type="number" min="0" max="100"
                  value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono font-bold text-center focus:border-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payments */}
        <div className="flex-1 w-[450px] shrink-0 bg-surface-alt/20 flex flex-col">
          <div className="p-5 border-b border-border bg-surface-alt/50 flex justify-between items-center">
            <h3 className="font-bold text-text text-lg flex items-center gap-2">
              <Banknote className="size-5 text-primary" /> Payments
            </h3>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${shortfall === 0 ? 'bg-success-soft text-success border-success/30' : 'bg-warning-soft text-warning border-warning/30'}`}>
              Shortfall: ₹{shortfall.toFixed(2)}
            </div>
          </div>

          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {payments.map((row, index) => (
              <div key={row.id} className="p-4 rounded-xl border border-border bg-surface shadow-xs space-y-3 relative group">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Payment Type</label>
                    <select 
                      value={row.paymentType} 
                      onChange={(e) => handleUpdate(index, 'paymentType', e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface-alt text-sm font-semibold focus:border-primary focus:outline-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI / QR</option>
                      <option value="Card">Card</option>
                      <option value="Wallet">Wallet / Advance</option>
                      <option value="Credit">Credit / Ledger</option>
                    </select>
                  </div>
                  <div className="w-1/3 space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Amount</label>
                    <input 
                      type="number"
                      value={row.amount}
                      onChange={(e) => handleUpdate(index, 'amount', e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface-alt text-sm font-mono font-bold focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {row.paymentType === "UPI" && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-top-1">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Receiving UPI Account</label>
                      <select 
                        value={row.paymentQrId || (primaryQr?._id ? String(primaryQr._id) : "")}
                        onChange={(e) => handleUpdate(index, 'paymentQrId', e.target.value)}
                        className="w-full p-1.5 rounded-md border border-border bg-surface-alt text-xs focus:border-primary focus:outline-none"
                      >
                        {paymentQrs && paymentQrs.filter(q => q.status === "ACTIVE").map(qr => (
                          <option key={qr._id} value={String(qr._id)}>
                            {qr.label ? `${qr.label} — ${qr.upiId}` : qr.upiId}
                            {qr.isPrimary ? " ★" : ""}
                          </option>
                        ))}
                        {(!paymentQrs || paymentQrs.filter(q => q.status === "ACTIVE").length === 0) && (
                          <option value="">No active UPI QR configured</option>
                        )}
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Txn Ref (Optional)</label>
                      <input 
                        type="text" placeholder="UPI Ref No..."
                        value={row.txnRefNo || ""} onChange={(e) => handleUpdate(index, 'txnRefNo', e.target.value)}
                        className="w-full p-1.5 rounded-md border border-border bg-surface-alt text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {row.paymentType === "Cash" && (
                  <div className="p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/20 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Wallet className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                            Cash Counter
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            {activeShift ? "Shift Cash Drawer" : "Main Counter"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-text truncate">
                          {mainCashAccount?.accountName || "Main Cash Counter"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Cash Available
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{Number(availableCash).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}

                {row.paymentType === "Cash" && row.cashDetails && (() => {
                  const receivedMap = row.cashDetails.received || {};
                  const returnedMap = row.cashDetails.returned || {};
                  const receivedEntries = Object.entries(receivedMap)
                    .filter(([_, qty]) => Number(qty) > 0)
                    .sort(([a], [b]) => Number(b) - Number(a));
                  const returnedEntries = Object.entries(returnedMap)
                    .filter(([_, qty]) => Number(qty) > 0)
                    .sort(([a], [b]) => Number(b) - Number(a));
                  const totalNotesGiven = receivedEntries.reduce((sum, [_, qty]) => sum + Number(qty), 0);
                  const totalNotesReturned = returnedEntries.reduce((sum, [_, qty]) => sum + Number(qty), 0);

                  return (
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2.5 animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-500/20">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                          Exact Denomination Summary
                        </span>
                        <span className="font-mono font-bold text-text">
                          Given: ₹{Number(row.cashDetails.receivedTotal).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Notes Given by Customer */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-text-muted">
                          <span className="font-semibold uppercase tracking-wider text-[10px]">
                            Notes Given by Customer ({totalNotesGiven} note{totalNotesGiven === 1 ? "" : "s"}):
                          </span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(row.cashDetails.receivedTotal).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {receivedEntries.map(([denom, qty]) => (
                            <span
                              key={`summary-rec-${denom}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface border border-emerald-500/30 text-xs font-mono font-medium text-text shadow-2xs"
                            >
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{denom}</span>
                              <span className="text-text-muted text-[10px]">×</span>
                              <span className="font-bold">{qty}</span>
                              <span className="text-[10px] text-text-muted font-normal">(₹{Number(denom) * Number(qty)})</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Change Returned (if any) */}
                      {Number(row.cashDetails.returnedTotal) > 0 && (
                        <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-text-muted">
                            <span className="font-semibold uppercase tracking-wider text-[10px] text-warning">
                              Change Returned ({totalNotesReturned} note{totalNotesReturned === 1 ? "" : "s"}):
                            </span>
                            <span className="font-mono font-bold text-warning">
                              ₹{Number(row.cashDetails.returnedTotal).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {returnedEntries.map(([denom, qty]) => (
                              <span
                                key={`summary-ret-${denom}`}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-warning-soft/40 border border-warning/30 text-[10px] font-mono font-medium text-warning"
                              >
                                <span>₹{denom}</span>
                                <span>×</span>
                                <span className="font-bold">{qty}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Net Amount Reconciled */}
                      <div className="pt-1.5 border-t border-emerald-500/20 flex justify-between items-center text-xs">
                        <span className="text-text-muted font-medium">Net Cash Collected:</span>
                        <span className="font-mono font-bold text-primary">
                          ₹{Number(row.cashDetails.netApplied || row.amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {row.paymentType === "Cash" && !row.cashDetails && (
                  <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
                      <AlertCircle className="size-4 shrink-0 text-amber-600" />
                      <span>Exact cash denominations not selected (Required)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCashBreakdownTarget(index)}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                    >
                      <Calculator className="size-3.5" />
                      Select Notes
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  {row.paymentType === "Cash" ? (
                    <button 
                      type="button"
                      onClick={() => setCashBreakdownTarget(index)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${row.cashDetails ? 'bg-primary-soft text-primary border-primary/40 shadow-xs' : 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25'}`}
                    >
                      <Calculator className="size-3.5" /> 
                      {row.cashDetails ? 'Edit Cash Breakdown' : 'Select Exact Denominations *'}
                    </button>
                  ) : <div></div>}

                  {payments.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveRow(index)}
                      className="p-1.5 rounded-lg text-text-muted hover:bg-error-soft hover:text-error transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              type="button" onClick={handleAddRow}
              className="w-full p-3 rounded-xl border border-dashed border-primary/40 text-primary font-bold text-sm bg-primary-soft/10 hover:bg-primary-soft/30 transition-colors flex items-center justify-center gap-2"
            >
              <PlusCircle className="size-4" /> Add Payment Method
            </button>
          </div>

          <div className="p-5 border-t border-border bg-surface-alt/80">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-error-soft/60 border border-error/30 text-error flex items-center gap-2.5 text-xs font-semibold">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {hasUncapturedCash && !errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center gap-2.5 text-xs font-semibold">
                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                <span>Please select exact customer cash denominations to enable confirmation.</span>
              </div>
            )}
            
            <div className="flex gap-3">
              <UIButton variant="outline" size="lg" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </UIButton>
              <PermissionGate
                permission="pos:create"
                fallback={<UIButton variant="primary" size="lg" className="flex-[2]" disabled>Permission Required</UIButton>}
              >
                <UIButton
                  variant="primary" size="lg" className="flex-[2] gap-2"
                  loading={isSubmitting}
                  disabled={isSubmitting || shortfall > 0 || hasUncapturedCash}
                  onClick={handleProcessSale}
                >
                  <CheckCircle2 className="size-5" /> 
                  Confirm Collection
                </UIButton>
              </PermissionGate>
            </div>
          </div>
        </div>

      </div>

      {(() => {
        const selectedCashAccount = mainCashAccount;
        
        return (
          <CashBreakdownModal
            isOpen={cashBreakdownTarget !== null}
            onClose={() => setCashBreakdownTarget(null)}
            onConfirm={handleConfirmCashBreakdown}
            targetAmount={cashBreakdownTarget !== null ? Number(payments[cashBreakdownTarget]?.amount || 0) : 0}
            initialReceived={cashBreakdownTarget !== null ? payments[cashBreakdownTarget]?.cashDetails?.received : {}}
            initialReturned={cashBreakdownTarget !== null ? payments[cashBreakdownTarget]?.cashDetails?.returned : {}}
            availableDenominations={selectedCashAccount?.denominationBalance?.denominations || []}
            availableBalance={selectedCashAccount?.denominationBalance?.totalBalance || 0}
            cashAccountName={selectedCashAccount?.accountName || "Main Cash Counter"}
          />
        );
      })()}
    </UIModal>
  );
};

export default SalesCheckoutModal;
