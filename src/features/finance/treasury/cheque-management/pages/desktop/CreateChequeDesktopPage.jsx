import React from "react";
import { FiArrowLeft, FiSave } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppText,
} from "@/components";

const chequeTypeOptions = [
  { label: "Received Cheque (From Customer)", value: "RECEIVED" },
  { label: "Issued Cheque (To Vendor)", value: "ISSUED" },
];

const CreateChequeDesktopPage = ({
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
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[800px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              Record Cheque
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Post physical cheque instruments received or issued.
            </AppText>
          </div>
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Finance" },
              { label: "Cheques", onClick: handleCancel },
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

        {/* Form Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          className="mt-5"
          sx={cardSx}
        >
          <form onSubmit={handleSubmit} className="p-5 space-y-6">
            {/* Type & Number */}
            <div className="grid grid-cols-2 gap-4">
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
                placeholder="e.g. CHQ-92849"
                error={Boolean(formErrors.chequeNumber)}
                errorText={formErrors.chequeNumber}
                required
              />
            </div>

            {/* Date & Amount */}
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
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
                label="Cheque Amount (INR)"
                name="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                error={Boolean(formErrors.amount)}
                errorText={formErrors.amount}
                required
              />
            </div>

            {/* Banks & Accounts */}
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
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

            {/* Drawer/Payee Name */}
            <div className="border-t border-border pt-4">
              <AppInput
                label="Party / Drawer / Payee Name (As written on Cheque)"
                name="partyName"
                value={formData.partyName}
                onChange={(e) => handleInputChange("partyName", e.target.value)}
                placeholder="e.g. Acme Corporation"
                error={Boolean(formErrors.partyName)}
                errorText={formErrors.partyName}
                required
              />
            </div>

            {/* Notes / Narration */}
            <div className="border-t border-border pt-4">
              <AppInput
                label="Narration / Description"
                name="narration"
                value={formData.narration}
                onChange={(e) => handleInputChange("narration", e.target.value)}
                placeholder="Record additional cheque details or remarks..."
                multiline
                minRows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                startIcon={<FiArrowLeft />}
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={actionBtnSx}
              >
                Cancel
              </AppButton>

              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                size="small"
                rounded="md"
                startIcon={<FiSave />}
                disabled={isSubmitting}
                loading={isSubmitting}
                sx={actionBtnSx}
              >
                Save Cheque
              </AppButton>
            </div>
          </form>
        </AppCard>
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

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

export default CreateChequeDesktopPage;
