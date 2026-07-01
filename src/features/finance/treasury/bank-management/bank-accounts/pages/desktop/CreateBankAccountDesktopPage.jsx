import React from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";

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

import { BANK_ACCOUNT_TYPE } from "../../constants/bankAccount.constant";

const accountTypeOptions = Object.values(BANK_ACCOUNT_TYPE).map((type) => ({
  label: type === "CURRENT" ? "Current Account" : type === "SAVINGS" ? "Savings Account" : type.replace(/_/g, " "),
  value: type,
}));

const booleanOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const CreateBankAccountDesktopPage = ({
  formData,
  formErrors = {},
  isLoading = false,
  bankOptions = [],
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Add Bank Account"
          subtitle="Register a new corporate bank account and map it to an accounting ledger."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Bank Accounts", onClick: handleCancel },
                { label: "Add Bank Account", current: true },
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
                {/* Section title */}
                <div className="px-5 py-4 border-b border-border">
                  <AppHeading level={3} weight={700} sx={formCardTitleSx}>
                    Bank Account Details
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

                  {/* Submit error if any */}
                  {formErrors.submit && (
                    <div className="p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Bank Master & Account Name Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <AppSelect
                      label="Select Bank"
                      name="bankMasterId"
                      value={formData.bankMasterId}
                      onChange={(e) => handleFieldChange("bankMasterId", e.target.value)}
                      options={bankOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      required
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      error={Boolean(formErrors.bankMasterId)}
                      helperText={formErrors.bankMasterId || "Select the bank from Bank Master list"}
                      labelSx={labelSx}
                    />

                    <AppInput
                      label="Account Nickname / Name"
                      name="accountName"
                      value={formData.accountName}
                      onChange={(e) => handleFieldChange("accountName", e.target.value)}
                      placeholder="e.g. HDFC Current A/c"
                      required
                      error={Boolean(formErrors.accountName)}
                      helperText={formErrors.accountName || "How you identify this account in the system"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  {/* Account Holder Name & Account Number Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <AppInput
                      label="Account Holder Name"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={(e) => handleFieldChange("accountHolderName", e.target.value)}
                      placeholder="Enter account holder name"
                      required
                      error={Boolean(formErrors.accountHolderName)}
                      helperText={formErrors.accountHolderName || "Name registered with the bank"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    <AppInput
                      label="Account Number"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
                      placeholder="Enter bank account number"
                      required
                      error={Boolean(formErrors.accountNumber)}
                      helperText={formErrors.accountNumber || "Must be unique for this company"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  {/* IFSC Code & Branch Name Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <AppInput
                      label="IFSC Code"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) => handleFieldChange("ifscCode", e.target.value.toUpperCase())}
                      placeholder="e.g. HDFC0001234"
                      required
                      error={Boolean(formErrors.ifscCode)}
                      helperText={formErrors.ifscCode || "11 character alphanumeric code"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    <AppInput
                      label="Branch Name"
                      name="branchName"
                      value={formData.branchName}
                      onChange={(e) => handleFieldChange("branchName", e.target.value)}
                      placeholder="Enter branch name"
                      required
                      error={Boolean(formErrors.branchName)}
                      helperText={formErrors.branchName || "e.g. Connaught Place Branch"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  {/* Account Type & Registered Mobile Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <AppSelect
                      label="Account Type"
                      name="accountType"
                      value={formData.accountType}
                      onChange={(e) => handleFieldChange("accountType", e.target.value)}
                      options={accountTypeOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      required
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      labelSx={labelSx}
                    />

                    <AppInput
                      label="Registered Mobile (Optional)"
                      name="registeredMobile"
                      value={formData.registeredMobile}
                      onChange={(e) => handleFieldChange("registeredMobile", e.target.value)}
                      placeholder="Enter mobile number"
                      helperText="Linked mobile number"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  {/* Branch Address field */}
                  <AppInput
                    label="Branch Address (Optional)"
                    name="branchAddress"
                    value={formData.branchAddress}
                    onChange={(e) => handleFieldChange("branchAddress", e.target.value.slice(0, 500))}
                    placeholder="Enter bank branch street address"
                    multiline
                    rows={2}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  {/* Opening Balance & Opening Balance Type Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <AppInput
                      label="Opening Balance"
                      name="openingBalance"
                      type="number"
                      value={formData.openingBalance}
                      onChange={(e) => handleFieldChange("openingBalance", e.target.value)}
                      placeholder="Enter opening balance amount"
                      error={Boolean(formErrors.openingBalance)}
                      helperText={formErrors.openingBalance || "Initial ledger balance"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    <AppSelect
                      label="Opening Balance Type"
                      name="openingBalanceType"
                      value={formData.openingBalanceType || "dr"}
                      onChange={(e) => handleFieldChange("openingBalanceType", e.target.value)}
                      options={[
                        { label: "Debit (Dr)", value: "dr" },
                        { label: "Credit (Cr)", value: "cr" },
                      ]}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      labelSx={labelSx}
                    />
                  </div>

                  {/* Primary & Active Flags Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <AppSelect
                      label="Primary Account"
                      name="isPrimary"
                      value={formData.isPrimary ? "true" : "false"}
                      onChange={(e) => handleFieldChange("isPrimary", e.target.value === "true")}
                      options={booleanOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      helperText="Makes this the default corporate account"
                      labelSx={labelSx}
                    />

                    <AppSelect
                      label="Active Status"
                      name="isActive"
                      value={formData.isActive ? "true" : "false"}
                      onChange={(e) => handleFieldChange("isActive", e.target.value === "true")}
                      options={booleanOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      helperText="Toggle to enable/disable bank transactions"
                      labelSx={labelSx}
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
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
                    Create Account
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
                  <span className="font-bold text-text block mb-1">Bank Master</span>
                  <span className="text-text-muted">
                    Display and choose standard registered bank assets from the global catalog directory.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Auto-Created Ledger</span>
                  <span className="text-text-muted">
                    The system will automatically create and configure a corresponding ledger account under Assets &rarr; Bank Accounts.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">IFSC Code</span>
                  <span className="text-text-muted">
                    Required for validation. Format: 4 alpha characters, a zero, and 6 alphanumeric digits.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Primary Flag</span>
                  <span className="text-text-muted">
                    Setting as Primary auto-clears any existing primary flags on other company accounts.
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

export default CreateBankAccountDesktopPage;