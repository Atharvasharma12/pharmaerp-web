import React from "react";
import { FiArrowLeft, FiClock, FiCheck, FiAlertTriangle, FiSlash, FiTrendingUp } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";
import { formatDate } from "@/utils";

const ChequeDetailsMobilePage = ({
  chequeDetails = null,
  isLoading = false,
  isTransitioning = false,
  error,
  message,
  clearFeedback,
  handleDeposit,
  handleClear,
  handleBounce,
  handleCancel,
  handleBack,
}) => {
  if (isLoading && !chequeDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving cheque logs...
        </AppText>
      </div>
    );
  }

  if (!chequeDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full text-center px-4">
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Cheque Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested cheque register could not be located.
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "CLEARED":
        return "bg-success-soft text-success border border-success/20";
      case "BOUNCED":
        return "bg-danger-soft text-danger border border-danger/20";
      case "CANCELLED":
        return "bg-neutral-soft text-text-muted border border-border";
      case "DEPOSITED":
        return "bg-primary-soft text-primary border border-primary/20";
      default:
        return "bg-warning-soft text-warning border border-warning/20";
    }
  };

  const getBankName = () => {
    return chequeDetails.bankAccountId?.bankName || "Unknown Bank";
  };

  const getAccountName = () => {
    return chequeDetails.counterpartyAccountId?.name || "Unknown Account";
  };

  const isReceived = chequeDetails.chequeType === "RECEIVED";
  const isPending = chequeDetails.status === "PENDING";
  const isDeposited = chequeDetails.status === "DEPOSITED";
  const isCleared = chequeDetails.status === "CLEARED";
  const isBounced = chequeDetails.status === "BOUNCED";
  const isCancelled = chequeDetails.status === "CANCELLED";

  const creatorName = chequeDetails.createdBy
    ? `${chequeDetails.createdBy.firstName || ""} ${chequeDetails.createdBy.lastName || ""}`.trim()
    : "System";

  return (
    <section className="w-full bg-bg pb-24">
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
                Cheque Details
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Audit logs and clearances status
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

        {/* Details card content */}
        <div className="px-2">
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
                  #{chequeDetails.chequeNumber}
                </span>
                <span className="text-[11.5px] text-text-muted block mt-0.5 font-semibold">
                  Type: {chequeDetails.chequeType}
                </span>
              </div>
              <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase ${getStatusBadgeClass(chequeDetails.status)}`}>
                {chequeDetails.status}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Drawn Bank */}
              <div>
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Drawn Bank Account</span>
                <span className="font-extrabold text-[12.5px] text-text mt-0.5 block">
                  {getBankName()}
                </span>
              </div>

              {/* Party / Payee Name */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Drawer / Payee</span>
                <span className="font-extrabold text-[12.5px] text-text mt-0.5 block">
                  {chequeDetails.partyName}
                </span>
              </div>

              {/* Counterparty Account */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Ledger Account Mapping</span>
                <span className="font-extrabold text-[12.5px] text-text mt-0.5 block">
                  {getAccountName()}
                </span>
              </div>

              {/* Amount and Drawn Date */}
              <div className="border-t border-border/50 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Amount</span>
                  <strong className="text-text font-black block mt-0.5 text-[15px]">
                    ₹{Number(chequeDetails.amount || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Cheque Date</span>
                  <strong className="text-text font-bold block mt-0.5 text-[12px] font-mono">
                    {formatDate(chequeDetails.chequeDate)}
                  </strong>
                </div>
              </div>

              {/* Narration */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Narration</span>
                <p className="text-[12px] text-text font-semibold mt-1 p-2 bg-surface-alt/10 rounded border border-border">
                  {chequeDetails.narration || "No remarks provided."}
                </p>
              </div>

              {/* Logs */}
              {isDeposited && (
                <div className="border-t border-border/50 pt-3 text-[11px] text-text-muted">
                  <span>Deposited at: <strong>{formatDate(chequeDetails.depositedAt)}</strong></span>
                </div>
              )}

              {isCleared && (
                <div className="border-t border-border/50 pt-3 text-[11px] text-text-muted">
                  <span>Cleared at: <strong>{formatDate(chequeDetails.clearedAt)}</strong></span>
                </div>
              )}

              {isBounced && (
                <div className="border-t border-border/50 pt-3 p-3 bg-danger-soft/10 border border-danger/20 rounded space-y-2">
                  <span className="text-[9px] font-bold text-danger uppercase tracking-wider block">
                    Bounce Logs
                  </span>
                  <div className="text-[11px] text-text-muted space-y-1">
                    <div>Reason: <strong className="text-text">{chequeDetails.bounceReason}</strong></div>
                    <div>Charges: <strong className="text-text">₹{chequeDetails.bounceCharges}</strong></div>
                    <div>Bounced At: <strong className="text-text">{formatDate(chequeDetails.bouncedAt)}</strong></div>
                  </div>
                </div>
              )}

              {isCancelled && (
                <div className="border-t border-border/50 pt-3 p-3 bg-neutral-soft border border-border rounded space-y-2">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
                    Cancellation Logs
                  </span>
                  <div className="text-[11px] text-text-muted space-y-1">
                    <div>Reason: <strong className="text-text">{chequeDetails.cancellationReason}</strong></div>
                    <div>Cancelled At: <strong className="text-text">{formatDate(chequeDetails.cancelledAt)}</strong></div>
                  </div>
                </div>
              )}

              {/* Creator details */}
              <div className="border-t border-border/50 pt-3 flex justify-between items-center text-[10.5px] text-text-muted">
                <span>By: {creatorName}</span>
                <span>Recorded: {formatDate(chequeDetails.createdAt)}</span>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Sticky bottom operations bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2 shadow-lg max-w-[460px] mx-auto w-full">
          <button
            type="button"
            onClick={handleBack}
            disabled={isTransitioning}
            className="px-3 py-2 text-[12px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
          >
            Back
          </button>

          <div className="flex-1 flex gap-2">
            {isReceived && isPending && (
              <button
                type="button"
                disabled={isTransitioning}
                onClick={handleDeposit}
                className="flex-1 py-2 text-[12px] font-bold bg-primary text-surface rounded-md hover:bg-primary-hover transition flex items-center justify-center gap-1"
              >
                <FiTrendingUp />
                <span>Deposit</span>
              </button>
            )}

            {((isReceived && isDeposited) || (!isReceived && isPending)) && (
              <>
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => {
                    const date = prompt("Enter clearance date (YYYY-MM-DD):");
                    if (date !== null) handleClear(date);
                  }}
                  className="flex-1 py-2 text-[11px] font-bold bg-[#2b8a3e] text-surface rounded-md hover:bg-emerald-700 transition flex items-center justify-center gap-1"
                >
                  <FiCheck />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => {
                    const reason = prompt("Enter bounce reason:");
                    if (reason) {
                      const charges = prompt("Charges (INR):", "0");
                      handleBounce(reason, Number(charges) || 0);
                    }
                  }}
                  className="flex-1 py-2 text-[11px] font-bold bg-danger text-surface rounded-md hover:bg-red-700 transition flex items-center justify-center gap-1"
                >
                  <FiAlertTriangle />
                  <span>Bounce</span>
                </button>
              </>
            )}

            {!isCleared && !isBounced && !isCancelled && (
              <button
                type="button"
                disabled={isTransitioning}
                onClick={() => {
                  const reason = prompt("Enter cancellation reason:");
                  if (reason !== null) handleCancel(reason);
                }}
                className="px-2 py-2 text-[11px] font-bold border border-danger text-danger bg-surface rounded-md hover:bg-danger-soft transition flex items-center justify-center gap-1"
              >
                <FiSlash />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </AppBox>
    </section>
  );
};

// Layout configurations
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

export default ChequeDetailsMobilePage;
