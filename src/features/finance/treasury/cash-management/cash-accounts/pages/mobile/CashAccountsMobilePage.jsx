import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiInbox,
  FiSliders,
  FiAlertCircle,
  FiMoreVertical,
} from "react-icons/fi";
import { LuWallet } from "react-icons/lu";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppTablePagination,
  AppTag,
  AppText,
  AppMenu,
} from "@/components";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const CashAccountsMobilePage = ({
  filters,
  stats,
  pagedAccounts = [],
  totalAccounts = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  activeFilterChips = [],
  isLoading = false,
  hasError = false,
  serverError,
  serverMessage,
  handleFilterChange,
  handleRemoveChip,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  handleRefresh,
  handleCreateAccount,
  handleEditAccount,
  handleViewDetails,
  handleDeleteAccount,
  handleSetPrimary,
  clearError,
  clearMessage,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilteredAccounts = pagedAccounts.length > 0;
  const shouldRenderPagination = hasFilteredAccounts && totalAccounts > pageSize;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            gap={1}
            justify="space-between"
          >
            <AppBox sx={{ minWidth: 0, flex: 1, pr: 1.5 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Cash Accounts
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage cash chests & registers
              </AppText>
            </AppBox>

            <AppStack direction="row" gap={1} align="center">
              <AppIconButton
                icon={
                  <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
                }
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                disabled={isLoading}
                sx={actionHeaderIconBtnSx}
              />
              <AppIconButton
                icon={<FiPlus />}
                variant="filled"
                colorVariant="primary"
                size="small"
                rounded="md"
                onClick={handleCreateAccount}
                disabled={isLoading}
                sx={addMobileBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Server errors / messages */}
        {serverError && (
          <div className="mx-0 mb-3 p-3 bg-danger-soft text-danger text-[11px] font-semibold rounded-md border border-danger/25 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <FiAlertCircle />
              {serverError}
            </span>
            <button
              type="button"
              onClick={clearError}
              className="font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {serverMessage && (
          <div className="mx-0 mb-3 p-3 bg-success-soft text-success text-[11px] font-semibold rounded-md border border-success/25 flex items-center justify-between">
            <span>{serverMessage}</span>
            <button
              type="button"
              onClick={clearMessage}
              className="font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="px-0 mb-3 flex gap-2">
          <AppInput
            placeholder="Search cash accounts..."
            name="search"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            size="small"
            startIcon={<FiSearch className="text-text-muted text-[13px]" />}
            inputSx={searchMobileInputSx}
            sx={{ flex: 1 }}
          />

          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="medium"
            rounded="md"
            startIcon={<FiSliders className={showFilters ? "text-primary" : ""} />}
            onClick={() => setShowFilters(!showFilters)}
            sx={filterBtnSx}
          >
            Filter
          </AppButton>
        </div>

        {/* Expandable filters dropdown block */}
        {showFilters && (
          <div className="px-0 mb-3">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={expandableFiltersCardSx}
            >
              <div className="p-3.5 space-y-3.5">
                <AppSelect
                  label="Status Filter"
                  name="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  options={statusFilterOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />

                <div className="flex gap-2 justify-end pt-1">
                  <AppButton
                    variant="text"
                    colorVariant="primary"
                    size="small"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </AppButton>
                  <AppButton
                    variant="contained"
                    colorVariant="primary"
                    size="small"
                    onClick={() => setShowFilters(false)}
                  >
                    Close
                  </AppButton>
                </div>
              </div>
            </AppCard>
          </div>
        )}

        {/* Accounts List Stack */}
        <div className="space-y-4 px-0">
          {isLoading && !hasFilteredAccounts ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-1 bg-surface rounded-lg border border-border">
              <FiRefreshCw className="text-[20px] text-primary animate-spin" />
              <AppText
                variant="body2"
                sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}
              >
                Loading registries...
              </AppText>
            </div>
          ) : !hasFilteredAccounts ? (
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              sx={emptyCardSx}
            >
              <div className="flex flex-col items-center justify-center text-center w-full py-10 px-4">
                <FiInbox className="text-[32px] text-text-muted/40 mb-2" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{
                    m: 0,
                    fontSize: "12.5px",
                    width: "100%",
                    color: "var(--app-color-text)",
                    mb: 0.5,
                  }}
                >
                  No Registries Found
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  sx={emptyStateSubTextSx}
                >
                  Add a new cash-in-hand chest or refine active filter options.
                </AppText>
                {activeFilterChips.length > 0 && (
                  <AppButton
                    variant="text"
                    colorVariant="primary"
                    size="small"
                    onClick={handleClearFilters}
                    sx={{ mt: 1.5 }}
                  >
                    Reset Filters
                  </AppButton>
                )}
              </div>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {pagedAccounts.map((account) => (
                <AppCard
                  key={account._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={accountCardSx}
                >
                  <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%", p: 1.5 }}>
                    {/* Left Info Block */}
                    <AppStack
                      direction="row"
                      align="center"
                      gap={1.5}
                      sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                      onClick={() => handleViewDetails(account)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/10">
                        <LuWallet className="text-[20px]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <AppHeading
                            level={3}
                            weight={700}
                            sx={accountTitleSx}
                          >
                            {account.displayName}
                          </AppHeading>
                          {account.isPrimary && (
                            <span className="inline-flex items-center rounded bg-[#e6fcf5] px-1.5 py-0.2 text-[8px] font-bold text-[#0ca678] uppercase tracking-wide">
                              Primary
                            </span>
                          )}
                        </div>
                        <AppText variant="body2" sx={descriptionTextSx}>
                          {account.displayDescription}
                        </AppText>
                      </div>
                    </AppStack>

                    {/* Right Stack */}
                    <AppStack direction="row" align="center" gap={1} sx={{ flexShrink: 0 }}>
                      <AppStack
                        direction="column"
                        align="flex-end"
                        gap={0.5}
                        sx={rightMetadataStackSx}
                      >
                        <span className="text-[9.5px] text-text-muted block">
                          Balance
                        </span>
                        <span className="text-[12.5px] font-extrabold text-text block mt-0.5">
                          ₹
                          {account.balance?.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </AppStack>

                      {/* Dropdown Action Menu */}
                      <AppMenu
                        triggerIcon={<FiMoreVertical />}
                        items={[
                          !account.isPrimary && {
                            label: "Set as Primary",
                            icon: <FiStar className="text-warning" />,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleSetPrimary(account);
                            },
                          },
                          {
                            label: "View Details",
                            icon: <FiEye />,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleViewDetails(account);
                            },
                          },
                          {
                            label: "Edit Account",
                            icon: <FiEdit2 />,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleEditAccount(account);
                            },
                          },
                          {
                            label: "Delete Account",
                            icon: <FiTrash2 />,
                            danger: true,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleDeleteAccount(account);
                            },
                          },
                        ].filter(Boolean)}
                        triggerProps={{
                          size: "small",
                          sx: {
                            color: "var(--app-color-text-muted)",
                            backgroundColor: "transparent",
                            border: "none",
                            p: 0.5,
                            minWidth: 0,
                            "&:hover": {
                              backgroundColor: "var(--app-color-surface-hover, #f1f5f9)",
                            },
                          },
                        }}
                      />
                    </AppStack>
                  </AppStack>

                  {/* Mid grid section */}
                  <div className="px-3.5 pb-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] border-t border-dashed border-border/80 pt-3">
                    <div className="col-span-2">
                      <span className="text-text-muted block font-semibold">
                        Mapped General Ledger
                      </span>
                      <span className="font-bold text-primary block mt-0.5">
                        {account.ledgerAccountId?.accountCode
                          ? `[${account.ledgerAccountId.accountCode}] ${account.ledgerAccountId.accountName}`
                          : "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-text-muted block font-semibold">
                        Account Status
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${account.displayStatus === "active" ? "bg-success" : "bg-danger"}`}
                        ></span>
                        <span
                          className={`text-[10px] font-bold capitalize ${account.displayStatus === "active" ? "text-success" : "text-danger"}`}
                        >
                          {account.displayStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </AppCard>
              ))}
            </AppStack>
          )}

          {/* Pagination Footer */}
          {shouldRenderPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalAccounts}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showPageSize={false}
                showSummary={true}
                showFirstLast={false}
                compact={true}
                size="small"
                align="center"
                rounded="md"
                sx={{
                  width: "100%",
                  justifyContent: "center !important",
                  alignItems: "center",
                  textAlign: "center",
                  "& .MuiPagination-root": {
                    display: "flex !important",
                    justifyContent: "center !important",
                    width: "100%",
                  },
                  "& .MuiPagination-ul": {
                    justifyContent: "center !important",
                    width: "100%",
                  },
                }}
                summarySx={{
                  textAlign: "center",
                  width: "100%",
                  mb: 0.5,
                }}
                paginationSx={{
                  display: "flex !important",
                  justifyContent: "center !important",
                  alignItems: "center",
                  width: "100%",
                  "& .MuiPagination-ul": {
                    justifyContent: "center !important",
                    width: "100%",
                  },
                }}
              />
            </AppBox>
          )}
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
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1,
  pb: 1.5,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  fontWeight: 800,
  color: "var(--app-color-text)",
  letterSpacing: "-0.5px",
};

const pageSubtitleSx = {
  mt: 0.4,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const addMobileBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const searchMobileInputSx = {
  height: 42,
  fontSize: "13px",
  bgcolor: "var(--app-color-surface)",
};

const filterBtnSx = {
  height: 42,
  px: 2,
  fontSize: "13px",
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  flexShrink: 0,
};

const expandableFiltersCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const labelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const accountCardSx = {
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const accountTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
};

const descriptionTextSx = {
  mt: 0.25,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 180,
};

const rightMetadataStackSx = {
  pl: 1.5,
  borderLeft:
    "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
  minWidth: { xs: 85, sm: 100 },
  maxWidth: { xs: 100, sm: 120 },
  flexShrink: 0,
};

const emptyCardSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  width: "100%",
};

const emptyStateSubTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  px: 2,
  textAlign: "center",
  width: "100%",
};

const paginationFooterWrapperSx = {
  px: 0,
  pt: 2,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": {
    width: "100%",
    display: "flex !important",
    justifyContent: "center !important",
    alignItems: "center",
    "& .MuiPagination-ul": {
      justifyContent: "center !important",
    },
    "& .MuiPagination-root": {
      display: "flex !important",
      justifyContent: "center !important",
    },
  },
};

export default CashAccountsMobilePage;
