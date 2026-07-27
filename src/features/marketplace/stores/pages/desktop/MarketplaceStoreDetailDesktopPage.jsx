// src/features/marketplace/stores/pages/desktop/MarketplaceStoreDetailDesktopPage.jsx

import React from "react";
import {
  FiArrowLeft,
  FiEdit,
  FiPlay,
  FiPause,
  FiWifi,
  FiWifiOff,
  FiClock,
  FiShoppingBag,
  FiInfo,
  FiCalendar,
} from "react-icons/fi";

import {
  AppAlert,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
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

const primaryButtonSx = {
  minHeight: 36,
  px: 2,
  fontSize: "0.8125rem",
  fontWeight: 600,
};

const secondaryButtonSx = {
  minHeight: 36,
  px: 1.75,
  fontSize: "0.8125rem",
  fontWeight: 600,
};

const MarketplaceStoreDetailDesktopPage = ({
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
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px] text-center py-10">
          <AppHeading level={2} className="text-base font-bold">
            Loading store details...
          </AppHeading>
        </div>
      </section>
    );
  }

  if (error || !store) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px] space-y-4">
          <AppAlert severity="error" variant="soft">
            {error || "Store details could not be loaded."}
          </AppAlert>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            onClick={handleBack}
            startIcon={<FiArrowLeft />}
            sx={secondaryButtonSx}
          >
            Back to Stores
          </AppButton>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <PageHeader
          title={store.storeName}
          subtitle={`Code: ${store.storeCode || "-"}`}
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Stores", onClick: handleBack },
                { label: store.storeName, current: true },
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
                onClick={handleBack}
                sx={secondaryButtonSx}
              >
                Back
              </AppButton>

              {store.onlineStatus === "ONLINE" ? (
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="warning"
                  rounded="md"
                  size="small"
                  startIcon={<FiWifiOff />}
                  onClick={() => handleGoOffline(store._id)}
                  sx={secondaryButtonSx}
                >
                  Go Offline
                </AppButton>
              ) : (
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="success"
                  rounded="md"
                  size="small"
                  startIcon={<FiWifi />}
                  onClick={() => handleGoOnline(store._id)}
                  sx={secondaryButtonSx}
                >
                  Go Online
                </AppButton>
              )}

              {store.onlineStatus === "PAUSED" ? (
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="primary"
                  rounded="md"
                  size="small"
                  startIcon={<FiPlay />}
                  onClick={() => handleResumeStore(store._id)}
                  sx={secondaryButtonSx}
                >
                  Resume Store
                </AppButton>
              ) : (
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  startIcon={<FiPause />}
                  onClick={() => handlePauseStore(store._id)}
                  sx={secondaryButtonSx}
                >
                  Pause Store
                </AppButton>
              )}

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiEdit />}
                onClick={() => handleEdit(store._id)}
                sx={primaryButtonSx}
              >
                Edit Store
              </AppButton>
            </AppStack>
          }
        />

        {message && (
          <AppAlert severity="success" variant="filled" closable onClose={clearMessage} className="mt-3">
            {message}
          </AppAlert>
        )}

        {/* Store Summary Strip */}
        <AppCard bordered shadow="sm" rounded="lg" className="mt-4 p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="space-y-1">
              <AppText size="xs" color="muted" className="uppercase font-semibold tracking-wider">
                Online Status
              </AppText>
              <div>
                <AppStatusBadge
                  status={onlineStatusColorMap[store.onlineStatus] || "neutral"}
                  label={store.onlineStatus || "OFFLINE"}
                />
              </div>
            </div>

            <div className="space-y-1 pt-3 md:pt-0 md:pl-5">
              <AppText size="xs" color="muted" className="uppercase font-semibold tracking-wider">
                Verification Status
              </AppText>
              <div>
                <AppStatusBadge
                  status={verificationStatusColorMap[store.verificationStatus] || "neutral"}
                  label={store.verificationStatus || "PENDING"}
                />
              </div>
            </div>

            <div className="space-y-1 pt-3 md:pt-0 md:pl-5">
              <AppText size="xs" color="muted" className="uppercase font-semibold tracking-wider">
                Store Status
              </AppText>
              <div>
                <AppTag variant={store.status === "ACTIVE" ? "success" : "neutral"} size="sm">
                  {store.status || "INACTIVE"}
                </AppTag>
              </div>
            </div>

            <div className="space-y-1 pt-3 md:pt-0 md:pl-5">
              <AppText size="xs" color="muted" className="uppercase font-semibold tracking-wider">
                Created On
              </AppText>
              <AppText className="font-medium text-text text-sm">
                {store.createdAt
                  ? new Date(store.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </AppText>
            </div>
          </div>
        </AppCard>

        {/* Content Grid */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_330px] items-start gap-5">
          {/* Operating Hours Table */}
          <AppCard bordered shadow="sm" rounded="lg" className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <FiClock className="text-primary text-lg" />
              <AppHeading level={2} className="text-base font-bold text-text">
                Working Hours Schedule
              </AppHeading>
            </div>

            <div className="divide-y divide-border border border-border rounded-md overflow-hidden bg-surface">
              {DAYS_OF_WEEK.map((day) => {
                const daySchedule = store.workingHours?.[day.key] || {
                  isOpen: true,
                  openTime: "09:00",
                  closeTime: "21:00",
                };

                return (
                  <div
                    key={day.key}
                    className="flex items-center justify-between p-3 hover:bg-surface-hover transition text-xs"
                  >
                    <span className="font-semibold text-text w-32">
                      {day.label}
                    </span>

                    {daySchedule.isOpen ? (
                      <span className="text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
                        {daySchedule.openTime} - {daySchedule.closeTime}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted italic bg-surface-hover px-3 py-1 rounded-full">
                        Closed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </AppCard>

          {/* Right Sidebar Metadata */}
          <div className="space-y-4">
            <AppCard bordered shadow="sm" rounded="lg" className="p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <FiInfo className="text-primary text-base" />
                <AppHeading level={3} className="text-xs font-bold text-text uppercase tracking-wider">
                  Store References
                </AppHeading>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <AppText size="xs" color="muted">Branch Reference ID</AppText>
                  <AppText className="font-mono text-xs font-medium text-text">{store.branchId || "-"}</AppText>
                </div>
                <div>
                  <AppText size="xs" color="muted">Company Reference ID</AppText>
                  <AppText className="font-mono text-xs font-medium text-text">{store.companyId || "-"}</AppText>
                </div>
                <div>
                  <AppText size="xs" color="muted">Workspace Reference ID</AppText>
                  <AppText className="font-mono text-xs font-medium text-text">{store.workspaceId || "-"}</AppText>
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

export default MarketplaceStoreDetailDesktopPage;
