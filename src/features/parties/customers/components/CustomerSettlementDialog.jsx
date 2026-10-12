import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIInput,
  UIButton,
  UIAlert,
  UIBadge,
} from "@/components/ui";
import {
  CheckCircle2,
  AlertTriangle,
  Wallet,
  CreditCard,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import customerService from "../services/customerService";
import CustomerPaymentMethodPanel from "./CustomerPaymentMethodPanel";
import useBranch from "@/features/branch/hooks/useBranch";
import { useActiveShift } from "@/features/operations/shifts/hooks/useActiveShift";

export default function CustomerSettlementDialog({
  isOpen,
  onClose,
  customer,
  preselectedInvoiceId = null,
  onSuccess,
}) {
  const { currentBranch } = useBranch();
  const { activeShift: hookActiveShift } = useActiveShift(currentBranch?._id);
  const reduxActiveShift = useSelector((state) => state.shift?.activeShift);
  const activeShift = hookActiveShift || reduxActiveShift;

  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [advanceBalance, setAdvanceBalance] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [settleAmount, setSettleAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [narration, setNarration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State from CustomerPaymentMethodPanel
  const [cashState, setCashState] = useState({
    receivedTotal: 0,
    returnedTotal: 0,
    netAmount: 0,
    denominations: [],
    returnedDenominations: [],
    isValid: false,
  });

  const [upiState, setUpiState] = useState({
    paymentQrId: "",
    referenceNo: "",
    selectedQr: null,
    isValid: false,
  });

  // Load customer outstanding credit invoices & advance balance
  useEffect(() => {
    if (isOpen && customer?._id) {
      setLoading(true);
      setError(null);
      setDate(new Date().toISOString().split("T")[0]);
      setNarration("");
      setPaymentMethod("Cash");
      setCashState({
        receivedTotal: 0,
        returnedTotal: 0,
        netAmount: 0,
        denominations: [],
        returnedDenominations: [],
        isValid: false,
      });
      setUpiState({
        paymentQrId: "",
        referenceNo: "",
        selectedQr: null,
        isValid: false,
      });

      Promise.all([
        customerService.getCreditOutstanding(customer._id),
        customerService.getAdvanceBalance(customer._id),
      ])
        .then(([outstandingRes, advanceRes]) => {
          const list =
            outstandingRes?.data?.data?.transactions ||
            outstandingRes?.data?.transactions ||
            [];
          setInvoices(list);
          const advBal =
            advanceRes?.data?.data?.advanceBalance ??
            advanceRes?.data?.advanceBalance ??
            0;
          setAdvanceBalance(advBal);

          if (preselectedInvoiceId) {
            setSelectedIds([preselectedInvoiceId]);
            const target = list.find(
              (inv) => inv._id === preselectedInvoiceId || inv.invoiceId === preselectedInvoiceId
            );
            if (target) {
              setSettleAmount(String(target.balanceDue || 0));
            }
          } else if (list.length > 0) {
            setSelectedIds(list.map((inv) => inv._id));
            const totalDue = list.reduce((sum, inv) => sum + Number(inv.balanceDue || 0), 0);
            setSettleAmount(String(totalDue));
          } else {
            setSelectedIds([]);
            setSettleAmount("0");
          }
        })
        .catch((err) => {
          console.error("Failed to load credit details:", err);
          setError("Failed to load customer credit details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, customer, preselectedInvoiceId]);

  // Selected invoices total
  const selectedInvoices = useMemo(() => {
    return invoices.filter((inv) => selectedIds.includes(inv._id));
  }, [invoices, selectedIds]);

  const selectedTotalDue = useMemo(() => {
    return selectedInvoices.reduce((sum, inv) => sum + Number(inv.balanceDue || 0), 0);
  }, [selectedInvoices]);

  const toggleSelect = (id) => {
    let next;
    if (selectedIds.includes(id)) {
      next = selectedIds.filter((item) => item !== id);
    } else {
      next = [...selectedIds, id];
    }
    setSelectedIds(next);

    const newTotal = invoices
      .filter((inv) => next.includes(inv._id))
      .reduce((sum, inv) => sum + Number(inv.balanceDue || 0), 0);
    setSettleAmount(String(newTotal));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === invoices.length) {
      setSelectedIds([]);
      setSettleAmount("0");
    } else {
      const all = invoices.map((inv) => inv._id);
      setSelectedIds(all);
      const total = invoices.reduce((sum, inv) => sum + Number(inv.balanceDue || 0), 0);
      setSettleAmount(String(total));
    }
  };

  const parsedSettleAmount = Number(settleAmount || 0);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (selectedInvoices.length === 0) {
      setError("Please select at least one invoice to settle");
      return;
    }

    if (!parsedSettleAmount || parsedSettleAmount <= 0) {
      setError("Settlement amount must be greater than ₹0");
      return;
    }

    if (parsedSettleAmount > selectedTotalDue + 0.01) {
      setError(
        `Settlement amount (₹${parsedSettleAmount.toFixed(2)}) cannot exceed total selected due (₹${selectedTotalDue.toFixed(2)})`
      );
      return;
    }

    if (paymentMethod === "Advance" && parsedSettleAmount > advanceBalance + 0.01) {
      setError(
        `Insufficient advance balance. Available: ₹${advanceBalance.toFixed(2)}, Required: ₹${parsedSettleAmount.toFixed(2)}`
      );
      return;
    }

    if (paymentMethod === "Cash") {
      if (cashState.receivedTotal > 0 && !cashState.isValid) {
        setError(
          `Cash net amount (₹${cashState.netAmount}) must match settlement amount (₹${parsedSettleAmount}), and received cash cannot be less than settlement amount.`
        );
        return;
      }
    } else if (paymentMethod === "UPI") {
      if (!upiState.paymentQrId) {
        setError("Please select a valid UPI QR account to settle payment.");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Distribute parsedSettleAmount across selected invoices (FIFO)
      let remaining = parsedSettleAmount;
      const settlements = [];

      for (const inv of selectedInvoices) {
        if (remaining <= 0) break;
        const due = Number(inv.balanceDue || 0);
        const alloc = Math.min(remaining, due);
        settlements.push({
          creditTransactionId: inv._id,
          invoiceId: inv.invoiceId,
          amount: alloc,
        });
        remaining -= alloc;
      }

      const effectiveBranchId =
        currentBranch?._id ||
        activeShift?.branchId?._id ||
        activeShift?.branchId ||
        customer?.branchId;

      const payload = {
        settlements,
        paymentMethod,
        date: date ? new Date(date) : new Date(),
        narration: narration.trim() || `Credit settlement via ${paymentMethod} for ${customer.name}`,
        branchId: effectiveBranchId,
        shiftId: activeShift?._id || undefined,
        paymentDetails: {},
      };

      if (paymentMethod === "Cash") {
        payload.cashTendered = cashState.receivedTotal > 0 ? cashState.receivedTotal : parsedSettleAmount;
        payload.changeDue = cashState.returnedTotal > 0 ? cashState.returnedTotal : 0;
        payload.denominations = cashState.denominations || [];
        payload.returnedDenominations = cashState.returnedDenominations || [];
        payload.paymentDetails.denominations = cashState.denominations || [];
        payload.paymentDetails.returnedDenominations = cashState.returnedDenominations || [];
        payload.paymentDetails.cashTendered = payload.cashTendered;
        payload.paymentDetails.changeDue = payload.changeDue;
      } else if (paymentMethod === "UPI") {
        payload.paymentQrId = upiState.paymentQrId;
        payload.paymentDetails.paymentQrId = upiState.paymentQrId;
        if (upiState.referenceNo) {
          payload.paymentDetails.referenceNo = upiState.referenceNo;
          payload.referenceNo = upiState.referenceNo;
        }
      }

      const res = await customerService.settleCredit(customer._id, payload);

      if (onSuccess) {
        onSuccess(res?.data || res);
      }
      onClose();
    } catch (err) {
      console.error("Failed to settle credit:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to settle customer credit"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = new Date();

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="xl">
      <UIModalHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <UIModalTitle>Settle Customer Credit</UIModalTitle>
            <UIModalDescription>
              Clear outstanding credit bills for {customer?.name || "Customer"}{" "}
              {customer?.customerCode && (
                <span className="font-mono text-text-muted">({customer.customerCode})</span>
              )}
            </UIModalDescription>
          </div>
        </div>
      </UIModalHeader>

      <UIModalBody>
        <form id="customer-settlement-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <UIAlert variant="danger">{error}</UIAlert>}

          {/* Top Balance Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-surface border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Advance Balance Available
                </div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  ₹{advanceBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Wallet className="size-4" />
              </div>
            </div>

            <div className="flex items-center justify-between border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
              <div>
                <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Total Outstanding Debt
                </div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400 font-mono mt-0.5">
                  ₹
                  {invoices
                    .reduce((sum, inv) => sum + Number(inv.balanceDue || 0), 0)
                    .toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="size-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <CreditCard className="size-4" />
              </div>
            </div>
          </div>

          {/* Outstanding Bills Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Outstanding Credit Invoices ({invoices.length})
              </label>
              {invoices.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  {selectedIds.length === invoices.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-text-muted">
                Loading outstanding invoices...
              </div>
            ) : invoices.length === 0 ? (
              <div className="py-8 text-center rounded-xl border border-dashed border-border bg-surface-alt/30">
                <ShieldCheck className="size-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-text">No pending credit invoices</p>
                <p className="text-xs text-text-muted mt-0.5">
                  All credit sales for this customer have been fully settled.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border bg-surface max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-alt/60 text-text-muted uppercase font-bold sticky top-0 z-10 border-b border-border">
                    <tr>
                      <th className="p-2.5 w-10 text-center">#</th>
                      <th className="p-2.5">Invoice No</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5 text-right">Bill Total</th>
                      <th className="p-2.5 text-right">Balance Due</th>
                      <th className="p-2.5">Due Date</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoices.map((inv) => {
                      const isSelected = selectedIds.includes(inv._id);
                      const isOverdue = inv.dueDate && new Date(inv.dueDate) < now;

                      return (
                        <tr
                          key={inv._id}
                          onClick={() => toggleSelect(inv._id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-primary/5" : "hover:bg-surface-alt/40"
                          }`}
                        >
                          <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(inv._id)}
                              className="size-4 rounded-sm border-border text-primary cursor-pointer"
                            />
                          </td>
                          <td className="p-2.5 font-mono font-bold text-text">
                            {inv.invoiceNo}
                          </td>
                          <td className="p-2.5 text-text-muted">
                            {new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-2.5 text-right font-mono text-text">
                            ₹{Number(inv.invoiceAmount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-red-600 dark:text-red-400">
                            ₹{Number(inv.balanceDue || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`flex items-center gap-1 font-mono ${
                                isOverdue ? "text-amber-600 dark:text-amber-400 font-bold" : "text-text-muted"
                              }`}
                            >
                              {inv.dueDate
                                ? new Date(inv.dueDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                : "N/A"}
                              {isOverdue && <AlertTriangle className="size-3 text-amber-500" />}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <UIBadge
                              variant={
                                isOverdue
                                  ? "warning"
                                  : inv.status === "PARTIAL"
                                  ? "info"
                                  : "neutral"
                              }
                              size="sm"
                            >
                              {isOverdue ? "OVERDUE" : inv.status}
                            </UIBadge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Amount to Settle & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                Amount to Settle (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-text-muted text-base">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  max={selectedTotalDue}
                  step="any"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border bg-surface text-base font-bold font-mono text-text focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1">
                Selected Due: ₹{selectedTotalDue.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                Settlement Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-text"
              />
            </div>
          </div>

          {/* Unified Payment Method Panel: Cash Drawer, 10 Denominations, Multi-UPI Hold */}
          <CustomerPaymentMethodPanel
            paymentMethod={paymentMethod}
            onChangePaymentMethod={setPaymentMethod}
            allowedMethods={advanceBalance > 0 ? ["Cash", "UPI", "Advance"] : ["Cash", "UPI"]}
            requiredAmount={parsedSettleAmount}
            onCashChange={setCashState}
            onUpiChange={setUpiState}
          />

          {/* Narration */}
          <UIInput
            label="Narration / Remarks"
            placeholder="e.g. Customer cleared balance via PhonePe"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            size="md"
          />
        </form>
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </UIButton>
        <UIButton
          variant="primary"
          type="submit"
          form="customer-settlement-form"
          isLoading={isSubmitting}
          disabled={selectedInvoices.length === 0 || parsedSettleAmount <= 0}
          startIcon={<CheckCircle2 className="size-4" />}
        >
          Confirm & Settle ₹{parsedSettleAmount.toLocaleString("en-IN")}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
}
