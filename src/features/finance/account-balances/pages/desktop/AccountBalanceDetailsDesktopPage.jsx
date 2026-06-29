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
      <div className="mx-auto w-full max-w-[800px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              Balance Details
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Audit aggregated debit/credit totals and balance configuration.
            </AppText>
          </div>
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

        {/* Balance Sheet Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          sx={cardSx}
          className="mt-5"
        >
          <div className="px-5 py-4 border-b border-border bg-surface-alt/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-muted font-black tracking-wider uppercase font-mono">
                {accCode}
              </span>
              <AppHeading level={3} weight={700} sx={cardTitleSx} className="mt-0.5">
                {accName}
              </AppHeading>
            </div>
            <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase bg-[#ebfbee] text-[#2b8a3e] border border-[#c3fae8]">
              {accNature}
            </span>
          </div>

          <div className="p-5 space-y-6">
            {/* Balance Overview Grid */}
            <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Debit Total (Dr)</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">
                  ₹ {Number(balanceDetails.debitTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Credit Total (Cr)</span>
                <span className="text-[20px] font-extrabold text-[#c92a2a] mt-1 block">
                  ₹ {Number(balanceDetails.creditTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Calculated Running Balance */}
            <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Closing Balance</span>
                <span className="text-[24px] font-black text-text mt-1 block">
                  ₹ {Number(balanceDetails.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  <span className="text-[12px] font-black text-text-muted uppercase ml-1">
                    {balanceDetails.balanceType}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Opening Balance</span>
                <span className="text-[18px] font-extrabold text-text mt-1.5 block">
                  ₹ {Number(openingBal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  <span className="text-[11px] font-black text-text-muted uppercase ml-1">
                    {openingType}
                  </span>
                </span>
              </div>
            </div>

            {/* Timestamps audit */}
            <div className="flex justify-between items-center text-[12px] text-text-muted">
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

        {/* Footer controls */}
        <div className="mt-5 flex items-center justify-between">
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

          <AppButton
            variant="contained"
            colorVariant="primary"
            size="small"
            rounded="md"
            startIcon={<FiRefreshCw />}
            onClick={handleRecalculate}
            disabled={isRecalculating}
            loading={isRecalculating}
            sx={actionBtnSx}
          >
            Recalculate Balance
          </AppButton>
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

export default AccountBalanceDetailsDesktopPage;
