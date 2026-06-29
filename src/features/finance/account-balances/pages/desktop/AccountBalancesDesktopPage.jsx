import React, { useMemo } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiBookOpen,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiEye,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppIconButton,
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

const balanceTypeOptions = [
  { label: "All Balance Types", value: "all" },
  { label: "Debit Balances (DR)", value: "dr" },
  { label: "Credit Balances (CR)", value: "cr" },
];

const AccountBalancesDesktopPage = ({
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
}) => {
  // Aggregate stats
  const stats = useMemo(() => {
    const counts = { total: totalBalances, dr: 0, cr: 0 };
    accountBalances.forEach((b) => {
      const type = String(b.balanceType || "").toUpperCase();
      if (type === "DR") counts.dr++;
      else if (type === "CR") counts.cr++;
    });
    return counts;
  }, [accountBalances, totalBalances]);

  const showPagination = accountBalances.length > 0;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Account Balances"
          subtitle="Audit aggregate balances, track debit/credit ledger sums, and verify chart of accounts."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Account Balances", current: true },
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

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">
                  Accounts Tracked
                </span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">
                  {stats.total}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                <FiBookOpen className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">
                  Debit Balances (DR)
                </span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">
                  {stats.dr}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiArrowUpCircle className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">
                  Credit Balances (CR)
                </span>
                <span className="text-[20px] font-extrabold text-[#c92a2a] mt-1 block">
                  {stats.cr}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff5f5] text-[#c92a2a] flex items-center justify-center border border-[#ffc9c9]">
                <FiArrowDownCircle className="text-[18px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error
                ? "bg-danger-soft text-danger"
                : "bg-success-soft text-success"
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
              <AppInput
                label="Search Account"
                name="search"
                value={searchParams.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search account name/code..."
                startIcon={<FiSearch />}
                size="small"
                fullWidth={false}
                formControlSx={{ width: 280 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />

              <AppSelect
                label="Balance Type"
                name="balanceType"
                value={searchParams.balanceType}
                onChange={(e) =>
                  handleFilterChange("balanceType", e.target.value)
                }
                options={balanceTypeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth={false}
                formControlSx={{ width: 180 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText
                  variant="body1"
                  sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}
                >
                  Retrieving balance sheets...
                </AppText>
              </div>
            ) : accountBalances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiBookOpen className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading
                  level={3}
                  weight={600}
                  sx={{
                    m: 0,
                    fontSize: "14px",
                    color: "var(--app-color-text)",
                  }}
                >
                  No Account Balances Found
                </AppHeading>
                <AppText
                  variant="body2"
                  sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}
                >
                  There are no balances matching your search criteria.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Account Code</th>
                    <th className="py-3 px-4 font-bold">Account Name</th>
                    <th className="py-3 px-4 text-right font-bold">
                      Debit Total (Dr)
                    </th>
                    <th className="py-3 px-4 text-right font-bold">
                      Credit Total (Cr)
                    </th>
                    <th className="py-3 px-4 text-right font-bold">
                      Current Balance
                    </th>
                    <th className="py-3 px-4 text-center font-bold">
                      Last Activity
                    </th>
                    <th className="py-3 px-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountBalances.map((b) => {
                    const accName =
                      b.accountId?.accountName || "Unknown Account";
                    const accCode = b.accountId?.accountCode || "-";
                    const isDebitBal =
                      String(b.balanceType || "").toUpperCase() === "DR";

                    return (
                      <tr
                        key={b._id}
                        className="border-b border-border hover:bg-surface-hover/20 transition"
                      >
                        <td className="py-3.5 px-2 font-bold text-text font-mono">
                          {accCode}
                        </td>
                        <td className="py-3.5 px-2 font-semibold text-text">
                          {accName}
                        </td>
                        <td className="py-3.5 px-2 text-right font-semibold text-[#2b8a3e]">
                          ₹{" "}
                          {Number(b.debitTotal || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3.5 px-2 text-right font-semibold text-[#c92a2a]">
                          ₹{" "}
                          {Number(b.creditTotal || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3.5 px-2 text-right font-extrabold text-text">
                          ₹{" "}
                          {Number(b.balance || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                          <span className="text-[9.5px] text-text-muted font-black ml-1 uppercase">
                            {b.balanceType}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-center text-text-muted">
                          {b.lastTransactionAt
                            ? formatDate(b.lastTransactionAt)
                            : "Never"}
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <AppStack
                            direction="row"
                            gap={1}
                            justify="center"
                            align="center"
                          >
                            <AppIconButton
                              icon={<FiEye />}
                              variant="outlined"
                              colorVariant="primary"
                              size="small"
                              onClick={() =>
                                handleViewDetails(
                                  b.accountId?._id || b.accountId,
                                )
                              }
                              title="Details"
                            />
                            <AppButton
                              size="tiny"
                              variant="text"
                              colorVariant="neutral"
                              startIcon={<FiRefreshCw />}
                              onClick={() =>
                                handleRecalculate(
                                  b.accountId?._id || b.accountId,
                                )
                              }
                              disabled={isRecalculating}
                            >
                              Recalculate
                            </AppButton>
                          </AppStack>
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
                totalItems={totalBalances}
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

export default AccountBalancesDesktopPage;
