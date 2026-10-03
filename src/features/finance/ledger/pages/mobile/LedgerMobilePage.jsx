import React, { useState } from "react";
import {
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiCalendar,
  FiRefreshCw,
  FiInbox,
  FiTrendingUp,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
  AppTablePagination,
  AppTag,
  AppButton,
} from "@/components";
import { formatDate, formatCurrency } from "@/utils";

const LedgerMobilePage = ({
  ledgerEntries = [],
  accountOptions = [],
  selectedAccountDetails = null,
  filters,
  currentPage,
  pageSize,
  totalEntries,
  isLoading = false,
  isRecalculating = false,
  error,
  message,
  clearFeedback,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleRecalculate,
  handleRefresh,
}) => {
  const [showFilters, setShowFilters] = useState(true);

  const shouldRenderPagination = totalEntries > pageSize;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                General Ledger
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Audit transaction postings and balances
              </AppText>
            </AppBox>

            <AppStack direction="row" align="center" justify="flex-end" gap={1} sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
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
                title="Refresh List"
              />
              <AppButton
                variant="outlined"
                colorVariant="primary"
                size="tiny"
                rounded="md"
                startIcon={<FiTrendingUp />}
                onClick={handleRecalculate}
                disabled={isRecalculating || !filters.accountId || isLoading}
                loading={isRecalculating}
                sx={recalcMobileHeaderBtnSx}
              >
                Recal
              </AppButton>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Feedback messages */}
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

        {/* Filters Toolbar */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="none"
          padding="none"
          sx={filterCardSx}
        >
          <div className="p-3.5 space-y-3">
            <AppSelect
              label="Select Account"
              name="accountId"
              value={filters.accountId}
              onChange={(e) => handleFilterChange("accountId", e.target.value)}
              options={accountOptions}
              size="small"
              variant="bordered"
              rounded="md"
              inputSx={compactFilterInputSx}
              labelSx={labelSx}
            />

            <div className="space-y-1">
              <AppText sx={labelSx}>Date Range</AppText>
              <AppBox sx={unifiedDatePickerSx}>
                <FiCalendar className="text-[15px] text-text-muted mr-1.5 flex-shrink-0" />
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full bg-transparent text-[11.5px] text-text border-0 p-0 focus:ring-0 focus:outline-none"
                  style={{
                    colorScheme: "dark",
                    border: "none",
                    outline: "none",
                  }}
                />
                <AppText sx={dateSeparatorSx}>
                  to
                </AppText>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full bg-transparent text-[11.5px] text-text border-0 p-0 focus:ring-0 focus:outline-none"
                  style={{
                    colorScheme: "dark",
                    border: "none",
                    outline: "none",
                  }}
                />
              </AppBox>
            </div>
          </div>
        </AppCard>

        {/* Selected Account Overview Stats */}
        {selectedAccountDetails && (
          <div className="px-0 mb-3 grid grid-cols-2 gap-2">
            <AppCard variant="default" rounded="md" bordered shadow="none" padding="none" sx={statCardSx}>
              <div className="p-3">
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Nature</span>
                <span className="text-[12.5px] font-extrabold text-primary mt-0.5 block">
                  {selectedAccountDetails.accountNature}
                </span>
              </div>
            </AppCard>
            <AppCard variant="default" rounded="md" bordered shadow="none" padding="none" sx={statCardSx}>
              <div className="p-3">
                <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">Opening</span>
                <span className="text-[12.5px] font-extrabold text-text mt-0.5 block">
                  {formatCurrency(selectedAccountDetails.openingBalance || 0)} {selectedAccountDetails.openingBalanceType}
                </span>
              </div>
            </AppCard>
          </div>
        )}

        {/* Content list */}
        <div className="px-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying ledger history...
              </AppText>
            </div>
          ) : !filters.accountId ? (
            <AppCard variant="default" rounded="md" bordered padding="md" sx={emptyCardContainerSx}>
              <AppStack direction="column" align="center" justify="center" gap={1} sx={{ py: 4, width: "100%" }}>
                <FiBookOpen className="text-[28px] text-text-muted/60" />
                <AppHeading level={3} weight={700} align="center" sx={{ m: 0, fontSize: "13px", width: "100%" }}>
                  No Account Selected
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  Choose an account from the filters panel to view its postings ledger.
                </AppText>
              </AppStack>
            </AppCard>
          ) : ledgerEntries.length === 0 ? (
            <AppCard variant="default" rounded="md" bordered padding="md" sx={emptyCardContainerSx}>
              <AppStack direction="column" align="center" justify="center" gap={1} sx={{ py: 4, width: "100%" }}>
                <FiCalendar className="text-[28px] text-text-muted/60" />
                <AppHeading level={3} weight={700} align="center" sx={{ m: 0, fontSize: "13px", width: "100%" }}>
                  No Posting History Found
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  There are no posting records for this account within the selected dates.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {ledgerEntries.map((e) => {
                const isDebitBal = e.runningBalance >= 0;

                return (
                  <AppCard
                    key={e._id}
                    variant="default"
                    rounded="lg"
                    bordered={false}
                    shadow="sm"
                    padding="none"
                    sx={ledgerCardSx}
                  >
                    <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%" }}>
                      {/* Left Info Block */}
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1.5}
                        sx={{ minWidth: 0, flex: 1 }}
                      >
                        {/* Left Icon Avatar Frame */}
                        <AppBox sx={avatarFrameSx}>
                          <FiBookOpen className="text-[24px]" />
                        </AppBox>

                        {/* Center Info Block */}
                        <AppBox sx={{ minWidth: 0, flex: 1 }}>
                          <AppHeading level={3} weight={700} sx={ledgerTitleSx}>
                            {e.voucherNumber || "OP-BAL"}
                          </AppHeading>
                          <AppText variant="body2" sx={ledgerDateSx}>
                            Date: {formatDate(e.voucherDate)}
                          </AppText>
                          {e.narration && (
                            <AppText variant="body2" sx={ledgerNarrationSx}>
                              {e.narration}
                            </AppText>
                          )}
                          <AppText variant="body2" sx={debitCreditSummarySx}>
                            Dr: {e.debit > 0 ? formatCurrency(e.debit) : "-"} | Cr: {e.credit > 0 ? formatCurrency(e.credit) : "-"}
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
                          <AppTag
                            label={isDebitBal ? "DR" : "CR"}
                            variant="soft"
                            size="small"
                            rounded="md"
                            colorVariant={isDebitBal ? "success" : "error"}
                            sx={typeBadgeSx}
                          />
                          <AppText variant="body2" sx={runningBalanceValueSx}>
                            {formatCurrency(Math.abs(e.runningBalance))}
                          </AppText>
                        </AppStack>
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
              totalItems={totalEntries}
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
  height: 30,
  width: 30,
  minWidth: 30,
  p: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const recalcMobileHeaderBtnSx = {
  height: 30,
  fontSize: "11px",
  fontWeight: 700,
  px: 1.2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
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

const ledgerCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
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

const ledgerTitleSx = {
  m: 0,
  fontSize: "12px",
  fontFamily: "var(--font-mono, monospace)",
  fontWeight: 800,
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
};

const ledgerDateSx = {
  mt: 0.25,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const ledgerNarrationSx = {
  mt: 0.4,
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: "15px",
};

const debitCreditSummarySx = {
  mt: 0.6,
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

const runningBalanceValueSx = {
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
  mb: 3,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 20%, var(--app-color-surface))",
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

const unifiedDatePickerSx = {
  display: "flex",
  alignItems: "center",
  height: 38,
  px: 1.5,
  border: "1px solid var(--app-color-border)",
  borderRadius: "6px",
  bgcolor: "var(--app-color-surface)",
  "&:focus-within": {
    borderColor: "var(--app-color-primary)",
    boxShadow: "0 0 0 1px var(--app-color-primary)",
  },
};

const dateSeparatorSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  px: 1,
  textTransform: "lowercase",
};

const statCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

export default LedgerMobilePage;
