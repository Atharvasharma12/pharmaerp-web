import React, { useState } from "react";
import { FiArrowLeft, FiSlash, FiCheckCircle } from "react-icons/fi";

import {
  AppCard,
  AppHeading,
  AppText,
  AppIconButton,
  AppButton,
  AppInput,
} from "@/components";
import { formatDate, formatDateTime } from "@/utils";

const CashExchangeDetailsMobilePage = ({
  exchangeDetails,
  isLoading = false,
  isCancelling = false,
  error,
  message,
  clearFeedback,
  handleCancelExchange,
  handleBack,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading || !exchangeDetails) {
    return (
      <section className="min-h-screen bg-bg flex items-center justify-center">
        <AppText>Loading details...</AppText>
      </section>
    );
  }

  const {
    exchangeNumber,
    exchangeDate,
    status,
    totalReceived,
    totalGiven,
    notes,
    denominationsReceived = [],
    denominationsGiven = [],
    narration,
    createdBy,
    createdAt,
    cancelledBy,
    cancelledAt,
    cancellationReason,
  } = exchangeDetails;

  const isCancelled = status === "CANCELLED";

  const handleConfirmCancel = async () => {
    setShowCancelModal(false);
    await handleCancelExchange(cancelReason);
    setCancelReason("");
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success-soft text-success text-xs font-bold">
            <FiCheckCircle /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-danger-soft text-danger text-xs font-bold">
            <FiSlash /> Cancelled
          </span>
        );
      default:
        return <span className="text-xs font-bold">{s}</span>;
    }
  };

  return (
    <section className="min-h-screen bg-bg pb-24 relative">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-surface border-b border-border shadow-sm px-2 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppIconButton
            variant="ghost"
            icon={<FiArrowLeft />}
            onClick={handleBack}
          />
          <AppHeading level={4} weight={700}>
            #{exchangeNumber}
          </AppHeading>
        </div>
        {!isCancelled && (
          <AppButton
            size="sm"
            variant="danger"
            onClick={() => setShowCancelModal(true)}
            disabled={isCancelling}
          >
            Cancel
          </AppButton>
        )}
      </div>

      <div className="p-4 space-y-4">
        {(error || message) && (
          <div className={`p-3 text-[13px] font-semibold rounded-lg flex justify-between ${
            error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
          }`}>
            <span>{error || message}</span>
            <button onClick={clearFeedback} className="underline">Dismiss</button>
          </div>
        )}

        <AppCard variant="default" rounded="xl" bordered shadow="sm" padding="md">
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-border">
            <div>
              <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>Status</AppText>
              <div className="mt-1">{getStatusBadge(status)}</div>
            </div>
            <div className="text-right">
              <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>Date</AppText>
              <AppText size="sm" weight={600} className="mt-1">{formatDate(exchangeDate)}</AppText>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>Cash Account</AppText>
              <AppText size="sm" weight={600}>Branch Cash</AppText>
            </div>
            <div>
              <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>Narration</AppText>
              <AppText size="sm">{narration || "—"}</AppText>
            </div>
          </div>
        </AppCard>

        <div className="space-y-3">
          {/* Received */}
          <div className="rounded-xl border border-success/20 bg-success-soft/20 overflow-hidden">
            <div className="px-4 py-3 bg-success-soft border-b border-success/20 flex justify-between items-center">
              <AppText size="xs" weight={700} sx={{ color: "var(--color-success)", textTransform: "uppercase" }}>
                Received
              </AppText>
              <AppText size="sm" weight={800} sx={{ color: "var(--color-success)" }}>
                ₹{totalReceived?.toLocaleString("en-IN")}
              </AppText>
            </div>
            <div className="p-4 space-y-2">
              {denominationsReceived.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">₹{d.denomination} × {d.quantity}</span>
                  <span className="font-semibold text-text">₹{(d.denomination * d.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Given */}
          <div className="rounded-xl border border-warning/20 bg-warning-soft/20 overflow-hidden">
            <div className="px-4 py-3 bg-warning-soft border-b border-warning/20 flex justify-between items-center">
              <AppText size="xs" weight={700} sx={{ color: "var(--color-warning)", textTransform: "uppercase" }}>
                Given
              </AppText>
              <AppText size="sm" weight={800} sx={{ color: "var(--color-warning)" }}>
                ₹{totalGiven?.toLocaleString("en-IN")}
              </AppText>
            </div>
            <div className="p-4 space-y-2">
              {denominationsGiven.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">₹{d.denomination} × {d.quantity}</span>
                  <span className="font-semibold text-text">₹{(d.denomination * d.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AppCard variant="default" rounded="xl" bordered shadow="sm" padding="md">
          <AppHeading level={5} weight={700} sx={{ marginBottom: 12 }}>
            Audit Info
          </AppHeading>
          <div className="space-y-3">
            <div>
              <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>Created By</AppText>
              <AppText size="sm">{createdBy?.name || "—"}</AppText>
              <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>{formatDateTime(createdAt)}</AppText>
            </div>
            {isCancelled && (
              <div className="pt-3 border-t border-border">
                <AppText size="xs" sx={{ color: "var(--color-danger)", fontWeight: 600 }}>Cancelled By</AppText>
                <AppText size="sm">{cancelledBy?.name || "—"}</AppText>
                <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>{formatDateTime(cancelledAt)}</AppText>
                {cancellationReason && (
                  <div className="mt-2 text-sm text-text bg-bg p-2 rounded">{cancellationReason}</div>
                )}
              </div>
            )}
          </div>
        </AppCard>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center p-4">
          <div className="w-full max-w-sm bg-surface rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-4">
            <AppHeading level={4} weight={700} sx={{ marginBottom: 8 }}>
              Cancel Exchange
            </AppHeading>
            <AppText size="sm" sx={{ color: "var(--color-text-muted)", marginBottom: 16 }}>
              Reverse denomination changes in drawer.
            </AppText>
            <AppInput
              placeholder="Reason (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              size="sm"
              sx={{ marginBottom: 20 }}
            />
            <div className="flex gap-3">
              <AppButton className="flex-1" variant="outline" onClick={() => setShowCancelModal(false)}>Keep</AppButton>
              <AppButton className="flex-1" variant="danger" onClick={handleConfirmCancel} loading={isCancelling}>Cancel It</AppButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CashExchangeDetailsMobilePage;
