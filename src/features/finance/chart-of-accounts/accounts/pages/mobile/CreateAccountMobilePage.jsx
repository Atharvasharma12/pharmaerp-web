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
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

const CreateAccountMobilePage = ({
  formData,
  formErrors,
  isLoading,
  groupOptions,
  categoryOptions,
  balanceTypeOptions,
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
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
                Create Account
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Add a new ledger account
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Content list */}
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
                Ledger Account Details
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

              {/* Account Name */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Account Name</label>
                  <span className="text-danger">*</span>
                </div>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={(e) => handleFieldChange("accountName", e.target.value)}
                  placeholder="Enter account name"
                  className={`w-full px-2.5 py-1.5 text-[12px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                    formErrors.accountName ? "border-danger" : "border-border"
                  }`}
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  e.g., Cash In Hand, Sales Ledger
                </span>
                {formErrors.accountName && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.accountName}
                  </span>
                )}
              </div>

              {/* Account Code */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Account Code</label>
                  <span className="text-danger">*</span>
                </div>
                <input
                  type="text"
                  name="accountCode"
                  value={formData.accountCode}
                  onChange={(e) => handleFieldChange("accountCode", e.target.value)}
                  placeholder="Enter account code"
                  className={`w-full px-2.5 py-1.5 text-[12px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                    formErrors.accountCode ? "border-danger" : "border-border"
                  }`}
                />
                <span className="text-[9.5px] text-text-muted mt-0.5 block">
                  e.g., ACC-001
                </span>
                {formErrors.accountCode && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.accountCode}
                  </span>
                )}
              </div>

              {/* Account Group */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Account Group</label>
                  <span className="text-danger">*</span>
                </div>
                <AppSelect
                  name="accountGroupId"
                  value={formData.accountGroupId}
                  onChange={(e) => handleFieldChange("accountGroupId", e.target.value)}
                  options={groupOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                />
                {formErrors.accountGroupId && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.accountGroupId}
                  </span>
                )}
              </div>


              {/* Account Category */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Account Category</label>
                  <span className="text-danger">*</span>
                </div>
                <AppSelect
                  name="accountCategory"
                  value={formData.accountCategory}
                  onChange={(e) => handleFieldChange("accountCategory", e.target.value)}
                  options={categoryOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                />
                {formErrors.accountCategory && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.accountCategory}
                  </span>
                )}
              </div>

              {/* Opening Balance */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Opening Balance</label>
                </div>
                <input
                  type="number"
                  name="openingBalance"
                  value={formData.openingBalance || ""}
                  onChange={(e) => handleFieldChange("openingBalance", e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-2.5 py-1.5 text-[12px] rounded-md border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary ${
                    formErrors.openingBalance ? "border-danger" : "border-border"
                  }`}
                />
                {formErrors.openingBalance && (
                  <span className="text-[10px] text-danger mt-0.5 block font-semibold">
                    {formErrors.openingBalance}
                  </span>
                )}
              </div>

              {/* Balance Type */}
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  <label className="text-[11.5px] font-bold text-text">Balance Type</label>
                </div>
                <AppSelect
                  name="openingBalanceType"
                  value={formData.openingBalanceType}
                  onChange={(e) => handleFieldChange("openingBalanceType", e.target.value)}
                  options={balanceTypeOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11.5px] font-bold text-text">Description (Optional)</label>
                  <span className="text-[9.5px] text-text-muted font-semibold">
                    {(formData.description || "").length} / 500
                  </span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value.slice(0, 500))}
                  placeholder="Enter description for this account"
                  rows={3}
                  className="w-full px-2.5 py-1.5 text-[12px] rounded-md border border-border bg-surface text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                />
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center gap-0.5 mb-1.5">
                  <label className="text-[11.5px] font-bold text-text">Status</label>
                  <span className="text-danger">*</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      formData.status === "active"
                        ? "border-success bg-success-soft/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={(e) => handleFieldChange("status", e.target.value)}
                      className="mt-0.5 accent-success"
                    />
                    <div>
                      <span className="text-[11.5px] font-bold text-text block">Active</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        Account is active and available for posting
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      formData.status === "inactive"
                        ? "border-neutral bg-surface-alt/50"
                        : "border-border bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === "inactive"}
                      onChange={(e) => handleFieldChange("status", e.target.value)}
                      className="mt-0.5 accent-neutral"
                    />
                    <div>
                      <span className="text-[11.5px] font-bold text-text block">Inactive</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        Account is inactive and disabled
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons block arranged horizontally */}
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
                  {isLoading ? "Saving..." : "Create Account"}
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
                <span className="font-bold text-text block">Account Code</span>
                <span className="text-text-muted mt-0.5 block">
                  Keep account code short, unique and easy to remember.
                </span>
              </div>
              <div>
                <span className="font-bold text-text block">Account Group</span>
                <span className="text-text-muted mt-0.5 block">
                  Select the correct parent group to organize financial ledgers properly.
                </span>
              </div>

              <div>
                <span className="font-bold text-text block">Opening Balance</span>
                <span className="text-text-muted mt-0.5 block">
                  Initial ledger balance at the start of active financial statement period.
                </span>
              </div>
              <div>
                <span className="font-bold text-text block">Status</span>
                <span className="text-text-muted mt-0.5 block">
                  Only active accounts accept transaction postings.
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

export default CreateAccountMobilePage;
