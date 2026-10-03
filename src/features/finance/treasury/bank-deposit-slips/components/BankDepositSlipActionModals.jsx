import { useState } from "react";
import { FiX, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AppInput, AppText } from "@/components";

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
      Close
    </button>
    <button
      onClick={onConfirm}
      disabled={isLoading}
      className={`px-5 py-2 text-[12px] font-bold rounded-lg text-white cursor-pointer transition disabled:opacity-60 flex items-center justify-center gap-1.5 ${confirmClass}`}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {isLoading ? "Processing..." : confirmLabel}
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   Confirm Deposit Modal
───────────────────────────────────────────── */
export const ConfirmDepositModal = ({ isOpen, onClose, onConfirm, isLoading, slip }) => {
  const [bankReferenceNumber, setBankReferenceNumber] = useState("");
  const [depositConfirmedDate, setDepositConfirmedDate] = useState(dayjs());

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      bankReferenceNumber: bankReferenceNumber || undefined,
      depositConfirmedDate: depositConfirmedDate ? depositConfirmedDate.toISOString() : undefined,
    });
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader
        icon={<FiCheck />}
        iconClass="bg-success-soft text-success"
        title="Confirm Bank Deposit"
        subtitle="Mark this deposit slip as confirmed by the bank."
        onClose={onClose}
      />
      <div className="p-5">
        <AppText variant="body2" sx={{ mb: 3, color: "var(--app-color-text-muted)" }}>
          Amount: <span className="font-bold text-text">₹{slip?.amount}</span>
        </AppText>

        <div className="flex flex-col gap-4">
          <AppInput
            label="Bank Reference Number (Optional)"
            placeholder="UTR / Bank receipt number"
            value={bankReferenceNumber}
            onChange={(e) => setBankReferenceNumber(e.target.value)}
            disabled={isLoading}
          />

          <div>
            <AppText variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Deposit Confirmed Date (Optional)
            </AppText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={depositConfirmedDate}
                onChange={(newValue) => setDepositConfirmedDate(newValue)}
                disabled={isLoading}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      "& .MuiInputBase-root": {
                        fontSize: "13px",
                        backgroundColor: "var(--app-color-surface)",
                        color: "var(--app-color-text)",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <ModalFooter
        onClose={onClose}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        confirmLabel="Confirm Deposit"
        confirmClass="bg-success hover:bg-success/90"
      />
    </ModalBackdrop>
  );
};

/* ─────────────────────────────────────────────
   Cancel Slip Modal
───────────────────────────────────────────── */
export const CancelSlipModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ reason });
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-danger-soft flex items-center justify-center text-[#ef4444] shadow-sm">
            <FiAlertTriangle size={28} />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-text">Cancel Deposit Slip</h3>
            <p className="text-[13px] text-text-muted mt-2 leading-relaxed">
              Are you sure you want to cancel this deposit slip? This action cannot be undone and will reverse the journal entry, returning denominations to the cash account.
            </p>
          </div>
        </div>

        <div className="mt-6 text-left">
          <label className="block text-[12px] font-bold text-text mb-1.5">
            Cancellation Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
            className="w-full text-[13px] bg-surface-alt text-text border border-border rounded-lg p-3 outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/20 transition min-h-[80px] resize-none"
            placeholder="Why is this slip being cancelled?"
          />
        </div>

        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 text-[13px] font-semibold border border-border rounded-lg text-text bg-surface hover:bg-surface-alt transition disabled:opacity-50 cursor-pointer"
          >
            Keep Slip
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 text-[13px] font-bold rounded-lg text-white bg-[#ef4444] hover:bg-[#dc2626] shadow-md shadow-red-500/20 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {isLoading ? "Cancelling..." : "Yes, Cancel Slip"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};
