import React from "react";
import { FiArrowLeft, FiClock, FiCheck, FiSlash, FiUser } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";
import { formatDate } from "@/utils";

const CashDenominationDetailsMobilePage = ({
  countDetails = null,
  isLoading = false,
  isTransitioning = false,
  error,
  message,
  clearFeedback,
  handleConfirm,
  handleCancel,
  handleBack,
}) => {
  if (isLoading && !countDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving cash count details...
        </AppText>
      </div>
    );
  }

  if (!countDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-bg w-full text-center px-4">
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Audit Report Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested physical cash audit could not be found.
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
      case "CONFIRMED":
        return "bg-success-soft text-success border border-success/20";
      case "CANCELLED":
        return "bg-danger-soft text-danger border border-danger/20";
      default:
        return "bg-warning-soft text-warning border border-warning/20";
    }
  };

  const getRegisterName = () => {
    return countDetails.cashAccountId?.accountName || "Unknown Register";
  };

  const getBranchName = () => {
    return countDetails.branchId?.name || countDetails.cashAccountId?.branchId?.name || "Central Office";
  };

  const varianceVal = countDetails.variance || 0;
  const isShort = varianceVal < 0;
  const isExcess = varianceVal > 0;
  const isDraft = countDetails.status === "DRAFT";
  const isCancelled = countDetails.status === "CANCELLED";

  const creatorName = countDetails.createdBy
    ? `${countDetails.createdBy.firstName || ""} ${countDetails.createdBy.lastName || ""}`.trim()
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
                Count Details
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Physical counts variance audit logs
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Feedback Alert */}
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

        {/* Details Card */}
        <div className="px-0 space-y-3">
          <AppCard
            variant="default"
            rounded="none"
            bordered
            shadow="none"
            padding="none"
            sx={detailsCardSx}
          >
            <div className="p-3 border-b border-border bg-surface-alt/10 flex justify-between items-center gap-2">
              <div>
                <span className="text-[10px] text-text-muted font-bold font-mono block">
                  {countDetails.countNumber}
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5 font-mono">
                  {formatDate(countDetails.countDate)}
                </span>
              </div>
              <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase ${getStatusBadgeClass(countDetails.status)}`}>
                {countDetails.status}
              </span>
            </div>

            <div className="p-3 space-y-3">
              {/* Register & Branch info */}
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <span className="text-[9.5px] text-text-muted uppercase tracking-wider block">Register</span>
                  <strong className="text-text block mt-0.5">{getRegisterName()}</strong>
                </div>
                <div>
                  <span className="text-[9.5px] text-text-muted uppercase tracking-wider block font-mono">Location</span>
                  <strong className="text-text block mt-0.5 font-mono">{getBranchName()}</strong>
                </div>
              </div>

              {/* Balances summary */}
              <div className="border-t border-border/50 pt-3 grid grid-cols-3 gap-2 text-[11px] text-text-muted bg-surface-alt/10 p-2.5 rounded">
                <div>
                  <span>Expected:</span>
                  <strong className="text-text block font-mono mt-0.5">₹{Number(countDetails.expectedBalance || 0).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span>Counted:</span>
                  <strong className="text-text block font-mono mt-0.5">₹{Number(countDetails.physicalTotal || 0).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span>Variance:</span>
                  <strong className={`block font-mono mt-0.5 ${
                    isShort ? "text-danger" : isExcess ? "text-success" : "text-text"
                  }`}>
                    {isExcess ? "+" : ""}₹{Number(varianceVal).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              {/* Denominations counted */}
              <div className="border-t border-border/50 pt-3 space-y-2">
                <span className="text-[9.5px] text-text-muted uppercase tracking-wider block font-mono">Breakdown Sheet</span>
                <div className="bg-surface border border-border rounded p-2.5 space-y-2 text-[11.5px]">
                  {countDetails.denominations?.map((d) => (
                    <div key={d.denomination} className="flex justify-between font-mono">
                      <span>₹ {d.denomination} × {d.quantity}</span>
                      <strong className="text-text">₹{Number(d.subtotal || 0).toLocaleString("en-IN")}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narration */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[9.5px] text-text-muted uppercase tracking-wider block">Remarks</span>
                <p className="text-[12px] text-text mt-1 p-2 bg-surface-alt/10 rounded border border-border">
                  {countDetails.narration || "No audit remarks."}
                </p>
              </div>

              {/* Cancellation */}
              {isCancelled && (
                <div className="border-t border-border/50 pt-3 p-2 bg-danger-soft/10 border border-danger/20 rounded">
                  <span className="text-[9px] font-bold text-danger uppercase tracking-wider block">Cancellation Reason</span>
                  <p className="text-[11.5px] text-text font-semibold mt-0.5">{countDetails.cancellationReason || "N/A"}</p>
                </div>
              )}

              {/* Audit By */}
              <div className="border-t border-border/50 pt-3 flex justify-between items-center text-[10px] text-text-muted">
                <span>By: {creatorName}</span>
                <span>Created: {formatDate(countDetails.createdAt)}</span>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Sticky bottom controls */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2 shadow-lg max-w-[460px] mx-auto w-full">
          <button
            type="button"
            onClick={handleBack}
            disabled={isTransitioning}
            className="px-3 py-2 text-[12px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
          >
            Back
          </button>

          {isDraft && (
            <div className="flex-1 flex gap-2">
              <button
                type="button"
                disabled={isTransitioning}
                onClick={() => handleConfirm(false)}
                className="flex-1 py-2 text-[11px] font-bold border border-border bg-surface rounded text-text hover:bg-surface-hover/20 transition"
              >
                Confirm
              </button>

              {varianceVal !== 0 && (
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => handleConfirm(true)}
                  className="flex-1 py-2 text-[11px] font-bold bg-primary text-surface rounded hover:bg-primary-hover transition"
                >
                  Adjust Var
                </button>
              )}

              <button
                type="button"
                disabled={isTransitioning}
                onClick={() => {
                  const reason = prompt("Enter cancellation reason:");
                  if (reason !== null) handleCancel(reason);
                }}
                className="px-2 py-2 text-[11px] font-bold border border-danger text-danger bg-surface rounded hover:bg-danger-soft transition"
              >
                Cancel
              </button>
            </div>
          )}
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

export default CashDenominationDetailsMobilePage;
