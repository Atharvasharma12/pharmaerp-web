import React, { useState } from "react";
import { FiArrowLeft, FiSlash, FiCheckCircle } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppTag,
  AppText,
  PageHeader,
  PermissionGate,
  AppInput,
} from "@/components";
import { formatDate, formatDateTime } from "@/utils";

const CashExchangeDetailsDesktopPage = ({
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
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5 flex items-center justify-center">
        <AppText>Loading exchange details...</AppText>
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

  const getStatusTag = (s) => {
    switch (s) {
      case "COMPLETED":
        return (
          <AppTag color="success" size="sm">
            <FiCheckCircle className="mr-1 inline" /> Completed
          </AppTag>
        );
      case "CANCELLED":
        return (
          <AppTag color="danger" size="sm">
            <FiSlash className="mr-1 inline" /> Cancelled
          </AppTag>
        );
      default:
        return <AppTag size="sm">{s}</AppTag>;
    }
  };

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title={`Cash Exchange #${exchangeNumber}`}
          subtitle="View full details of the denomination exchange"
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance" },
                { label: "Cash Exchanges", onClick: handleBack },
                { label: "Details", current: true },
              ]}
            />
          }
          align="flex-start"
          justify="space-between"
        />

        {/* Feedback */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error
                ? "bg-danger-soft text-danger"
                : "bg-success-soft text-success"
            }`}
          >
            <span>{error || message}</span>
            <button
              type="button"
              onClick={clearFeedback}
              className="ml-4 text-xs underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="mt-5 flex items-center justify-between mb-4">
          <AppButton
            variant="ghost"
            size="sm"
            icon={<FiArrowLeft />}
            onClick={handleBack}
          >
            Back to List
          </AppButton>

          <div className="flex gap-2">
            {!isCancelled && (
              <PermissionGate permission="cash-exchange:delete">
                <AppButton
                  variant="danger"
                  size="sm"
                  icon={<FiSlash />}
                  onClick={() => setShowCancelModal(true)}
                  disabled={isCancelling}
                >
                  Cancel Exchange
                </AppButton>
              </PermissionGate>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Main Info */}
          <div className="col-span-2 space-y-5">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="md">
              <AppHeading level={5} weight={700} sx={{ marginBottom: 16 }}>
                Exchange Summary
              </AppHeading>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)", marginBottom: 4 }}>
                    Status
                  </AppText>
                  {getStatusTag(status)}
                </div>
                <div>
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)", marginBottom: 4 }}>
                    Date
                  </AppText>
                  <AppText size="sm" weight={600}>
                    {formatDate(exchangeDate)}
                  </AppText>
                </div>
                <div>
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)", marginBottom: 4 }}>
                    Cash Account
                  </AppText>
                  <AppText size="sm" weight={600}>
                    Branch Cash
                  </AppText>
                </div>
                <div>
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)", marginBottom: 4 }}>
                    Narration
                  </AppText>
                  <AppText size="sm">{narration || "—"}</AppText>
                </div>
              </div>
            </AppCard>

            {/* Denominations Grid */}
            <div className="grid grid-cols-2 gap-5">
              {/* Received */}
              <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none">
                <div className="px-4 py-3 border-b border-border bg-success-soft/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <AppText size="xs" weight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-success)" }}>
                      Received from Customer
                    </AppText>
                  </div>
                  <AppText size="sm" weight={700} sx={{ color: "var(--color-success)" }}>
                    ₹{totalReceived?.toLocaleString("en-IN")}
                  </AppText>
                </div>
                <div className="p-4 space-y-2">
                  {denominationsReceived.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                      <AppText size="sm" sx={{ color: "var(--color-text-muted)" }}>
                        ₹{d.denomination} × {d.quantity}
                      </AppText>
                      <AppText size="sm" weight={600}>
                        ₹{(d.denomination * d.quantity).toLocaleString("en-IN")}
                      </AppText>
                    </div>
                  ))}
                  {denominationsReceived.length === 0 && (
                    <AppText size="sm" sx={{ color: "var(--color-text-muted)", textAlign: "center" }}>
                      No denominations
                    </AppText>
                  )}
                </div>
              </AppCard>

              {/* Given */}
              <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none">
                <div className="px-4 py-3 border-b border-border bg-warning-soft/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <AppText size="xs" weight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-warning)" }}>
                      Given to Customer
                    </AppText>
                  </div>
                  <AppText size="sm" weight={700} sx={{ color: "var(--color-warning)" }}>
                    ₹{totalGiven?.toLocaleString("en-IN")}
                  </AppText>
                </div>
                <div className="p-4 space-y-2">
                  {denominationsGiven.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                      <AppText size="sm" sx={{ color: "var(--color-text-muted)" }}>
                        ₹{d.denomination} × {d.quantity}
                      </AppText>
                      <AppText size="sm" weight={600}>
                        ₹{(d.denomination * d.quantity).toLocaleString("en-IN")}
                      </AppText>
                    </div>
                  ))}
                  {denominationsGiven.length === 0 && (
                    <AppText size="sm" sx={{ color: "var(--color-text-muted)", textAlign: "center" }}>
                      No denominations
                    </AppText>
                  )}
                </div>
              </AppCard>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="md">
              <AppHeading level={5} weight={700} sx={{ marginBottom: 16 }}>
                Audit Information
              </AppHeading>
              
              <div className="space-y-4">
                <div>
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)", marginBottom: 4 }}>
                    Created By
                  </AppText>
                  <AppText size="sm">{createdBy?.name || "—"}</AppText>
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>
                    {formatDateTime(createdAt)}
                  </AppText>
                </div>

                {isCancelled && (
                  <div className="p-3 bg-danger-soft/50 rounded-md border border-danger/20">
                    <AppText size="xs" sx={{ color: "var(--color-danger)", marginBottom: 4, fontWeight: 600 }}>
                      Cancelled By
                    </AppText>
                    <AppText size="sm">{cancelledBy?.name || "—"}</AppText>
                    <AppText size="xs" sx={{ color: "var(--color-text-muted)", marginBottom: 8 }}>
                      {formatDateTime(cancelledAt)}
                    </AppText>
                    
                    {cancellationReason && (
                      <>
                        <AppText size="xs" sx={{ color: "var(--color-danger)", marginBottom: 2, fontWeight: 600 }}>
                          Reason
                        </AppText>
                        <AppText size="sm">{cancellationReason}</AppText>
                      </>
                    )}
                  </div>
                )}

                {notes && (
                  <div className="pt-4 border-t border-border">
                    <AppText size="xs" sx={{ color: "var(--color-text-muted)", marginBottom: 4 }}>
                      Internal Notes
                    </AppText>
                    <AppText size="sm">{notes}</AppText>
                  </div>
                )}
              </div>
            </AppCard>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="xl"
              padding="lg"
              sx={{ width: 420 }}
            >
              <AppHeading level={4} weight={700} sx={{ marginBottom: 8 }}>
                Cancel Cash Exchange
              </AppHeading>
              <AppText size="sm" sx={{ color: "var(--color-text-muted)", marginBottom: 16 }}>
                Are you sure you want to cancel this exchange? The denominations will be reversed in the cash account.
              </AppText>
              
              <AppInput
                label="Reason (Optional)"
                placeholder="Why is this being cancelled?"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                size="sm"
                sx={{ marginBottom: 20 }}
              />

              <AppStack direction="row" gap={8} justify="flex-end">
                <AppButton
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCancelModal(false)}
                >
                  Close
                </AppButton>
                <AppButton
                  size="sm"
                  variant="danger"
                  onClick={handleConfirmCancel}
                  loading={isCancelling}
                >
                  Confirm Cancel
                </AppButton>
              </AppStack>
            </AppCard>
          </div>
        )}
      </div>
    </section>
  );
};

export default CashExchangeDetailsDesktopPage;
