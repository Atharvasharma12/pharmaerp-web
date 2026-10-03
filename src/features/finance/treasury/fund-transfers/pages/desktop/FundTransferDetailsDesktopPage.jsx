import React from "react";
import { FiArrowLeft, FiSlash, FiClock, FiFileText, FiUser } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";
import { formatDate } from "@/utils";

const FundTransferDetailsDesktopPage = ({
  transferDetails = null,
  isLoading = false,
  isCancelling = false,
  error,
  message,
  clearFeedback,
  handleCancelTransfer,
  handleBack,
}) => {
  if (isLoading && !transferDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg">
        <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Retrieving transfer logs...
        </AppText>
      </div>
    );
  }

  if (!transferDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-58px)] bg-bg text-center">
        <FiClock className="text-[40px] text-text-muted/40 mb-3" />
        <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
          Record Not Found
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
          The requested fund transfer record could not be found.
        </AppText>
        <AppButton size="small" variant="contained" onClick={handleBack} sx={{ mt: 3 }}>
          Back to List
        </AppButton>
      </div>
    );
  }

  const getSourceAccountName = () => {
    if (transferDetails.fromAccountType === "BANK") {
      const b = transferDetails.fromBankAccountId;
      return b ? `${b.bankName} (${b.accountNumber || b.accountCode || ""})` : "Bank Account";
    }
    return "Branch Cash";
  };

  const getDestAccountName = () => {
    if (transferDetails.toAccountType === "BANK") {
      const b = transferDetails.toBankAccountId;
      return b ? `${b.bankName} (${b.accountNumber || b.accountCode || ""})` : "Bank Account";
    }
    return "Branch Cash";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "POSTED":
        return "bg-success-soft text-success border border-success/20";
      case "CANCELLED":
        return "bg-danger-soft text-danger border border-danger/20";
      default:
        return "bg-warning-soft text-warning border border-warning/20";
    }
  };

  const isCancelled = transferDetails.status === "CANCELLED";
  const creatorName = transferDetails.createdBy
    ? `${transferDetails.createdBy.firstName || ""} ${transferDetails.createdBy.lastName || ""}`.trim()
    : "System";

  const cancellerName = transferDetails.cancelledBy
    ? `${transferDetails.cancelledBy.firstName || ""} ${transferDetails.cancelledBy.lastName || ""}`.trim()
    : "";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[800px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              Transfer Details
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Verify audit trails and posting logs for recorded treasury transfers.
            </AppText>
          </div>
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Finance & Accounting" },
              { label: "Fund Transfers", onClick: handleBack },
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

        {/* Details Card */}
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
                {transferDetails.transferNumber}
              </span>
              <AppHeading level={3} weight={700} sx={cardTitleSx} className="mt-0.5">
                Fund Transfer Details
              </AppHeading>
            </div>
            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase ${getStatusBadgeClass(transferDetails.status)}`}>
              {transferDetails.status}
            </span>
          </div>

          <div className="p-5 space-y-6">
            {/* Source and Destination Accounts */}
            <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Source Account</span>
                <span className="text-[14px] font-bold text-text mt-1.5 block">
                  {getSourceAccountName()}
                </span>
                <span className="text-[9.5px] font-extrabold uppercase text-text-muted tracking-wide mt-0.5 block font-mono">
                  Type: {transferDetails.fromAccountType}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Destination Account</span>
                <span className="text-[14px] font-bold text-text mt-1.5 block">
                  {getDestAccountName()}
                </span>
                <span className="text-[9.5px] font-extrabold uppercase text-text-muted tracking-wide mt-0.5 block font-mono">
                  Type: {transferDetails.toAccountType}
                </span>
              </div>
            </div>

            {/* Amount & Reference */}
            <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Transfer Amount</span>
                <span className="text-[24px] font-black text-text mt-1 block">
                  ₹ {Number(transferDetails.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Reference / Slip Number</span>
                <span className="text-[15px] font-extrabold text-text mt-2 block font-mono">
                  {transferDetails.referenceNumber || "-"}
                </span>
              </div>
            </div>

            {/* Narration */}
            <div className="border-b border-border pb-5">
              <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Narration / Description</span>
              <p className="text-[13px] text-text font-semibold mt-2 leading-relaxed bg-surface-alt/20 p-3 rounded-md border border-border">
                {transferDetails.narration || "No transfer notes or remarks provided."}
              </p>
            </div>

            {/* Denomination breakdown sheets if cash is involved and has denominations */}
            {((transferDetails.fromDenominations?.length > 0) || (transferDetails.toDenominations?.length > 0)) && (
              <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
                {/* Source Denominations */}
                <div>
                  <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block mb-2">
                    Source Chest Denominations
                  </span>
                  {transferDetails.fromDenominations?.length > 0 ? (
                    <table className="w-full text-left border-collapse text-[11.5px]">
                      <thead>
                        <tr className="border-b border-border text-text-muted">
                          <th className="py-1 px-1 font-semibold">Denomination</th>
                          <th className="py-1 px-1 font-semibold text-center">×</th>
                          <th className="py-1 px-1 font-semibold">Quantity</th>
                          <th className="py-1 px-1 font-semibold text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transferDetails.fromDenominations.map((d) => (
                          <tr key={d.denomination} className="border-b border-border/30">
                            <td className="py-1 px-1 font-bold text-text font-mono">₹{d.denomination}</td>
                            <td className="py-1 px-1 text-center text-text-muted">×</td>
                            <td className="py-1 px-1 font-mono">{d.quantity}</td>
                            <td className="py-1 px-1 text-right font-extrabold text-text font-mono">
                              ₹{(d.denomination * d.quantity).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="text-[12px] text-text-muted italic">No denominations count recorded.</span>
                  )}
                </div>

                {/* Destination Denominations */}
                <div>
                  <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block mb-2">
                    Destination Chest Denominations
                  </span>
                  {transferDetails.toDenominations?.length > 0 ? (
                    <table className="w-full text-left border-collapse text-[11.5px]">
                      <thead>
                        <tr className="border-b border-border text-text-muted">
                          <th className="py-1 px-1 font-semibold">Denomination</th>
                          <th className="py-1 px-1 font-semibold text-center">×</th>
                          <th className="py-1 px-1 font-semibold">Quantity</th>
                          <th className="py-1 px-1 font-semibold text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transferDetails.toDenominations.map((d) => (
                          <tr key={d.denomination} className="border-b border-border/30">
                            <td className="py-1 px-1 font-bold text-text font-mono">₹{d.denomination}</td>
                            <td className="py-1 px-1 text-center text-text-muted">×</td>
                            <td className="py-1 px-1 font-mono">{d.quantity}</td>
                            <td className="py-1 px-1 text-right font-extrabold text-text font-mono">
                              ₹{(d.denomination * d.quantity).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="text-[12px] text-text-muted italic">No denominations count recorded.</span>
                  )}
                </div>
              </div>
            )}

            {/* Cancellation info if applicable */}
            {isCancelled && (
              <div className="p-4 bg-danger-soft/10 border border-danger/20 rounded-md space-y-2">
                <span className="text-[10px] font-extrabold text-danger uppercase tracking-wider block">
                  Cancellation Logs
                </span>
                <div className="grid grid-cols-2 gap-4 text-[12px] text-text-muted">
                  <div>
                    <span>Cancelled By:</span>
                    <strong className="text-text ml-1">{cancellerName || "System"}</strong>
                  </div>
                  <div>
                    <span>Cancelled At:</span>
                    <strong className="text-text ml-1">{transferDetails.cancelledAt ? formatDate(transferDetails.cancelledAt) : "-"}</strong>
                  </div>
                  <div className="col-span-2">
                    <span>Reason:</span>
                    <p className="text-text mt-1 font-semibold">{transferDetails.cancellationReason || "No reason specified"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Logs */}
            <div className="flex justify-between items-center text-[12px] text-text-muted">
              <div className="flex items-center gap-1.5">
                <FiUser />
                <span>Recorded By:</span>
                <strong>{creatorName}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <FiClock />
                <span>Recorded Date:</span>
                <strong>{formatDate(transferDetails.createdAt)}</strong>
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
            disabled={isCancelling}
            sx={actionBtnSx}
          >
            Back to List
          </AppButton>

          {!isCancelled && (
            <AppButton
              variant="outlined"
              colorVariant="error"
              size="small"
              rounded="md"
              startIcon={<FiSlash />}
              onClick={() => {
                const reason = prompt("Enter cancellation reason:");
                if (reason !== null) {
                  handleCancelTransfer(reason);
                }
              }}
              disabled={isCancelling}
              loading={isCancelling}
              sx={actionBtnSx}
            >
              Cancel Transfer
            </AppButton>
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

export default FundTransferDetailsDesktopPage;
