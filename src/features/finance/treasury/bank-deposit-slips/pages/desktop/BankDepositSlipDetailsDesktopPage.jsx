import { useState } from "react";
import { FiArrowLeft, FiPrinter, FiCheck, FiAlertTriangle } from "react-icons/fi";
import dayjs from "dayjs";
import { AppText } from "@/components";
import { ConfirmDepositModal, CancelSlipModal } from "../../components/BankDepositSlipActionModals";

const getStatusBadge = (status) => {
  switch (status) {
    case "PREPARED":
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-warning-soft text-warning">Prepared</span>;
    case "DEPOSITED":
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-success-soft text-success">Deposited</span>;
    case "CANCELLED":
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-danger-soft text-danger">Cancelled</span>;
    default:
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-alt text-text-muted">{status}</span>;
  }
};

const BankDepositSlipDetailsDesktopPage = ({
  slipDetails: slip,
  isLoading,
  isTransitioning,
  error,
  message,
  clearFeedback,
  handleConfirmDeposit,
  handleCancelSlip,
  handleBack,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (isLoading || !slip) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-none px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <AppText variant="h6" className="font-bold text-text leading-tight">
                {slip.slipNumber}
              </AppText>
              {getStatusBadge(slip.status)}
            </div>
            <AppText variant="body2" className="text-text-muted mt-0.5">
              {dayjs(slip.slipDate).format("DD MMM YYYY")}
            </AppText>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {slip.status === "PREPARED" && (
            <>
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="px-4 py-2 border border-danger/30 text-danger hover:bg-danger-soft rounded-lg text-[13px] font-medium transition flex items-center gap-2"
              >
                <FiAlertTriangle size={16} />
                Cancel Slip
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="px-4 py-2 bg-success hover:bg-success/90 text-white rounded-lg text-[13px] font-medium transition flex items-center gap-2"
              >
                <FiCheck size={16} />
                Confirm Deposit
              </button>
            </>
          )}
          <button className="p-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition" title="Print Slip">
            <FiPrinter size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[1000px] mx-auto flex gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {error && (
              <div className="p-3 bg-danger-soft text-danger border border-danger/20 rounded-lg text-[13px] flex justify-between items-center">
                <span>{error}</span>
                <button onClick={clearFeedback} className="font-bold">&times;</button>
              </div>
            )}
            {message && (
              <div className="p-3 bg-success-soft text-success border border-success/20 rounded-lg text-[13px] flex justify-between items-center">
                <span>{message}</span>
                <button onClick={clearFeedback} className="font-bold">&times;</button>
              </div>
            )}

            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
              <AppText variant="subtitle2" className="font-bold text-text mb-4 pb-2 border-b border-border">
                Deposit Information
              </AppText>
              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                <div>
                  <p className="text-[12px] text-text-muted mb-1">From Cash Account</p>
                  <p className="text-[13px] font-medium text-text">
                    {slip.fromCashAccountId?.accountName || slip.fromCashAccount?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-text-muted mb-1">To Bank Account</p>
                  <p className="text-[13px] font-medium text-text">
                    {slip.toBankAccountId?.accountName ||
                      slip.toBankAccountId?.bankMasterId?.name ||
                      slip.toBankAccountId?.bankName ||
                      slip.toBankAccount?.bankName ||
                      "-"}
                    {slip.toBankAccountId?.accountNumber
                      ? ` (*${slip.toBankAccountId.accountNumber.slice(-4)})`
                      : slip.toBankAccount?.accountNumber
                        ? ` (*${slip.toBankAccount.accountNumber.slice(-4)})`
                        : ""}
                  </p>
                </div>
                {slip.dayClosingId && (
                  <div>
                    <p className="text-[12px] text-text-muted mb-1">Linked Day Closing</p>
                    <p className="text-[13px] font-medium text-text font-mono">
                      {slip.dayClosingId?.dayClosingNo ||
                        (typeof slip.dayClosingId === "string" ? slip.dayClosingId : "-")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[12px] text-text-muted mb-1">Bank Branch</p>
                  <p className="text-[13px] font-medium text-text">{slip.bankBranchName || "-"}</p>
                </div>
                <div>
                  <p className="text-[12px] text-text-muted mb-1">Bag Reference</p>
                  <p className="text-[13px] font-medium text-text">{slip.depositBagReference || "-"}</p>
                </div>
                <div>
                  <p className="text-[12px] text-text-muted mb-1">Total Amount</p>
                  <p className="text-[14px] font-bold text-primary">₹{slip.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              {slip.narration && (
                <div className="mt-6">
                  <p className="text-[12px] text-text-muted mb-1">Narration</p>
                  <p className="text-[13px] text-text">{slip.narration}</p>
                </div>
              )}
            </div>

            {slip.status === "DEPOSITED" && (
              <div className="bg-success-soft/30 border border-success/20 rounded-xl p-5 shadow-sm">
                <AppText variant="subtitle2" className="font-bold text-success-dark mb-4 pb-2 border-b border-success/20">
                  Confirmation Details
                </AppText>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  <div>
                    <p className="text-[12px] text-success-dark/70 mb-1">Confirmed On</p>
                    <p className="text-[13px] font-medium text-success-dark">
                      {slip.depositConfirmedDate ? dayjs(slip.depositConfirmedDate).format("DD MMM YYYY, hh:mm A") : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-success-dark/70 mb-1">Bank Reference (UTR)</p>
                    <p className="text-[13px] font-medium text-success-dark">{slip.bankReferenceNumber || "-"}</p>
                  </div>
                </div>
              </div>
            )}

            {slip.status === "CANCELLED" && (
              <div className="bg-danger-soft/30 border border-danger/20 rounded-xl p-5 shadow-sm">
                <AppText variant="subtitle2" className="font-bold text-danger-dark mb-4 pb-2 border-b border-danger/20">
                  Cancellation Details
                </AppText>
                <div>
                  <p className="text-[12px] text-danger-dark/70 mb-1">Reason</p>
                  <p className="text-[13px] font-medium text-danger-dark">{slip.cancellationReason || "No reason provided"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="w-[360px] flex-none">
            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border bg-surface-alt">
                <AppText variant="subtitle2" className="font-bold text-text">
                  Denominations Summary
                </AppText>
              </div>
              
              <div className="flex-1 p-4 flex flex-col gap-3">
                <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border">
                  <div className="col-span-4">Notes</div>
                  <div className="col-span-4 text-center">Qty</div>
                  <div className="col-span-4 text-right">Subtotal</div>
                </div>
                
                {slip.denominations?.map((item) => (
                  <div key={item.denomination} className="grid grid-cols-12 gap-2 items-center px-2 py-1">
                    <div className="col-span-4 text-[13px] font-medium text-text flex items-center gap-1.5">
                      <span className="text-[11px] text-text-muted">₹</span>
                      {item.denomination}
                      <span className="text-[11px] text-text-muted mx-1">×</span>
                    </div>
                    <div className="col-span-4 text-center text-[13px] font-medium text-text">
                      {item.quantity}
                    </div>
                    <div className="col-span-4 text-right text-[13px] font-medium text-text">
                      {(item.denomination * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-border bg-primary/5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-text">Total</span>
                  <span className="text-[16px] font-bold text-primary">
                    ₹{slip.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDepositModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={(payload) => {
          handleConfirmDeposit(payload);
          setIsConfirmModalOpen(false);
        }}
        isLoading={isTransitioning}
        slip={slip}
      />

      <CancelSlipModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(payload) => {
          handleCancelSlip(payload);
          setIsCancelModalOpen(false);
        }}
        isLoading={isTransitioning}
      />
    </div>
  );
};

export default BankDepositSlipDetailsDesktopPage;
