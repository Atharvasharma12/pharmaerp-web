// src/features/marketplace/stores/pages/mobile/MarketplaceStoreEditMobilePage.jsx

import React from "react";
import { FiArrowLeft, FiClock, FiSave } from "react-icons/fi";

import {
  AppAlert,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSwitch,
} from "@/components";

import { DAYS_OF_WEEK } from "../../constants/marketplaceStoreConstants";

const MarketplaceStoreEditMobilePage = ({
  formData,
  errors,
  isSubmitting,
  isLoading,
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
      <div className="p-4 text-center">
        <AppHeading level={3}>Loading Store...</AppHeading>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppButton variant="ghost" size="sm" onClick={handleCancel} startIcon={<FiArrowLeft />}>
            Back
          </AppButton>
          <AppHeading level={1} className="text-xl font-bold">
            Edit Store
          </AppHeading>
        </div>

        <AppButton
          size="sm"
          variant="contained"
          colorVariant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Update
        </AppButton>
      </div>

      {/* Notifications */}
      {message && (
        <AppAlert variant="success" onClose={clearMessage} title="Success">
          {message}
        </AppAlert>
      )}

      {error && (
        <AppAlert variant="danger" title="Error">
          {error}
        </AppAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Details */}
        <AppCard className="p-4 space-y-3">
          <AppHeading level={2} className="text-base font-semibold border-b border-divider pb-2">
            Store Info
          </AppHeading>

          <AppInput
            label="Store Name *"
            name="storeName"
            value={formData.storeName || ""}
            onChange={handleChange}
            error={errors.storeName}
            required
          />
        </AppCard>

        {/* Daily Hours */}
        <AppCard className="p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-divider pb-2">
            <FiClock className="text-primary" />
            <AppHeading level={2} className="text-base font-semibold">
              Daily Hours
            </AppHeading>
          </div>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => {
              const dayData = formData.workingHours?.[day.key] || {
                isOpen: true,
                openTime: "09:00",
                closeTime: "21:00",
              };

              return (
                <div key={day.key} className="p-3 border border-divider rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{day.label}</span>
                    <div className="flex items-center gap-2">
                      <AppSwitch
                        checked={dayData.isOpen}
                        onChange={(checked) =>
                          handleWorkingHoursChange(day.key, "isOpen", checked)
                        }
                      />
                      <span className="text-xs">{dayData.isOpen ? "Open" : "Closed"}</span>
                    </div>
                  </div>

                  {dayData.isOpen && (
                    <div className="flex items-center gap-2 pt-1">
                      <AppInput
                        type="time"
                        value={dayData.openTime || "09:00"}
                        onChange={(e) =>
                          handleWorkingHoursChange(day.key, "openTime", e.target.value)
                        }
                        className="w-full text-xs"
                      />
                      <span className="text-xs text-text-muted">to</span>
                      <AppInput
                        type="time"
                        value={dayData.closeTime || "21:00"}
                        onChange={(e) =>
                          handleWorkingHoursChange(day.key, "closeTime", e.target.value)
                        }
                        className="w-full text-xs"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AppCard>

        <AppButton
          type="submit"
          fullWidth
          variant="contained"
          colorVariant="primary"
          startIcon={<FiSave />}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Store"}
        </AppButton>
      </form>
    </div>
  );
};

export default MarketplaceStoreEditMobilePage;
