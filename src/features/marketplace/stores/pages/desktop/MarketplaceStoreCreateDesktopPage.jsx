// src/features/marketplace/stores/pages/desktop/MarketplaceStoreCreateDesktopPage.jsx

import React from "react";
import {
  FiArrowLeft,
  FiSave,
  FiShoppingBag,
  FiMapPin,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSelect,
  AppStack,
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
} from "@/components";

// Predefined style maps matching CreateBranchDesktopPage.jsx exactly
const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const primaryButtonSx = {
  height: 36,
  minWidth: 124,
  px: 1.7,
  fontSize: "12px",
  fontWeight: 700,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.3,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.7,
  fontSize: "12.5px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const formLabelSx = {
  display: "block",
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
  mb: 1,
};

const guideTitleSx = {
  m: 0,
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const formMainCardSx = {
  p: 2.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const MarketplaceStoreCreateDesktopPage = ({
  formData,
  errors = {},
  branchOptions = [],
  isLoadingBranches = false,
  isSubmitting = false,
  message,
  error,
  handleBranchSelect,
  handleSubmit,
  handleCancel,
  clearMessage,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <PageHeader
          title="Create Marketplace Store"
          subtitle="Link an existing physical branch location to launch its online digital storefront."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Stores", onClick: handleCancel },
                { label: "Create Store", current: true },
              ]}
            />
          }
          actions={
            <AppStack direction="row" align="center" justify="flex-end" gap={1.1}>
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiArrowLeft />}
                onClick={handleCancel}
                sx={secondaryButtonSx}
              >
                Back
              </AppButton>

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiSave />}
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || !formData.branchId}
                sx={primaryButtonSx}
              >
                {isSubmitting ? "Creating..." : "Save Store"}
              </AppButton>
            </AppStack>
          }
        />

        {message && (
          <AppAlert severity="success" variant="filled" closable onClose={clearMessage} className="mt-3">
            {message}
          </AppAlert>
        )}

        {error && (
          <AppAlert severity="error" variant="soft" className="mt-3">
            {error}
          </AppAlert>
        )}

        {/* Main Grid Layout */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] items-start gap-5">
          {/* Form Content Left Column */}
          <AppBox component="form" onSubmit={handleSubmit}>
            <AppCard bordered shadow="sm" rounded="lg" sx={formMainCardSx} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <IconBox icon={<FiMapPin />} colorVariant="primary" small />
                <div>
                  <AppHeading level={2} sx={sectionTitleSx}>
                    Branch Location
                  </AppHeading>
                  <AppText sx={sectionSubtitleSx}>
                    Select the physical branch location to enable online marketplace presence.
                  </AppText>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <AppText sx={formLabelSx}>
                    Branch Location *
                  </AppText>
                  <AppSelect
                    value={formData.branchId || ""}
                    onChange={(e) => handleBranchSelect(e.target.value)}
                    options={[
                      { label: "-- Select Branch Location --", value: "" },
                      ...branchOptions,
                    ]}
                    error={Boolean(errors.branchId)}
                    helperText={errors.branchId}
                    disabled={isLoadingBranches}
                    size="small"
                    variant="bordered"
                    rounded="md"
                    className="w-full"
                  />
                </div>

                {formData.storeName ? (
                  <div className="flex items-center justify-between p-3 bg-surface-alt border border-border rounded-lg text-xs mt-2">
                    <div className="flex items-center gap-2">
                      <FiShoppingBag className="text-primary text-base" />
                      <span className="text-text-muted font-medium">Online Storefront Name:</span>
                      <span className="font-bold text-text">{formData.storeName}</span>
                    </div>
                    <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                      Ready to Link
                    </span>
                  </div>
                ) : null}
              </div>
            </AppCard>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-end gap-3 mt-5">
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                onClick={handleCancel}
                sx={secondaryButtonSx}
              >
                Cancel
              </AppButton>
              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                startIcon={<FiSave />}
                loading={isSubmitting}
                disabled={isSubmitting || !formData.branchId}
                sx={primaryButtonSx}
              >
                {isSubmitting ? "Creating Store..." : "Save Store"}
              </AppButton>
            </div>
          </AppBox>

          {/* Right Sidebar - Replicated style cards */}
          <div className="space-y-4">
            <AppCard bordered shadow="sm" rounded="lg" sx={{ p: 2.5, spaceY: 3 }}>
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <FiInfo className="text-primary text-base" />
                <AppHeading level={3} sx={guideTitleSx}>
                  Store Setup Guidelines
                </AppHeading>
              </div>

              <div className="space-y-2.5 text-[11.5px] text-text-muted leading-relaxed pt-1">
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="text-success text-[13px] shrink-0 mt-0.5" />
                  <span>Each marketplace store represents the online digital storefront of a physical branch.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="text-success text-[13px] shrink-0 mt-0.5" />
                  <span>Only one active online store can be created per physical branch location.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="text-success text-[13px] shrink-0 mt-0.5" />
                  <span>Newly created stores undergo brief platform review before receiving live online orders.</span>
                </div>
              </div>
            </AppCard>

            <PageRightSidebar cards={[HELP_SUPPORT_CARD]} />
          </div>
        </div>
      </div>
    </section>
  );
};

// Icon box component helper matching list page
const IconBox = ({ icon, colorVariant = "primary", small = false }) => (
  <AppBox
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: small ? 32 : 40,
      height: small ? 32 : 40,
      borderRadius: small ? "8px" : "10px",
      bgcolor: `var(--app-color-${colorVariant}-soft)`,
      color: `var(--app-color-${colorVariant})`,
      fontSize: small ? "15px" : "22px",
    }}
  >
    {icon}
  </AppBox>
);

export default MarketplaceStoreCreateDesktopPage;
