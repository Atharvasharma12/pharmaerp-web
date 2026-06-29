import React from "react";
import { FiArrowLeft, FiSave } from "react-icons/fi";

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

const chequeTypeOptions = [
  { label: "Received Cheque (Customer)", value: "RECEIVED" },
  { label: "Issued Cheque (Vendor)", value: "ISSUED" },
];

const CreateChequeMobilePage = ({
  formData,
  formErrors,
  bankOptions = [],
  accountOptions = [],
  isSubmitting = false,
  error,
  message,
  clearFeedback,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <section className="w-full bg-bg pb-20">
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
                Record Cheque
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Post incoming or outgoing cheque ledger
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
        <div className="px-2">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <AppSelect
                label="Cheque Type"
                name="chequeType"
                value={formData.chequeType}
                onChange={(e) => handleInputChange("chequeType", e.target.value)}
                options={chequeTypeOptions}
                required
              />

              <AppInput
                label="Cheque Number"
                name="chequeNumber"
                value={formData.chequeNumber}
                onChange={(e) => handleInputChange("chequeNumber", e.target.value)}
                placeholder="e.g. CHQ-8742"
                error={Boolean(formErrors.chequeNumber)}
                errorText={formErrors.chequeNumber}
                required
              />

              <AppInput
                type="date"
                label="Cheque Date (Drawn Date)"
                name="chequeDate"
                value={formData.chequeDate}
                onChange={(e) => handleInputChange("chequeDate", e.target.value)}
                error={Boolean(formErrors.chequeDate)}
                errorText={formErrors.chequeDate}
                required
              />

              <AppInput
                type="number"
                step="0.01"
                label="Amount (INR)"
                name="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                error={Boolean(formErrors.amount)}
                errorText={formErrors.amount}
                required
              />

              <div className="border-t border-border/50 pt-3 space-y-3">
                <AppSelect
                  label="Company Bank Account"
                  name="bankAccountId"
                  value={formData.bankAccountId}
                  onChange={(e) => handleInputChange("bankAccountId", e.target.value)}
                  options={bankOptions}
                  placeholder="Select bank..."
                  error={Boolean(formErrors.bankAccountId)}
                  errorText={formErrors.bankAccountId}
                  required
                />

                <AppSelect
                  label="Counterparty Ledger Account"
                  name="counterpartyAccountId"
                  value={formData.counterpartyAccountId}
                  onChange={(e) => handleInputChange("counterpartyAccountId", e.target.value)}
                  options={accountOptions}
                  placeholder="Select ledger..."
                  error={Boolean(formErrors.counterpartyAccountId)}
                  errorText={formErrors.counterpartyAccountId}
                  required
                />
              </div>

              <div className="border-t border-border/50 pt-3 space-y-3">
                <AppInput
                  label="Party / Payee Name (written on Cheque)"
                  name="partyName"
                  value={formData.partyName}
                  onChange={(e) => handleInputChange("partyName", e.target.value)}
                  placeholder="e.g. ABC Trading"
                  error={Boolean(formErrors.partyName)}
                  errorText={formErrors.partyName}
                  required
                />

                <AppInput
                  label="Narration / Remarks"
                  name="narration"
                  value={formData.narration}
                  onChange={(e) => handleInputChange("narration", e.target.value)}
                  placeholder="Additional remarks..."
                  multiline
                  minRows={2}
                />
              </div>

              {/* Fixed bottom controls */}
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
                  <span>{isSubmitting ? "Saving..." : "Save Cheque"}</span>
                </button>
              </div>
            </form>
          </AppCard>
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

export default CreateChequeMobilePage;
