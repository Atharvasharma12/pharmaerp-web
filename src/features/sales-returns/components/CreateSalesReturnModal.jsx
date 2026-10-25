import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  RotateCcw,
  Boxes,
  Banknote,
  Wallet,
  Receipt,
  AlertCircle,
  Plus,
  Minus,
  SlidersHorizontal,
} from "lucide-react";
import { UIModal, UIButton } from "@/components/ui";
import invoiceService from "@/features/sales/services/invoiceService";
import salesReturnService from "../services/salesReturnService";
import useBranch from "@/features/branch/hooks/useBranch";
import { useActiveShift } from "@/features/operations/shifts/hooks/useActiveShift";

const CURRENCY_DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const CreateSalesReturnModal = ({ open, onClose, onSuccess }) => {
  const { currentBranch } = useBranch();
  const { activeShift } = useActiveShift();

  // Step 1: Search original invoice
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [originalInvoice, setOriginalInvoice] = useState(null);

  // Step 2: Selected items to return
  const [selectedItems, setSelectedItems] = useState([]);

  // Step 3: Refund Settlement Mode
  const [refundMode, setRefundMode] = useState("Cash"); // "Cash" | "Advance" | "Credit"
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Cash Denominations
  const [cashDenominations, setCashDenominations] = useState({});
  const [showDenomBreakdown, setShowDenomBreakdown] = useState(false);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSearchError(null);
      setOriginalInvoice(null);
      setSelectedItems([]);
      setRefundMode("Cash");
      setNotes("");
      setSubmitError(null);
      setCashDenominations({});
      setShowDenomBreakdown(false);
    }
  }, [open]);

  // Lookup invoice by invoiceNo
  const handleSearchInvoice = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setOriginalInvoice(null);
    setSelectedItems([]);

    try {
      const res = await invoiceService.getInvoiceById(searchQuery.trim());
      const inv = res?.data?.data || res?.data;

      if (!inv || !inv.invoiceNo) {
        setSearchError(`No invoice found matching "${searchQuery.trim()}".`);
        return;
      }

      setOriginalInvoice(inv);

      const initialItems = (inv.items || []).map((it, idx) => ({
        id: it._id || `item-${idx}`,
        productId: it.productId || it.product_id || it.workspaceProductId || it.id,
        name: it.name || it.productName || "Product",
        batch: it.batch || it.batchNo || "STANDARD",
        batchId: it.batchId || it.batch_id || undefined,
        pack: it.pack || "10S",
        expiry: it.expiry || it.expiryDate || "—",
        mrp: Number(it.mrp || 0),
        price: Number(it.price || it.rate || 0),
        tax: Number(it.tax || it.gst || 5),
        soldQty: Number(it.qty || 1),
        returnQty: 0,
        isSelected: false,
      }));

      setSelectedItems(initialItems);
    } catch (err) {
      console.error("Search invoice error:", err);
      setSearchError(err?.response?.data?.message || `Invoice "${searchQuery}" not found.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleItem = (index) => {
    setSelectedItems((prev) => {
      const copy = [...prev];
      const item = copy[index];
      const nextSelected = !item.isSelected;
      copy[index] = {
        ...item,
        isSelected: nextSelected,
        returnQty: nextSelected && item.returnQty === 0 ? 1 : (nextSelected ? item.returnQty : 0),
      };
      return copy;
    });
  };

  const handleQtyChange = (index, delta) => {
    setSelectedItems((prev) => {
      const copy = [...prev];
      const item = copy[index];
      const nextQty = Math.max(0, Math.min(item.soldQty, item.returnQty + delta));
      copy[index] = {
        ...item,
        returnQty: nextQty,
        isSelected: nextQty > 0,
      };
      return copy;
    });
  };

  // Calculations for items to return
  const activeReturnItems = useMemo(
    () => selectedItems.filter((i) => i.isSelected && i.returnQty > 0),
    [selectedItems]
  );

  const subtotal = useMemo(
    () => activeReturnItems.reduce((sum, i) => sum + i.price * i.returnQty, 0),
    [activeReturnItems]
  );

  const totalGst = useMemo(() => {
    return activeReturnItems.reduce((sum, i) => {
      const itemTotal = i.price * i.returnQty;
      const rate = Number(i.tax) || 0;
      return sum + (itemTotal * rate) / (100 + rate);
    }, 0);
  }, [activeReturnItems]);

  const grandTotal = Math.round(subtotal);

  // Auto-decompose denominations when Cash mode and total changes
  useEffect(() => {
    if (refundMode === "Cash" && grandTotal > 0) {
      let rem = grandTotal;
      const autoDenoms = {};
      for (const d of CURRENCY_DENOMINATIONS) {
        if (rem >= d) {
          const count = Math.floor(rem / d);
          autoDenoms[d] = count;
          rem -= count * d;
        }
      }
      setCashDenominations(autoDenoms);
    }
  }, [refundMode, grandTotal]);

  const handleDenomChange = (val, delta) => {
    setCashDenominations((prev) => {
      const current = Number(prev[val] || 0);
      const next = Math.max(0, current + delta);
      return { ...prev, [val]: next };
    });
  };

  const denomTotal = useMemo(() => {
    return Object.entries(cashDenominations).reduce(
      (sum, [val, qty]) => sum + Number(val) * (Number(qty) || 0),
      0
    );
  }, [cashDenominations]);

  const handleSaveReturn = async () => {
    if (activeReturnItems.length === 0) {
      setSubmitError("Please select at least one item and quantity to return.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const branchId = currentBranch?._id || currentBranch?.id || originalInvoice?.branchId;
      const customerId = originalInvoice?.customerId?._id || originalInvoice?.customerId;

      const payload = {
        branchId,
        date: new Date().toISOString(),
        shiftId: activeShift?._id || null,
        originalInvoiceId: originalInvoice?._id,
        originalInvoiceNo: originalInvoice?.invoiceNo,
        billingMode: originalInvoice?.billingMode || "B2C",
        subtotal,
        tax: totalGst,
        grandTotal,
        returnType: refundMode === "Advance" ? "advance_credit" : refundMode === "Credit" ? "credit_note" : "cash_refund",
        paymentMethod: refundMode,
        refundMethod: refundMode,
        notes: notes || `Returned from bill #${originalInvoice?.invoiceNo}`,
        items: activeReturnItems.map((i) => ({
          productId: i.productId,
          batchId: i.batchId,
          batchNo: i.batch,
          name: i.name,
          pack: i.pack,
          expiry: i.expiry,
          price: i.price,
          rate: i.price,
          mrp: i.mrp,
          qty: i.returnQty,
          gst: i.tax,
          total: i.price * i.returnQty,
        })),
        denominations: Object.entries(cashDenominations)
          .map(([val, qty]) => ({ denomination: Number(val), quantity: Number(qty) }))
          .filter((d) => d.quantity > 0),
      };

      const res = await salesReturnService.recordSalesReturn(payload, customerId);
      const saved = res?.data?.data || res?.data;

      if (onSuccess) {
        onSuccess(saved);
      }
      onClose();
    } catch (err) {
      console.error("Save sales return error:", err);
      setSubmitError(err?.response?.data?.message || "Failed to record sales return memo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-base text-text-primary">New Sales Return</div>
            <div className="text-[11px] text-text-muted">
              Look up original sale invoice, select return items, and issue refund
            </div>
          </div>
        </div>
      }
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <UIButton variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </UIButton>
          <div className="flex items-center gap-2">
            {grandTotal > 0 && (
              <div className="text-right mr-2">
                <div className="text-[10px] uppercase font-bold text-text-muted">Total Refund</div>
                <div className="text-sm font-mono font-extrabold text-rose-600 dark:text-rose-400">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
            )}
            <UIButton
              variant="destructive"
              size="sm"
              icon={RotateCcw}
              onClick={handleSaveReturn}
              loading={isSubmitting}
              disabled={activeReturnItems.length === 0 || isSubmitting}
            >
              Confirm Return & Refund
            </UIButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* Step 1: Search Original Invoice */}
        <div className="p-3 rounded-xl border border-border bg-surface-alt/30 space-y-2">
          <label className="text-xs font-bold text-text-primary">
            1. Search Original Bill / Invoice Number *
          </label>
          <form onSubmit={handleSearchInvoice} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Invoice No (e.g. NN-2627-0036)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
            <UIButton
              type="submit"
              variant="default"
              size="sm"
              loading={isSearching}
              disabled={!searchQuery.trim() || isSearching}
            >
              Lookup Bill
            </UIButton>
          </form>

          {searchError && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Original Invoice Info Strip */}
        {originalInvoice && (
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted">Bill No</span>
              <div className="font-mono font-bold text-primary">{originalInvoice.invoiceNo}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted">Bill Date</span>
              <div className="font-semibold text-text-primary">
                {new Date(originalInvoice.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted">Customer</span>
              <div className="font-semibold text-text-primary truncate">
                {originalInvoice.customerId?.name || originalInvoice.customerName || "Walk-in"}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted">Original Total</span>
              <div className="font-mono font-extrabold text-text-primary">
                {formatCurrency(originalInvoice.grandTotal)}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Items to Return */}
        {originalInvoice && (
          <div className="border border-border rounded-xl overflow-hidden bg-surface space-y-0">
            <div className="px-3 py-2 bg-surface-alt/60 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-text-muted" />
                2. Select Items to Return ({activeReturnItems.length} selected)
              </span>
              <span className="text-[11px] text-text-muted">Adjust quantity to return</span>
            </div>

            <div className="divide-y divide-border max-h-[220px] overflow-y-auto">
              {selectedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-2.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                    item.isSelected ? "bg-rose-500/5" : "hover:bg-surface-alt/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={item.isSelected}
                      onChange={() => handleToggleItem(idx)}
                      className="rounded border-border text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-text-primary truncate">{item.name}</div>
                      <div className="flex items-center gap-2 text-[10.5px] text-text-muted font-mono">
                        <span>Batch: {item.batch}</span>
                        <span>·</span>
                        <span>Sold: {item.soldQty}</span>
                        <span>·</span>
                        <span>Rate: {formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden bg-surface">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, -1)}
                        disabled={item.returnQty <= 0}
                        className="p-1 px-2 hover:bg-surface-alt disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-text-secondary" />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs text-text-primary">
                        {item.returnQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, 1)}
                        disabled={item.returnQty >= item.soldQty}
                        className="p-1 px-2 hover:bg-surface-alt disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-text-secondary" />
                      </button>
                    </div>

                    <div className="w-20 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(item.price * item.returnQty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Refund Settlement */}
        {activeReturnItems.length > 0 && (
          <div className="p-3 rounded-xl border border-border bg-surface-alt/30 space-y-3">
            <label className="text-xs font-bold text-text-primary">
              3. Refund Settlement Method
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRefundMode("Cash")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  refundMode === "Cash"
                    ? "border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600"
                    : "border-border bg-surface text-text-muted hover:border-text-muted"
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash Drawer Refund</span>
              </button>

              <button
                type="button"
                onClick={() => setRefundMode("Advance")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  refundMode === "Advance"
                    ? "border-blue-600 bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600"
                    : "border-border bg-surface text-text-muted hover:border-text-muted"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Customer Advance Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setRefundMode("Credit")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  refundMode === "Credit"
                    ? "border-purple-600 bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-1 ring-purple-600"
                    : "border-border bg-surface text-text-muted hover:border-text-muted"
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Credit Note Voucher</span>
              </button>
            </div>

            {refundMode === "Cash" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    <span>Cash will be deducted from drawer:</span>
                    <span className="font-mono font-bold">{formatCurrency(grandTotal)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDenomBreakdown((prev) => !prev)}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    {showDenomBreakdown ? "Hide Notes" : "Adjust Notes"}
                  </button>
                </div>

                {/* Inline Denominations Note Counter */}
                {showDenomBreakdown && (
                  <div className="p-2.5 rounded-lg border border-border bg-surface space-y-2">
                    <div className="text-[11px] font-semibold text-text-muted flex justify-between">
                      <span>Specify notes dispensed:</span>
                      <span className="font-mono">
                        Notes Sum: <strong>{formatCurrency(denomTotal)}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {CURRENCY_DENOMINATIONS.map((d) => (
                        <div
                          key={d}
                          className="flex items-center justify-between border border-border rounded-lg p-1 px-1.5 text-xs bg-surface-alt/30"
                        >
                          <span className="font-bold text-[11px] font-mono">₹{d}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDenomChange(d, -1)}
                              className="w-5 h-5 rounded hover:bg-surface flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-mono font-bold text-xs">
                              {cashDenominations[d] || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDenomChange(d, 1)}
                              className="w-5 h-5 rounded hover:bg-surface flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {refundMode === "Advance" && (
              <div className="p-2 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Wallet className="w-4 h-4 shrink-0" />
                <span>
                  <strong>{formatCurrency(grandTotal)}</strong> will be credited to{" "}
                  <strong>{originalInvoice.customerId?.name || "Customer"}</strong>'s advance balance
                  for future purchases.
                </span>
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Optional notes or reason for return (e.g. Expired / Wrong medicine)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}
      </div>
    </UIModal>
  );
};

export default CreateSalesReturnModal;
