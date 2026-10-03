import React from "react";
import {
  FiArrowLeft,
  FiInfo,
} from "react-icons/fi";

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

import { BANK_ACCOUNT_TYPE } from "../../constants/bankAccount.constant";

const accountTypeOptions = Object.values(BANK_ACCOUNT_TYPE).map((type) => ({
  label: type === "CURRENT" ? "Current Account" : type === "SAVINGS" ? "Savings Account" : type.replace(/_/g, " "),
  value: type,
}));

const booleanOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const EditBankAccountMobilePage = ({
  formData,
  formErrors = {},
  isLoading = false,
  isFetching = false,
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  if (isFetching) {
    return (
      <section className="w-full bg-bg py-8 flex items-center justify-center">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Loading bank details...
        </AppText>
      </section>
    );
  }

  return (
    <section className="w-full bg-bg pb-6">
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
                Edit Bank Account
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Modify corporate account details
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Content stack */}
        <div className="px-2 space-y-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Account details
              </AppHeading>
            </div>

            <form onSubmit={handleSubmit} className="p-3.5 space-y-4">
              {/* Server error if any */}
              {serverError && (
                <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex items-center justify-between">
                  <span>{serverError}</span>
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-danger hover:underline font-bold"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* Submit errors */}
              {formErrors.submit && (
                <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md">
                  {formErrors.submit}
                </div>
              )}

              {/* Bank Master Selection (Disabled) */}
              <AppInput
                label="Selected Bank"
                name="bankMasterName"
                value={formData.bankMasterName}
                disabled
                helperText="Bank name cannot be changed"
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Account Nickname */}
              <AppInput
                label="Account Nickname"
                name="accountName"
                value={formData.accountName}
                onChange={(e) => handleFieldChange("accountName", e.target.value)}
                placeholder="e.g. HDFC Current Account"
                required
                error={Boolean(formErrors.accountName)}
                helperText={formErrors.accountName}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Account Holder Name */}
              <AppInput
                label="Account Holder Name"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={(e) => handleFieldChange("accountHolderName", e.target.value)}
                placeholder="Enter registered name"
                required
                error={Boolean(formErrors.accountHolderName)}
                helperText={formErrors.accountHolderName}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Account Number (Disabled) */}
              <AppInput
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                disabled
                helperText="Account number cannot be changed"
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* IFSC Code */}
              <AppInput
                label="IFSC Code"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={(e) => handleFieldChange("ifscCode", e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001234"
                required
                error={Boolean(formErrors.ifscCode)}
                helperText={formErrors.ifscCode}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Branch Name */}
              <AppInput
                label="Branch Name"
                name="branchName"
                value={formData.branchName}
                onChange={(e) => handleFieldChange("branchName", e.target.value)}
                placeholder="Enter branch name"
                required
                error={Boolean(formErrors.branchName)}
                helperText={formErrors.branchName}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Account Type */}
              <AppSelect
                label="Account Type"
                name="accountType"
                value={formData.accountType}
                onChange={(e) => handleFieldChange("accountType", e.target.value)}
                options={accountTypeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                required
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Registered Mobile */}
              <AppInput
                label="Registered Mobile (Optional)"
                name="registeredMobile"
                value={formData.registeredMobile || ""}
                onChange={(e) => handleFieldChange("registeredMobile", e.target.value)}
                placeholder="Linked phone number"
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Branch Address */}
              <AppInput
                label="Branch Address (Optional)"
                name="branchAddress"
                value={formData.branchAddress || ""}
                onChange={(e) => handleFieldChange("branchAddress", e.target.value.slice(0, 500))}
                placeholder="Street details"
                multiline
                rows={2}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Primary Flag */}
              <AppSelect
                label="Primary Account"
                name="isPrimary"
                value={formData.isPrimary ? "true" : "false"}
                onChange={(e) => handleFieldChange("isPrimary", e.target.value === "true")}
                options={booleanOptions}
                size="small"
                variant="bordered"
                rounded="md"
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Active Flag */}
              <AppSelect
                label="Active Status"
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={(e) => handleFieldChange("isActive", e.target.value === "true")}
                options={booleanOptions}
                size="small"
                variant="bordered"
                rounded="md"
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2 w-full">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 py-2 text-[12px] font-bold border border-border bg-surface hover:bg-surface-hover/20 transition rounded-md text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 text-[12px] font-bold bg-success hover:bg-success/90 transition text-surface rounded-md"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </AppCard>

          {/* Help Tips */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-3.5 border-b border-border flex items-center gap-1.5">
              <FiInfo className="text-success text-[14px]" />
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Help & Tips
              </AppHeading>
            </div>
            <div className="p-3.5 space-y-3.5 text-[11px] leading-relaxed">
              <div>
                <span className="font-bold text-text block">Locked Fields</span>
                <span className="text-text-muted mt-0.5 block">
                  You cannot modify the bank or the account number because of accounting transaction records.
                </span>
              </div>
              <div>
                <span className="font-bold text-text block">IFSC Code</span>
                <span className="text-text-muted mt-0.5 block">
                  Alpha-numeric code used for bank-to-bank validations.
                </span>
              </div>
            </div>
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

const cardTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11px",
  bgcolor: "var(--app-color-surface)",
};

const labelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};

const inputSx = {
  minHeight: 35,
  fontSize: "12.0px",
  bgcolor: "var(--app-color-surface)",
};

export default EditBankAccountMobilePage;
