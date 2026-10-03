import React, { useMemo } from "react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiSend,
  FiRefreshCcw,
  FiFileText,
} from "react-icons/fi";
import { LuBookOpen } from "react-icons/lu";

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

const JournalVoucherDetailsDesktopPage = ({
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
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5 flex items-center justify-center">
        <AppText
          variant="body1"
          sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}
        >
          Loading Journal Voucher details...
        </AppText>
      </section>
    );
  }

  if (!voucher) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
        <div className="mx-auto w-full max-w-[1200px] text-center py-10">
          <AppHeading
            level={2}
            weight={700}
            sx={{ color: "var(--app-color-text)" }}
          >
            Voucher Not Found
          </AppHeading>
          <AppText
            variant="body1"
            sx={{ color: "var(--app-color-danger)", mt: 1 }}
          >
            {error ||
              "The requested journal voucher has been deleted or does not exist."}
          </AppText>
          <AppButton
            variant="contained"
            colorVariant="primary"
            onClick={handleBack}
            sx={{ mt: 3 }}
          >
            Back to Vouchers
          </AppButton>
        </div>
      </section>
    );
  }

  const status = String(voucher.status || "").toUpperCase();
  const isDraft = status === "DRAFT";
  const isPendingApproval =
    status === "PENDING_APPROVAL" || status === "PENDING";
  const isApproved = status === "APPROVED";
  const isPosted = status === "POSTED";

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "DRAFT") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";
    else if (raw === "PENDING_APPROVAL" || raw === "PENDING")
      bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "APPROVED")
      bg = "bg-[#e8f2ff] text-[#1864ab] border-[#c3e3ff]";
    else if (raw === "POSTED")
      bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CANCELLED")
      bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "REVERSED")
      bg = "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]";

    return (
      <span
        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase border ${bg}`}
      >
        {raw}
      </span>
    );
  };

  const totals = useMemo(() => {
    let debitSum = 0;
    let creditSum = 0;
    voucher.lines?.forEach((line) => {
      debitSum += parseFloat(line.debit) || 0;
      creditSum += parseFloat(line.credit) || 0;
    });
    return { debitSum, creditSum };
  }, [voucher.lines]);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title={`Journal Voucher Details`}
          subtitle={`Voucher Number: ${voucher.voucherNumber}`}
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Journal Vouchers", onClick: handleBack },
                { label: voucher.voucherNumber, current: true },
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

            {/* Workflow Action Triggers */}
            {isDraft && (
              <>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="primary"
                  rounded="md"
                  size="small"
                  startIcon={<FiEdit2 />}
                  onClick={handleEdit}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Edit
                </AppButton>

                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="danger"
                  rounded="md"
                  size="small"
                  startIcon={<FiXCircle />}
                  onClick={handleCancel}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Void Voucher
                </AppButton>

                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  startIcon={<FiSend />}
                  onClick={handleApprovalSubmit}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Submit for Approval
                </AppButton>

                <AppButton
                  type="button"
                  variant="filled"
                  colorVariant="success"
                  rounded="md"
                  size="small"
                  startIcon={<FiCheckCircle />}
                  onClick={handlePost}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Post to Ledger
                </AppButton>
              </>
            )}

            {isPendingApproval && (
              <>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="danger"
                  rounded="md"
                  size="small"
                  startIcon={<FiXCircle />}
                  onClick={handleCancel}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Reject & Void
                </AppButton>

                <AppButton
                  type="button"
                  variant="filled"
                  colorVariant="success"
                  rounded="md"
                  size="small"
                  startIcon={<FiCheckCircle />}
                  onClick={handleApprove}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Approve Voucher
                </AppButton>
              </>
            )}

            {isApproved && (
              <>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="danger"
                  rounded="md"
                  size="small"
                  startIcon={<FiXCircle />}
                  onClick={handleCancel}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Void Voucher
                </AppButton>

                <AppButton
                  type="button"
                  variant="filled"
                  colorVariant="success"
                  rounded="md"
                  size="small"
                  startIcon={<FiCheckCircle />}
                  onClick={handlePost}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Post to Ledger
                </AppButton>
              </>
            )}

            {isPosted && (
              <>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="danger"
                  rounded="md"
                  size="small"
                  startIcon={<FiRefreshCcw />}
                  onClick={handleReverse}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Reverse Posting
                </AppButton>

                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  startIcon={<FiXCircle />}
                  onClick={handleCancel}
                  disabled={isActioning}
                  sx={actionBtnSx}
                >
                  Void / Cancel
                </AppButton>
              </>
            )}
          </AppStack>
        </div>

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

        {/* Detailed parameters */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          {/* Left Panel: Voucher overview */}
          <div className="col-span-1">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={leftCardSx}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-alt flex items-center justify-center border border-border shadow-xs">
                  <LuBookOpen className="text-[22px] text-text" />
                </div>
                <AppHeading level={2} weight={700} sx={titleSx}>
                  {voucher.voucherNumber}
                </AppHeading>
                <div className="mt-2 flex items-center gap-1.5 justify-center">
                  {getStatusBadge(voucher.status)}
                  <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold bg-surface-alt border border-border text-text-muted">
                    {voucher.voucherType}
                  </span>
                </div>

                <div className="mt-6 py-4 px-2 w-full bg-surface-alt/10 border-y border-border/60">
                  <span className="text-[11px] text-text-muted uppercase tracking-wider block">
                    Total Entry Value
                  </span>
                  <span className="text-[24px] font-black text-[#2b8a3e] mt-1 block">
                    {formatCurrency(voucher.totalDebit)}
                  </span>
                </div>

                {/* Audit details */}
                <div className="mt-4 w-full text-left text-[12.5px] space-y-2.5 pt-3">
                  <div>
                    <span className="text-text-muted block font-semibold">
                      Voucher Date
                    </span>
                    <span className="font-semibold text-text block mt-0.5">
                      {formatDate(voucher.voucherDate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">
                      Reference Document
                    </span>
                    <span className="font-semibold text-text block mt-0.5 font-mono">
                      {voucher.referenceNumber || "-"}
                    </span>
                  </div>

                  {voucher.narration && (
                    <div className="pt-2">
                      <span className="text-text-muted block font-bold">
                        Header Narration
                      </span>
                      <p className="text-[11.8px] leading-relaxed text-text italic mt-0.5">
                        "{voucher.narration}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AppCard>
          </div>

          {/* Right Panel: Transaction lines list */}
          <div className="col-span-2">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={rightCardSx}
            >
              <div className="px-5 py-4 border-b border-border">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  Posting Ledger Double-Entry Lines
                </AppHeading>
              </div>

              <div className="overflow-x-auto w-full relative">
                <table className="w-full text-left border-collapse text-[12.5px]">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt/5 text-text-muted font-bold">
                      <th className="py-2.5 px-4 w-[40px] text-center font-bold">
                        #
                      </th>
                      <th className="py-2.5 px-4 font-bold">Ledger Account</th>
                      <th className="py-2.5 px-4 w-[130px] font-bold">
                        Debit ($)
                      </th>
                      <th className="py-2.5 px-4 w-[130px] font-bold">
                        Credit ($)
                      </th>
                      <th className="py-2.5 px-4 min-w-[150px] font-bold">
                        Line Memo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucher.lines?.map((line, idx) => {
                      const accountLabel = line.accountId
                        ? `${line.accountId.accountCode || ""} — ${line.accountId.accountName || "Account"}`
                        : "-";

                      return (
                        <tr
                          key={line._id || idx}
                          className="border-b border-border hover:bg-surface-hover/10 transition"
                        >
                          <td className="py-2.5 px-4 text-center font-semibold text-text-muted">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-text">
                            {accountLabel}
                          </td>
                          <td className="py-2.5 px-4 font-extrabold text-[#2b8a3e]">
                            {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                          </td>
                          <td className="py-2.5 px-4 font-extrabold text-[#e64980]">
                            {line.credit > 0
                              ? formatCurrency(line.credit)
                              : "-"}
                          </td>
                          <td className="py-2.5 px-4 text-text-muted italic">
                            {line.narration || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* totals summation row */}
              <div className="p-4 bg-surface-alt/10 border-t border-border flex justify-end gap-6 text-[13px] font-extrabold text-text">
                <div>
                  <span className="text-text-muted font-normal text-[11px] block text-right">
                    Sum of Debits:
                  </span>
                  <span className="text-[#2b8a3e] text-[15px]">
                    {formatCurrency(totals.debitSum)}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted font-normal text-[11px] block text-right">
                    Sum of Credits:
                  </span>
                  <span className="text-[#e64980] text-[15px]">
                    {formatCurrency(totals.creditSum)}
                  </span>
                </div>
              </div>
            </AppCard>
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

export default JournalVoucherDetailsDesktopPage;
