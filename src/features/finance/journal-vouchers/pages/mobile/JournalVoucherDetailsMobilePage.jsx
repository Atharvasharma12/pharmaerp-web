import React, { useMemo } from "react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiSend,
  FiRefreshCcw,
} from "react-icons/fi";
import { LuBookOpen } from "react-icons/lu";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";
import { formatCurrency, formatDate } from "@/utils";

const JournalVoucherDetailsMobilePage = ({
  voucher,
  isLoading = false,
  isActioning = false,
  error,
  handleBack,
  handleEdit,
  handleRefresh,
  handlePost,
  handleCancel,
  handleApprovalSubmit,
  handleApprove,
  handleReverse,
  clearLocalErrors,
}) => {
  if (isLoading) {
    return (
      <section className="w-full bg-bg py-8 flex items-center justify-center">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Loading Journal Voucher details...
        </AppText>
      </section>
    );
  }

  if (!voucher) {
    return (
      <section className="w-full bg-bg px-4 py-8 text-center">
        <AppHeading level={2} weight={700} sx={{ fontSize: "16px", color: "var(--app-color-text)" }}>
          Voucher Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-danger)", mt: 1 }}>
          {error || "The requested journal voucher details could not be found."}
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

  const status = String(voucher.status || "").toUpperCase();
  const isDraft = status === "DRAFT";
  const isPendingApproval = status === "PENDING_APPROVAL" || status === "PENDING";
  const isApproved = status === "APPROVED";
  const isPosted = status === "POSTED";

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "DRAFT") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";
    else if (raw === "PENDING_APPROVAL" || raw === "PENDING") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "APPROVED") bg = "bg-[#e8f2ff] text-[#1864ab] border-[#c3e3ff]";
    else if (raw === "POSTED") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CANCELLED") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "REVERSED") bg = "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  return (
    <section className="w-full bg-bg pb-20">
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
                  {voucher.voucherNumber}
                </AppHeading>
                <AppText variant="body2" sx={pageSubtitleSx}>
                  Journal voucher details
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

        {/* Content stack */}
        <div className="px-2 space-y-4">
          {/* Visual card */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center text-text border border-border/40 shrink-0 shadow-xs">
                <LuBookOpen className="text-[20px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <AppHeading level={2} weight={700} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                    {voucher.voucherNumber}
                  </AppHeading>
                  {getStatusBadge(voucher.status)}
                  <span className="inline-flex items-center rounded px-1.5 py-0.2 text-[8.5px] font-semibold bg-surface-alt border border-border text-text-muted">
                    {voucher.voucherType}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  Date: {formatDate(voucher.voucherDate)}
                </span>
              </div>
            </div>

            <div className="border-t border-border/65 p-4 bg-surface-alt/5 text-center">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Total Voucher Value</span>
              <span className="text-[22px] font-black text-[#2b8a3e] mt-1 block">
                {formatCurrency(voucher.totalDebit)}
              </span>
            </div>
          </AppCard>

          {/* Ledger Posting Lines */}
          <div className="space-y-2">
            <AppHeading level={3} weight={700} sx={{ px: 1, m: 0, fontSize: "12.5px", color: "var(--app-color-text)" }}>
              Journal Entry Rows
            </AppHeading>

            {voucher.lines?.map((line, idx) => {
              const accountLabel = line.accountId
                ? `${line.accountId.accountCode || ""} - ${line.accountId.accountName || "Account"}`
                : "-";

              return (
                <AppCard
                  key={line._id || idx}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={formCardSx}
                >
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11.5px] font-bold">
                      <span className="text-text-muted">Row #{idx + 1}</span>
                      {line.debit > 0 ? (
                        <span className="text-[#2b8a3e]">DEBIT</span>
                      ) : (
                        <span className="text-[#e64980]">CREDIT</span>
                      )}
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="font-bold text-text text-[12.5px] block truncate">
                          {accountLabel}
                        </span>
                        {line.narration && (
                          <span className="text-[10px] text-text-muted block italic">
                            Memo: "{line.narration}"
                          </span>
                        )}
                      </div>
                      <span className={`text-[14.5px] font-black shrink-0 ${line.debit > 0 ? "text-[#2b8a3e]" : "text-[#e64980]"}`}>
                        {line.debit > 0 ? formatCurrency(line.debit) : formatCurrency(line.credit)}
                      </span>
                    </div>
                  </div>
                </AppCard>
              );
            })}
          </div>

          {/* Voucher parameter specs */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-3.5 border-b border-border">
              <span className="text-[11.5px] font-bold text-text">Voucher Metadata</span>
            </div>

            <div className="p-3.5 space-y-3.5 text-[12px] leading-relaxed">
              <div>
                <span className="text-text-muted block font-semibold">Reference Document</span>
                <span className="font-semibold text-text block mt-0.5 font-mono">
                  {voucher.referenceNumber || "-"}
                </span>
              </div>

              {voucher.narration && (
                <div>
                  <span className="text-text-muted block font-semibold">Header Narration</span>
                  <p className="text-[11.5px] leading-relaxed text-text mt-0.5 italic">
                    "{voucher.narration}"
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-border/40 flex justify-between">
                <span>Created At:</span>
                <span className="font-semibold text-text">{formatDate(voucher.createdAt)}</span>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Workflow actions fixed mobile bottom drawer bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2 shadow-lg max-w-[460px] mx-auto w-full">
          {isDraft && (
            <>
              <button
                type="button"
                disabled={isActioning}
                onClick={handleEdit}
                className="flex-1 py-2 text-[11px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={isActioning}
                onClick={handlePost}
                className="flex-1 py-2 text-[11px] font-bold bg-success text-surface rounded-md hover:bg-success/90 transition"
              >
                Post Entry
              </button>
            </>
          )}

          {isPendingApproval && (
            <>
              <button
                type="button"
                disabled={isActioning}
                onClick={handleCancel}
                className="flex-1 py-2 text-[11px] font-bold border border-border bg-surface rounded-md text-danger hover:bg-danger-soft/10 transition"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={isActioning}
                onClick={handleApprove}
                className="flex-1 py-2 text-[11px] font-bold bg-success text-surface rounded-md hover:bg-success/90 transition"
              >
                Approve
              </button>
            </>
          )}

          {isApproved && (
            <>
              <button
                type="button"
                disabled={isActioning}
                onClick={handleCancel}
                className="flex-1 py-2 text-[11px] font-bold border border-border bg-surface rounded-md text-danger hover:bg-danger-soft/10 transition"
              >
                Void
              </button>
              <button
                type="button"
                disabled={isActioning}
                onClick={handlePost}
                className="flex-1 py-2 text-[11px] font-bold bg-success text-surface rounded-md hover:bg-success/90 transition"
              >
                Post Entry
              </button>
            </>
          )}

          {isPosted && (
            <>
              <button
                type="button"
                disabled={isActioning}
                onClick={handleCancel}
                className="flex-1 py-2 text-[11px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
              >
                Void
              </button>
              <button
                type="button"
                disabled={isActioning}
                onClick={handleReverse}
                className="flex-1 py-2 text-[11px] font-bold bg-danger text-surface rounded-md hover:bg-danger/90 transition"
              >
                Reverse Post
              </button>
            </>
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

export default JournalVoucherDetailsMobilePage;
