import React from "react";
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

const EditPaymentQrDesktopPage = ({
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
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5 flex items-center justify-center">
        <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}>
          Loading Payment QR details...
        </AppText>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Edit UPI QR Register"
          subtitle="Update parameters, QR image references, or toggle receiver status."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Payment QRs", onClick: handleCancel },
                { label: "Edit Payment QR", current: true },
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
                    Edit Details: {formData.label || formData.upiId}
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
                    {/* Linked Bank Account (Disabled) */}
                    <AppInput
                      label="Linked settlement bank account"
                      name="bankName"
                      value={formData.bankName}
                      disabled
                      helperText="The settlement bank account cannot be changed after QR registration"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    {/* UPI ID Address (Disabled) */}
                    <AppInput
                      label="UPI ID / Address"
                      name="upiId"
                      value={formData.upiId}
                      disabled
                      helperText="The UPI VPA address is locked after registration"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Label */}
                    <AppInput
                      label="Custom Label / Nickname"
                      name="label"
                      value={formData.label}
                      onChange={(e) => handleFieldChange("label", e.target.value)}
                      placeholder="e.g. Main Counter QR"
                      error={Boolean(formErrors.label)}
                      helperText={formErrors.label || "Nickname to recognize this QR code"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    {/* Provider */}
                    <AppSelect
                      label="UPI QR Provider"
                      name="provider"
                      value={formData.provider}
                      onChange={(e) => handleFieldChange("provider", e.target.value)}
                      options={providerOptions}
                      size="medium"
                      variant="bordered"
                      rounded="md"
                      sx={selectFieldSx}
                      inputSx={selectInputSx}
                      helperText="Payment service logo displayed next to the register"
                      labelSx={labelSx}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* QR Image URL */}
                    <AppInput
                      label="QR Code Image URL (Optional)"
                      name="qrImageUrl"
                      value={formData.qrImageUrl}
                      onChange={(e) => handleFieldChange("qrImageUrl", e.target.value)}
                      placeholder="e.g. https://domain.com/assets/qr.png"
                      error={Boolean(formErrors.qrImageUrl)}
                      helperText={formErrors.qrImageUrl || "URL pointing to the static QR image code"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Status */}
                      <AppSelect
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={(e) => handleFieldChange("status", e.target.value)}
                        options={statusOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                        helperText="Toggle to enable/disable QR payments"
                        labelSx={labelSx}
                      />

                      {/* Primary QR */}
                      <AppSelect
                        label="Primary QR Code"
                        name="isPrimary"
                        value={formData.isPrimary ? "true" : "false"}
                        onChange={(e) => handleFieldChange("isPrimary", e.target.value === "true")}
                        options={booleanOptions}
                        size="medium"
                        variant="bordered"
                        rounded="md"
                        sx={selectFieldSx}
                        inputSx={selectInputSx}
                        helperText="Default UPI QR code on checkout screens"
                        labelSx={labelSx}
                      />
                    </div>
                  </div>
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
                    Save Changes
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
                  <span className="font-bold text-text block mb-1">Locked Settlement</span>
                  <span className="text-text-muted">
                    To prevent settlement mismatch history, you cannot edit the mapped bank account or the UPI VPA address.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-text block mb-1">QR Image Link</span>
                  <span className="text-text-muted">
                    Ensure the QR image link is accessible. You can host your QR code on a secure cloud storage bucket and paste the link here.
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

export default EditPaymentQrDesktopPage;
