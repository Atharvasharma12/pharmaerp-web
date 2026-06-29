import React, { useState } from "react";
import {
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiCalendar,
  FiRefreshCw,
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
} from "@/components";
import { formatDate } from "@/utils";

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
}) => {
  const [showFilters, setShowFilters] = useState(true);

  const shouldRenderPagination = ledgerEntries.length > 0;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                General Ledger
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Audit transaction postings and balances
              </AppText>
            </AppBox>

            <AppIconButton
              icon={<FiRefreshCw />}
              variant="outlined"
              colorVariant="primary"
              size="small"
              rounded="md"
              onClick={handleRecalculate}
              disabled={isRecalculating || !filters.accountId || isLoading}
              loading={isRecalculating}
              sx={actionHeaderIconBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* Feedback messages */}
        {(error || message) && (
          <div
            className={`mx-2 mb-3 p-3 text-[11.5px] font-semibold rounded-md flex justify-between items-center ${
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
        <div className="px-2 mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full px-3 py-2 border rounded-md flex items-center justify-between text-[11.5px] font-bold transition ${
              showFilters
                ? "bg-primary-soft border-primary/40 text-primary"
                : "bg-surface border-border text-text"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FiFilter />
              <span>Ledger Parameters</span>
            </span>
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {/* Collapsible Panel */}
          {showFilters && (
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

                <div className="grid grid-cols-2 gap-2">
                  <AppInput
                    type="date"
                    label="From Date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    size="small"
                    inputSx={compactFilterInputSx}
                    labelSx={labelSx}
                  />

                  <AppInput
                    type="date"
                    label="To Date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    size="small"
                    inputSx={compactFilterInputSx}
                    labelSx={labelSx}
                  />
                </div>
              </div>
            </AppCard>
          )}
        </div>

        {/* Stats segment when an account is loaded */}
        {selectedAccountDetails && (
          <div className="px-2 mb-3 grid grid-cols-2 gap-2 text-[11px] text-text-muted">
            <div className="p-2 border border-border bg-surface rounded">
              <strong>Nature:</strong> {selectedAccountDetails.accountNature}
            </div>
            <div className="p-2 border border-border bg-surface rounded">
              <strong>Opening:</strong> ₹{Number(selectedAccountDetails.openingBalance || 0).toLocaleString("en-IN")} {selectedAccountDetails.openingBalanceType}
            </div>
          </div>
        )}

        {/* Content list */}
        <div className="px-2 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying ledger history...
              </AppText>
            </div>
          ) : !filters.accountId ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiBookOpen className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Account Selected
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                Choose an account from the filters panel to view its postings ledger.
              </AppText>
            </div>
          ) : ledgerEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiCalendar className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Posting History Found
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                There are no posting records for this account within the selected dates.
              </AppText>
            </div>
          ) : (
            ledgerEntries.map((e) => {
              const isDebitBal = e.runningBalance >= 0;

              return (
                <AppCard
                  key={e._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={ledgerCardSx}
                >
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-text font-mono text-[12.5px]">
                        {e.voucherNumber || "OP-BAL"}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {formatDate(e.voucherDate)}
                      </span>
                    </div>

                    {e.narration && (
                      <p className="text-[11.5px] leading-relaxed text-text">
                        {e.narration}
                      </p>
                    )}

                    <div className="border-t border-border/50 pt-2 flex items-center justify-between text-[11px]">
                      <div className="flex gap-2">
                        {e.debit > 0 && (
                          <span className="text-[#2b8a3e] font-bold">
                            Dr: ₹{e.debit.toLocaleString("en-IN")}
                          </span>
                        )}
                        {e.credit > 0 && (
                          <span className="text-[#c92a2a] font-bold">
                            Cr: ₹{e.credit.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-text-muted font-normal block">Running Balance</span>
                        <strong className="text-text font-extrabold text-[12px]">
                          ₹{Math.abs(e.runningBalance).toLocaleString("en-IN")}
                          <span className="text-[8.5px] text-text-muted font-black ml-0.5 uppercase">
                            {isDebitBal ? "dr" : "cr"}
                          </span>
                        </strong>
                      </div>
                    </div>
                  </div>
                </AppCard>
              );
            })
          )}

          {/* Conditional Pagination Footer */}
          {shouldRenderPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalEntries}
                onPageChange={handlePageChange}
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
  px: 0.5,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "18.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-primary)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const filterCardSx = {
  mt: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const labelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const ledgerCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const paginationFooterWrapperSx = {
  pt: 2,
  pb: 2,
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": { width: "100%" },
};

export default LedgerMobilePage;
