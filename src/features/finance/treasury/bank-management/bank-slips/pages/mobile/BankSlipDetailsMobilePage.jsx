import React, { useState } from "react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiSend,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { LuTicket } from "react-icons/lu";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";
import { formatCurrency, formatDate } from "@/utils";

const BankSlipDetailsMobilePage = ({
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
      <section className="w-full bg-bg py-8 flex items-center justify-center">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Loading Bank Slip details...
        </AppText>
      </section>
    );
  }

  if (!bankSlip) {
    return (
      <section className="w-full bg-bg px-4 py-8 text-center">
        <AppHeading level={2} weight={700} sx={{ fontSize: "16px", color: "var(--app-color-text)" }}>
          Error Loading Bank Slip
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-danger)", mt: 1 }}>
          {error || "Bank slip details could not be found."}
        </AppText>
        <AppIconButton
          icon={<FiArrowLeft />}
          variant="filled"
          colorVariant="primary"
          onClick={handleBack}
          sx={{ mt: 3, mx: "auto" }}
        />
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
      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1} justify="space-between">
            <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0, flex: 1 }}>
              <AppIconButton
                icon={<FiArrowLeft />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleBack}
                disabled={isActioning}
                sx={actionHeaderIconBtnSx}
              />
              <AppBox sx={{ minWidth: 0, flex: 1 }}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {bankSlip.slipNumber}
                </AppHeading>
                <AppText variant="body2" sx={pageSubtitleSx}>
                  Bank pay-in slip details
                </AppText>
              </AppBox>
            </AppStack>

            <AppIconButton
              icon={<FiRefreshCw />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleRefresh}
              disabled={isActioning}
              sx={actionHeaderIconBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* Server errors */}
        {error && (
          <div className="mx-2 mb-3 p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex justify-between items-center">
            <span className="flex-1">{error}</span>
            <button
              onClick={clearLocalErrors}
              className="text-danger font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workflow actions drawer */}
        {(isPending || isSubmitted) && (
          <div className="px-2 mb-3">
            <AppCard variant="default" rounded="lg" bordered shadow="none" sx={formCardSx}>
              <div className="p-3 border-b border-border">
                <span className="text-[11.5px] font-bold text-text">Workflow Actions</span>
              </div>
              <div className="p-3 flex gap-2 w-full">
                {isPending && (
                  <>
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => {
                        setShowCancelForm(true);
                        setShowRejectForm(false);
                      }}
                      className="flex-1 py-1.8 text-[11px] font-bold border border-border bg-surface rounded-md text-danger hover:bg-danger-soft/10 transition"
                    >
                      Void Slip
                    </button>
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleSubmitSlip()}
                      className="flex-1 py-1.8 text-[11px] font-bold bg-primary text-surface rounded-md hover:bg-primary-hover transition"
                    >
                      Submit
                    </button>
                  </>
                )}

                {isSubmitted && (
                  <>
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => {
                        setShowRejectForm(true);
                        setShowCancelForm(false);
                      }}
                      className="flex-1 py-1.8 text-[11px] font-bold border border-border bg-surface rounded-md text-danger hover:bg-danger-soft/10 transition"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleConfirmSlip()}
                      className="flex-1 py-1.8 text-[11px] font-bold bg-success text-surface rounded-md hover:bg-success/90 transition"
                    >
                      Confirm
                    </button>
                  </>
                )}
              </div>
            </AppCard>
          </div>
        )}

        {/* Rejection / Cancellation inline panels */}
        {showRejectForm && (
          <div className="mx-2 mb-3 p-3 bg-danger-soft border border-danger/20 rounded-lg">
            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <span className="font-bold text-[11.5px] text-danger block">Enter Rejection Reason</span>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
                placeholder="Reason for bank counter rejection..."
                rows={2}
                className="w-full p-2 text-[11.5px] border border-border rounded bg-surface"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-2.5 py-1 text-[10.5px] font-bold border border-border rounded text-text bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 text-[10.5px] font-bold bg-danger text-surface rounded"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        )}

        {showCancelForm && (
          <div className="mx-2 mb-3 p-3 bg-danger-soft border border-danger/20 rounded-lg">
            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <span className="font-bold text-[11.5px] text-danger block">Enter Void Reason</span>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for slip cancellation..."
                rows={2}
                className="w-full p-2 text-[11.5px] border border-border rounded bg-surface"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCancelForm(false)}
                  className="px-2.5 py-1 text-[10.5px] font-bold border border-border rounded text-text bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 text-[10.5px] font-bold bg-danger text-surface rounded"
                >
                  Confirm Void
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content stack */}
        <div className="px-2 space-y-4">
          {/* Slip visual header card */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center text-text border border-border/40 shrink-0 shadow-xs">
                <LuTicket className="text-[20px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <AppHeading level={2} weight={700} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                    {bankSlip.slipNumber}
                  </AppHeading>
                  {getStatusBadge(bankSlip.status)}
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.2 text-[8px] font-semibold uppercase border ${
                      isDeposit
                        ? "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]"
                        : "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]"
                    }`}
                  >
                    {isDeposit ? "Deposit" : "Withdrawal"}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Date: {formatDate(bankSlip.slipDate)}
                </span>
              </div>
            </div>

            <div className="border-t border-border/65 p-4 bg-surface-alt/5 text-center">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Total Slip Amount</span>
              <span className="text-[22px] font-black text-text mt-1 block">
                {formatCurrency(bankSlip.amount)}
              </span>
            </div>
          </AppCard>

          {/* Details Card */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Parameters
              </AppHeading>
            </div>

            <div className="p-3.5 space-y-3.5 text-[12px]">
              <div>
                <span className="text-text-muted block font-semibold">Linked settlement bank</span>
                {bankSlip.bankAccountId ? (
                  <span className="font-bold text-primary block mt-0.5 break-words">
                    {bankSlip.bankAccountId.bankName} - A/C: {bankSlip.bankAccountId.accountNumber}
                  </span>
                ) : (
                  <span className="font-semibold text-text block mt-0.5">-</span>
                )}
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Physical Receipt Reference</span>
                <span className="font-semibold text-text block mt-0.5 font-mono">
                  {bankSlip.bankSlipReference || "-"}
                </span>
              </div>

              {bankSlip.narration && (
                <div>
                  <span className="text-text-muted block font-semibold">Narration</span>
                  <p className="text-[11.5px] leading-relaxed text-text mt-0.5 italic">
                    "{bankSlip.narration}"
                  </p>
                </div>
              )}
            </div>
          </AppCard>

          {/* Timeline details */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Audit timeline
              </AppHeading>
            </div>
            <div className="p-3.5 space-y-2.5 text-[11px] leading-relaxed text-text-muted">
              <div className="flex justify-between">
                <span>Created At:</span>
                <span className="font-semibold text-text">{formatDate(bankSlip.createdAt)}</span>
              </div>

              {bankSlip.submittedAt && (
                <div className="flex justify-between">
                  <span>Submitted At:</span>
                  <span className="font-semibold text-text">{formatDate(bankSlip.submittedAt)}</span>
                </div>
              )}

              {bankSlip.confirmedAt && (
                <div className="flex justify-between">
                  <span>Confirmed At:</span>
                  <span className="font-semibold text-text">{formatDate(bankSlip.confirmedAt)}</span>
                </div>
              )}

              {bankSlip.rejectedAt && (
                <div className="space-y-1 pt-1 border-t border-border/40">
                  <div className="flex justify-between">
                    <span>Rejected At:</span>
                    <span className="font-semibold text-danger">{formatDate(bankSlip.rejectedAt)}</span>
                  </div>
                  <div className="text-[10px] text-danger italic">
                    Reason: "{bankSlip.rejectionReason}"
                  </div>
                </div>
              )}

              {bankSlip.cancelledAt && (
                <div className="space-y-1 pt-1 border-t border-border/40">
                  <div className="flex justify-between">
                    <span>Cancelled At:</span>
                    <span className="font-semibold text-text">{formatDate(bankSlip.cancelledAt)}</span>
                  </div>
                  {bankSlip.cancellationReason && (
                    <div className="text-[10px] italic">
                      Reason: "{bankSlip.cancellationReason}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </AppCard>
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
  fontSize: "17.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
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

const formCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const labelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};

const inputSx = {
  minHeight: 35,
  fontSize: "12.0px",
  bgcolor: "var(--app-color-surface)",
};

export default BankSlipDetailsMobilePage;
