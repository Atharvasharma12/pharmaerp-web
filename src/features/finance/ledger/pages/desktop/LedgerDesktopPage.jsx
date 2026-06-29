import React, { useMemo } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiCalendar,
  FiBookOpen,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppTablePagination,
  AppText,
  PageHeader,
} from "@/components";
import { formatDate } from "@/utils";

const LedgerDesktopPage = ({
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
  // Compute total debit/credit sums
  const sums = useMemo(() => {
    let debit = 0;
    let credit = 0;
    ledgerEntries.forEach((e) => {
      debit += e.debit || 0;
      credit += e.credit || 0;
    });
    return { debit, credit };
  }, [ledgerEntries]);

  const showPagination = ledgerEntries.length > 0;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="General Ledger"
          subtitle="Audit transaction posting trails, verify debits and credits, and view real-time running balances."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "General Ledger", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Selected Account Overview Stats */}
        {selectedAccountDetails && (
          <div className="mt-5 grid grid-cols-4 gap-4">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Account Nature</span>
                  <span className="text-[16px] font-extrabold text-primary mt-1 block">
                    {selectedAccountDetails.accountNature}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                  <FiBookOpen className="text-[18px]" />
                </div>
              </div>
            </AppCard>

            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Opening Balance</span>
                  <span className="text-[16px] font-extrabold text-text mt-1 block">
                    ₹ {Number(selectedAccountDetails.openingBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    <span className="text-[11px] font-black uppercase text-text-muted ml-1">
                      {selectedAccountDetails.openingBalanceType}
                    </span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                  <FaRupeeSign className="text-[16px]" />
                </div>
              </div>
            </AppCard>

            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Total Debits</span>
                  <span className="text-[16px] font-extrabold text-[#2b8a3e] mt-1 block">
                    ₹ {sums.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                  <FiTrendingUp className="text-[18px]" />
                </div>
              </div>
            </AppCard>

            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Total Credits</span>
                  <span className="text-[16px] font-extrabold text-[#c92a2a] mt-1 block">
                    ₹ {sums.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#fff5f5] text-[#c92a2a] flex items-center justify-center border border-[#ffc9c9]">
                  <FiTrendingDown className="text-[18px]" />
                </div>
              </div>
            </AppCard>
          </div>
        )}

        {/* Feedback messages */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span>{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Table & Filters Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={mainCardSx}
        >
          {/* Filters Toolbar */}
          <div className="p-4 border-b border-border bg-surface-hover/20 flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <AppSelect
                label="Select Account"
                name="accountId"
                value={filters.accountId}
                onChange={(e) => handleFilterChange("accountId", e.target.value)}
                options={accountOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth={false}
                formControlSx={{ width: 280 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />

              <AppInput
                type="date"
                label="From Date"
                name="startDate"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                size="small"
                fullWidth={false}
                formControlSx={{ width: 160 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />

              <AppInput
                type="date"
                label="To Date"
                name="endDate"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                size="small"
                fullWidth={false}
                formControlSx={{ width: 160 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />
            </div>

            <AppButton
              variant="outlined"
              colorVariant="primary"
              size="small"
              rounded="md"
              startIcon={<FiRefreshCw />}
              onClick={handleRecalculate}
              disabled={isRecalculating || !filters.accountId || isLoading}
              loading={isRecalculating}
              sx={recalcBtnSx}
            >
              Recalculate Balance
            </AppButton>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Retrieving ledger data...
                </AppText>
              </div>
            ) : !filters.accountId ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiBookOpen className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Account Selected
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Choose an account from the dropdown selector to audit its posting ledger.
                </AppText>
              </div>
            ) : ledgerEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiCalendar className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Posting History Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  There are no posting records for this account within the selected dates.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Voucher Date</th>
                    <th className="py-3 px-4 font-bold">Voucher No.</th>
                    <th className="py-3 px-4 font-bold">Narration</th>
                    <th className="py-3 px-4 text-right font-bold">Debit (Dr)</th>
                    <th className="py-3 px-4 text-right font-bold">Credit (Cr)</th>
                    <th className="py-3 px-4 text-right font-bold">Running Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map((e) => {
                    const isDebitBal = e.runningBalance >= 0;

                    return (
                      <tr
                        key={e._id}
                        className="border-b border-border hover:bg-surface-hover/20 transition"
                      >
                        <td className="py-3.5 px-4 text-text-muted">
                          {formatDate(e.voucherDate)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-text font-mono">
                          {e.voucherNumber || "OP-BAL"}
                        </td>
                        <td className="py-3.5 px-4 text-text max-w-[350px] truncate" title={e.narration}>
                          {e.narration || "-"}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#2b8a3e]">
                          {e.debit > 0 ? `₹ ${e.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#c92a2a]">
                          {e.credit > 0 ? `₹ ${e.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-text">
                          ₹ {Math.abs(e.runningBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          <span className="text-[9.5px] text-text-muted font-black ml-1 uppercase">
                            {isDebitBal ? "dr" : "cr"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          {showPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalEntries}
                onPageChange={handlePageChange}
              />
            </AppBox>
          )}
        </AppCard>
      </div>
    </section>
  );
};

// Styling variables
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  cursor: "pointer",
  "&:hover": { color: "var(--app-color-primary)" },
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "23px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};

const statCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const mainCardSx = {
  mt: 5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const filterLabelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const recalcBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 600,
};

const paginationFooterWrapperSx = {
  px: 2,
  pt: 2,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": { width: "100%" },
};

export default LedgerDesktopPage;
