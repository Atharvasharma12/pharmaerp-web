import React, { useState } from "react";
import { FiArrowLeft, FiClock, FiCheck, FiAlertTriangle, FiSlash, FiFolderMinus, FiTrendingUp, FiInfo } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";
import { formatDate } from "@/utils";

import {
  ClearChequeModal,
  BounceChequeModal,
  CancelChequeModal,
} from "../../components/ChequeActionModals";

const ChequeDetailsDesktopPage = ({
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
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [bounceModalOpen, setBounceModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  if (isLoading && !chequeDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg">
        <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving cheque logs...
        </AppText>
      </div>
    );
  }

  if (!chequeDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg text-center">
        <FiClock className="text-[40px] text-text-muted/40 mb-3" />
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Cheque Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested cheque register could not be located.
        </AppText>
        <AppButton size="small" variant="contained" onClick={handleBack} sx={{ mt: 3 }}>
          Back to List
        </AppButton>
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

  const getBankName = () => chequeDetails.bankAccountId?.bankName || "Unknown Bank";
  const getAccountName = () => chequeDetails.counterpartyAccountId?.name || "Unknown Account";

  const isReceived = chequeDetails.chequeType === "RECEIVED";
  const isPending = chequeDetails.status === "PENDING";
  const isDeposited = chequeDetails.status === "DEPOSITED";
  const isCleared = chequeDetails.status === "CLEARED";
  const isBounced = chequeDetails.status === "BOUNCED";
  const isCancelled = chequeDetails.status === "CANCELLED";

  const creatorName = chequeDetails.createdBy
    ? `${chequeDetails.createdBy.firstName || ""} ${chequeDetails.createdBy.lastName || ""}`.trim()
    : "System";

  // ─── Contextual next-step hint ───────────────────────────────────────────
  const getStatusHint = () => {
    if (isCleared || isBounced || isCancelled) return null;
    if (isReceived && isPending)
      return { text: "Waiting to be deposited into the bank. Click 'Deposit Cheque' once submitted.", color: "warning" };
    if (isReceived && isDeposited)
      return { text: "Cheque is in transit. Awaiting bank confirmation — clear or bounce once confirmed.", color: "primary" };
    if (!isReceived && isPending)
      return { text: "Cheque has been issued to the vendor. Clear once the vendor cashes it, or bounce if returned.", color: "warning" };
    return null;
  };

  const hint = getStatusHint();

  // ─── Modal submit handlers ────────────────────────────────────────────────
  const onClearSubmit = async (payload) => {
    await handleClear(payload.clearDate || "", payload.narration || "");
    setClearModalOpen(false);
  };

  const onBounceSubmit = async (payload) => {
    await handleBounce(payload.reason, payload.bounceCharges);
    setBounceModalOpen(false);
  };

  const onCancelSubmit = async (payload) => {
    await handleCancel(payload.reason || "");
    setCancelModalOpen(false);
  };

  const canClear = (isReceived && isDeposited) || (!isReceived && isPending);
  const canBounce = (isReceived && isDeposited) || (!isReceived && isPending);
  const canCancel = !isCleared && !isBounced && !isCancelled;
  const canDeposit = isReceived && isPending;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      {/* ── Modals ── */}
      <ClearChequeModal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={onClearSubmit}
        isLoading={isTransitioning}
        chequeType={chequeDetails.chequeType}
      />
      <BounceChequeModal
        open={bounceModalOpen}
        onClose={() => setBounceModalOpen(false)}
        onConfirm={onBounceSubmit}
        isLoading={isTransitioning}
        chequeType={chequeDetails.chequeType}
      />
      <CancelChequeModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={onCancelSubmit}
        isLoading={isTransitioning}
      />

      <div className="mx-auto w-full max-w-[800px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              Cheque Details
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Verify clearances, bounce charges, posting diaries, and audit records.
            </AppText>
          </div>
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Finance" },
              { label: "Cheques", onClick: handleBack },
              { label: "Details", current: true },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* Status hint banner */}
        {hint && (
          <div
            className={`mt-4 p-3 rounded-lg border flex items-start gap-2.5 text-[12px] font-semibold ${
              hint.color === "warning"
                ? "bg-warning-soft/20 border-warning/20 text-warning"
                : "bg-primary-soft/20 border-primary/20 text-primary"
            }`}
          >
            <FiInfo className="mt-0.5 shrink-0" size={14} />
            <span>{hint.text}</span>
          </div>
        )}

        {/* Feedback Alert */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span>{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Details Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          sx={cardSx}
          className="mt-5"
        >
          {/* Header Panel */}
          <div className="px-5 py-4 border-b border-border bg-surface-alt/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-muted font-black tracking-wider uppercase font-mono">
                Cheque Number: {chequeDetails.chequeNumber}
              </span>
              <AppHeading level={3} weight={700} sx={cardTitleSx} className="mt-0.5">
                Cheque Instrument Registry
              </AppHeading>
            </div>
            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase ${getStatusBadgeClass(chequeDetails.status)}`}>
              {chequeDetails.status}
            </span>
          </div>

          <div className="p-5 space-y-6">
            {/* Type & Amount */}
            <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Cheque Amount</span>
                <span className="text-[24px] font-black text-text mt-1 block">
                  ₹ {Number(chequeDetails.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Cheque Date (Drawn)</span>
                <span className="text-[15px] font-extrabold text-text mt-2 block">
                  {formatDate(chequeDetails.chequeDate)}
                </span>
              </div>
            </div>

            {/* Core Info */}
            <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Cheque Type</span>
                <span className="text-[13px] font-bold text-text mt-1 block">
                  {isReceived ? "Received from Customer" : "Issued to Vendor"}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block font-mono">Company Bank</span>
                <span className="text-[13px] font-semibold text-text mt-1 block">
                  {getBankName()}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Party Name (Drawer/Payee)</span>
                <span className="text-[13.5px] font-bold text-text mt-1.5 block">
                  {chequeDetails.partyName}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Ledger Account (COA Mapping)</span>
                <span className="text-[13px] font-semibold text-text mt-1 block">
                  {getAccountName()}
                </span>
              </div>
            </div>

            {/* Narration */}
            <div className="border-b border-border pb-5">
              <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Narration / Remarks</span>
              <p className="text-[13px] text-text font-semibold mt-2 leading-relaxed bg-surface-alt/20 p-3 rounded-md border border-border">
                {chequeDetails.narration || "No additional remarks."}
              </p>
            </div>

            {/* Transition logs depending on status */}
            {isDeposited && (
              <div className="p-4 bg-primary-soft/10 border border-primary/20 rounded-md">
                <span className="text-[9.5px] font-extrabold text-primary uppercase tracking-wider block mb-1">
                  Deposit Log
                </span>
                <span className="text-[12px] text-text-muted">
                  Deposited at: <strong>{formatDate(chequeDetails.depositedAt)}</strong>
                </span>
              </div>
            )}

            {isCleared && (
              <div className="p-4 bg-success-soft/10 border border-success/20 rounded-md">
                <span className="text-[9.5px] font-extrabold text-success uppercase tracking-wider block mb-1">
                  Clearance Log
                </span>
                <span className="text-[12px] text-text-muted">
                  Cleared at: <strong>{formatDate(chequeDetails.clearedAt)}</strong>
                </span>
              </div>
            )}

            {isBounced && (
              <div className="p-4 bg-danger-soft/10 border border-danger/20 rounded-md space-y-2">
                <span className="text-[9.5px] font-extrabold text-danger uppercase tracking-wider block">
                  Bounce Log
                </span>
                <div className="grid grid-cols-2 gap-4 text-[12px] text-text-muted">
                  <div>
                    <span>Bounced At:</span>
                    <strong className="text-text ml-1">{formatDate(chequeDetails.bouncedAt)}</strong>
                  </div>
                  <div>
                    <span>Charges Incurred:</span>
                    <strong className="text-text ml-1">₹ {Number(chequeDetails.bounceCharges || 0).toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="col-span-2">
                    <span>Reason:</span>
                    <p className="text-text font-semibold mt-1">{chequeDetails.bounceReason || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="p-4 bg-neutral-soft border border-border rounded-md space-y-2">
                <span className="text-[9.5px] font-extrabold text-text-muted uppercase tracking-wider block">
                  Cancellation Log
                </span>
                <div className="grid grid-cols-2 gap-4 text-[12px] text-text-muted">
                  <div>
                    <span>Cancelled At:</span>
                    <strong className="text-text ml-1">{formatDate(chequeDetails.cancelledAt)}</strong>
                  </div>
                  <div className="col-span-2">
                    <span>Reason:</span>
                    <p className="text-text font-semibold mt-1">{chequeDetails.cancellationReason || "No reason provided"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Audit creation info */}
            <div className="flex justify-between items-center text-[12px] text-text-muted pt-2">
              <div className="flex items-center gap-1.5">
                <span>Recorded By:</span>
                <strong>{creatorName}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Created At:</span>
                <strong>{formatDate(chequeDetails.createdAt)}</strong>
              </div>
            </div>
          </div>
        </AppCard>

        {/* Footer controls */}
        <div className="mt-5 flex items-center justify-between">
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            disabled={isTransitioning}
            sx={actionBtnSx}
          >
            Back to List
          </AppButton>

          <AppStack direction="row" gap={1} align="center">
            {/* RECEIVED + PENDING → Deposit */}
            {canDeposit && (
              <AppButton
                variant="contained"
                colorVariant="primary"
                size="small"
                rounded="md"
                startIcon={<FiTrendingUp />}
                onClick={handleDeposit}
                disabled={isTransitioning}
              >
                Deposit Cheque
              </AppButton>
            )}

            {/* Clear button */}
            {canClear && (
              <AppButton
                variant="contained"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiCheck />}
                onClick={() => setClearModalOpen(true)}
                disabled={isTransitioning}
              >
                Clear
              </AppButton>
            )}

            {/* Bounce button */}
            {canBounce && (
              <AppButton
                variant="outlined"
                colorVariant="error"
                size="small"
                rounded="md"
                startIcon={<FiAlertTriangle />}
                onClick={() => setBounceModalOpen(true)}
                disabled={isTransitioning}
              >
                Bounce
              </AppButton>
            )}

            {/* Cancel button */}
            {canCancel && (
              <AppButton
                variant="outlined"
                colorVariant="error"
                size="small"
                rounded="md"
                startIcon={<FiSlash />}
                onClick={() => setCancelModalOpen(true)}
                disabled={isTransitioning}
              >
                Cancel Cheque
              </AppButton>
            )}
          </AppStack>
        </div>
      </div>
    </section>
  );
};

// Styling variables
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  cursor: "pointer",
  "&:hover": { color: "var(--app-color-primary)" },
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageTitleSx = {
  m: 0,
  fontSize: "23px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.5,
  fontSize: "13px",
  color: "var(--app-color-text-muted)",
};

const cardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const cardTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

export default ChequeDetailsDesktopPage;
