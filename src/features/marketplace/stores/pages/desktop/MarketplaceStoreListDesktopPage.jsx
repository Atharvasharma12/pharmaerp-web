// src/features/marketplace/stores/pages/desktop/MarketplaceStoreListDesktopPage.jsx

import React, { useMemo, useState } from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiShoppingBag,
  FiMoreHorizontal,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiWifi,
  FiWifiOff,
  FiPlay,
  FiPause,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppConfirmModal,
  AppEmptyState,
  AppErrorState,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTableSkeleton,
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
} from "@/components";

// Replicated exact CSS Tokens from Branches page
const tableCardSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const searchSx = { width: "100%" };
const selectSx = { width: "100%" };
const filterInputSx = {
  minHeight: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const clearButtonSx = {
  height: 36,
  minWidth: 88,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 650,
};

const branchNameSx = {
  m: 0,
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const subLocationTextSx = {
  mt: 0.2,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const statusBadgeSx = {
  height: 22,
  px: 1.5,
  fontSize: "10.5px",
  textTransform: "capitalize",
};

const actionButtonSx = {
  height: 26,
  fontSize: "11px",
  fontWeight: 650,
  px: 1,
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 86,
  px: 1.5,
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

const stateSx = { minHeight: 360 };

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

const MarketplaceStoreListDesktopPage = ({
  stores = [],
  totalStores = 0,
  currentPage = 1,
  pageSize = 20,
  totalPages = 1,
  filters = {},
  activeFilterChips = [],
  onlineStatusOptions = [],
  verificationStatusOptions = [],
  isLoading = false,
  hasError = false,
  error = null,
  message = null,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  handleCreateStore,
  handleViewStore,
  handleEditStore,
  handleGoOnline,
  handleGoOffline,
  handlePauseStore,
  handleResumeStore,
  handleDeleteStore,
  handleRefresh,
  clearMessage,
}) => {
  const [storeToDelete, setStoreToDelete] = useState(null);

  const hasStores = stores && stores.length > 0;
  const showInitialSkeleton = isLoading && !hasStores;

  const derivedOverview = useMemo(() => {
    const total = totalStores || stores.length || 1;
    const online = stores.filter((s) => s.onlineStatus === "ONLINE").length;
    const offline = stores.filter((s) => s.onlineStatus === "OFFLINE").length;
    const pending = stores.filter(
      (s) => s.verificationStatus === "PENDING",
    ).length;

    return [
      {
        id: "online",
        label: "Online Stores",
        count: online,
        percent: Math.round((online / total) * 100),
      },
      {
        id: "offline",
        label: "Offline Stores",
        count: offline,
        percent: Math.round((offline / total) * 100),
      },
      {
        id: "pending",
        label: "Pending Review",
        count: pending,
        percent: Math.round((pending / total) * 100),
      },
    ];
  }, [stores, totalStores]);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <PageHeader
          title="Marketplace Stores"
          subtitle="Manage digital storefront presences, live order readiness, and daily operating schedules."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[{ label: "Marketplace Stores", current: true }]}
            />
          }
          actions={
            <AppStack
              direction="row"
              align="center"
              justify="flex-end"
              gap={1.1}
            >
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={
                  <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
                }
                onClick={handleRefresh}
                disabled={isLoading}
                sx={secondaryButtonSx}
              >
                Refresh
              </AppButton>

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiPlus />}
                onClick={handleCreateStore}
                sx={primaryButtonSx}
              >
                Create Store
              </AppButton>
            </AppStack>
          }
        />

        {message && (
          <AppAlert
            severity="success"
            variant="filled"
            closable
            onClose={clearMessage}
            className="mt-3"
          >
            {message}
          </AppAlert>
        )}

        {error && !hasError ? (
          <AppAlert
            severity="error"
            variant="soft"
            closable
            onClose={clearMessage}
            className="mt-3"
          >
            {error}
          </AppAlert>
        ) : null}

        {/* Layout Grid - 290px right sidebar matched to Branches page */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          {/* Main Table Card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={tableCardSx}
          >
            {/* Toolbar */}
            <div className="border-b border-border px-3.5 py-3">
              <div className="grid grid-cols-[minmax(260px,1fr)_150px_150px_100px] items-center gap-3">
                <AppSearchInput
                  name="search"
                  value={filters.search || ""}
                  onChange={handleSearchChange}
                  placeholder="Search stores..."
                  clearable
                  onClear={() => handleSearchChange("")}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  sx={searchSx}
                  inputSx={filterInputSx}
                />

                <AppSelect
                  name="onlineStatus"
                  value={filters.onlineStatus || "all"}
                  onChange={(e) =>
                    handleFilterChange({ onlineStatus: e.target.value })
                  }
                  options={onlineStatusOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  sx={selectSx}
                  inputSx={filterInputSx}
                />

                <AppSelect
                  name="verificationStatus"
                  value={filters.verificationStatus || "all"}
                  onChange={(e) =>
                    handleFilterChange({ verificationStatus: e.target.value })
                  }
                  options={verificationStatusOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  sx={selectSx}
                  inputSx={filterInputSx}
                />

                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  startIcon={<FiRefreshCw />}
                  onClick={handleClearFilters}
                  sx={clearButtonSx}
                >
                  Reset
                </AppButton>
              </div>

              {activeFilterChips.length > 0 && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                  {activeFilterChips.map((chip) => (
                    <AppTag
                      key={chip.key}
                      variant="soft"
                      size="sm"
                      closable
                      onClose={() => handleRemoveFilter(chip.key)}
                    >
                      {chip.label}
                    </AppTag>
                  ))}
                  <AppButton
                    variant="text"
                    size="xs"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </AppButton>
                </div>
              )}
            </div>

            {/* Table Content */}
            {hasError ? (
              <AppErrorState
                title="Unable to load marketplace stores"
                description={error || "Please refresh and try again."}
                actionText="Refresh"
                onRetry={handleRefresh}
                size="page"
                sx={stateSx}
              />
            ) : showInitialSkeleton ? (
              <AppTableSkeleton rows={6} columns={6} showHeader={false} />
            ) : !hasStores ? (
              <AppEmptyState
                title="No marketplace stores created"
                description="Link an existing physical branch location to create its online digital presence for marketplace orders."
                icon={<FiShoppingBag className="text-3xl text-primary" />}
                action={
                  <AppButton
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiPlus />}
                    onClick={handleCreateStore}
                  >
                    Create Marketplace Store
                  </AppButton>
                }
                size="page"
                sx={stateSx}
              />
            ) : (
              <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="min-w-[900px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1.5fr_1.1fr_1.4fr_1.5fr_180px_54px] border-b border-border bg-surface-alt px-3.5 py-2.5">
                    <HeaderCell>Storefront</HeaderCell>
                    <HeaderCell>Online Status</HeaderCell>
                    <HeaderCell>Verification</HeaderCell>
                    <HeaderCell>Store Status</HeaderCell>
                    <HeaderCell>Quick Controls</HeaderCell>
                    <HeaderCell align="right">Actions</HeaderCell>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-border">
                    {stores.map((store) => (
                      <div
                        key={store._id}
                        onClick={() => handleViewStore(store._id)}
                        className="grid grid-cols-[1.5fr_1.1fr_1.4fr_1.5fr_180px_54px] items-center px-3.5 py-2 transition hover:bg-surface-hover/60 cursor-pointer min-h-[58px]"
                      >
                        {/* Storefront Name */}
                        <div className="flex items-center gap-3 min-w-0 h-full">
                          <div className="flex items-center justify-center shrink-0">
                            <IconBox
                              icon={<FiShoppingBag />}
                              colorVariant="success"
                              small
                            />
                          </div>
                          <div className="flex flex-col min-w-0 justify-center">
                            <AppHeading
                              level={3}
                              weight={700}
                              sx={branchNameSx}
                            >
                              {store.storeName}
                            </AppHeading>
                            {store.storeCode && (
                              <AppText variant="body2" sx={subLocationTextSx}>
                                Code: {store.storeCode}
                              </AppText>
                            )}
                          </div>
                        </div>

                        {/* Online Status */}
                        <div>
                          <AppStatusBadge
                            status={
                              onlineStatusColorMap[store.onlineStatus] ||
                              "neutral"
                            }
                            label={store.onlineStatus || "OFFLINE"}
                            variant="soft"
                            size="small"
                            rounded="md"
                            colorVariant={
                              onlineStatusColorMap[store.onlineStatus] ||
                              "neutral"
                            }
                            sx={statusBadgeSx}
                          />
                        </div>

                        {/* Verification */}
                        <div>
                          <AppStatusBadge
                            status={
                              verificationStatusColorMap[
                                store.verificationStatus
                              ] || "neutral"
                            }
                            label={store.verificationStatus || "PENDING"}
                            variant="soft"
                            size="small"
                            rounded="md"
                            colorVariant={
                              verificationStatusColorMap[
                                store.verificationStatus
                              ] || "neutral"
                            }
                            sx={statusBadgeSx}
                          />
                        </div>

                        {/* Store Status */}
                        <div>
                          <AppStatusBadge
                            status={
                              store.status === "ACTIVE" ? "active" : "inactive"
                            }
                            label={store.status || "INACTIVE"}
                            variant="soft"
                            size="small"
                            rounded="md"
                            colorVariant={
                              store.status === "ACTIVE" ? "success" : "neutral"
                            }
                            sx={statusBadgeSx}
                          />
                        </div>

                        {/* Quick Controls */}
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {store.onlineStatus === "ONLINE" ? (
                            <AppButton
                              size="xs"
                              variant="outlined"
                              colorVariant="warning"
                              startIcon={<FiWifiOff />}
                              onClick={() => handleGoOffline(store._id)}
                              sx={actionButtonSx}
                            >
                              Offline
                            </AppButton>
                          ) : (
                            <AppButton
                              size="xs"
                              variant="outlined"
                              colorVariant="success"
                              startIcon={<FiWifi />}
                              onClick={() => handleGoOnline(store._id)}
                              sx={actionButtonSx}
                            >
                              Online
                            </AppButton>
                          )}

                          {store.onlineStatus === "PAUSED" ? (
                            <AppButton
                              size="xs"
                              variant="outlined"
                              colorVariant="primary"
                              startIcon={<FiPlay />}
                              onClick={() => handleResumeStore(store._id)}
                              sx={actionButtonSx}
                            >
                              Resume
                            </AppButton>
                          ) : (
                            <AppButton
                              size="xs"
                              variant="outlined"
                              colorVariant="neutral"
                              startIcon={<FiPause />}
                              onClick={() => handlePauseStore(store._id)}
                              sx={actionButtonSx}
                            >
                              Pause
                            </AppButton>
                          )}
                        </div>

                        {/* Row Actions */}
                        <div
                          className="flex justify-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AppMenu
                            trigger={
                              <button
                                type="button"
                                className="inline-flex h-auto w-auto items-center justify-center border-0 bg-transparent p-0 text-text-muted shadow-none outline-none transition hover:bg-transparent hover:text-primary focus:bg-transparent active:bg-transparent"
                              >
                                <FiMoreHorizontal className="text-[18px]" />
                              </button>
                            }
                            items={[
                              {
                                id: "view",
                                label: "View Details",
                                icon: <FiEye />,
                                onClick: () => handleViewStore(store._id),
                              },
                              {
                                id: "edit",
                                label: "Edit Store",
                                icon: <FiEdit2 />,
                                onClick: () => handleEditStore(store._id),
                              },
                              {
                                id: "delete",
                                label: "Delete Store",
                                icon: <FiTrash2 />,
                                danger: true,
                                onClick: () => setStoreToDelete(store),
                              },
                            ]}
                            dense
                            minWidth={170}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AppCard>

          {/* Right Sidebar - Replicated directly from Branches page */}
          <PageRightSidebar
            spacing={4}
            cards={[
              {
                title: "Stores Overview",
                icon: null,
                colorVariant: "success",
                variant: "default",
                custom: (
                  <OverviewChartCard
                    overviewData={derivedOverview}
                    total={totalStores || stores.length}
                  />
                ),
              },
              HELP_SUPPORT_CARD,
            ]}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {storeToDelete && (
        <AppConfirmModal
          open={Boolean(storeToDelete)}
          title="Delete Marketplace Store"
          description={`Are you sure you want to delete "${storeToDelete.storeName}"? This action cannot be undone.`}
          confirmText="Delete Store"
          confirmColorVariant="danger"
          onConfirm={() => {
            handleDeleteStore(storeToDelete._id);
            setStoreToDelete(null);
          }}
          onClose={() => setStoreToDelete(null)}
        />
      )}
    </section>
  );
};

// Header cell helper matching branches page
const HeaderCell = ({ children, align = "left" }) => (
  <div
    className={`text-[11.2px] font-bold leading-5 text-text-muted ${
      align === "right" ? "text-right" : "text-left"
    }`}
  >
    {children}
  </div>
);

// Icon box component helper matching branches page
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

// Compact Donut Chart component matching Branches page
const OverviewChartCard = ({ overviewData = [], total = 0 }) => {
  const conicGradientStyle = useMemo(() => {
    let currentPercentage = 0;
    const segments = overviewData.map((item) => {
      const start = currentPercentage;
      currentPercentage += item.percent || 0;
      const color =
        item.id === "online"
          ? "var(--app-color-primary)"
          : item.id === "offline"
            ? "var(--app-color-border-strong)"
            : "var(--app-color-warning)";
      return `${color} ${start}% ${currentPercentage}%`;
    });
    return {
      background: segments.length
        ? `conic-gradient(${segments.join(", ")})`
        : "var(--app-color-border)",
    };
  }, [overviewData]);

  return (
    <div>
      <div
        style={conicGradientStyle}
        className="mx-auto mt-2 flex h-[86px] w-[86px] items-center justify-center rounded-full"
      >
        <div className="flex flex-col items-center justify-center h-[45px] w-[45px] rounded-full bg-surface">
          <span className="text-[11px] font-bold text-text leading-tight">
            {total}
          </span>
          <span className="text-[9px] text-text-muted">Total</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {overviewData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_auto] items-center gap-3"
          >
            <AppStack direction="row" align="center" gap={0.8}>
              <span
                className={`w-2 h-2 rounded-full ${
                  item.id === "online"
                    ? "bg-primary"
                    : item.id === "offline"
                      ? "bg-border-strong"
                      : "bg-warning"
                }`}
              />
              <span className="text-[12px] text-text-muted">{item.label}</span>
            </AppStack>
            <span className="text-[12px] font-bold text-text">
              {item.count} ({item.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceStoreListDesktopPage;
