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

const booleanOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const CreateCashAccountMobilePage = ({
  formData,
  formErrors = {},
  denominations = [],
  physicalTotal = 0,
  isLoading = false,
  branchOptions = [],
  handleFieldChange,
  handleQtyChange,
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
                Create Cash Account
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Register a new cash register or till
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
              {/* Server error */}
              {serverError && (
                <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex items-center justify-between">
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

              {/* Submit errors */}
              {formErrors.submit && (
                <div className="p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md">
                  {formErrors.submit}
                </div>
              )}

              {/* Account Name */}
              <AppInput
                label="Cash Account Name"
                name="accountName"
                value={formData.accountName}
                onChange={(e) => handleFieldChange("accountName", e.target.value)}
                placeholder="e.g. Front Office Cash Till"
                required
                error={Boolean(formErrors.accountName)}
                helperText={formErrors.accountName}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Opening Balance */}
              <AppInput
                label="Opening Balance (₹)"
                name="openingBalance"
                type="number"
                value={formData.openingBalance}
                onChange={(e) => handleFieldChange("openingBalance", Number(e.target.value))}
                placeholder="0.00"
                error={Boolean(formErrors.openingBalance)}
                helperText={formErrors.openingBalance}
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

              {/* Branch selection */}
              <AppSelect
                label="Linked Branch (Optional)"
                name="branchId"
                value={formData.branchId || ""}
                onChange={(e) => handleFieldChange("branchId", e.target.value)}
                options={branchOptions}
                size="small"
                variant="bordered"
                rounded="md"
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Denomination breakdown sheet (Optional for opening balance) */}
              {Number(formData.openingBalance) > 0 && (
                <div className="border border-border rounded-md overflow-hidden bg-surface-alt/5 text-[11.5px] mt-2">
                  <div className="px-3 py-2 border-b border-border bg-surface-alt/10 flex flex-col gap-1">
                    <span className="font-bold text-text">
                      Opening Balance Denominations (Optional)
                    </span>
                    {formErrors.denominations && (
                      <span className="text-[11px] text-danger font-semibold">
                        {formErrors.denominations}
                      </span>
                    )}
                  </div>
                  <div className="p-2 space-y-2">
                    {denominations.map((d) => {
                      const subTotal = d.denomination * d.quantity;
                      return (
                        <div key={d.denomination} className="flex items-center justify-between py-1 border-b border-border/40 last:border-b-0">
                          <span className="font-bold text-text font-mono w-[60px]">
                            ₹ {d.denomination}
                          </span>
                          <span className="text-text-muted font-mono">
                            ×
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={d.quantity || ""}
                            onChange={(e) => handleQtyChange(d.denomination, e.target.value)}
                            placeholder="0"
                            className="w-[70px] px-1.5 py-0.5 border border-border rounded bg-surface text-text font-bold font-mono text-center focus:outline-none focus:border-primary"
                          />
                          <span className="font-extrabold text-text font-mono w-[100px] text-right">
                            ₹ {subTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                    <div className="bg-surface-alt/10 p-2 rounded flex justify-between items-center font-bold text-text mt-2">
                      <span>Total Value:</span>
                      <span className="font-black font-mono text-[13px]">
                        ₹ {physicalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <AppInput
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value.slice(0, 500))}
                placeholder="Brief purpose"
                multiline
                rows={2}
                labelSx={labelSx}
                inputSx={inputSx}
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
                  {isLoading ? "Creating..." : "Create Account"}
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
                <span className="font-bold text-text block">Ledger Auto-creation</span>
                <span className="text-text-muted mt-0.5 block">
                  The system will automatically set up a matching Cash Account ledger under your Asset chart of accounts.
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
  fontSize: "11.5px",
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

export default CreateCashAccountMobilePage;
