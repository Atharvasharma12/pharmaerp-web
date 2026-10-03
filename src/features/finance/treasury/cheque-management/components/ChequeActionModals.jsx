import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiAlertTriangle, FiSlash, FiCalendar } from "react-icons/fi";

/* ─────────────────────────────────────────────
   Shared backdrop + modal shell
───────────────────────────────────────────── */
const ModalBackdrop = ({ onClose, children }) => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-[420px] rounded-xl border border-border bg-surface shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const ModalHeader = ({ icon, title, subtitle, iconClass, onClose }) => (
  <div className="flex items-start justify-between p-5 border-b border-border">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[16px] ${iconClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-bold text-text leading-tight">{title}</p>
        <p className="text-[11px] text-text-muted mt-0.5">{subtitle}</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="text-text-muted hover:text-text transition p-1 rounded"
    >
      <FiX size={16} />
    </button>
  </div>
);

const ModalFooter = ({ onClose, onConfirm, isLoading, confirmLabel, confirmClass }) => (
  <div className="flex items-center justify-end gap-2.5 p-4 border-t border-border">
    <button
      onClick={onClose}
      disabled={isLoading}
      className="px-4 py-2 text-[12px] font-semibold border border-border rounded-lg text-text bg-surface hover:bg-surface-alt/20 transition disabled:opacity-50"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      disabled={isLoading}
      className={`px-5 py-2 text-[12px] font-bold rounded-lg text-white transition disabled:opacity-60 flex items-center gap-1.5 ${confirmClass}`}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {isLoading ? "Processing..." : confirmLabel}
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   1. CLEAR CHEQUE MODAL
   Shows: clearance date picker + optional narration
───────────────────────────────────────────── */
export const ClearChequeModal = ({ open, onClose, onConfirm, isLoading, chequeType }) => {
  const [clearDate, setClearDate] = useState("");
  const [narration, setNarration] = useState("");

  useEffect(() => {
    if (open) {
      // Default to today
      const today = new Date().toISOString().split("T")[0];
      setClearDate(today);
      setNarration("");
    }
  }, [open]);

  if (!open) return null;

  const isIssued = chequeType === "ISSUED";

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader
        icon={<FiCheck />}
        title="Clear Cheque"
        subtitle={
          isIssued
            ? "Confirm that vendor cashed this cheque"
            : "Confirm bank has deposited and cleared this cheque"
        }
        iconClass="bg-success-soft text-success"
        onClose={onClose}
      />

      <div className="p-5 space-y-4">
        {/* Info banner */}
        <div className="p-3 bg-success-soft/20 border border-success/20 rounded-lg text-[11.5px] text-success font-semibold leading-relaxed">
          {isIssued
            ? "Marking as Cleared will debit Cheques In Transit and credit the bank account — confirming funds have left your bank."
            : "Marking as Cleared will debit your bank account and credit Cheques In Transit — funds are now received."}
        </div>

        {/* Clearance Date */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
            <FiCalendar className="inline mr-1 mb-0.5" />
            Clearance Date
          </label>
          <input
            type="date"
            value={clearDate}
            onChange={(e) => setClearDate(e.target.value)}
            className="w-full px-3 py-2.5 text-[12.5px] font-semibold text-text bg-surface border border-border rounded-lg focus:outline-none focus:border-success/60 focus:ring-2 focus:ring-success/10 transition"
          />
          <p className="text-[10.5px] text-text-muted mt-1">Leave as today if cleared today.</p>
        </div>

        {/* Optional narration */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
            Narration <span className="text-[10px] font-normal normal-case">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            placeholder="e.g. Confirmed clearance via bank statement"
            className="w-full px-3 py-2.5 text-[12.5px] font-semibold text-text bg-surface border border-border rounded-lg focus:outline-none focus:border-success/60 focus:ring-2 focus:ring-success/10 transition resize-none"
          />
        </div>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ clearDate: clearDate || undefined, narration: narration || undefined })}
        isLoading={isLoading}
        confirmLabel="Confirm Clearance"
        confirmClass="bg-[#2b8a3e] hover:bg-[#237032]"
      />
    </ModalBackdrop>
  );
};

