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

const providerOptions = [
  { label: "Other / Generic", value: "OTHER" },
  { label: "Google Pay", value: "GPAY" },
  { label: "PhonePe", value: "PHONEPE" },
  { label: "Paytm", value: "PAYTM" },
  { label: "BHIM UPI", value: "BHIM" },
  { label: "Razorpay", value: "RAZORPAY" },
  { label: "Cashfree", value: "CASHFREE" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const EditPaymentQrMobilePage = ({
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
          Loading Payment QR details...
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
                Edit Payment QR
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Modify payment receiver QR code details
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
                QR details
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

              {/* Linked Settlement Bank (Disabled) */}
              <AppInput
                label="Linked bank account"
                name="bankName"
                value={formData.bankName}
                disabled
                helperText="Settlement account is locked"
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* UPI ID Address (Disabled) */}
              <AppInput
                label="UPI ID Address"
                name="upiId"
                value={formData.upiId}
                disabled
                helperText="UPI ID address is locked"
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Custom Label */}
              <AppInput
                label="Label (Nickname)"
                name="label"
                value={formData.label}
                onChange={(e) => handleFieldChange("label", e.target.value)}
                placeholder="e.g. Main Counter QR"
                error={Boolean(formErrors.label)}
                helperText={formErrors.label}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Provider */}
              <AppSelect
                label="Provider"
                name="provider"
                value={formData.provider}
                onChange={(e) => handleFieldChange("provider", e.target.value)}
                options={providerOptions}
                size="small"
                variant="bordered"
                rounded="md"
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* QR Image URL */}
              <AppInput
                label="QR Image URL (Optional)"
                name="qrImageUrl"
                value={formData.qrImageUrl}
                onChange={(e) => handleFieldChange("qrImageUrl", e.target.value)}
                placeholder="e.g. https://domain.com/assets/qr.png"
                error={Boolean(formErrors.qrImageUrl)}
                helperText={formErrors.qrImageUrl}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Status */}
              <AppSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                options={statusOptions}
                size="small"
                variant="bordered"
                rounded="md"
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Primary Flag */}
              <AppSelect
                label="Primary QR Code"
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
                <span className="font-bold text-text block">Locked Parameters</span>
                <span className="text-text-muted mt-0.5 block">
                  For ledger settlement integrity, you cannot modify the bank account or the UPI VPA address of this QR register.
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

export default EditPaymentQrMobilePage;
