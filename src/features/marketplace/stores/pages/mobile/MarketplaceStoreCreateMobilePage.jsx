// src/features/marketplace/stores/pages/mobile/MarketplaceStoreCreateMobilePage.jsx

import React from "react";
import { FiArrowLeft, FiSave, FiMapPin, FiShoppingBag } from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

const MarketplaceStoreCreateMobilePage = ({
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
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Mobile Top Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <div className="flex items-center gap-1 min-w-0">
              <AppButton
                variant="ghost"
                size="small"
                onClick={handleCancel}
                startIcon={<FiArrowLeft />}
                sx={actionButtonLeftSx}
              >
                Back
              </AppButton>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Create Store
              </AppHeading>
            </div>

            <AppButton
              size="small"
              variant="contained"
              colorVariant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.branchId}
              loading={isSubmitting}
              startIcon={<FiSave />}
              sx={actionButtonRightSx}
            >
              Save
            </AppButton>
          </AppStack>
        </AppBox>

        {/* Notifications */}
        {message && (
          <AppAlert severity="success" closable onClose={clearMessage} className="mx-2 mb-2">
            {message}
          </AppAlert>
        )}

        {error && (
          <AppAlert severity="error" className="mx-2 mb-2">
            {error}
          </AppAlert>
        )}

        <form onSubmit={handleSubmit} className="px-2 space-y-4">
          {/* Branch Selection Card */}
          <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={formCardContainerSx}>
            <div className="flex items-center gap-2.5 border-b border-divider pb-2.5">
              <IconBox icon={<FiMapPin />} colorVariant="primary" small />
              <div className="min-w-0">
                <AppHeading level={2} weight={700} sx={formCardSectionHeaderSx}>
                  Branch Location
                </AppHeading>
                <AppText variant="body2" sx={formCardSectionDescSx}>
                  Select the physical branch location to enable online marketplace presence.
                </AppText>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <div>
                <AppText sx={mobileLabelSx}>
                  Select Branch Location *
                </AppText>
                <AppSelect
                  value={formData.branchId || ""}
                  onChange={(e) => handleBranchSelect(e.target.value)}
                  options={[
                    { label: "-- Select Branch --", value: "" },
                    ...branchOptions,
                  ]}
                  error={Boolean(errors.branchId)}
                  helperText={errors.branchId}
                  disabled={isLoadingBranches}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  className="w-full"
                  inputSx={mobileInputSx}
                />
              </div>

              {formData.storeName ? (
                <div className="flex flex-col gap-1.5 p-3 bg-surface-alt border border-border rounded-lg text-xs">
                  <div className="flex items-center gap-1.5">
                    <FiShoppingBag className="text-primary text-sm shrink-0" />
                    <span className="text-text-muted font-medium">Online Storefront Name:</span>
                  </div>
                  <span className="font-bold text-text text-[12.2px] truncate">{formData.storeName}</span>
                  <div className="mt-0.5">
                    <span className="text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full inline-block">
                      Ready to Link
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </AppCard>

          {/* Bottom Actions Sticky-Style Bar */}
          <AppStack direction="row" gap={1.2} sx={bottomStickyActionBarSx}>
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              onClick={handleCancel}
              sx={actionButtonCancelSx}
            >
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              variant="contained"
              colorVariant="primary"
              disabled={isSubmitting || !formData.branchId}
              loading={isSubmitting}
              startIcon={<FiSave />}
              sx={actionButtonContinueSx}
            >
              Create Store
            </AppButton>
          </AppStack>
        </form>
      </AppBox>
    </section>
  );
};

// Icon box component helper matching branch style
const IconBox = ({ icon, colorVariant = "primary", small = false }) => (
  <AppBox
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: small ? 28 : 36,
      height: small ? 28 : 36,
      borderRadius: small ? "6px" : "8px",
      bgcolor: `var(--app-color-${colorVariant}-soft)`,
      color: `var(--app-color-${colorVariant})`,
      fontSize: small ? "14px" : "18px",
    }}
  >
    {icon}
  </AppBox>
);

/* Style Tokens Configuration Dictionary matching CreateBranchMobilePage.jsx */
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
  pb: 1.25,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "20px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const formCardContainerSx = {
  p: 1.4,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
};

const formCardSectionHeaderSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-text)",
};

const formCardSectionDescSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const mobileLabelSx = {
  mb: 0.45,
  fontSize: "11.8px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const mobileInputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
  "& input::placeholder": {
    fontSize: "12px",
  },
};

const bottomStickyActionBarSx = {
  mt: 2.2,
  mb: 1.5,
  width: "100%",
};

const actionButtonCancelSx = {
  height: 40,
  flex: 0.3,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonContinueSx = {
  height: 40,
  flex: 0.7,
  fontSize: "12px",
  fontWeight: 750,
  boxShadow: "none",
};

const actionButtonLeftSx = {
  height: 32,
  width: "auto",
  px: 1,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonRightSx = {
  height: 32,
  width: "auto",
  px: 1.5,
  fontSize: "12px",
  fontWeight: 750,
  boxShadow: "none",
};

export default MarketplaceStoreCreateMobilePage;
