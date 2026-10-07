import React from "react";
import { FiArrowLeft, FiSave, FiInfo, FiRepeat } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";

// All valid Indian denominations
const DENOMINATION_NOTES = [500, 200, 100, 50, 20, 10];
const DENOMINATION_COINS = [5, 2, 1];

const DenominationGrid = ({
  label,
  denominations,
  onQtyChange,
  total,
  availableDenoms = [],
  showAvailable = false,
  accentColor = "primary",
}) => {
  const getAvailable = (denom) => {
    if (!showAvailable) return null;
    const found = availableDenoms.find((d) => d.denomination === denom);
    return found ? found.quantity : 0;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <AppHeading level={5} weight={600} sx={{ fontSize: 13 }}>
          {label}
        </AppHeading>
        <AppText
          size="sm"
          weight={700}
          sx={{
            color: `var(--color-${accentColor})`,
            fontSize: 15,
          }}
        >
          ₹{total.toLocaleString("en-IN")}
        </AppText>
      </div>

      {/* Notes */}
      <div className="mb-2">
        <AppText
          size="xs"
          sx={{
            color: "var(--color-text-muted)",
            fontWeight: 600,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Notes
        </AppText>
        <div className="grid grid-cols-3 gap-2">
          {DENOMINATION_NOTES.map((denom) => {
            const row = denominations.find((d) => d.denomination === denom);
            const qty = row?.quantity || 0;
            const subtotal = denom * qty;
            const available = getAvailable(denom);

            return (
              <div
                key={denom}
                className="rounded-md border border-border bg-surface p-2 flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <AppText size="xs" weight={700}>
                    ₹{denom}
                  </AppText>
                  {showAvailable && (
                    <AppText
                      size="xs"
                      sx={{ color: "var(--color-text-muted)" }}
                    >
                      Avail: {available}
                    </AppText>
                  )}
                </div>
                <input
                  type="number"
                  min={0}
                  max={
                    showAvailable && available !== null ? available : undefined
                  }
                  value={qty === 0 ? "" : qty}
                  placeholder="0"
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10) || 0;
                    if (showAvailable && available !== null && val > available)
                      val = available;
                    onQtyChange(denom, val);
                  }}
                  className="w-full text-center text-sm font-semibold rounded border border-border bg-bg py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {qty > 0 && (
                  <AppText
                    size="xs"
                    sx={{
                      textAlign: "center",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    = ₹{subtotal.toLocaleString("en-IN")}
                  </AppText>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coins */}
      <div>
        <AppText
          size="xs"
          sx={{
            color: "var(--color-text-muted)",
            fontWeight: 600,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Coins
        </AppText>
        <div className="grid grid-cols-3 gap-2">
          {DENOMINATION_COINS.map((denom) => {
            const row = denominations.find((d) => d.denomination === denom);
            const qty = row?.quantity || 0;
            const subtotal = denom * qty;
            const available = getAvailable(denom);

            return (
              <div
                key={denom}
                className="rounded-md border border-border bg-surface p-2 flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <AppText size="xs" weight={700}>
                    ₹{denom}
                  </AppText>
                  {showAvailable && (
                    <AppText
                      size="xs"
                      sx={{ color: "var(--color-text-muted)" }}
                    >
                      Avail: {available}
                    </AppText>
                  )}
                </div>
                <input
                  type="number"
                  min={0}
                  max={
                    showAvailable && available !== null ? available : undefined
                  }
                  value={qty === 0 ? "" : qty}
                  placeholder="0"
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10) || 0;
                    if (showAvailable && available !== null && val > available)
                      val = available;
                    onQtyChange(denom, val);
                  }}
                  className="w-full text-center text-sm font-semibold rounded border border-border bg-bg py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {qty > 0 && (
                  <AppText
                    size="xs"
                    sx={{
                      textAlign: "center",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    = ₹{subtotal.toLocaleString("en-IN")}
                  </AppText>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CreateCashExchangeDesktopPage = ({
  formData,
  formErrors,
  partitionOptions,
  selectedCashAccount,
  receivedDenominations,
  givenDenominations,
  totalReceived,
  totalGiven,
  isBalanced,
  handleReceivedQtyChange,
  handleGivenQtyChange,
  isSubmitting = false,
  error,
  message,
  clearFeedback,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  const diff = totalReceived - totalGiven;
  const availableDenoms =
    (formData.partition === "running"
      ? selectedCashAccount?.balance?.runningDenominations
      : selectedCashAccount?.balance?.frozenDenominations) || [];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="New Cash Exchange"
          subtitle="Exchange currency denominations — give khulli paisa (change) to customers."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance" },
                { label: "Cash Exchanges", onClick: handleCancel },
                { label: "Create", current: true },
              ]}
            />
          }
          align="flex-start"
          justify="space-between"
        />

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          {/* Form Side */}
          <div className="min-w-0">
            <form onSubmit={handleSubmit}>
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="sm"
                padding="none"
              >
                {/* Card Title */}
                <div className="px-5 py-4 border-b border-border">
                  <AppHeading level={3} weight={700} sx={{ fontSize: 15 }}>
                    Exchange Details
                  </AppHeading>
                </div>

                <div className="p-5 space-y-5">
                  {/* Feedback Alert */}
                  {(error || message) && (
                    <div
                      className={`p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
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

                  {/* Row 1: Date + Cash Account */}
                  <div className="grid grid-cols-2 gap-4">
                    <AppInput
                      label="Exchange Date *"
                      type="date"
                      value={formData.exchangeDate}
                      onChange={(e) =>
                        handleInputChange("exchangeDate", e.target.value)
                      }
                      error={formErrors.exchangeDate}
                      size="sm"
                    />
                    <AppSelect
                      label="Cash Partition *"
                      placeholder="Select cash partition…"
                      options={partitionOptions}
                      value={formData.partition}
                      onChange={(e) =>
                        handleInputChange("partition", e.target.value)
                      }
                      error={formErrors.partition}
                      size="sm"
                    />
                  </div>

                  {/* Balance indicator */}
                  {(totalReceived > 0 || totalGiven > 0) && (
                    <div
                      className={`rounded-lg p-3 flex items-center gap-3 text-[13px] font-semibold ${
                        isBalanced
                          ? "bg-success-soft text-success"
                          : "bg-warning-soft text-warning"
                      }`}
                    >
                      <FiRepeat className="flex-shrink-0" />
                      <span>
                        {isBalanced
                          ? `✓ Balanced: ₹${totalReceived.toLocaleString("en-IN")} received = ₹${totalGiven.toLocaleString("en-IN")} given`
                          : `Difference: ${diff > 0 ? "+" : ""}₹${diff.toLocaleString("en-IN")} — received and given must be equal`}
                      </span>
                    </div>
                  )}

                  {formErrors.balance && (
                    <AppText
                      size="xs"
                      sx={{ color: "var(--color-danger)", fontWeight: 600 }}
                    >
                      {formErrors.balance}
                    </AppText>
                  )}

                  {/* Two-column denomination grids */}
                  <div className="grid grid-cols-2 gap-6 border-t border-border pt-5">
                    {/* Customer gives us */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <AppText
                          size="xs"
                          weight={700}
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--color-success)",
                          }}
                        >
                          Customer Gives Us (Received)
                        </AppText>
                      </div>
                      {formErrors.receivedDenominations && (
                        <AppText
                          size="xs"
                          sx={{ color: "var(--color-danger)", marginBottom: 8 }}
                        >
                          {formErrors.receivedDenominations}
                        </AppText>
                      )}
                      <DenominationGrid
                        label="Denominations Received"
                        denominations={receivedDenominations}
                        onQtyChange={handleReceivedQtyChange}
                        total={totalReceived}
                        accentColor="success"
                        showAvailable={!!selectedCashAccount}
                        availableDenoms={availableDenoms}
                      />
                    </div>

                    {/* We give the customer */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        <AppText
                          size="xs"
                          weight={700}
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--color-warning)",
                          }}
                        >
                          We Give Customer (Change)
                        </AppText>
                      </div>
                      {formErrors.givenDenominations && (
                        <AppText
                          size="xs"
                          sx={{ color: "var(--color-danger)", marginBottom: 8 }}
                        >
                          {formErrors.givenDenominations}
                        </AppText>
                      )}
                      <DenominationGrid
                        label="Denominations Given"
                        denominations={givenDenominations}
                        onQtyChange={handleGivenQtyChange}
                        total={totalGiven}
                        accentColor="warning"
                        showAvailable={!!selectedCashAccount}
                        availableDenoms={availableDenoms}
                      />
                    </div>
                  </div>

                  {/* Narration */}
                  <AppInput
                    label="Narration"
                    placeholder="Optional note about this exchange…"
                    value={formData.narration}
                    onChange={(e) =>
                      handleInputChange("narration", e.target.value)
                    }
                    size="sm"
                  />

                  {/* Action Buttons */}
                  <AppStack direction="row" gap={8} justify="flex-end">
                    <AppButton
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </AppButton>
                    <AppButton
                      type="submit"
                      size="sm"
                      variant="primary"
                      icon={<FiSave />}
                      loading={isSubmitting}
                      disabled={
                        !isBalanced && (totalReceived > 0 || totalGiven > 0)
                      }
                    >
                      Complete Exchange
                    </AppButton>
                  </AppStack>
                </div>
              </AppCard>
            </form>
          </div>

          {/* Side Info Panel */}
          <div className="space-y-4">
            {/* Drawer Balance Card */}
            {selectedCashAccount && (
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="sm"
                padding="md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FiInfo className="text-primary" />
                  <AppHeading level={5} weight={700} sx={{ fontSize: 13 }}>
                    Drawer Balance
                  </AppHeading>
                </div>
                <AppText
                  size="xs"
                  sx={{ color: "var(--color-text-muted)", marginBottom: 8 }}
                >
                  {selectedCashAccount.branchId ? "Branch Cash" : ""}
                </AppText>
                {availableDenoms.length > 0 ? (
                  <div className="space-y-1">
                    {availableDenoms
                      .filter((d) => d.quantity > 0)
                      .sort((a, b) => b.denomination - a.denomination)
                      .map((d) => (
                        <div
                          key={d.denomination}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-text-muted">
                            ₹{d.denomination} ×
                          </span>
                          <span className="font-semibold">{d.quantity}</span>
                          <span className="text-text-muted">
                            = ₹
                            {(d.denomination * d.quantity).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                      ))}
                    {availableDenoms.filter((d) => d.quantity > 0).length ===
                      0 && (
                      <AppText
                        size="xs"
                        sx={{ color: "var(--color-text-muted)" }}
                      >
                        Drawer is empty
                      </AppText>
                    )}
                  </div>
                ) : (
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>
                    No denomination data
                  </AppText>
                )}
              </AppCard>
            )}

            {/* How it works */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="md"
            >
              <div className="flex items-center gap-2 mb-3">
                <FiInfo className="text-primary" />
                <AppHeading level={5} weight={700} sx={{ fontSize: 13 }}>
                  How it works
                </AppHeading>
              </div>
              <div className="space-y-2 text-xs text-text-muted">
                <p>
                  A cash exchange lets you swap denominations with a customer
                  without any impact on account balances.
                </p>
                <p>
                  <strong className="text-text">Example:</strong> Customer gives
                  ₹500 note → you give 5 × ₹100 notes back.
                </p>
                <p>Both sides must total the same amount.</p>
                <p>
                  The drawer balance updates automatically — no journal entry
                  needed.
                </p>
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateCashExchangeDesktopPage;
