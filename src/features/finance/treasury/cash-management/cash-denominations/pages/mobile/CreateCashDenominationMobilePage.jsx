import React from "react";
import { FiArrowLeft, FiSave, FiAlertCircle } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

const CreateCashDenominationMobilePage = ({
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
              onClick={handleCancel}
              sx={actionHeaderIconBtnSx}
            />
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                New Cash Count
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Post physical till checks
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Feedback Alert */}
        {(error || message) && (
          <div
            className={`mx-2 mb-3 p-3 text-[11px] font-semibold rounded-md flex justify-between items-center ${
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

        {/* Form Container */}
        <div className="px-2 space-y-3">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-4 space-y-4">
              <AppSelect
                label="Cash Register Till"
                name="cashAccountId"
                value={formData.cashAccountId}
                onChange={(e) => handleInputChange("cashAccountId", e.target.value)}
                options={cashAccountOptions}
                placeholder="Choose register..."
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

          {/* Variance details */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-3 border-b border-border bg-surface-alt/10">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase block font-mono">
                Audit summary
              </span>
            </div>

            <div className="p-4 space-y-2 text-[12px] text-text-muted">
              <div className="flex justify-between">
                <span>Ledger Expected:</span>
                <strong className="text-text font-mono">₹{Number(formData.expectedBalance || 0).toLocaleString("en-IN")}</strong>
              </div>

              <div className="flex justify-between">
                <span>Physical Counted:</span>
                <strong className="text-text font-mono">₹{physicalTotal.toLocaleString("en-IN")}</strong>
              </div>

              <div className="border-t border-border/50 pt-2 flex justify-between items-center text-[12.5px]">
                <span className="font-bold text-text">Variance Short/Excess:</span>
                <strong className={`font-black font-mono ${
                  isShort ? "text-danger" : isExcess ? "text-success" : "text-text"
                }`}>
                  {isExcess ? "+" : ""}₹{variance.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </AppCard>

          {/* Denominations rows */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-3 border-b border-border bg-surface-alt/10 flex justify-between items-center">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase block font-mono">
                Denomination breakdown
              </span>
              {formErrors.denominations && (
                <span className="text-[10px] text-danger font-bold flex items-center gap-0.5">
                  <FiAlertCircle /> Invalid count
                </span>
              )}
            </div>

            <div className="p-3.5 space-y-3.5">
              {denominations.map((d) => {
                const subTotal = d.denomination * d.quantity;

                return (
                  <div key={d.denomination} className="flex items-center justify-between gap-3 text-[12px]">
                    <div className="w-[60px] shrink-0 font-bold text-text font-mono">
                      ₹ {d.denomination}
                    </div>
                    <span className="text-text-muted">×</span>
                    <input
                      type="number"
                      min="0"
                      value={d.quantity || ""}
                      onChange={(e) => handleQtyChange(d.denomination, e.target.value)}
                      placeholder="0"
                      className="w-[80px] px-2 py-1 border border-border rounded bg-surface text-text font-bold font-mono focus:outline-none focus:border-primary text-center"
                    />
                    <div className="flex-1 text-right font-bold text-text font-mono">
                      ₹{subTotal.toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>
          </AppCard>

          {/* Remarks */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-4">
              <AppInput
                label="Remarks / Narration"
                name="narration"
                value={formData.narration}
                onChange={(e) => handleInputChange("narration", e.target.value)}
                placeholder="Audit remarks..."
                multiline
                minRows={2}
              />
            </div>
          </AppCard>

          {/* Sticky bottom controls */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2.5 shadow-lg max-w-[460px] mx-auto w-full">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 py-2 text-[12px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 text-[12px] font-bold bg-primary text-surface rounded-md hover:bg-primary-hover transition flex items-center justify-center gap-1.5"
            >
              <FiSave />
              <span>{isSubmitting ? "Posting..." : "Post Count"}</span>
            </button>
          </div>
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
  px: 0.5,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 0.5,
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

const formCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

export default CreateCashDenominationMobilePage;
