import React from "react";
import { FiArrowLeft, FiClock, FiCheck, FiSlash, FiAlertTriangle, FiUser, FiInfo } from "react-icons/fi";

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

const CashDenominationDetailsDesktopPage = ({
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
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg">
        <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving cash count logs...
        </AppText>
      </div>
    );
  }

  if (!countDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg text-center">
        <FiClock className="text-[40px] text-text-muted/40 mb-3" />
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Audit Report Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested cash audit could not be found.
        </AppText>
        <AppButton size="small" variant="contained" onClick={handleBack} sx={{ mt: 3 }}>
          Back to List
        </AppButton>
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
    return countDetails.partition === "running" ? "Running Cash" : "Frozen Cash";
  };

  const getBranchName = () => {
    return countDetails.branchId?.name || "Central Office";
  };

  const varianceVal = countDetails.variance || 0;
  const isShort = varianceVal < 0;
  const isExcess = varianceVal > 0;
  const isDraft = countDetails.status === "DRAFT";
  const isCancelled = countDetails.status === "CANCELLED";

  const creatorName = countDetails.createdBy
    ? `${countDetails.createdBy.firstName || ""} ${countDetails.createdBy.lastName || ""}`.trim()
    : "System";

  const confirmerName = countDetails.confirmedBy
    ? `${countDetails.confirmedBy.firstName || ""} ${countDetails.confirmedBy.lastName || ""}`.trim()
    : "";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title="Audit Count Details"
          subtitle="Verify currency calculations and linked branch location registers."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance" },
                { label: "Cash Counts", onClick: handleBack },
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
            disabled={isTransitioning}
            sx={actionBtnSx}
          >
            Back to List
          </AppButton>
        </div>

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

        {/* Split Grid */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          {/* Left Column - Summary & Status */}
          <div className="col-span-1 space-y-5">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={leftCardSx}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center text-primary shrink-0 select-none shadow-sm mb-3">
                  <FiInfo size={24} />
                </div>
                <AppHeading level={2} weight={700} sx={leftCardTitleSx}>
                  Count #{countDetails.countNumber}
                </AppHeading>
                <div className="mt-2 flex flex-col gap-1.5 items-center justify-center">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(countDetails.status)}`}>
                    {countDetails.status}
                  </span>
                  <span className="text-[12px] text-text-muted mt-1 font-semibold">
                    Physical Till Audit
                  </span>
                </div>
              </div>

              {/* Balances summary */}
              <div className="border-t border-border p-4 space-y-3.5 text-[12.5px]">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Ledger Expected:</span>
                  <strong className="text-text font-mono">
                    ₹ {Number(countDetails.expectedBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Physical Counted:</span>
                  <strong className="text-text font-mono">
                    ₹ {Number(countDetails.physicalTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-bold text-text">Variance:</span>
                  <strong className={`font-black text-[13.5px] font-mono ${
                    isShort ? "text-danger" : isExcess ? "text-success" : "text-text"
                  }`}>
                    {isExcess ? "+" : ""} ₹ {Number(varianceVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>

              {/* Action buttons */}
              {isDraft && (
                <div className="border-t border-border p-4 flex flex-col gap-2">
                  <AppButton
                    variant="outlined"
                    colorVariant="neutral"
                    size="small"
                    rounded="md"
                    startIcon={<FiCheck />}
                    onClick={() => handleConfirm(false)}
                    disabled={isTransitioning}
                    fullWidth
                  >
                    Confirm Count
                  </AppButton>

                  {varianceVal !== 0 && (
                    <AppButton
                      variant="contained"
                      colorVariant="primary"
                      size="small"
                      rounded="md"
                      startIcon={<FiCheck />}
                      onClick={() => handleConfirm(true)}
                      disabled={isTransitioning}
                      fullWidth
                    >
                      Adjust Variance
                    </AppButton>
                  )}

                  <AppButton
                    variant="outlined"
                    colorVariant="error"
                    size="small"
                    rounded="md"
                    startIcon={<FiSlash />}
                    onClick={() => {
                      const reason = prompt("Enter cancellation reason:");
                      if (reason !== null) handleCancel(reason);
                    }}
                    disabled={isTransitioning}
                    fullWidth
                  >
                    Cancel Count
                  </AppButton>
                </div>
              )}
            </AppCard>
          </div>

          {/* Right Column - Audit details & breakdown sheet */}
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
                  Cash Register Audit Metadata
                </AppHeading>
              </div>

              <div className="p-5 space-y-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-[13px]">
                  <div>
                    <span className="text-text-muted block font-semibold">
                      Cash Register
                    </span>
                    <span className="font-bold text-text block mt-1">
                      {getRegisterName()}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">
                      Linked Location / Branch
                    </span>
                    <span className="font-bold text-text block mt-1">
                      {getBranchName()}
                    </span>
                  </div>
                </div>

                {/* Denomination sheet */}
                <div>
                  <span className="text-text-muted block font-semibold mb-2">Count Breakdown Sheet</span>
                  <table className="w-full text-left border-collapse text-[12px] border border-border rounded-md">
                    <thead>
                      <tr className="border-b border-border bg-surface-alt/5 text-text-muted font-bold">
                        <th className="py-2 px-3 font-bold">Denomination</th>
                        <th className="py-2 px-3 font-bold text-center">Quantity Counted</th>
                        <th className="py-2 px-3 font-bold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {countDetails.denominations?.map((d) => (
                        <tr key={d.denomination} className="border-b border-border/55 hover:bg-surface-hover/10 transition">
                          <td className="py-2 px-3 font-semibold text-text font-mono">₹ {d.denomination}</td>
                          <td className="py-2 px-3 text-center text-text font-mono font-bold">× {d.quantity}</td>
                          <td className="py-2 px-3 text-right text-text font-bold font-mono">
                            ₹ {Number(d.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Remarks */}
                <div>
                  <span className="text-text-muted block font-semibold font-mono">Remarks / Narration</span>
                  <p className="text-[13px] text-text font-semibold mt-2 leading-relaxed bg-surface-alt/20 p-3 rounded-md border border-border">
                    {countDetails.narration || "No remarks provided."}
                  </p>
                </div>

                {/* Cancellation info */}
                {isCancelled && (
                  <div className="p-4 bg-danger-soft/10 border border-danger/20 rounded-md">
                    <span className="text-[9.5px] font-extrabold text-danger uppercase tracking-wider block mb-1">
                      Cancellation Reason
                    </span>
                    <p className="text-[12.5px] text-text font-semibold">{countDetails.cancellationReason || "No reason specified"}</p>
                  </div>
                )}

                {/* Confirmation info */}
                {confirmerName && (
                  <div className="p-4 bg-success-soft/10 border border-success/20 rounded-md text-[12.5px] text-text-muted">
                    Confirmed by: <strong className="text-text">{confirmerName}</strong> at: <strong className="text-text">{formatDate(countDetails.confirmedAt)}</strong>
                  </div>
                )}

                {/* Audit Logs */}
                <div className="flex justify-between items-center text-[12px] text-text-muted pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <FiUser />
                    <span>Counted By:</span>
                    <strong>{creatorName}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock />
                    <span>Audit Date:</span>
                    <strong>{formatDate(countDetails.countDate)}</strong>
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

export default CashDenominationDetailsDesktopPage;