/* ─────────────────────────────────────────────
   2. BOUNCE CHEQUE MODAL
   RECEIVED → shows reason + bounce charges
   ISSUED   → shows reason only (no bank charges)
───────────────────────────────────────────── */
export const BounceChequeModal = ({ open, onClose, onConfirm, isLoading, chequeType }) => {
  const [reason, setReason] = useState("");
  const [bounceCharges, setBounceCharges] = useState("");
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setBounceCharges("");
      setReasonError("");
    }
  }, [open]);

  if (!open) return null;

  const isReceived = chequeType === "RECEIVED";

  const handleConfirm = () => {
    if (!reason.trim()) {
      setReasonError("Bounce reason is required.");
      return;
    }
    onConfirm({
      reason: reason.trim(),
      bounceCharges: isReceived ? (Number(bounceCharges) || 0) : 0,
    });
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader
        icon={<FiAlertTriangle />}
        title="Mark as Bounced"
        subtitle={
          isReceived
            ? "Customer's cheque was dishonoured by the bank"
            : "Our issued cheque was returned / rejected"
        }
        iconClass="bg-danger-soft text-danger"
        onClose={onClose}
      />

      <div className="p-5 space-y-4">
        {/* Info banner */}
        <div className="p-3 bg-danger-soft/20 border border-danger/20 rounded-lg text-[11.5px] text-danger font-semibold leading-relaxed">
          {isReceived
            ? "This will reverse the transit entry and restore the party's outstanding balance. Any bounce charges will be debited from your bank."
            : "This will reverse the transit entry and restore your payable to the vendor."}
        </div>

        {/* Bounce Reason */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
            Bounce Reason <span className="text-danger">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setReasonError(""); }}
            placeholder="e.g. Insufficient funds, Account closed, Signature mismatch..."
            className={`w-full px-3 py-2.5 text-[12.5px] font-semibold text-text bg-surface border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
              reasonError
                ? "border-danger focus:border-danger focus:ring-danger/10"
                : "border-border focus:border-danger/60 focus:ring-danger/10"
            }`}
          />
          {reasonError && (
            <p className="text-[10.5px] text-danger mt-1 font-semibold">{reasonError}</p>
          )}
        </div>

        {/* Bounce Charges — only for RECEIVED cheques */}
        {isReceived && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
              Bounce Charges (₹){" "}
              <span className="text-[10px] font-normal normal-case">(bank-deducted fee, if any)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-text-muted">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={bounceCharges}
                onChange={(e) => setBounceCharges(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2.5 text-[12.5px] font-semibold text-text bg-surface border border-border rounded-lg focus:outline-none focus:border-danger/60 focus:ring-2 focus:ring-danger/10 transition"
              />
            </div>
            <p className="text-[10.5px] text-text-muted mt-1">
              Enter 0 if no charges were levied. This creates a Bounce Charges expense entry.
            </p>
          </div>
        )}
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        confirmLabel="Confirm Bounce"
        confirmClass="bg-danger hover:bg-red-700"
      />
    </ModalBackdrop>
  );
};

/* ─────────────────────────────────────────────
   3. CANCEL CHEQUE MODAL
   Only for PENDING cheques — reason field
───────────────────────────────────────────── */
export const CancelChequeModal = ({ open, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  if (!open) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader
        icon={<FiSlash />}
        title="Cancel Cheque"
        subtitle="Void this cheque before it is deposited"
        iconClass="bg-neutral-soft text-text-muted"
        onClose={onClose}
      />

      <div className="p-5 space-y-4">
        {/* Warning banner */}
        <div className="p-3 bg-warning-soft/30 border border-warning/30 rounded-lg text-[11.5px] text-warning font-semibold leading-relaxed">
          This will reverse the original journal entry and mark the cheque as void. This action cannot be undone.
        </div>

        {/* Cancellation reason */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
            Cancellation Reason{" "}
            <span className="text-[10px] font-normal normal-case">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Wrong amount entered, cheque lost, duplicate entry..."
            className="w-full px-3 py-2.5 text-[12.5px] font-semibold text-text bg-surface border border-border rounded-lg focus:outline-none focus:border-border/60 focus:ring-2 focus:ring-border/20 transition resize-none"
          />
        </div>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ reason: reason.trim() || undefined })}
        isLoading={isLoading}
        confirmLabel="Cancel Cheque"
        confirmClass="bg-text hover:bg-text/80"
      />
    </ModalBackdrop>
  );
};
