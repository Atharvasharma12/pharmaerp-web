import React, { useState, useEffect } from "react";
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
  Wallet,
  CheckCircle2,
  Calendar,
  FileText,
  ShieldCheck,
  Building2,
} from "lucide-react";
import customerService from "../services/customerService";
import CustomerPaymentMethodPanel from "./CustomerPaymentMethodPanel";
import useBranch from "@/features/branch/hooks/useBranch";
import { useActiveShift } from "@/features/operations/shifts/hooks/useActiveShift";

export default function CustomerAdvanceReceiptDialog({
  isOpen,
  onClose,
  customer,
  onSuccess,
}) {
  const { currentBranch } = useBranch();
  const { activeShift: hookActiveShift } = useActiveShift(currentBranch?._id);
  const reduxActiveShift = useSelector((state) => state.shift?.activeShift);
  const activeShift = hookActiveShift || reduxActiveShift;

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [narration, setNarration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [advanceBalance, setAdvanceBalance] = useState(0);

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

  useEffect(() => {
    if (isOpen && customer?._id) {
      setAmount("");
      setPaymentMethod("Cash");
      setDate(new Date().toISOString().split("T")[0]);
      setNarration("");
      setError(null);
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

      // Fetch latest advance balance
      customerService
        .getAdvanceBalance(customer._id)
        .then((res) => {
          setAdvanceBalance(res?.data?.advanceBalance ?? res?.data?.data?.advanceBalance ?? 0);
        })
        .catch(() => {
          setAdvanceBalance(customer.advanceBalance || 0);
        });
    }
  }, [isOpen, customer]);

  const parsedAmount = Number(amount || 0);
  const currentAdvance = Number(advanceBalance || customer?.advanceBalance || 0);
  const newAdvanceBalance = Math.round((currentAdvance + parsedAmount) * 100) / 100;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Please enter a valid advance amount greater than ₹0");
      return;
    }

    if (paymentMethod === "Cash") {
      if (cashState.receivedTotal > 0 && !cashState.isValid) {
        setError(
          `Cash net amount (₹${cashState.netAmount}) must match advance amount (₹${parsedAmount}), and received cash cannot be less than advance amount.`
        );
        return;
      }
    } else if (paymentMethod === "UPI") {
      if (!upiState.paymentQrId) {
        setError("Please select a valid UPI QR account to receive payment.");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const effectiveBranchId =
        currentBranch?._id ||
        activeShift?.branchId?._id ||
        activeShift?.branchId ||
        customer?.branchId;

      const payload = {
        amount: parsedAmount,
        paymentMethod,
        date: date ? new Date(date) : new Date(),
        narration: narration.trim() || `Customer advance received from ${customer.name}`,
        branchId: effectiveBranchId,
        shiftId: activeShift?._id || undefined,
        paymentDetails: {},
      };

      if (paymentMethod === "Cash") {
        payload.cashTendered = cashState.receivedTotal > 0 ? cashState.receivedTotal : parsedAmount;
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

      const res = await customerService.receiveAdvance(customer._id, payload);

      if (onSuccess) {
        onSuccess(res?.data || res);
      }
      onClose();
    } catch (err) {
      console.error("Failed to receive advance:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to record customer advance"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="xl">
      <UIModalHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Wallet className="size-5" />
          </div>
          <div>
            <UIModalTitle>Receive Customer Advance</UIModalTitle>
            <UIModalDescription>
              Record advance prepayment for {customer?.name || "Customer"}{" "}
              {customer?.customerCode && (
                <span className="font-mono text-text-muted">({customer.customerCode})</span>
              )}
            </UIModalDescription>
          </div>
        </div>
      </UIModalHeader>

      <UIModalBody>
        <form id="customer-advance-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <UIAlert variant="danger">{error}</UIAlert>}

          {/* Current & New Balance Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-surface border border-emerald-500/20">
            <div>
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Current Advance Balance
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                ₹{currentAdvance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-500/15 pt-2 sm:pt-0 sm:pl-3">
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Balance After Receipt
              </div>
              <div className="text-lg font-bold text-text font-mono mt-0.5 flex items-center sm:justify-end gap-1.5">
                <span>₹{newAdvanceBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                {parsedAmount > 0 && (
                  <UIBadge variant="success" size="sm">
                    +₹{parsedAmount.toLocaleString("en-IN")}
                  </UIBadge>
                )}
              </div>
            </div>
          </div>

          {/* Advance Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
              Advance Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-text-muted text-base">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border bg-surface text-lg font-bold font-mono text-text focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Unified Payment Method Panel: Cash Drawer, 10 Denominations, Multi-UPI Hold */}
          <CustomerPaymentMethodPanel
            paymentMethod={paymentMethod}
            onChangePaymentMethod={setPaymentMethod}
            allowedMethods={["Cash", "UPI"]}
            requiredAmount={parsedAmount}
            onCashChange={setCashState}
            onUpiChange={setUpiState}
          />

          {/* Receipt Date & Narration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                Receipt Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-sm text-text"
              />
            </div>

            <UIInput
              label="Narration / Purpose"
              placeholder="e.g. Advance deposit for prescription medicines"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              size="md"
            />
          </div>
        </form>
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </UIButton>
        <UIButton
          variant="primary"
          type="submit"
          form="customer-advance-form"
          isLoading={isSubmitting}
          startIcon={<CheckCircle2 className="size-4" />}
        >
          Confirm & Receive Advance
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
}
