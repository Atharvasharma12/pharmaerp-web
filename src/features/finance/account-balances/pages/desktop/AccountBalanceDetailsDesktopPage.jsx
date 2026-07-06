import React from "react";
import { FiArrowLeft, FiRefreshCw, FiBookOpen, FiClock } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";
import { formatDate } from "@/utils";

const AccountBalanceDetailsDesktopPage = ({
  balanceDetails = null,
  isLoading = false,
  isRecalculating = false,
  error,
  message,
  clearFeedback,
  handleRecalculate,
  handleBack,
}) => {
  if (isLoading && !balanceDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg">
        <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving account details...
        </AppText>
      </div>
    );
  }

  if (!balanceDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg text-center">
        <FiBookOpen className="text-[40px] text-text-muted/40 mb-3" />
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Record Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested account balance details could not be found.
        </AppText>
        <AppButton size="small" variant="contained" onClick={handleBack} sx={{ mt: 3 }}>
          Back to List
        </AppButton>
      </div>
    );
  }

  const accName = balanceDetails.accountId?.accountName || "Unknown Account";
  const accCode = balanceDetails.accountId?.accountCode || "-";
  const accNature = balanceDetails.accountId?.accountNature || "-";
  const openingBal = balanceDetails.accountId?.openingBalance || 0;
  const openingType = balanceDetails.accountId?.openingBalanceType || "dr";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title="Account Balance Details"
          subtitle="Audit aggregated debit/credit totals and balance configuration."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Account Balances", onClick: handleBack },
                { label: "Details", current: true },
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
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            disabled={isRecalculating}
            sx={actionBtnSx}
          >
            Back to List
          </AppButton>
        </div>

        {/* Feedback alerts */}
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

        {/* Split Grid */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          {/* Left Column - Balance Summary & Recalculate */}
          <div className="col-span-1 space-y-5">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={leftCardSx}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-lg bg-success-soft border border-success/20 flex items-center justify-center text-success shrink-0 select-none shadow-sm mb-3">
                  <FiBookOpen size={24} />
                </div>
                <AppHeading level={2} weight={700} sx={leftCardTitleSx}>
                  {accName}
                </AppHeading>
                <div className="mt-2 flex flex-col gap-1.5 items-center justify-center">
                  <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase bg-[#ebfbee] text-[#2b8a3e] border border-[#c3fae8]">
                    {accNature}
                  </span>
                  <span className="text-[11px] text-text-muted mt-1 font-mono font-bold">
                    Code: {accCode}
                  </span>
                </div>
              </div>

              <div className="border-t border-border p-4 text-center">
                <span className="text-[12px] text-text-muted block font-semibold">
                  Closing Balance
                </span>
                <span className="text-[22px] font-black text-text block mt-1 font-mono">
                  ₹ {Number(balanceDetails.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  <span className="text-[12px] font-black text-text-muted uppercase ml-1">
                    {balanceDetails.balanceType}
                  </span>
                </span>
              </div>

              {/* Action buttons */}
              <div className="border-t border-border p-4">
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  size="small"
                  rounded="md"
                  startIcon={<FiRefreshCw />}
                  onClick={handleRecalculate}
                  disabled={isRecalculating}
                  loading={isRecalculating}
                  fullWidth
                >
                  Recalculate Balance
                </AppButton>
              </div>
            </AppCard>
          </div>

          {/* Right Column - Ledger Balances Detail */}
          <div className="col-span-2 space-y-5">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={rightCardSx}
            >
              <div className="px-5 py-4 border-b border-border">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  Ledger Configuration & Balances
                </AppHeading>
              </div>

              <div className="p-5 space-y-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-[13px]">
                  <div>
                    <span className="text-text-muted block font-semibold">Debit Total (Dr)</span>
                    <strong className="text-[16px] font-extrabold text-[#2b8a3e] mt-1 block font-mono">
                      ₹ {Number(balanceDetails.debitTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">Credit Total (Cr)</span>
                    <strong className="text-[16px] font-extrabold text-[#c92a2a] mt-1 block font-mono">
                      ₹ {Number(balanceDetails.creditTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold font-mono">Opening Balance</span>
                    <span className="font-bold text-text block mt-1 font-mono">
                      ₹ {Number(openingBal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}{" "}
                      <span className="text-text-muted uppercase text-[11px] font-black">{openingType}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">COA Nature Group</span>
                    <span className="font-semibold text-text block mt-1 uppercase">
                      {accNature}
                    </span>
                  </div>
                </div>

                {/* Audit Timestamps */}
                <div className="flex justify-between items-center text-[12px] text-text-muted pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <FiClock />
                    <span>Last transaction posted:</span>
                    <strong>{balanceDetails.lastTransactionAt ? formatDate(balanceDetails.lastTransactionAt) : "Never"}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Last recalculated:</span>
                    <strong>{formatDate(balanceDetails.updatedAt)}</strong>
                  </div>
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

const leftCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  height: "fit-content",
};

const rightCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const leftCardTitleSx = {
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

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

export default AccountBalanceDetailsDesktopPage;
