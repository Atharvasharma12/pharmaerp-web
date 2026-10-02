import { useState } from "react";
import { FiArrowLeft, FiCheck, FiAlertTriangle } from "react-icons/fi";
import dayjs from "dayjs";
import { AppText } from "@/components";
import { ConfirmDepositModal, CancelSlipModal } from "../../components/BankDepositSlipActionModals";

const getStatusColor = (status) => {
  switch (status) {
    case "PREPARED":
      return "text-warning bg-warning-soft border-warning/20";
    case "DEPOSITED":
      return "text-success bg-success-soft border-success/20";
    case "CANCELLED":
      return "text-danger bg-danger-soft border-danger/20";
    default:
      return "text-text-muted bg-surface-alt border-border";
  }
};

const BankDepositSlipDetailsMobilePage = ({
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
  const [activeTab, setActiveTab] = useState("details");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (isLoading || !slip) {
    return (
      <div className="h-full flex items-center justify-center bg-surface-alt">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface-alt">
      <div className="flex-none px-4 py-4 bg-surface border-b border-border shadow-sm z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-text hover:bg-surface-alt rounded-lg transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <AppText variant="h6" className="font-bold text-text truncate">
              {slip.slipNumber}
            </AppText>
            <AppText variant="body2" className="text-[12px] text-text-muted mt-0.5">
              {dayjs(slip.slipDate).format("DD MMM YYYY")}
            </AppText>
          </div>
          <div className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(slip.status)}`}>
            {slip.status}
          </div>
        </div>

        <div className="flex bg-surface-alt rounded-lg p-1 border border-border">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-1.5 text-[13px] font-bold rounded-md transition ${
              activeTab === "details" ? "bg-surface shadow-sm text-text" : "text-text-muted"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("denominations")}
            className={`flex-1 py-1.5 text-[13px] font-bold rounded-md transition ${
              activeTab === "denominations" ? "bg-surface shadow-sm text-text" : "text-text-muted"
            }`}
          >
            Denominations
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24">
        <div className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-danger-soft text-danger rounded-xl text-[13px] flex justify-between items-center shadow-sm">
              <span>{error}</span>
              <button onClick={clearFeedback} className="font-bold p-1">&times;</button>
            </div>
          )}
          {message && (
            <div className="p-3 bg-success-soft text-success rounded-xl text-[13px] flex justify-between items-center shadow-sm">
              <span>{message}</span>
              <button onClick={clearFeedback} className="font-bold p-1">&times;</button>
            </div>
          )}

          {activeTab === "details" ? (
            <div className="flex flex-col gap-4">
              <div className="bg-surface rounded-xl p-4 shadow-sm border border-border flex flex-col gap-4">
                <div>
                  <p className="text-[11px] text-text-muted mb-0.5">From Cash Account</p>
                  <p className="text-[14px] font-medium text-text">
                    {slip.fromCashAccountId?.accountName || slip.fromCashAccount?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-text-muted mb-0.5">To Bank Account</p>
                  <p className="text-[14px] font-medium text-text">
                    {slip.toBankAccountId?.accountName ||
                      slip.toBankAccountId?.bankMasterId?.name ||
                      slip.toBankAccountId?.bankName ||
                      slip.toBankAccount?.bankName ||
                      "-"}
                    <span className="text-[12px] text-text-muted ml-1">
                      {slip.toBankAccountId?.accountNumber
                        ? `(*${slip.toBankAccountId.accountNumber.slice(-4)})`
                        : slip.toBankAccount?.accountNumber
                          ? `(*${slip.toBankAccount.accountNumber.slice(-4)})`
                          : ""}
                    </span>
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  {slip.dayClosingId ? (
                    <div>
                      <p className="text-[11px] text-text-muted mb-0.5">Day Closing</p>
                      <p className="text-[13px] font-medium text-text font-mono">
                        {slip.dayClosingId?.dayClosingNo ||
                          (typeof slip.dayClosingId === "string" ? slip.dayClosingId : "-")}
                      </p>
                    </div>
                  ) : <div />}
                  <div className="text-right">
                    <p className="text-[11px] text-text-muted mb-0.5">Total Amount</p>
                    <p className="text-[16px] font-bold text-primary">₹{slip.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-xl p-4 shadow-sm border border-border flex flex-col gap-4">
                <AppText variant="subtitle2" className="font-bold text-text">Additional Info</AppText>
                <div>
                  <p className="text-[11px] text-text-muted mb-0.5">Bank Branch</p>
                  <p className="text-[13px] text-text">{slip.bankBranchName || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-text-muted mb-0.5">Bag Reference</p>
                  <p className="text-[13px] text-text">{slip.depositBagReference || "-"}</p>
                </div>
                {slip.narration && (
                  <div>
                    <p className="text-[11px] text-text-muted mb-0.5">Narration</p>
                    <p className="text-[13px] text-text">{slip.narration}</p>
                  </div>
                )}
              </div>

              {slip.status === "DEPOSITED" && (
                <div className="bg-success-soft/30 rounded-xl p-4 shadow-sm border border-success/20 flex flex-col gap-3">
                  <AppText variant="subtitle2" className="font-bold text-success-dark">Confirmation Details</AppText>
                  <div>
                    <p className="text-[11px] text-success-dark/70 mb-0.5">Confirmed On</p>
                    <p className="text-[13px] font-medium text-success-dark">
                      {slip.depositConfirmedDate ? dayjs(slip.depositConfirmedDate).format("DD MMM YYYY, hh:mm A") : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-success-dark/70 mb-0.5">Bank Reference (UTR)</p>
                    <p className="text-[13px] font-medium text-success-dark">{slip.bankReferenceNumber || "-"}</p>
                  </div>
                </div>
              )}

              {slip.status === "CANCELLED" && (
                <div className="bg-danger-soft/30 rounded-xl p-4 shadow-sm border border-danger/20 flex flex-col gap-3">
                  <AppText variant="subtitle2" className="font-bold text-danger-dark">Cancellation Details</AppText>
                  <div>
                    <p className="text-[11px] text-danger-dark/70 mb-0.5">Reason</p>
                    <p className="text-[13px] font-medium text-danger-dark">{slip.cancellationReason || "No reason provided"}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-12 gap-2 pb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border">
                  <div className="col-span-4">Notes</div>
                  <div className="col-span-4 text-center">Qty</div>
                  <div className="col-span-4 text-right">Subtotal</div>
                </div>
                
                {slip.denominations?.map((item) => (
                  <div key={item.denomination} className="grid grid-cols-12 gap-2 items-center py-1">
                    <div className="col-span-4 text-[13px] font-medium text-text flex items-center gap-1.5">
                      <span className="text-[11px] text-text-muted">₹</span>
                      {item.denomination}
                      <span className="text-[11px] text-text-muted mx-1">×</span>
                    </div>
                    <div className="col-span-4 text-center text-[13px] font-medium text-text">
                      {item.quantity}
                    </div>
                    <div className="col-span-4 text-right text-[13px] font-bold text-text">
                      {(item.denomination * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-bold text-text-muted">Total Amount</span>
          <span className="text-[20px] font-black text-primary">
            ₹{slip.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        {slip.status === "PREPARED" && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="flex-1 py-3 bg-danger-soft hover:bg-danger-soft/80 text-danger rounded-xl text-[14px] font-bold transition flex items-center justify-center gap-2"
            >
              <FiAlertTriangle size={16} />
              Cancel
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="flex-1 py-3 bg-success hover:bg-success/90 text-white rounded-xl text-[14px] font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              <FiCheck size={16} />
              Confirm
            </button>
          </div>
        )}
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

export default BankDepositSlipDetailsMobilePage;
