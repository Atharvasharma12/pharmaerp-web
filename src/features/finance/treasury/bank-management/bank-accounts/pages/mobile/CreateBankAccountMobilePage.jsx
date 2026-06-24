import React from "react";
import { FiChevronLeft } from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

import { BANK_ACCOUNT_TYPE } from "../../constants/bankAccount.constant";

const accountTypeOptions = [
  { label: "Select Account Type", value: "" },
  ...Object.values(BANK_ACCOUNT_TYPE).map((type) => ({
    label: type === "CURRENT" ? "Current Account" : type === "SAVINGS" ? "Savings Account" : type,
    value: type,
  })),
];

const CreateBankAccountMobilePage = ({
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
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Back and Title Bar */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1}>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 rounded-md border border-border bg-surface text-text-muted hover:text-text cursor-pointer"
            >
              <FiChevronLeft className="text-[18px]" />
            </button>
            <AppBox>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Create Bank Account
              </AppHeading>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="mt-3 px-3.5 pb-8 space-y-4">
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

          {/* Account Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[12px] font-bold text-text">Account Name</label>
              <span className="text-danger">*</span>
            </div>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={(e) => handleFieldChange("accountName", e.target.value)}
              placeholder="e.g. HDFC Current A/C"
              className={`w-full px-3 py-2 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none ${
                formErrors.accountName ? "border-danger" : "border-border"
              }`}
            />
            {formErrors.accountName && (
              <span className="text-[10.5px] text-danger font-semibold">{formErrors.accountName}</span>
            )}
          </div>

          {/* Account Holder Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[12px] font-bold text-text">Account Holder Name</label>
              <span className="text-danger">*</span>
            </div>
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={(e) => handleFieldChange("accountHolderName", e.target.value)}
              placeholder="e.g. MedPlus Pharmacy"
              className={`w-full px-3 py-2 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none ${
                formErrors.accountHolderName ? "border-danger" : "border-border"
              }`}
            />
            {formErrors.accountHolderName && (
              <span className="text-[10.5px] text-danger font-semibold">{formErrors.accountHolderName}</span>
            )}
          </div>

          {/* Bank */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
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
            {formErrors.bankMasterId && (
              <span className="text-[10.5px] text-danger font-semibold">{formErrors.bankMasterId}</span>
            )}
          </div>

          {/* Account Type */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
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
          </div>

          {/* Account Number */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[12px] font-bold text-text">Account Number</label>
              <span className="text-danger">*</span>
            </div>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
              placeholder="Enter bank account number"
              className={`w-full px-3 py-2 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none ${
                formErrors.accountNumber ? "border-danger" : "border-border"
              }`}
            />
            {formErrors.accountNumber && (
              <span className="text-[10.5px] text-danger font-semibold">{formErrors.accountNumber}</span>
            )}
          </div>

          {/* IFSC Code */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[12px] font-bold text-text">IFSC Code</label>
              <span className="text-danger">*</span>
            </div>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={(e) => handleFieldChange("ifscCode", e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              className={`w-full px-3 py-2 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none ${
                formErrors.ifscCode ? "border-danger" : "border-border"
              }`}
            />
            {formErrors.ifscCode && (
              <span className="text-[10.5px] text-danger font-semibold">{formErrors.ifscCode}</span>
            )}
          </div>

          {/* Branch Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[12px] font-bold text-text">Branch Name</label>
              <span className="text-danger">*</span>
            </div>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={(e) => handleFieldChange("branchName", e.target.value)}
              placeholder="e.g. Koramangala Branch"
              className={`w-full px-3 py-2 text-[12.5px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none ${
                formErrors.branchName ? "border-danger" : "border-border"
              }`}
            />
            {formErrors.branchName && (
              <span className="text-[10.5px] text-danger font-semibold">{formErrors.branchName}</span>
            )}
          </div>

          {/* Registered Mobile */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-text">Registered Mobile (Optional)</label>
            <input
              type="text"
              name="registeredMobile"
              value={formData.registeredMobile}
              onChange={(e) => handleFieldChange("registeredMobile", e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="w-full px-3 py-2 text-[12.5px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none"
            />
          </div>

          {/* Branch Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-text">Branch Address (Optional)</label>
            <textarea
              name="branchAddress"
              value={formData.branchAddress}
              onChange={(e) => handleFieldChange("branchAddress", e.target.value)}
              placeholder="Enter branch address"
              rows={2}
              className="w-full px-3 py-2 text-[12.5px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none resize-none"
            />
          </div>

          {/* Ledger Account Mapping */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[12px] font-bold text-text">Ledger Account mapping</label>
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
            {formErrors.ledgerAccountId && (
              <span className="text-[10.5px] text-danger font-semibold">{formErrors.ledgerAccountId}</span>
            )}
          </div>

          {/* Options */}
          <div className="py-2 space-y-3">
            <label className="flex items-center gap-2.5 select-none">
              <input
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={(e) => handleFieldChange("isPrimary", e.target.checked)}
                className="accent-primary h-4.5 w-4.5"
              />
              <div>
                <span className="text-[12.5px] font-bold text-text block">Set as Primary Account</span>
              </div>
            </label>

            <div className="border-t border-border pt-3">
              <span className="text-[12px] font-bold text-text block mb-2">Status</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 select-none">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    checked={formData.isActive === true}
                    onChange={() => handleFieldChange("isActive", true)}
                    className="accent-success h-4 w-4"
                  />
                  <span className="text-[12.5px] font-bold text-text">Active</span>
                </label>
                <label className="flex items-center gap-2 select-none">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    checked={formData.isActive === false}
                    onChange={() => handleFieldChange("isActive", false)}
                    className="accent-neutral h-4 w-4"
                  />
                  <span className="text-[12.5px] font-bold text-text">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="large"
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
              size="large"
              loading={isLoading}
              disabled={isLoading}
              sx={actionBtnSx}
            >
              Create Account
            </AppButton>
          </div>
        </form>
      </AppBox>
    </section>
  );
};

const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 3.5,
  borderBottom: "1px solid var(--app-color-border)",
};

const pageTitleSx = {
  m: 0,
  fontSize: "18px",
  color: "var(--app-color-text)",
  letterSpacing: "-0.3px",
};

const selectFieldSx = {
  width: "100%",
};

const selectInputSx = {
  height: 40,
  fontSize: "13px",
  bgcolor: "var(--app-color-surface)",
};

const actionBtnSx = {
  flex: 1,
  height: 40,
  fontSize: "12.5px",
  fontWeight: 600,
};

export default CreateBankAccountMobilePage;
