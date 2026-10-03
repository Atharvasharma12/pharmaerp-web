import React from "react";
import { FiArrowLeft, FiClock, FiSlash, FiUser } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";
import { formatDate } from "@/utils";

const FundTransferDetailsMobilePage = ({
  transferDetails = null,
  isLoading = false,
  isCancelling = false,
  error,
  message,
  clearFeedback,
  handleCancelTransfer,
  handleBack,
}) => {
  if (isLoading && !transferDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving transfer details...
        </AppText>
      </div>
    );
  }

  if (!transferDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full text-center px-4">
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Record Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested fund transfer record could not be found.
        </AppText>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-primary text-surface rounded-md text-[12px] font-bold"
        >
          Back to List
        </button>
      </div>
    );
  }

  const getSourceAccountName = () => {
    if (transferDetails.fromAccountType === "BANK") {
      const b = transferDetails.fromBankAccountId;
      return b ? `${b.bankName} (${b.accountNumber || b.accountCode || ""})` : "Bank Account";
    }
    return "Branch Cash";
  };

  const getDestAccountName = () => {
    if (transferDetails.toAccountType === "BANK") {
      const b = transferDetails.toBankAccountId;
      return b ? `${b.bankName} (${b.accountNumber || b.accountCode || ""})` : "Bank Account";
    }
    return "Branch Cash";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "POSTED":
        return "bg-success-soft text-success border border-success/20";
      case "CANCELLED":
        return "bg-danger-soft text-danger border border-danger/20";
      default:
        return "bg-warning-soft text-warning border border-warning/20";
    }
  };

  const isCancelled = transferDetails.status === "CANCELLED";
  const creatorName = transferDetails.createdBy
    ? `${transferDetails.createdBy.firstName || ""} ${transferDetails.createdBy.lastName || ""}`.trim()
    : "System";

  return (
    <section className="w-full bg-bg pb-20">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1}>
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleBack}
              sx={actionHeaderIconBtnSx}
            />
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Transfer Details
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Audit details and status log
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Feedback Alert */}
        {(error || message) && (
          <div
            className={`mx-2 mb-3 p-3 text-[11px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span className="flex-1">{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ml-2 ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content list */}
        <div className="px-2 space-y-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={detailsCardSx}
          >
            <div className="p-4 border-b border-border bg-surface-alt/10 flex justify-between items-center gap-2">
              <div>
                <span className="text-[10px] text-text-muted font-bold font-mono block">
                  {transferDetails.transferNumber}
                </span>
                <span className="text-[11.5px] text-text-muted block mt-0.5">
                  {formatDate(transferDetails.transferDate)}
                </span>
              </div>
              <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase ${getStatusBadgeClass(transferDetails.status)}`}>
                {transferDetails.status}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Source Account details */}
              <div>
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Source Account</span>
                <span className="font-extrabold text-[12.5px] text-text mt-0.5 block">
                  {getSourceAccountName()}
                </span>
                <span className="text-[9px] font-bold text-text-muted mt-0.2 block font-mono">
                  Type: {transferDetails.fromAccountType}
                </span>
              </div>

              {/* Destination Account details */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Destination Account</span>
                <span className="font-extrabold text-[12.5px] text-text mt-0.5 block">
                  {getDestAccountName()}
                </span>
                <span className="text-[9px] font-bold text-text-muted mt-0.2 block font-mono">
                  Type: {transferDetails.toAccountType}
                </span>
              </div>

              {/* Amount and Ref */}
              <div className="border-t border-border/50 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Amount</span>
                  <strong className="text-text font-black block mt-0.5 text-[15px]">
                    ₹{Number(transferDetails.amount || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block font-mono">Reference</span>
                  <strong className="text-text font-bold block mt-0.5 text-[12px] font-mono">
                    {transferDetails.referenceNumber || "-"}
                  </strong>
                </div>
              </div>

              {/* Narration */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Narration</span>
                <p className="text-[12px] text-text font-semibold mt-1 p-2 bg-surface-alt/10 rounded border border-border">
                  {transferDetails.narration || "No transfer notes."}
                </p>
              </div>

              {/* Denomination Sheets for Cash sides */}
              {((transferDetails.fromDenominations?.length > 0) || (transferDetails.toDenominations?.length > 0)) && (
                <div className="border-t border-border/50 pt-3 space-y-3">
                  {/* From CASH Denominations */}
                  {transferDetails.fromDenominations?.length > 0 && (
                    <div className="border border-border rounded bg-surface-alt/5 p-2 text-[11px]">
                      <span className="font-bold text-text block mb-1">Source Denominations</span>
                      {transferDetails.fromDenominations.map((d) => (
                        <div key={d.denomination} className="flex justify-between items-center py-1 border-b border-border/40 last:border-b-0">
                          <span className="font-bold text-text font-mono">₹{d.denomination}</span>
                          <span className="text-text-muted font-mono">×</span>
                          <span className="font-mono">{d.quantity}</span>
                          <span className="font-extrabold text-text font-mono text-right w-[80px]">₹{(d.denomination * d.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* To CASH Denominations */}
                  {transferDetails.toDenominations?.length > 0 && (
                    <div className="border border-border rounded bg-surface-alt/5 p-2 text-[11px]">
                      <span className="font-bold text-text block mb-1">Destination Denominations</span>
                      {transferDetails.toDenominations.map((d) => (
                        <div key={d.denomination} className="flex justify-between items-center py-1 border-b border-border/40 last:border-b-0">
                          <span className="font-bold text-text font-mono">₹{d.denomination}</span>
                          <span className="text-text-muted font-mono">×</span>
                          <span className="font-mono">{d.quantity}</span>
                          <span className="font-extrabold text-text font-mono text-right w-[80px]">₹{(d.denomination * d.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Cancellation Info if cancelled */}
              {isCancelled && (
                <div className="border-t border-border/50 pt-3 p-3 bg-danger-soft/10 border border-danger/20 rounded space-y-2">
                  <span className="text-[9px] font-bold text-danger uppercase tracking-wider block">
                    Cancellation Log
                  </span>
                  <div className="text-[11px] text-text-muted space-y-1">
                    <div>Reason: <strong className="text-text">{transferDetails.cancellationReason || "N/A"}</strong></div>
                    <div>Cancelled At: <strong className="text-text">{transferDetails.cancelledAt ? formatDate(transferDetails.cancelledAt) : "-"}</strong></div>
                  </div>
                </div>
              )}

              {/* Creator details */}
              <div className="border-t border-border/50 pt-3 flex justify-between items-center text-[10.5px] text-text-muted">
                <span className="flex items-center gap-1"><FiUser /> By: {creatorName}</span>
                <span className="flex items-center gap-1"><FiClock /> Posted: {formatDate(transferDetails.createdAt)}</span>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Fixed bottom controls */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2.5 shadow-lg max-w-[460px] mx-auto w-full">
          <button
            type="button"
            onClick={handleBack}
            disabled={isCancelling}
            className="flex-1 py-2 text-[12px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
          >
            Back to List
          </button>
          {!isCancelled && (
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => {
                const reason = prompt("Enter cancellation reason:");
                if (reason !== null) {
                  handleCancelTransfer(reason);
                }
              }}
              className="flex-1 py-2 text-[12px] font-bold bg-[#c92a2a] text-surface rounded-md hover:bg-red-700 transition flex items-center justify-center gap-1.5"
            >
              <FiSlash className={isCancelling ? "animate-spin" : ""} />
              <span>{isCancelling ? "Cancelling..." : "Cancel Transfer"}</span>
            </button>
          )}
        </div>
      </AppBox>
    </section>
  );
};

// MUI style configurations
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0.5,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "18.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const detailsCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

export default FundTransferDetailsMobilePage;
