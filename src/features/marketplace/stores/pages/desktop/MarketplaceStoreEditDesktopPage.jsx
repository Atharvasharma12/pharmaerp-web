// src/features/marketplace/stores/pages/desktop/MarketplaceStoreEditDesktopPage.jsx

import React from "react";
import {
  FiArrowLeft,
  FiClock,
  FiSave,
  FiShoppingBag,
  FiInfo,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppStack,
  AppSwitch,
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
} from "@/components";

import { DAYS_OF_WEEK } from "../../constants/marketplaceStoreConstants";

const primaryButtonSx = {
  minHeight: 36,
  px: 2.2,
  fontSize: "0.8125rem",
  fontWeight: 600,
};

const secondaryButtonSx = {
  minHeight: 36,
  px: 1.75,
  fontSize: "0.8125rem",
  fontWeight: 600,
};

const MarketplaceStoreEditDesktopPage = ({
  formData,
  errors = {},
  isSubmitting = false,
  isLoading = false,
  message,
  error,
  handleChange,
  handleWorkingHoursChange,
  handleSubmit,
  handleCancel,
  clearMessage,
}) => {
  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px] text-center py-10">
          <AppHeading level={2} className="text-base font-bold">
            Loading store details...
          </AppHeading>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <PageHeader
          title="Edit Marketplace Store"
          subtitle="Update storefront name and operating hours schedule."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Stores", onClick: handleCancel },
                { label: "Edit Store", current: true },
              ]}
            />
          }
          actions={
            <AppStack direction="row" align="center" justify="flex-end" gap={1}>
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
                disabled={isSubmitting}
                sx={primaryButtonSx}
              >
                {isSubmitting ? "Updating..." : "Update Store"}
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

        {/* Layout Grid */}
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_330px] items-start gap-5">
          <AppBox component="form" onSubmit={handleSubmit} sx={{ spaceY: 3 }}>
            {/* Store Name Card */}
            <AppCard bordered shadow="sm" rounded="lg" className="p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <FiShoppingBag className="text-primary text-lg" />
                <AppHeading level={2} className="text-base font-bold text-text">
                  Store Details
                </AppHeading>
              </div>

              <div>
                <AppInput
                  label="Store Name *"
                  name="storeName"
                  value={formData.storeName || ""}
                  onChange={handleChange}
                  error={errors.storeName}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  required
                />
              </div>
            </AppCard>

            {/* Operating Schedule Card */}
            <AppCard bordered shadow="sm" rounded="lg" className="p-5 space-y-4 mt-5">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <FiClock className="text-primary text-lg" />
                <div>
                  <AppHeading level={2} className="text-base font-bold text-text">
                    Operating Schedule
                  </AppHeading>
                  <AppText size="xs" color="muted">
                    Configure daily open & close times.
                  </AppText>
                </div>
              </div>

              <div className="divide-y divide-border border border-border rounded-md overflow-hidden bg-surface">
                {DAYS_OF_WEEK.map((day) => {
                  const dayData = formData.workingHours?.[day.key] || {
                    isOpen: true,
                    openTime: "09:00",
                    closeTime: "21:00",
                  };

                  return (
                    <div
                      key={day.key}
                      className="flex items-center justify-between p-3 hover:bg-surface-hover transition text-xs"
                    >
                      <span className="w-32 font-semibold text-text">
                        {day.label}
                      </span>

                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                          <AppSwitch
                            checked={dayData.isOpen}
                            onChange={(checked) =>
                              handleWorkingHoursChange(day.key, "isOpen", checked)
                            }
                          />
                          <span className="font-medium text-text">
                            {dayData.isOpen ? "Open" : "Closed"}
                          </span>
                        </div>

                        {dayData.isOpen ? (
                          <div className="flex items-center gap-2">
                            <AppInput
                              type="time"
                              value={dayData.openTime || "09:00"}
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  day.key,
                                  "openTime",
                                  e.target.value,
                                )
                              }
                              size="small"
                              variant="bordered"
                              rounded="md"
                              className="w-28"
                            />
                            <span className="text-text-muted">to</span>
                            <AppInput
                              type="time"
                              value={dayData.closeTime || "21:00"}
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  day.key,
                                  "closeTime",
                                  e.target.value,
                                )
                              }
                              size="small"
                              variant="bordered"
                              rounded="md"
                              className="w-28"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted italic w-64 text-center">
                            Closed on this day
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AppCard>

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
                disabled={isSubmitting}
                sx={primaryButtonSx}
              >
                {isSubmitting ? "Updating..." : "Update Store"}
              </AppButton>
            </div>
          </AppBox>

          <div className="space-y-4">
            <PageRightSidebar cards={[HELP_SUPPORT_CARD]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceStoreEditDesktopPage;
