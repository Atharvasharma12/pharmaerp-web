// src/features/marketplace/stores/pages/mobile/MarketplaceStoreDetailMobilePage.jsx

import React from "react";
import {
  FiArrowLeft,
  FiEdit,
  FiPlay,
  FiPause,
  FiWifi,
  FiWifiOff,
  FiClock,
  FiInfo,
} from "react-icons/fi";

import {
  AppAlert,
  AppButton,
  AppCard,
  AppHeading,
  AppStatusBadge,
  AppTag,
  AppText,
} from "@/components";

import { DAYS_OF_WEEK } from "../../constants/marketplaceStoreConstants";

const onlineStatusColorMap = {
  ONLINE: "success",
  OFFLINE: "neutral",
  BUSY: "warning",
  PAUSED: "secondary",
};

const verificationStatusColorMap = {
  APPROVED: "success",
  PENDING: "warning",
  UNDER_REVIEW: "info",
  REJECTED: "danger",
};

const MarketplaceStoreDetailMobilePage = ({
  store,
  isLoading,
  error,
  message,
  handleBack,
  handleEdit,
  handleGoOnline,
  handleGoOffline,
  handlePauseStore,
  handleResumeStore,
  clearMessage,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <AppHeading level={3}>Loading Store Details...</AppHeading>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="p-4 space-y-3">
        <AppAlert variant="danger" title="Error">
          {error || "Store details could not be loaded."}
        </AppAlert>
        <AppButton variant="outlined" onClick={handleBack} startIcon={<FiArrowLeft />}>
          Back
        </AppButton>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppButton variant="ghost" size="sm" onClick={handleBack} startIcon={<FiArrowLeft />}>
            Back
          </AppButton>
          <AppHeading level={1} className="text-xl font-bold">
            {store.storeName}
          </AppHeading>
        </div>

        <AppButton
          size="sm"
          variant="outlined"
          colorVariant="primary"
          onClick={() => handleEdit(store._id)}
          startIcon={<FiEdit />}
        >
          Edit
        </AppButton>
      </div>

      {/* Notifications */}
      {message && (
        <AppAlert variant="success" onClose={clearMessage} title="Notification">
          {message}
        </AppAlert>
      )}

      {/* Store Badges Card */}
      <AppCard className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary-soft">
            {store.storeCode}
          </span>
          <AppTag variant={store.status === "ACTIVE" ? "success" : "neutral"} size="sm">
            {store.status || "INACTIVE"}
          </AppTag>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-divider">
          <AppStatusBadge
            status={onlineStatusColorMap[store.onlineStatus] || "neutral"}
            label={store.onlineStatus || "OFFLINE"}
          />
          <AppStatusBadge
            status={verificationStatusColorMap[store.verificationStatus] || "neutral"}
            label={store.verificationStatus || "PENDING"}
          />
        </div>

        {/* Quick Action Toggles */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-divider">
          {store.onlineStatus === "ONLINE" ? (
            <AppButton
              size="xs"
              variant="outlined"
              colorVariant="warning"
              onClick={() => handleGoOffline(store._id)}
              startIcon={<FiWifiOff />}
            >
              Go Offline
            </AppButton>
          ) : (
            <AppButton
              size="xs"
              variant="outlined"
              colorVariant="success"
              onClick={() => handleGoOnline(store._id)}
              startIcon={<FiWifi />}
            >
              Go Online
            </AppButton>
          )}

          {store.onlineStatus === "PAUSED" ? (
            <AppButton
              size="xs"
              variant="outlined"
              colorVariant="primary"
              onClick={() => handleResumeStore(store._id)}
              startIcon={<FiPlay />}
            >
              Resume
            </AppButton>
          ) : (
            <AppButton
              size="xs"
              variant="outlined"
              colorVariant="secondary"
              onClick={() => handlePauseStore(store._id)}
              startIcon={<FiPause />}
            >
              Pause
            </AppButton>
          )}
        </div>
      </AppCard>

      {/* Hours Overview */}
      <AppCard className="p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-divider pb-2">
          <FiClock className="text-primary" />
          <AppHeading level={2} className="text-base font-semibold">
            Daily Hours
          </AppHeading>
        </div>

        <div className="space-y-2">
          {DAYS_OF_WEEK.map((day) => {
            const daySchedule = store.workingHours?.[day.key] || {
              isOpen: true,
              openTime: "09:00",
              closeTime: "21:00",
            };

            return (
              <div key={day.key} className="flex items-center justify-between text-xs py-1">
                <span className="font-semibold text-text">{day.label}</span>
                {daySchedule.isOpen ? (
                  <span className="text-success font-medium">
                    {daySchedule.openTime} - {daySchedule.closeTime}
                  </span>
                ) : (
                  <span className="text-text-muted italic">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </AppCard>

      {/* Metadata */}
      <AppCard className="p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 border-b border-divider pb-2">
          <FiInfo className="text-primary" />
          <AppHeading level={2} className="text-base font-semibold">
            Store Info
          </AppHeading>
        </div>

        <div>
          <AppText size="xs" color="muted">Branch ID</AppText>
          <AppText className="font-mono text-xs">{store.branchId || "-"}</AppText>
        </div>

        <div>
          <AppText size="xs" color="muted">Company ID</AppText>
          <AppText className="font-mono text-xs">{store.companyId || "-"}</AppText>
        </div>
      </AppCard>
    </div>
  );
};

export default MarketplaceStoreDetailMobilePage;
