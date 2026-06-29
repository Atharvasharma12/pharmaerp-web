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

const accountTypeOptions = [
  { label: "Bank Account", value: "BANK" },
  { label: "Cash / Vault", value: "CASH" },
];

const CreateFundTransferMobilePage = ({
  formData,
  formErrors,
  sourceOptions = [],
  destinationOptions = [],
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
                New Transfer
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Post internal balance fund transfer
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

        {/* Form Card container */}
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
              {/* Date & Amount */}
              <AppInput
                type="date"
                label="Transfer Date"
                name="transferDate"
                value={formData.transferDate}
                onChange={(e) => handleInputChange("transferDate", e.target.value)}
                error={Boolean(formErrors.transferDate)}
                errorText={formErrors.transferDate}
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

              {/* Source Account */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block mb-2">
                  From (Source Account)
                </span>
                <div className="space-y-3">
                  <AppSelect
                    label="Account Type"
                    name="fromAccountType"
                    value={formData.fromAccountType}
                    onChange={(e) => handleInputChange("fromAccountType", e.target.value)}
                    options={accountTypeOptions}
                    required
                  />

                  <AppSelect
                    label="Select Source Account"
                    name="fromAccountId"
                    value={formData.fromAccountId}
                    onChange={(e) => handleInputChange("fromAccountId", e.target.value)}
                    options={sourceOptions}
                    placeholder="Choose account..."
                    error={Boolean(formErrors.fromAccountId)}
                    errorText={formErrors.fromAccountId}
                    required
                  />
                </div>
              </div>

              {/* Destination Account */}
              <div className="border-t border-border/50 pt-3">
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block mb-2">
                  To (Destination Account)
                </span>
                <div className="space-y-3">
                  <AppSelect
                    label="Account Type"
                    name="toAccountType"
                    value={formData.toAccountType}
                    onChange={(e) => handleInputChange("toAccountType", e.target.value)}
                    options={accountTypeOptions}
                    required
                  />

                  <AppSelect
                    label="Select Destination Account"
                    name="toAccountId"
                    value={formData.toAccountId}
                    onChange={(e) => handleInputChange("toAccountId", e.target.value)}
                    options={destinationOptions}
                    placeholder="Choose account..."
                    error={Boolean(formErrors.toAccountId)}
                    errorText={formErrors.toAccountId}
                    required
                  />
                </div>
              </div>

              {/* Ref & Narration */}
              <div className="border-t border-border/50 pt-3 space-y-3">
                <AppInput
                  label="Reference Number"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                  placeholder="e.g. TXN-1002"
                />

                <AppInput
                  label="Narration / Description"
                  name="narration"
                  value={formData.narration}
                  onChange={(e) => handleInputChange("narration", e.target.value)}
                  placeholder="Additional transfer notes..."
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
                  <span>{isSubmitting ? "Posting..." : "Post Transfer"}</span>
                </button>
              </div>
            </form>
          </AppCard>
        </div>
      </AppBox>
    </section>
  );
};

// MUI style configurations
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

export default CreateFundTransferMobilePage;
