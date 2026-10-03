import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiRefreshCw,
  FiEye,
  FiMoreVertical,
  FiInbox,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppSelect,
  AppStack,
  AppText,
  AppTablePagination,
  AppMenu,
  AppSearchInput,
  AppTag,
  AppButton,
} from "@/components";
import { formatDate, formatCurrency } from "@/utils";

const balanceTypeOptions = [
  { label: "All Balance Types", value: "all" },
  { label: "Debit Balances (DR)", value: "dr" },
  { label: "Credit Balances (CR)", value: "cr" },
];

const balanceTypeColorMap = {
  DR: "success",
  CR: "error",
};

const AccountBalancesMobilePage = ({
  accountBalances = [],
  searchParams,
  currentPage,
  pageSize,
  totalBalances,
  isLoading = false,
  isRecalculating = false,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleRecalculate,
  handleViewDetails,
  handleRefresh,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const getBalanceTypeBadge = (type) => {
    const raw = String(type || "").toUpperCase();
    return (
      <AppTag
        label={raw}
        variant="soft"
        size="small"
        rounded="md"
        colorVariant={balanceTypeColorMap[raw] || "neutral"}
        sx={typeBadgeSx}
      />
    );
  };

  const shouldRenderPagination = totalBalances > pageSize;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Account Balances
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Audit aggregate chart of account balances
              </AppText>
            </AppBox>

            <AppStack direction="row" align="center" gap={1}>
              <AppIconButton
                icon={<FiRefreshCw />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                loading={isLoading}
                disabled={isLoading}
                sx={refreshIconBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mx-0 mb-3 p-3 text-[11.5px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span className="flex-1">{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ml-2 ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filter Row */}
        <AppBox sx={searchFilterRowSx}>
          <AppBox sx={{ flex: 1, minWidth: 0 }}>
            <AppSearchInput
              name="search"
              value={searchParams.search}
              onChange={handleSearchChange}
              placeholder="Search account name..."
              clearable
              onClear={() => handleSearchChange("")}
              size="large"
              variant="bordered"
              rounded="md"
              sx={searchBarSx}
              inputSx={searchInputSx}
            />
          </AppBox>

          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="medium"
            rounded="md"
            startIcon={<FiFilter />}
            onClick={() => setShowFilters(!showFilters)}
            sx={filterBtnSx}
          >
            Filter
          </AppButton>
        </AppBox>

        {/* Collapsible Panel */}
        {showFilters && (
          <div className="px-0 mb-3">
            <AppCard
              variant="default"
              rounded="md"
              bordered
              shadow="none"
              padding="none"
              sx={filterCardSx}
            >
              <div className="p-3.5 space-y-3.5">
                <AppSelect
                  label="Balance Type"
                  name="balanceType"
                  value={searchParams.balanceType}
                  onChange={(e) => handleFilterChange("balanceType", e.target.value)}
                  options={balanceTypeOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />
              </div>
            </AppCard>
          </div>
        )}

        {/* Content list */}
        <div className="px-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying account balances...
              </AppText>
            </div>
          ) : accountBalances.length === 0 ? (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              padding="md"
              sx={emptyCardContainerSx}
            >
              <AppStack
                direction="column"
                align="center"
                justify="center"
                gap={1}
                sx={{ py: 4, width: "100%" }}
              >
                <FiInbox className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  No balances found
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  Verify your filter settings or search query.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {accountBalances.map((b) => {
                const accName = b.accountId?.accountName || "Unknown Account";
                const accCode = b.accountId?.accountCode || "-";

                return (
                  <AppCard
                    key={b._id}
                    variant="default"
                    rounded="lg"
                    bordered={false}
                    shadow="sm"
                    padding="none"
                    sx={balanceCardSx}
                  >
                    <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%" }}>
                      {/* Left Info Block */}
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1.5}
                        sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                        onClick={() => handleViewDetails(b.accountId?._id || b.accountId)}
                      >
                        {/* Left Icon Avatar Frame */}
                        <AppBox sx={avatarFrameSx}>
                          <FiBookOpen className="text-[24px]" />
                        </AppBox>

                        {/* Center Info Block */}
                        <AppBox sx={{ minWidth: 0, flex: 1 }}>
                          <AppHeading level={3} weight={700} sx={accountTitleSx}>
                            {accName}
                          </AppHeading>
                          <AppText variant="body2" sx={accountCodeSx}>
                            {accCode}
                          </AppText>
                          <AppText variant="body2" sx={debitCreditSummarySx}>
                            Dr: {formatCurrency(b.debitTotal || 0)} | Cr: {formatCurrency(b.creditTotal || 0)}
                          </AppText>
                        </AppBox>
                      </AppStack>

                      {/* Right Stack */}
                      <AppStack direction="row" align="center" gap={1} sx={{ flexShrink: 0 }}>
                        <AppStack
                          direction="column"
                          align="flex-end"
                          gap={0.5}
                          sx={rightMetadataStackSx}
                        >
                          {getBalanceTypeBadge(b.balanceType)}
                          <AppText variant="body2" sx={balanceValueSx}>
                            {formatCurrency(b.balance || 0)}
                          </AppText>
                        </AppStack>

                        {/* Dropdown Action Menu */}
                        <AppMenu
                          triggerIcon={<FiMoreVertical />}
                          items={[
                            {
                              label: "View Details",
                              icon: <FiEye />,
                              onClick: (e) => {
                                e.stopPropagation();
                                handleViewDetails(b.accountId?._id || b.accountId);
                              },
                            },
                            {
                              label: "Recalculate",
                              icon: <FiRefreshCw />,
                              onClick: (e) => {
                                e.stopPropagation();
                                handleRecalculate(b.accountId?._id || b.accountId);
                              },
                              disabled: isRecalculating,
                            },
                          ]}
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
                  </AppCard>
                );
              })}
            </AppStack>
          )}
        </div>

        {/* Conditional Pagination Footer */}
        {shouldRenderPagination && (
          <AppBox sx={paginationFooterWrapperSx}>
            <AppTablePagination
              page={currentPage}
              pageSize={pageSize}
              totalItems={totalBalances}
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

const refreshIconBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const searchFilterRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 0,
  py: 0.5,
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

const searchBarSx = {
  width: "100%",
  boxShadow: "none",
};

const searchInputSx = {
  height: 42,
  fontSize: "13px",
  bgcolor: "var(--app-color-surface)",
};

const emptyCardContainerSx = {
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

const balanceCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const avatarFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 46,
  height: 46,
  borderRadius: "10px",
  bgcolor: "color-mix(in_srgb, var(--app-color-primary) 10%, transparent)",
  color: "var(--app-color-primary)",
  flexShrink: 0,
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

const accountCodeSx = {
  mt: 0.25,
  fontSize: "10px",
  fontFamily: "var(--font-mono, monospace)",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const debitCreditSummarySx = {
  mt: 0.5,
  fontSize: "9.5px",
  color: "var(--app-color-text-muted)",
};

const rightMetadataStackSx = {
  pl: 1.5,
  borderLeft:
    "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
  minWidth: { xs: 85, sm: 100 },
  maxWidth: { xs: 100, sm: 120 },
  flexShrink: 0,
};

const typeBadgeSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
  textTransform: "uppercase",
};

const balanceValueSx = {
  mt: 0.5,
  fontSize: "11.5px",
  fontWeight: 800,
  color: "var(--app-color-text)",
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

const filterCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const labelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

export default AccountBalancesMobilePage;
