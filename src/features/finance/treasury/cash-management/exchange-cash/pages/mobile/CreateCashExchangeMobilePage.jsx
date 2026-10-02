import React from "react";
import { FiArrowLeft, FiSave, FiRepeat, FiInfo } from "react-icons/fi";

import {
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppText,
  AppIconButton,
} from "@/components";

// All valid Indian denominations
const DENOMINATION_NOTES = [500, 200, 100, 50, 20, 10];
const DENOMINATION_COINS = [5, 2, 1];

const MobileDenominationGrid = ({
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
    <div className={`p-4 rounded-xl border border-${accentColor}/20 bg-${accentColor}-soft/20`}>
      <div className="flex items-center justify-between mb-4">
        <AppHeading level={5} weight={700} sx={{ color: `var(--color-${accentColor})` }}>
          {label}
        </AppHeading>
        <AppText size="sm" weight={800} sx={{ color: `var(--color-${accentColor})` }}>
          ₹{total.toLocaleString("en-IN")}
        </AppText>
      </div>

      <div className="space-y-3">
        {DENOMINATION_NOTES.map((denom) => {
          const row = denominations.find((d) => d.denomination === denom);
          const qty = row?.quantity || 0;
          const subtotal = denom * qty;
          const available = getAvailable(denom);

          return (
            <div key={denom} className="flex items-center gap-3 bg-surface p-2 rounded-lg border border-border">
              <div className="w-16">
                <AppText size="sm" weight={700}>₹{denom}</AppText>
                {showAvailable && (
                  <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>
                    Av: {available}
                  </AppText>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  value={qty === 0 ? "" : qty}
                  placeholder="0"
                  onChange={(e) => onQtyChange(denom, e.target.value)}
                  className="w-full text-center text-sm font-semibold rounded border border-border bg-bg py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="w-20 text-right">
                <AppText size="xs" sx={{ color: qty > 0 ? "var(--color-text)" : "var(--color-text-muted)" }}>
                  = ₹{subtotal.toLocaleString("en-IN")}
                </AppText>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CreateCashExchangeMobilePage = ({
  formData,
  formErrors,
  cashAccountOptions,
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
  const availableDenoms = selectedCashAccount?.denominationBalance?.denominations || [];

  return (
    <section className="min-h-screen bg-bg pb-24 relative">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-surface border-b border-border shadow-sm">
        <div className="px-2 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppIconButton
              variant="ghost"
              icon={<FiArrowLeft />}
              onClick={handleCancel}
            />
            <AppHeading level={4} weight={700}>
              New Exchange
            </AppHeading>
          </div>
          <AppButton
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!isBalanced && (totalReceived > 0 || totalGiven > 0)}
          >
            Save
          </AppButton>
        </div>

        {/* Balance Sticky Footer Indicator */}
        {(totalReceived > 0 || totalGiven > 0) && (
          <div className={`px-4 py-2 text-[13px] font-bold flex items-center justify-center gap-2 ${
            isBalanced ? "bg-success text-white" : "bg-warning text-warning-dark"
          }`}>
            <FiRepeat />
            <span>
              {isBalanced
                ? "Balanced (OK)"
                : `Diff: ${diff > 0 ? "+" : ""}₹${diff.toLocaleString("en-IN")}`}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-5">
        {(error || message) && (
          <div className={`p-3 text-[13px] font-semibold rounded-lg flex justify-between ${
            error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
          }`}>
            <span>{error || message}</span>
            <button onClick={clearFeedback} className="underline">Dismiss</button>
          </div>
        )}

        <AppCard variant="default" rounded="xl" bordered shadow="sm" padding="md" className="space-y-4">
          <AppInput
            label="Exchange Date *"
            type="date"
            value={formData.exchangeDate}
            onChange={(e) => handleInputChange("exchangeDate", e.target.value)}
            error={formErrors.exchangeDate}
          />
          <AppSelect
            label="Cash Account *"
            options={cashAccountOptions}
            value={formData.cashAccountId}
            onChange={(e) => handleInputChange("cashAccountId", e.target.value)}
            error={formErrors.cashAccountId}
          />
          <AppInput
            label="Narration"
            placeholder="Optional notes"
            value={formData.narration}
            onChange={(e) => handleInputChange("narration", e.target.value)}
          />
        </AppCard>

        {formErrors.balance && (
          <div className="p-3 bg-danger-soft rounded-xl border border-danger/30 text-danger text-sm font-semibold">
            {formErrors.balance}
          </div>
        )}

        {/* Received Grid */}
        <div className="space-y-2">
          {formErrors.receivedDenominations && (
            <AppText size="sm" sx={{ color: "var(--color-danger)", fontWeight: 600, paddingLeft: 4 }}>
              {formErrors.receivedDenominations}
            </AppText>
          )}
          <MobileDenominationGrid
            label="Customer Gives (Received)"
            denominations={receivedDenominations}
            onQtyChange={handleReceivedQtyChange}
            total={totalReceived}
            accentColor="success"
            showAvailable={false}
          />
        </div>

        {/* Given Grid */}
        <div className="space-y-2">
          {formErrors.givenDenominations && (
            <AppText size="sm" sx={{ color: "var(--color-danger)", fontWeight: 600, paddingLeft: 4 }}>
              {formErrors.givenDenominations}
            </AppText>
          )}
          <MobileDenominationGrid
            label="We Give (Change)"
            denominations={givenDenominations}
            onQtyChange={handleGivenQtyChange}
            total={totalGiven}
            accentColor="warning"
            showAvailable={!!selectedCashAccount}
            availableDenoms={availableDenoms}
          />
        </div>

      </div>
    </section>
  );
};

export default CreateCashExchangeMobilePage;
