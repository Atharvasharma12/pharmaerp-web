import React from "react";
import { FiArrowLeft, FiClock, FiCheck, FiSlash, FiAlertTriangle, FiUser } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
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

  const confirmerName = countDetails.confirmedBy
    ? `${countDetails.confirmedBy.firstName || ""} ${countDetails.confirmedBy.lastName || ""}`.trim()
    : "";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[800px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              Audit Count Details
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Verify currency calculations and linked branch location registers.
            </AppText>
          </div>
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

        {/* Audit Details Card */}
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
                Count Number: {countDetails.countNumber}
              </span>
              <AppHeading level={3} weight={700} sx={cardTitleSx} className="mt-0.5">
                Physical Cash Audit
              </AppHeading>
            </div>
            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase ${getStatusBadgeClass(countDetails.status)}`}>
              {countDetails.status}
            </span>
          </div>

          <div className="p-5 space-y-6">
            {/* Core Info */}
            <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Cash Register</span>
                <span className="text-[14px] font-bold text-text mt-1.5 block">
                  {getRegisterName()}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block font-mono">Linked Location / Branch</span>
                <span className="text-[14px] font-bold text-text mt-1.5 block">
                  {getBranchName()}
                </span>
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="grid grid-cols-3 gap-5 border-b border-border pb-5 bg-surface-alt/10 p-4 rounded-md border border-border">
              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Ledger Expected</span>
                <span className="text-[16px] font-extrabold text-text mt-1 block font-mono">
                  ₹ {Number(countDetails.expectedBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Physical Counted</span>
                <span className="text-[16px] font-extrabold text-text mt-1 block font-mono">
                  ₹ {Number(countDetails.physicalTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Variance Short/Excess</span>
                <span className={`text-[16px] font-black mt-1 block font-mono ${
                  isShort ? "text-danger" : isExcess ? "text-success" : "text-text"
                }`}>
                  {isExcess ? "+" : ""} ₹ {Number(varianceVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Denomination list */}
            <div>
              <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block mb-2">Count Breakdown Sheet</span>
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
            <div className="border-b border-border pb-5">
              <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Remarks / Narration</span>
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
            <div className="flex justify-between items-center text-[12px] text-text-muted">
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

          {isDraft && (
            <AppStack direction="row" gap={1} align="center">
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                startIcon={<FiCheck />}
                onClick={() => handleConfirm(false)}
                disabled={isTransitioning}
                sx={actionBtnSx}
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
                  sx={actionBtnSx}
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
                sx={actionBtnSx}
              >
                Cancel Count
              </AppButton>
            </AppStack>
          )}
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

export default CashDenominationDetailsDesktopPage;
