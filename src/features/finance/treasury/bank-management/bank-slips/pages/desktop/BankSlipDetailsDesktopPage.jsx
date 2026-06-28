import React, { useState } from "react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiSend,
  FiInfo,
} from "react-icons/fi";
import { LuTicket } from "react-icons/lu";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";
import { formatCurrency, formatDate } from "@/utils";

const BankSlipDetailsDesktopPage = ({
  bankSlip,
  isLoading = false,
  isActioning = false,
  error,
  handleBack,
  handleRefresh,
  handleSubmitSlip,
  handleConfirmSlip,
  handleRejectSlip,
  handleCancelSlip,
  clearLocalErrors,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5 flex items-center justify-center">
        <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}>
          Loading Bank Slip details...
        </AppText>
      </section>
    );
  }

  if (!bankSlip) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
        <div className="mx-auto w-full max-w-[1200px] text-center py-10">
          <AppHeading level={2} weight={700} sx={{ color: "var(--app-color-text)" }}>
            Error Loading Bank Slip
          </AppHeading>
          <AppText variant="body1" sx={{ color: "var(--app-color-danger)", mt: 1 }}>
            {error || "Bank slip not found or has been deleted."}
          </AppText>
          <AppButton variant="contained" colorVariant="primary" onClick={handleBack} sx={{ mt: 3 }}>
            Back to Bank Slips
          </AppButton>
        </div>
      </section>
    );
  }

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    handleRejectSlip(rejectReason);
    setShowRejectForm(false);
    setRejectReason("");
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    handleCancelSlip(cancelReason);
    setShowCancelForm(false);
    setCancelReason("");
  };

  const status = String(bankSlip.status || "").toUpperCase();
  const isPending = status === "PENDING";
  const isSubmitted = status === "SUBMITTED";
  const isDeposit = String(bankSlip.slipType).toUpperCase() === "CASH_DEPOSIT";

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "PENDING") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "SUBMITTED") bg = "bg-[#e7f5ff] text-[#1c7ed6] border-[#a5d8ff]";
    else if (raw === "CONFIRMED") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "REJECTED") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "CANCELLED") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";

    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title={`Bank Slip Details`}
          subtitle={`Auto Slip No: ${bankSlip.slipNumber}`}
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Bank Slips", onClick: handleBack },
                { label: bankSlip.slipNumber, current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Toolbar */}
        <div className="mt-4 flex items-center justify-between">
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            disabled={isActioning}
            sx={actionBtnSx}
          >
            Back
          </AppButton>

          <AppStack direction="row" gap={1.5} align="center">
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              disabled={isActioning}
              sx={actionBtnSx}
            >
              Refresh
            </AppButton>

            {/* Workflow Action Buttons */}
            {isPending && (
              <>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="danger"
                  rounded="md"
                  size="small"
                  startIcon={<FiXCircle />}
                  onClick={() => {
                    setShowCancelForm(true);
                    setShowRejectForm(false);
                  }}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Cancel Slip
                </AppButton>
                <AppButton
                  type="button"
                  variant="filled"
                  colorVariant="primary"
                  rounded="md"
                  size="small"
                  startIcon={<FiSend />}
                  onClick={() => handleSubmitSlip()}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Submit to Bank
                </AppButton>
              </>
            )}

            {isSubmitted && (
              <>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="danger"
                  rounded="md"
                  size="small"
                  startIcon={<FiXCircle />}
                  onClick={() => {
                    setShowRejectForm(true);
                    setShowCancelForm(false);
                  }}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Reject Slip
                </AppButton>
                <AppButton
                  type="button"
                  variant="filled"
                  colorVariant="success"
                  rounded="md"
                  size="small"
                  startIcon={<FiCheckCircle />}
                  onClick={() => handleConfirmSlip()}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Confirm Settlement
                </AppButton>
              </>
            )}
          </AppStack>
        </div>

        {/* Rejection / Cancellation inline panels */}
        {showRejectForm && (
          <div className="mt-4 p-4 bg-danger-soft border border-danger/20 rounded-lg">
            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <span className="font-bold text-[12.5px] text-danger block">Enter Rejection Reason</span>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
                placeholder="Reason for bank counter rejection..."
                rows={2}
                className="w-full p-2 text-[12px] border border-border rounded bg-surface"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1 text-[11px] font-bold border border-border rounded text-text bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] font-bold bg-danger text-surface rounded"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        )}

        {showCancelForm && (
          <div className="mt-4 p-4 bg-danger-soft border border-danger/20 rounded-lg">
            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <span className="font-bold text-[12.5px] text-danger block">Enter Void Reason</span>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for slip cancellation..."
                rows={2}
                className="w-full p-2 text-[12px] border border-border rounded bg-surface"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCancelForm(false)}
                  className="px-3 py-1 text-[11px] font-bold border border-border rounded text-text bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] font-bold bg-danger text-surface rounded"
                >
                  Confirm Void
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Server errors */}
        {error && (
          <div className="mt-4 p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearLocalErrors}
              className="text-danger font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Detail grids */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          {/* Left panel: Overview */}
          <div className="col-span-1">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={leftCardSx}>
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-alt flex items-center justify-center border border-border/80 shadow-xs">
                  <LuTicket className="text-[22px] text-text" />
                </div>
                <AppHeading level={2} weight={700} sx={titleSx}>
                  {bankSlip.slipNumber}
                </AppHeading>
                <div className="mt-2 flex items-center gap-1.5 justify-center">
                  {getStatusBadge(bankSlip.status)}
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase border ${
                      isDeposit
                        ? "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]"
                        : "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]"
                    }`}
                  >
                    {isDeposit ? "Deposit" : "Withdrawal"}
                  </span>
                </div>

                <div className="mt-6 py-4 px-2 w-full bg-surface-alt/10 border-y border-border/60">
                  <span className="text-[11px] text-text-muted uppercase tracking-wider block">Slip Amount</span>
                  <span className="text-[24px] font-black text-text mt-1 block">
                    {formatCurrency(bankSlip.amount)}
                  </span>
                </div>

                {bankSlip.narration && (
                  <div className="mt-4 w-full text-left">
                    <span className="text-[11.5px] text-text-muted font-bold block mb-1">Narration</span>
                    <p className="text-[12px] leading-relaxed text-text italic">
                      "{bankSlip.narration}"
                    </p>
                  </div>
                )}
              </div>
            </AppCard>
          </div>

          {/* Right panel: Metadata parameters */}
          <div className="col-span-2 space-y-4">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={rightCardSx}>
              <div className="px-5 py-4 border-b border-border">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  Bank Pay-in Slip Parameters
                </AppHeading>
              </div>

              <div className="p-5 space-y-4 text-[13px]">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-text-muted block font-semibold">Settlement Bank Account</span>
                    {bankSlip.bankAccountId ? (
                      <span className="font-bold text-primary block mt-1">
                        {bankSlip.bankAccountId.bankName} - A/C: {bankSlip.bankAccountId.accountNumber} ({bankSlip.bankAccountId.accountNickname || "Primary Checking"})
                      </span>
                    ) : (
                      <span className="font-semibold text-text block mt-1">-</span>
                    )}
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">Physical Receipt Reference</span>
                    <span className="font-semibold text-text block mt-1 font-mono text-[14px]">
                      {bankSlip.bankSlipReference || "-"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-text-muted block font-semibold">Slip Date</span>
                    <span className="font-semibold text-text block mt-1">
                      {formatDate(bankSlip.slipDate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">Transaction Created Date</span>
                    <span className="font-semibold text-text block mt-1">
                      {formatDate(bankSlip.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Audit trail */}
                {bankSlip.submittedAt && (
                  <div className="grid grid-cols-2 gap-5 border-t border-border/60 pt-3">
                    <div>
                      <span className="text-text-muted block font-semibold">Submitted At</span>
                      <span className="font-semibold text-text block mt-1">
                        {formatDate(bankSlip.submittedAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block font-semibold">Submitted By</span>
                      <span className="font-semibold text-text block mt-1">
                        {bankSlip.submittedBy?.name || "System Manager"}
                      </span>
                    </div>
                  </div>
                )}

                {bankSlip.confirmedAt && (
                  <div className="grid grid-cols-2 gap-5 border-t border-border/60 pt-3">
                    <div>
                      <span className="text-text-muted block font-semibold">Confirmed At</span>
                      <span className="font-semibold text-text block mt-1">
                        {formatDate(bankSlip.confirmedAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block font-semibold">Confirmed By</span>
                      <span className="font-semibold text-text block mt-1">
                        {bankSlip.confirmedBy?.name || "Bank Counter Clerk"}
                      </span>
                    </div>
                  </div>
                )}

                {bankSlip.rejectedAt && (
                  <div className="border-t border-border/60 pt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <span className="text-text-muted block font-semibold">Rejected At</span>
                        <span className="font-semibold text-text block mt-1">
                          {formatDate(bankSlip.rejectedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block font-semibold">Rejected By</span>
                        <span className="font-semibold text-text block mt-1">
                          {bankSlip.rejectedBy?.name || "Bank Counter Clerk"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-text-muted block font-semibold">Rejection Reason</span>
                      <p className="text-[12px] text-danger mt-1 italic">
                        "{bankSlip.rejectionReason}"
                      </p>
                    </div>
                  </div>
                )}

                {bankSlip.cancelledAt && (
                  <div className="border-t border-border/60 pt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <span className="text-text-muted block font-semibold">Cancelled / Void At</span>
                        <span className="font-semibold text-text block mt-1">
                          {formatDate(bankSlip.cancelledAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block font-semibold">Cancelled By</span>
                        <span className="font-semibold text-text block mt-1">
                          {bankSlip.cancelledBy?.name || "System Operator"}
                        </span>
                      </div>
                    </div>
                    {bankSlip.cancellationReason && (
                      <div>
                        <span className="text-text-muted block font-semibold">Void Reason</span>
                        <p className="text-[12px] text-text-muted mt-1 italic">
                          "{bankSlip.cancellationReason}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AppCard>

            {/* Posting Ledger Documents links */}
            {(bankSlip.journalVoucherId || bankSlip.bankTransactionId) && (
              <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={rightCardSx}>
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-1.5">
                  <FiInfo className="text-primary text-[14px]" />
                  <span className="text-[12.8px] font-bold text-text">Posted Ledger Records</span>
                </div>
                <div className="p-4 space-y-2.5 text-[12.5px]">
                  {bankSlip.journalVoucherId && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted font-medium">Journal Settlement Voucher</span>
                      <span className="font-bold text-primary hover:underline cursor-pointer">
                        View JV Document
                      </span>
                    </div>
                  )}
                  {bankSlip.bankTransactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted font-medium">Linked Bank Ledger Entry</span>
                      <span className="font-bold text-primary hover:underline cursor-pointer">
                        View Bank Transaction
                      </span>
                    </div>
                  )}
                </div>
              </AppCard>
            )}
          </div>
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

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "23px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

const leftCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  height: "100%",
};

const rightCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const titleSx = {
  m: 0,
  mt: 2,
  fontSize: "16px",
  color: "var(--app-color-text)",
};

const cardTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

export default BankSlipDetailsDesktopPage;
