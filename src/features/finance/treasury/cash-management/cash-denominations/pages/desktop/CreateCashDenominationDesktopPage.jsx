import React from "react";
import { FiArrowLeft, FiSave, FiAlertCircle } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

const CreateCashDenominationDesktopPage = ({
  formData,
  formErrors,
  denominations = [],
  physicalTotal = 0,
  variance = 0,
  cashAccountOptions = [],
  isSubmitting = false,
  error,
  message,
  clearFeedback,
  handleInputChange,
  handleQtyChange,
  handleSubmit,
  handleCancel,
}) => {
  const isShort = variance < 0;
  const isExcess = variance > 0;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              New Cash Count
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Verify cash balances with physical denomination lists.
            </AppText>
          </div>
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Finance" },
              { label: "Cash Counts", onClick: handleCancel },
              { label: "Record", current: true },
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

        {/* Split Grid */}
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-[1fr_320px] gap-5">
          <div className="space-y-5 min-w-0">
            {/* Drawer selections */}
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={cardSx}>
              <div className="p-4 grid grid-cols-2 gap-4">
                <AppSelect
                  label="Select Cash Register Chest"
                  name="cashAccountId"
                  value={formData.cashAccountId}
                  onChange={(e) => handleInputChange("cashAccountId", e.target.value)}
                  options={cashAccountOptions}
                  placeholder="Choose cash drawer..."
                  error={Boolean(formErrors.cashAccountId)}
                  errorText={formErrors.cashAccountId}
                  required
                />

                <AppInput
                  type="date"
                  label="Count Date"
                  name="countDate"
                  value={formData.countDate}
                  onChange={(e) => handleInputChange("countDate", e.target.value)}
                  error={Boolean(formErrors.countDate)}
                  errorText={formErrors.countDate}
                  required
                />
              </div>
            </AppCard>

            {/* Denomination sheet */}
            <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none" sx={cardSx}>
              <div className="px-4 py-3 border-b border-border bg-surface-alt/5 flex items-center justify-between">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  Denomination Breakdown Sheet
                </AppHeading>
                {formErrors.denominations && (
                  <span className="text-[11px] text-danger font-bold flex items-center gap-1">
                    <FiAlertCircle />
                    {formErrors.denominations}
                  </span>
                )}
              </div>

              <div className="p-4">
                <table className="w-full text-left border-collapse text-[12.5px]">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-bold">
                      <th className="py-2 px-3 font-bold w-[120px]">Denomination</th>
                      <th className="py-2 px-3 font-bold w-[150px] text-center">Multiplier</th>
                      <th className="py-2 px-3 font-bold w-[180px]">Quantity</th>
                      <th className="py-2 px-3 font-bold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denominations.map((d) => {
                      const subTotal = d.denomination * d.quantity;

                      return (
                        <tr key={d.denomination} className="border-b border-border/40 hover:bg-surface-hover/20 transition">
                          <td className="py-2.5 px-3 font-bold text-text font-mono">
                            ₹ {d.denomination}
                          </td>
                          <td className="py-2.5 px-3 text-center text-text-muted font-mono">
                            ×
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min="0"
                              value={d.quantity || ""}
                              onChange={(e) => handleQtyChange(d.denomination, e.target.value)}
                              placeholder="0"
                              className="w-full max-w-[120px] px-2 py-1 text-[12.5px] border border-border rounded-md bg-surface text-text font-bold font-mono focus:outline-none focus:border-primary text-center"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-text font-mono">
                            ₹ {subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-surface-alt/10 font-bold">
                      <td colSpan="3" className="py-3 px-3 font-bold text-text text-[13.5px]">
                        Total Physical counted
                      </td>
                      <td className="py-3 px-3 text-right font-black text-text text-[15px] font-mono">
                        ₹ {physicalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </AppCard>

            {/* Remarks */}
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={cardSx}>
              <div className="p-4">
                <AppInput
                  label="Count Narration / Remarks"
                  name="narration"
                  value={formData.narration}
                  onChange={(e) => handleInputChange("narration", e.target.value)}
                  placeholder="Record additional audit comments or variance justifications..."
                  multiline
                  minRows={2}
                />
              </div>
            </AppCard>
          </div>

          {/* Sidebar calculations */}
          <div className="space-y-5">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={cardSx}>
              <div className="p-4 border-b border-border bg-surface-alt/10">
                <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase block">
                  Variance Calculator
                </span>
                <AppHeading level={3} weight={700} sx={cardTitleSx} className="mt-1">
                  Audit Summary
                </AppHeading>
              </div>

              <div className="p-4 space-y-4 text-[12.5px]">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Ledger Expected:</span>
                  <strong className="text-text font-mono">
                    ₹ {Number(formData.expectedBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Physical Counted:</span>
                  <strong className="text-text font-mono">
                    ₹ {physicalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-bold text-text">Variance Short/Excess:</span>
                  <strong className={`font-black text-[13.5px] font-mono ${
                    isShort ? "text-danger" : isExcess ? "text-success" : "text-text"
                  }`}>
                    {isExcess ? "+" : ""} ₹ {variance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                {isShort && (
                  <div className="p-2.5 bg-danger-soft text-danger text-[11px] font-semibold rounded-md border border-danger/10">
                    Warning: Cash box is short by ₹{Math.abs(variance).toLocaleString("en-IN")}. Adjustments will be logged.
                  </div>
                )}
              </div>
            </AppCard>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                size="medium"
                rounded="md"
                startIcon={<FiSave />}
                disabled={isSubmitting}
                loading={isSubmitting}
                fullWidth
              >
                Post Draft Count
              </AppButton>

              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="medium"
                rounded="md"
                startIcon={<FiArrowLeft />}
                onClick={handleCancel}
                disabled={isSubmitting}
                fullWidth
              >
                Cancel
              </AppButton>
            </div>
          </div>
        </form>
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
  fontSize: "14px",
  color: "var(--app-color-text)",
};

export default CreateCashDenominationDesktopPage;
