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
import { UIModal, UIButton } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";
import usePaymentQr from "@/features/finance/treasury/payment-qr/hooks/usePaymentQr";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
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
}) => {
  const navigate = useNavigate();
  const { paymentQrs, getPaymentQrs } = usePaymentQr();
  const { cashAccounts, getCashAccounts } = useCashAccount();

  useEffect(() => {
    if (isOpen) {
      getPaymentQrs({});
      getCashAccounts({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
      setPayments([{ id: Date.now(), paymentType: "Cash", amount: grandTotal }]);
    }
  }, [isOpen, grandTotal]);

  const [cashBreakdownTarget, setCashBreakdownTarget] = useState(null); // index of row

  const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [payments]);
  const shortfall = Math.max(0, grandTotal - totalPaid);

  const handleUpdate = (index, field, value) => {
    const next = [...payments];
    next[index] = { ...next[index], [field]: value };
    setPayments(next);
  };

  const handleAddRow = () => {
    setPayments([...payments, { id: Date.now(), paymentType: "Cash", amount: shortfall }]);
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
        cashTendered: grandTotal,
        changeDue: 0,
        denominations: [],
        payments: payments.map(p => ({
          paymentType: p.paymentType,
          amount: Number(p.amount),
          paymentQrId: p.paymentQrId,
          txnRefNo: p.txnRefNo,
          cashAccountId: p.cashAccountId,
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
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Select QR</label>
                      <select 
                        value={row.paymentQrId || ""} 
                        onChange={(e) => handleUpdate(index, 'paymentQrId', e.target.value)}
                        className="w-full p-1.5 rounded-md border border-border bg-surface-alt text-xs focus:border-primary focus:outline-none"
                      >
                        <option value="">Default QR</option>
                        {paymentQrs.map(qr => (
                          <option key={qr._id} value={qr._id}>{qr.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Txn Ref (Opt)</label>
                      <input 
                        type="text" placeholder="UPI Ref..."
                        value={row.txnRefNo || ""} onChange={(e) => handleUpdate(index, 'txnRefNo', e.target.value)}
                        className="w-full p-1.5 rounded-md border border-border bg-surface-alt text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {row.paymentType === "Cash" && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-top-1">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Cash Account</label>
                      <select 
                        value={row.cashAccountId || ""} 
                        onChange={(e) => handleUpdate(index, 'cashAccountId', e.target.value)}
                        className="w-full p-1.5 rounded-md border border-border bg-surface-alt text-xs focus:border-primary focus:outline-none"
                      >
                        <option value="">Default Counter Cash</option>
                        {cashAccounts?.map(ca => (
                          <option key={ca._id} value={ca._id}>{ca.accountName} {ca.denominationBalance ? `(₹${ca.denominationBalance.totalBalance})` : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  {row.paymentType === "Cash" ? (
                    <button 
                      type="button"
                      onClick={() => setCashBreakdownTarget(index)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${row.cashDetails ? 'bg-primary-soft text-primary border-primary/40 shadow-xs' : 'bg-surface-alt border-border text-text-muted hover:text-text hover:border-border-heavy'}`}
                    >
                      <Calculator className="size-3.5" /> 
                      {row.cashDetails ? 'Cash Breakdown Captured' : 'Exact Denominations'}
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
                  disabled={isSubmitting || shortfall > 0}
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
        const selectedCashRow = cashBreakdownTarget !== null ? payments[cashBreakdownTarget] : null;
        const selectedCashAccount = selectedCashRow 
          ? (cashAccounts?.find(ca => ca._id === selectedCashRow.cashAccountId) || cashAccounts?.find(ca => ca.isPrimary) || cashAccounts?.[0]) 
          : null;
        
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
            cashAccountName={selectedCashAccount?.accountName || 'Cash Account'}
          />
        );
      })()}
    </UIModal>
  );
};

export default SalesCheckoutModal;
