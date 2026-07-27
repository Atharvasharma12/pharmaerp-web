// src/features/marketplace/stores/pages/mobile/MarketplaceStoreListMobilePage.jsx

import React, { useState } from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlay,
  FiPause,
  FiWifi,
  FiWifiOff,
  FiShoppingBag,
  FiFilter,
  FiMoreHorizontal,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
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
  AppTag,
  AppText,
} from "@/components";

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

const MarketplaceStoreListMobilePage = ({
  stores = [],
  totalStores = 0,
  filters = {},
  onlineStatusOptions = [],
  verificationStatusOptions = [],
  isLoading = false,
  hasError = false,
  error = null,
  message = null,
  hasStores = false,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,
  handleCreateStore,
  handleViewStore,
  handleEditStore,
  handleDeleteStore,
  handleGoOnline,
  handleGoOffline,
  handlePauseStore,
  handleResumeStore,
  clearMessage,
}) => {
  const [storeToDelete, setStoreToDelete] = useState(null);

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Expanded Width Page Title Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Marketplace Stores
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Manage digital storefronts and live order statuses.
              </AppText>
            </AppBox>

            <AppButton
              variant="contained"
              colorVariant="primary"
              size="small"
              rounded="md"
              startIcon={<FiPlus />}
              onClick={handleCreateStore}
              sx={addStoreBtnSx}
            >
              Add Store
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

        {/* Max Width Filter Layout Row */}
        <AppBox sx={filterSectionSx}>
          <div className="grid grid-cols-[1fr_auto] gap-2">
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
              sx={searchBarSx}
              inputSx={inputOverrideSx}
            />
            <AppIconButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleRefresh}
              disabled={isLoading}
              sx={filterToggleBtnSx}
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            </AppIconButton>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
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
              sx={selectInputSx}
              inputSx={inputOverrideSx}
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
              sx={selectInputSx}
              inputSx={inputOverrideSx}
            />
          </div>
        </AppBox>

        {/* Edge-Aligned Counter Actions Bar */}
        <AppBox sx={metaActionRowSx}>
          <AppText variant="body2" weight={700} sx={countLabelTextSx}>
            Total Stores: {totalStores}
          </AppText>
          <AppButton
            variant="text"
            colorVariant="neutral"
            size="small"
            startIcon={<FiRefreshCw />}
            onClick={handleClearFilters}
            sx={resetTextLinkSx}
          >
            Reset
          </AppButton>
        </AppBox>

        {/* High Density Main Listing Stream */}
        <AppBox sx={listingListWrapperSx}>
          {isLoading && !hasStores ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <AppCard key={n} sx={{ p: 2, height: 110, bgcolor: "var(--app-color-surface)", borderColor: "var(--app-color-border)", border: "1px solid" }} className="animate-pulse" />
              ))}
            </div>
          ) : hasError ? (
            <AppErrorState
              title="Failed to Load Stores"
              description={error || "An error occurred."}
              onRetry={handleRefresh}
            />
          ) : !hasStores ? (
            <AppCard variant="default" rounded="md" bordered padding="md" sx={emptyCardContainerSx}>
              <AppStack direction="column" align="center" justify="center" gap={1} sx={{ py: 4, width: "100%" }}>
                <FiShoppingBag className="text-[28px] text-text-muted/60" />
                <AppHeading level={3} weight={700} align="center" sx={{ m: 0, fontSize: "13px", width: "100%" }}>
                  No stores found
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  Add your first online store or refine filter keywords.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1}>
              {stores.map((store) => (
                <AppCard
                  key={store._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  onClick={() => handleViewStore(store._id)}
                  sx={storeListingItemCardSx}
                >
                  {/* Top Segment */}
                  <AppStack direction="row" align="flex-start" justify="space-between" gap={1}>
                    <AppStack direction="row" align="center" gap={1}>
                      <AppBox sx={avatarIconFrameSx}>
                        <FiShoppingBag />
                      </AppBox>

                      <AppBox sx={{ minWidth: 0 }}>
                        <AppHeading level={2} weight={800} sx={storeCardTitleTextSx}>
                          {store.storeName}
                        </AppHeading>
                        {store.storeCode && (
                          <AppText variant="body2" sx={storeCardSubTextSx}>
                            Code: {store.storeCode}
                          </AppText>
                        )}
                      </AppBox>
                    </AppStack>

                    <AppStack
                      direction="row"
                      align="center"
                      gap={0.25}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <AppStatusBadge
                        status={onlineStatusColorMap[store.onlineStatus] || "neutral"}
                        label={store.onlineStatus || "OFFLINE"}
                        variant="soft"
                        size="small"
                        rounded="md"
                        colorVariant={onlineStatusColorMap[store.onlineStatus] || "neutral"}
                        sx={statusBadgeOverrideSx}
                      />
                      <AppMenu
                        trigger={
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center border-0 bg-transparent p-0 text-text-muted transition hover:text-text focus:outline-none"
                          >
                            <FiMoreHorizontal className="text-[17px]" />
                          </button>
                        }
                        triggerProps={{
                          onClick: (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          },
                        }}
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
                            icon: <FiEdit />,
                            onClick: () => handleEditStore(store._id),
                          },
                          {
                            id: "delete",
                            label: "Delete",
                            icon: <FiTrash2 className="text-danger" />,
                            danger: true,
                            onClick: () => setStoreToDelete(store),
                          },
                        ]}
                        dense
                        minWidth={160}
                      />
                    </AppStack>
                  </AppStack>

                  <div className="w-full h-[1px] bg-divider my-2" />

                  {/* Bottom Segment */}
                  <AppStack direction="row" align="center" justify="space-between" gap={1}>
                    <AppStack direction="row" align="center" gap={0.5}>
                      <AppStatusBadge
                        status={verificationStatusColorMap[store.verificationStatus] || "neutral"}
                        label={store.verificationStatus || "PENDING"}
                        variant="soft"
                        size="small"
                        rounded="md"
                        colorVariant={verificationStatusColorMap[store.verificationStatus] || "neutral"}
                        sx={statusBadgeOverrideSx}
                      />
                      <AppStatusBadge
                        status={store.status === "ACTIVE" ? "active" : "inactive"}
                        label={store.status || "INACTIVE"}
                        variant="soft"
                        size="small"
                        rounded="md"
                        colorVariant={store.status === "ACTIVE" ? "success" : "neutral"}
                        sx={statusBadgeOverrideSx}
                      />
                    </AppStack>

                    <AppStack
                      direction="row"
                      align="center"
                      gap={1}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      {store.onlineStatus === "ONLINE" ? (
                        <AppButton
                          size="xs"
                          variant="outlined"
                          colorVariant="warning"
                          onClick={() => handleGoOffline(store._id)}
                          startIcon={<FiWifiOff />}
                          sx={actionButtonSx}
                        >
                          Offline
                        </AppButton>
                      ) : (
                        <AppButton
                          size="xs"
                          variant="outlined"
                          colorVariant="success"
                          onClick={() => handleGoOnline(store._id)}
                          startIcon={<FiWifi />}
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
                          onClick={() => handleResumeStore(store._id)}
                          startIcon={<FiPlay />}
                          sx={actionButtonSx}
                        >
                          Resume
                        </AppButton>
                      ) : (
                        <AppButton
                          size="xs"
                          variant="outlined"
                          colorVariant="neutral"
                          onClick={() => handlePauseStore(store._id)}
                          startIcon={<FiPause />}
                          sx={actionButtonSx}
                        >
                          Pause
                        </AppButton>
                      )}
                    </AppStack>
                  </AppStack>
                </AppCard>
              ))}
            </AppStack>
          )}
        </AppBox>
      </AppBox>

      {/* Delete Modal */}
      {storeToDelete && (
        <AppConfirmModal
          open={Boolean(storeToDelete)}
          title="Delete Store"
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

/* Style Tokens Configuration Dictionary matching BranchesMobilePage.jsx */
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
  fontSize: "21px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const addStoreBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 750,
  px: 1.2,
  boxShadow: "var(--app-shadow-xs)",
  "& .MuiButton-startIcon": {
    marginRight: "4px",
    fontSize: "12px",
  },
};

const filterSectionSx = {
  px: 0.5,
  pb: 1.25,
};

const searchBarSx = {
  width: "100%",
};

const filterToggleBtnSx = {
  height: 35,
  width: 35,
  minWidth: 35,
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
  p: 0,
};

const selectInputSx = {
  width: "100%",
};

const inputOverrideSx = {
  height: 35,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const metaActionRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 0.5,
  py: 0.75,
  borderTop: "1px solid var(--app-color-divider)",
  borderBottom: "1px solid var(--app-color-divider)",
  bgcolor: "var(--app-color-surface-alt)",
};

const countLabelTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const resetTextLinkSx = {
  p: 0,
  minWidth: "auto",
  height: "auto",
  fontSize: "11px",
  fontWeight: 750,
  color: "var(--app-color-text)",
  "& .MuiButton-startIcon": {
    marginRight: "3px",
    fontSize: "10.5px",
  },
};

const listingListWrapperSx = {
  px: 0.5,
  py: 1.25,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 25%, transparent)",
  overflowY: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
    height: 0,
  },
};

const emptyCardContainerSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  width: "100%",
};

const emptyStateSubTextSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  px: 2,
  textAlign: "center",
  width: "100%",
};

const storeListingItemCardSx = {
  p: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  cursor: "pointer",
  transition: "background-color 0.1s ease",
  "&:hover": {
    bgcolor: "var(--app-color-surface)",
  },
};

const avatarIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "8px",
  fontSize: "17px",
  flexShrink: 0,
  bgcolor: "var(--app-color-success-soft)",
  color: "var(--app-color-success)",
};

const storeCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const storeCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-primary)",
  fontWeight: 650,
  mt: 0.1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const statusBadgeOverrideSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 1,
  textTransform: "capitalize",
};

const actionButtonSx = {
  height: 26,
  fontSize: "11px",
  fontWeight: 650,
  px: 1,
};

export default MarketplaceStoreListMobilePage;
