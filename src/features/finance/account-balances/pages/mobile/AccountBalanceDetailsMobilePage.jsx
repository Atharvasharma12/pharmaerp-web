import React from "react";
import { FiArrowLeft, FiClock, FiRefreshCw } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";
import { formatDate } from "@/utils";

const AccountBalanceDetailsMobilePage = ({
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
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving account details...
        </AppText>
      </div>
    );
  }

  if (!balanceDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full text-center px-4">
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Record Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested account balance details could not be found.
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

  const accName = balanceDetails.accountId?.accountName || "Unknown Account";
  const accCode = balanceDetails.accountId?.accountCode || "-";
  const accNature = balanceDetails.accountId?.accountNature || "-";
  const openingBal = balanceDetails.accountId?.openingBalance || 0;
  const openingType = balanceDetails.accountId?.openingBalanceType || "dr";

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
                Balance Details
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Audit debit/credit totals and configuration
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mx-4 mb-3 p-3 text-[11px] font-semibold rounded-md flex justify-between items-center ${
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
        <div className="px-0 space-y-4">
          <AppCard
            variant="default"
            rounded="none"
            bordered
            shadow="none"
            padding="none"
            sx={detailsCardSx}
          >
            <div className="p-4 border-b border-border bg-surface-alt/10 flex justify-between items-center gap-2">
              <div>
                <span className="text-[10px] text-text-muted font-bold font-mono block">
                  {accCode}
                </span>
                <span className="font-extrabold text-[13.5px] text-text mt-0.5 block">
                  {accName}
                </span>
              </div>
              <span className="inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase bg-primary-soft text-primary border border-primary/20">
                {accNature}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Balances overview */}
              <div className="grid grid-cols-2 gap-3 border-b border-border/50 pb-3.5">
                <div>
                  <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Debit Total (Dr)</span>
                  <span className="text-[15px] font-extrabold text-[#2b8a3e] mt-0.5 block">
                    ₹{Number(balanceDetails.debitTotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Credit Total (Cr)</span>
                  <span className="text-[15px] font-extrabold text-[#c92a2a] mt-0.5 block">
                    ₹{Number(balanceDetails.creditTotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Net Balance & Opening */}
              <div className="grid grid-cols-2 gap-3 border-b border-border/50 pb-3.5">
                <div>
                  <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Closing Balance</span>
                  <span className="text-[18px] font-black text-text mt-0.5 block">
                    ₹{Number(balanceDetails.balance || 0).toLocaleString("en-IN")}
                    <span className="text-[10px] font-black text-text-muted uppercase ml-0.5">
                      {balanceDetails.balanceType}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Opening Balance</span>
                  <span className="text-[14px] font-extrabold text-text mt-1 block">
                    ₹{Number(openingBal).toLocaleString("en-IN")}
                    <span className="text-[9.5px] font-black text-text-muted uppercase ml-0.5">
                      {openingType}
                    </span>
                  </span>
                </div>
              </div>

              {/* History flags */}
              <div className="space-y-1.5 text-[11px] text-text-muted">
                <div className="flex items-center gap-1.5">
                  <FiClock />
                  <span>Last Transaction:</span>
                  <strong>{balanceDetails.lastTransactionAt ? formatDate(balanceDetails.lastTransactionAt) : "Never"}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiClock />
                  <span>Last Recalculated:</span>
                  <strong>{formatDate(balanceDetails.updatedAt)}</strong>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Fixed bottom controls */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2.5 shadow-lg max-w-[460px] mx-auto w-full">
          <button
            type="button"
            onClick={handleBack}
            disabled={isRecalculating}
            className="flex-1 py-2 text-[12px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
          >
            Back to List
          </button>
          <button
            type="button"
            disabled={isRecalculating}
            onClick={handleRecalculate}
            className="flex-1 py-2 text-[12px] font-bold bg-primary text-surface rounded-md hover:bg-primary-hover transition flex items-center justify-center gap-1.5"
          >
            <FiRefreshCw className={isRecalculating ? "animate-spin" : ""} />
            <span>{isRecalculating ? "Running..." : "Recalculate"}</span>
          </button>
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
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 2,
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

export default AccountBalanceDetailsMobilePage;
