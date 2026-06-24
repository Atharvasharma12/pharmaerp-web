import React from "react";
import { FiInfo } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSelect,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";

import { BANK_ACCOUNT_TYPE } from "../../constants/bankAccount.constant";

const accountTypeOptions = [
  { label: "Select Account Type", value: "" },
  ...Object.values(BANK_ACCOUNT_TYPE).map((type) => ({
    label: type === "CURRENT" ? "Current Account" : type === "SAVINGS" ? "Savings Account" : type.replace(/_/g, " "),
    value: type,
  })),
];

const CreateBankAccountDesktopPage = ({
  formData,
  formErrors,
  isLoading,
  bankMasterOptions,
  ledgerAccountOptions,
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
          title="Create Bank Account"
          subtitle="Add a new corporate bank account, overdraft, or cash-credit facility."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Bank Accounts", onClick: handleCancel },
                { label: "Create Bank Account", current: true },
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
                        className="text-danger hover:underline font-bold cursor-pointer"
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

                  {/* Row 1: Account Name & Holder Name */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Name</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={(e) => handleFieldChange("accountName", e.target.value)}
                        placeholder="e.g. HDFC Current A/C"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.accountName ? "border-danger" : "border-border"
                        }`}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Name identifier for this ledger
                      </span>
                      {formErrors.accountName && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.accountName}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Holder Name</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={(e) => handleFieldChange("accountHolderName", e.target.value)}
                        placeholder="e.g. MedPlus Pharmacy"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.accountHolderName ? "border-danger" : "border-border"
                        }`}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Registered company or person name
                      </span>
                      {formErrors.accountHolderName && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.accountHolderName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Bank & Account Type */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Bank</label>
                        <span className="text-danger">*</span>
                      </div>
                      <AppSelect
                        name="bankMasterId"
                        value={formData.bankMasterId}
                        onChange={(e) => handleFieldChange("bankMasterId", e.target.value)}
                        options={bankMasterOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Associate with a bank record
                      </span>
                      {formErrors.bankMasterId && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.bankMasterId}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Type</label>
                        <span className="text-danger">*</span>
                      </div>
                      <AppSelect
                        name="accountType"
                        value={formData.accountType}
                        onChange={(e) => handleFieldChange("accountType", e.target.value)}
                        options={accountTypeOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                      />
                      <span className="text-[10px] text-text-muted mt-1 block">
                        Operational category of the bank account
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Account Number & IFSC Code */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Account Number</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
                        placeholder="Enter account number"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.accountNumber ? "border-danger" : "border-border"
                        }`}
                      />
                      {formErrors.accountNumber && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.accountNumber}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">IFSC Code</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={(e) => handleFieldChange("ifscCode", e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001234"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.ifscCode ? "border-danger" : "border-border"
                        }`}
                      />
                      {formErrors.ifscCode && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.ifscCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Branch Name & Registered Mobile */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <label className="text-[12px] font-bold text-text">Branch Name</label>
                        <span className="text-danger">*</span>
                      </div>
                      <input
                        type="text"
                        name="branchName"
                        value={formData.branchName}
                        onChange={(e) => handleFieldChange("branchName", e.target.value)}
                        placeholder="e.g. Koramangala Branch"
                        className={`w-full px-3 py-1.5 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                          formErrors.branchName ? "border-danger" : "border-border"
                        }`}
                      />
                      {formErrors.branchName && (
                        <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                          {formErrors.branchName}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center mb-1.5">
                        <label className="text-[12px] font-bold text-text">Registered Mobile (Optional)</label>
                      </div>
                      <input
                        type="text"
                        name="registeredMobile"
                        value={formData.registeredMobile}
                        onChange={(e) => handleFieldChange("registeredMobile", e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3 py-1.5 text-[12.5px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Row 5: Branch Address (Textarea) */}
                  <div>
                    <div className="flex items-center mb-1.5">
                      <label className="text-[12px] font-bold text-text">Branch Address (Optional)</label>
                    </div>
                    <textarea
                      name="branchAddress"
                      value={formData.branchAddress}
                      onChange={(e) => handleFieldChange("branchAddress", e.target.value)}
                      placeholder="Enter branch physical address"
                      rows={2}
                      className="w-full px-3 py-2 text-[12.5px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    />
                  </div>

                  {/* Row 6: Ledger Account Mapping */}
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <label className="text-[12px] font-bold text-text">Ledger Account mapping (Chart of Accounts)</label>
                      <span className="text-danger">*</span>
                    </div>
                    <AppSelect
                      name="ledgerAccountId"
                      value={formData.ledgerAccountId}
                      onChange={(e) => handleFieldChange("ledgerAccountId", e.target.value)}
                      options={ledgerAccountOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                    />
                    <span className="text-[10px] text-text-muted mt-1 block">
                      Connect this bank account to a ledger account for accounting updates.
                    </span>
                    {formErrors.ledgerAccountId && (
                      <span className="text-[10.5px] text-danger mt-1 block font-semibold">
                        {formErrors.ledgerAccountId}
                      </span>
                    )}
                  </div>

                  {/* Row 7: Primary Configuration Checkbox */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <label className="text-[12px] font-bold text-text">Default Account Options</label>
                    </div>
                    <label className="flex items-center gap-2 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover/10 cursor-pointer transition max-w-sm select-none">
                      <input
                        type="checkbox"
                        name="isPrimary"
                        checked={formData.isPrimary}
                        onChange={(e) => handleFieldChange("isPrimary", e.target.checked)}
                        className="accent-primary h-4 w-4"
                      />
                      <div>
                        <span className="text-[12.5px] font-bold text-text block">Set as Primary Account</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">
                          Use this account as default for all general bank transfers.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Row 8: Status Selection cards */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <label className="text-[12px] font-bold text-text">Status</label>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <label
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition select-none ${
                          formData.isActive === true
                            ? "border-success bg-success-soft/10"
                            : "border-border bg-surface hover:bg-surface-hover/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="isActive"
                          value="true"
                          checked={formData.isActive === true}
                          onChange={() => handleFieldChange("isActive", true)}
                          className="mt-1 accent-success"
                        />
                        <div>
                          <span className="text-[12.5px] font-bold text-text block">Active</span>
                          <span className="text-[10.5px] text-text-muted block mt-0.5">
                            Account is active and ready for ledger posting
                          </span>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition select-none ${
                          formData.isActive === false
                            ? "border-neutral bg-surface-alt/50"
                            : "border-border bg-surface hover:bg-surface-hover/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="isActive"
                          value="false"
                          checked={formData.isActive === false}
                          onChange={() => handleFieldChange("isActive", false)}
                          className="mt-1 accent-neutral"
                        />
                        <div>
                          <span className="text-[12.5px] font-bold text-text block">Inactive</span>
                          <span className="text-[10.5px] text-text-muted block mt-0.5">
                            Account is inactive and disabled
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-5 py-4 border-t border-border flex items-center justify-between bg-[#fdfdfd]">
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
                    Create Bank Account
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
                  <span className="font-bold text-text block mb-1">IFSC Format</span>
                  <span className="text-text-muted">
                    IFSC code consists of 11 characters (e.g. HDFC0001234). First 4 letters are bank code, 5th is zero, and last 6 are branch code.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Primary Account</span>
                  <span className="text-text-muted">
                    Setting an account as Primary makes it the default choice for recording payments and fund transfers.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">Ledger Mapping</span>
                  <span className="text-text-muted">
                    Each bank account must map to a specific bank asset account ledger inside your Chart of Accounts.
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

export default CreateBankAccountDesktopPage;
