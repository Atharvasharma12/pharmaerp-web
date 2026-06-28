import React, { useMemo } from "react";
import {
  FiArrowLeft,
  FiInfo,
} from "react-icons/fi";

import {
  AppBox,
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

const typeOptions = [
  { label: "Cash Deposit", value: "CASH_DEPOSIT" },
  { label: "Cash Withdrawal", value: "CASH_WITHDRAWAL" },
];

const CreateBankSlipDesktopPage = ({
  formData,
  formErrors = {},
  bankAccounts = [],
  isLoading = false,
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  const bankOptions = useMemo(() => {
    return [
      { label: "Select settlement bank...", value: "" },
      ...bankAccounts.map((b) => ({
        label: `${b.bankMasterId?.name || b.accountName || "Bank"} - *${String(b.accountNumber || "").slice(-4)} (${b.accountName || "Primary"})`,
        value: b._id,
      })),
    ];
  }, [bankAccounts]);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Create Bank pay-in Slip"
          subtitle="Record physical cash counter transactions for settlement audits."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Bank Slips", onClick: handleCancel },
                { label: "Create Slip", current: true },
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
          {/* Form Card */}
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
                <div className="px-5 py-4 border-b border-border">
                  <AppHeading level={3} weight={700} sx={formCardTitleSx}>
                    Bank Slip Parameters
                  </AppHeading>
                </div>

                <div className="p-5 space-y-5">
                  {/* Server error if any */}
                  {serverError && (
                    <div className="p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md flex items-center justify-between">
                      <span>{serverError}</span>
                      <button
                        type="button"
                        onClick={clearError}
                        className="text-danger hover:underline font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Submit error */}
                  {formErrors.submit && (
                    <div className="p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-5">
                    {/* Linked Bank Account */}
                    <AppSelect
                      label="Linked Bank Account"
                      name="bankAccountId"
                      value={formData.bankAccountId}
                      onChange={(e) => handleFieldChange("bankAccountId", e.target.value)}
                      options={bankOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      required
                      error={Boolean(formErrors.bankAccountId)}
                      helperText={formErrors.bankAccountId || "Select bank account receiving or dispensing cash"}
                      labelSx={labelSx}
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                    />

                    {/* Slip Type */}
                    <AppSelect
                      label="Transaction Slip Type"
                      name="slipType"
                      value={formData.slipType}
                      onChange={(e) => handleFieldChange("slipType", e.target.value)}
                      options={typeOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      required
                      labelSx={labelSx}
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      helperText="Whether you are depositing cash or withdrawing cash"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Slip Date */}
                    <AppInput
                      type="date"
                      label="Slip Date"
                      name="slipDate"
                      value={formData.slipDate}
                      onChange={(e) => handleFieldChange("slipDate", e.target.value)}
                      required
                      error={Boolean(formErrors.slipDate)}
                      helperText={formErrors.slipDate || "Date printed on the physical bank slip receipt"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    {/* Amount */}
                    <AppInput
                      type="number"
                      step="0.01"
                      label="Amount ($)"
                      name="amount"
                      value={formData.amount}
                      onChange={(e) => handleFieldChange("amount", e.target.value)}
                      placeholder="e.g. 2500"
                      required
                      error={Boolean(formErrors.amount)}
                      helperText={formErrors.amount || "Total currency value of slip"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Reference Number */}
                    <AppInput
                      label="Physical Slip Reference / Receipt No. (Optional)"
                      name="bankSlipReference"
                      value={formData.bankSlipReference}
                      onChange={(e) => handleFieldChange("bankSlipReference", e.target.value)}
                      placeholder="e.g. PY-987654"
                      helperText="The transaction reference printed by the bank counter teller"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  {/* Narration */}
                  <AppInput
                    label="Narration / Purpose (Optional)"
                    name="narration"
                    value={formData.narration}
                    onChange={(e) => handleFieldChange("narration", e.target.value)}
                    placeholder="Describe transaction details (e.g., Weekly cash deposit from cash register counter 1)"
                    multiline
                    rows={3}
                    helperText="Max 500 characters"
                    labelSx={labelSx}
                    inputSx={{ ...inputSx, height: "auto" }}
                  />
                </div>

                {/* Form Footer */}
                <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                  <AppButton
                    type="button"
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    size="small"
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={actionBtnSx}
                  >
                    Cancel
                  </AppButton>

                  <AppButton
                    type="submit"
                    variant="contained"
                    colorVariant="success"
                    rounded="md"
                    size="small"
                    loading={isLoading}
                    disabled={isLoading}
                    sx={actionBtnSx}
                  >
                    Create pay-in Slip
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
                  Help & Info
                </AppHeading>
              </div>
              <div className="p-4 space-y-4 text-[12px] leading-relaxed">
                <div>
                  <span className="font-bold text-text block mb-1">Counter Cash Audit</span>
                  <span className="text-text-muted">
                    Bank pay-in slips allow managers to verify cash register balances against verified bank receipts to prevent cash leakage.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Double-Entry Posting</span>
                  <span className="text-text-muted">
                    Vouchers are automatically posted to respective accounts once a counter slip's status is changed to **CONFIRMED**.
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

const selectFieldSx = {
  width: "100%",
};

const selectInputSx = {
  height: 35,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
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

const labelSx = {
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const inputSx = {
  minHeight: 38,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
};

export default CreateBankSlipDesktopPage;
