import React from "react";
import { FiArrowLeft, FiSave, FiInfo } from "react-icons/fi";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppText,
  PageHeader,
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
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Record Cheque"
          subtitle="Post physical cheque instruments received or issued."
          extra={
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
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Layout Split */}
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
                sx={formCardSx}
              >
                {/* Section Title */}
                <div className="px-5 py-4 border-b border-border">
                  <AppHeading level={3} weight={700} sx={formCardTitleSx}>
                    Cheque Details
                  </AppHeading>
                </div>

                <div className="p-5 space-y-5">
                  {/* Feedback Alert */}
                  {(error || message) && (
                    <div
                      className={`p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
                        error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
                      }`}
                    >
                      <span>{error || message}</span>
                      <button
                        type="button"
                        onClick={clearFeedback}
                        className={`font-bold hover:underline ${error ? "text-danger" : "text-success"}`}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Type & Number */}
                  <div className="grid grid-cols-2 gap-5">
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
                  <div className="grid grid-cols-2 gap-5 border-t border-border pt-5">
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
                  <div className="grid grid-cols-2 gap-5 border-t border-border pt-5">
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
                  <div className="border-t border-border pt-5">
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
                  <div className="border-t border-border pt-5">
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
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                  <AppButton
                    type="button"
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
                    colorVariant="success"
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
              </AppCard>
            </form>
          </div>

          {/* Right Sidebar Section */}
          <div className="space-y-4">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sideCardSx}
            >
              <div className="px-4 py-3.5 border-b border-border flex items-center gap-1.5">
                <FiInfo className="text-success text-[15px]" />
                <AppHeading level={3} weight={700} sx={sideCardTitleSx}>
                  Help & Tips
                </AppHeading>
              </div>
              <div className="p-4 space-y-4 text-[12px] leading-relaxed">
                <div>
                  <span className="font-bold text-text block mb-1">Cheque Type</span>
                  <span className="text-text-muted">
                    Specify whether the cheque was received from a customer (inward) or issued to a vendor (outward).
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Drawn Date</span>
                  <span className="text-text-muted">
                    The written date on the physical cheque instrument.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Settlement Bank</span>
                  <span className="text-text-muted">
                    The linked company bank registry where this cheque balance settles.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Counterparty Offset</span>
                  <span className="text-text-muted">
                    The target ledger account representing the payer or vendor entity.
                  </span>
                </div>
              </div>
            </AppCard>
          </div>
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

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "23px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};

const formCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const formCardTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const sideCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const sideCardTitleSx = {
  m: 0,
  fontSize: "12.8px",
  color: "var(--app-color-text)",
};

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

export default CreateChequeDesktopPage;
