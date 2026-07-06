import React, { useMemo } from "react";
import {
  FiRefreshCw,
  FiCalendar,
  FiBookOpen,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSelect,
  AppStack,
  AppText,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppStatCard,
  AppEmptyState,
  AppAlert,
  AppIconButton,
  AppMenu,
} from "@/components";
import { formatDate, formatCurrency } from "@/utils";

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
  handleRefresh,
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

  const statsList = useMemo(() => {
    if (!selectedAccountDetails) return [];
    return [
      {
        id: "account_nature",
        title: "Account Nature",
        value: selectedAccountDetails.accountNature || "-",
        description: "Classification of account",
        colorVariant: "primary",
        icon: <FiBookOpen />,
      },
      {
        id: "opening_balance",
        title: "Opening Balance",
        value: `${formatCurrency(selectedAccountDetails.openingBalance || 0)} ${selectedAccountDetails.openingBalanceType || ""}`,
        description: "Starting balance sheet value",
        colorVariant: "neutral",
        icon: <FiCalendar />,
      },
      {
        id: "total_debits",
        title: "Total Debits",
        value: formatCurrency(sums.debit),
        description: "Aggregated ledger debits",
        colorVariant: "success",
        icon: <FiTrendingUp />,
      },
      {
        id: "total_credits",
        title: "Total Credits",
        value: formatCurrency(sums.credit),
        description: "Aggregated ledger credits",
        colorVariant: "error",
        icon: <FiTrendingDown />,
      },
    ];
  }, [selectedAccountDetails, sums]);

  const columns = useMemo(
    () => [
      {
        id: "voucherDate",
        key: "voucherDate",
        label: "Voucher Date",
        minWidth: 130,
        render: (_, e) => (
          <AppText variant="body2" sx={tableValueSx}>
            {formatDate(e.voucherDate)}
          </AppText>
        ),
      },
      {
        id: "voucherNumber",
        key: "voucherNumber",
        label: "Voucher No.",
        minWidth: 140,
        render: (_, e) => (
          <AppText variant="body2" sx={tableValueMonoSx}>
            {e.voucherNumber || "OP-BAL"}
          </AppText>
        ),
      },
      {
        id: "narration",
        key: "narration",
        label: "Narration",
        minWidth: 320,
        render: (_, e) => (
          <AppText variant="body2" sx={narrationSx}>
            {e.narration || "-"}
          </AppText>
        ),
      },
      {
        id: "debit",
        key: "debit",
        label: "Debit (Dr)",
        minWidth: 150,
        align: "right",
        render: (_, e) => (
          <AppText variant="body2" sx={debitAmountSx}>
            {e.debit > 0 ? formatCurrency(e.debit) : "-"}
          </AppText>
        ),
      },
      {
        id: "credit",
        key: "credit",
        label: "Credit (Cr)",
        minWidth: 150,
        align: "right",
        render: (_, e) => (
          <AppText variant="body2" sx={creditAmountSx}>
            {e.credit > 0 ? formatCurrency(e.credit) : "-"}
          </AppText>
        ),
      },
      {
        id: "runningBalance",
        key: "runningBalance",
        label: "Running Balance",
        minWidth: 180,
        align: "right",
        render: (_, e) => {
          const isDebitBal = e.runningBalance >= 0;
          return (
            <AppStack
              direction="row"
              align="center"
              justify="flex-end"
              gap={0.8}
            >
              <AppText variant="body2" sx={balanceAmountSx}>
                {formatCurrency(Math.abs(e.runningBalance))}
              </AppText>
              <AppTag
                label={isDebitBal ? "DR" : "CR"}
                variant="soft"
                size="small"
                rounded="md"
                colorVariant={isDebitBal ? "success" : "error"}
                sx={tagSx}
              />
            </AppStack>
          );
        },
      },
    ],
    [],
  );

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <AppBox
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={pageHeaderSx}
        >
          <AppBox sx={pageHeaderContentSx}>
            <AppHeading level={1} weight={650}>
              General Ledger
            </AppHeading>
            <AppText variant="body2" sx={pageHeaderSubtitleSx}>
              Audit transaction posting trails, verify debits and credits, and
              view real-time running balances.
            </AppText>
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Finance & Accounting", href: "/finance" },
                { label: "General Ledger", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          </AppBox>

          <AppStack
            direction="row"
            align="center"
            justify="flex-end"
            gap={1.1}
            sx={{ flexShrink: 0 }}
          >
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
              sx={secondaryButtonSx}
            >
              Refresh
            </AppButton>
          </AppStack>
        </AppBox>

        {/* Selected Account Overview Stats */}
        {selectedAccountDetails && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {statsList.map((stat) => (
              <AppStatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                subtitle={stat.description}
                icon={stat.icon}
                colorVariant={stat.colorVariant}
                variant="default"
                sx={statCardSx}
                iconSx={statIconSx}
              />
            ))}
          </div>
        )}

        {/* Feedback alerts */}
        {(error || message) && (
          <AppAlert
            severity={error ? "error" : "success"}
            variant="soft"
            title={error ? "Something went wrong" : "Success"}
            closable
            onClose={clearFeedback}
            sx={alertSx}
          >
            {error || message}
          </AppAlert>
        )}

        {/* Table & Filters Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={tableCardSx}
        >
          {/* Filters Toolbar */}
          <div className="border-b border-border px-3.5 py-3">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-end gap-3 flex-wrap">
                <AppSelect
                  label="Select Account"
                  name="accountId"
                  value={filters.accountId}
                  onChange={(e) =>
                    handleFilterChange("accountId", e.target.value)
                  }
                  options={accountOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  formControlSx={{ width: 480, mr: 3 }}
                  inputSx={filterInputSx}
                  labelSx={filterLabelSx}
                />

                <AppBox
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <AppText sx={filterLabelSx}>From Date</AppText>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                    className="h-[36px] px-3 border border-border rounded-md text-[12px] bg-surface text-text focus:outline-none focus:border-primary w-[160px]"
                  />
                </AppBox>

                <AppBox
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <AppText sx={filterLabelSx}>To Date</AppText>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                    className="h-[36px] px-3 border border-border rounded-md text-[12px] bg-surface text-text focus:outline-none focus:border-primary w-[160px]"
                  />
                </AppBox>
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
          </div>

          {/* Table Container */}
          {isLoading ? (
            <AppTableSkeleton rows={8} columns={6} showHeader={false} />
          ) : !filters.accountId ? (
            <AppEmptyState
              title="No Account Selected"
              description="Choose an account from the dropdown selector to audit its posting ledger."
              icon={<FiBookOpen />}
              size="page"
              sx={stateSx}
            />
          ) : ledgerEntries.length === 0 ? (
            <AppEmptyState
              title="No Posting History Found"
              description="There are no posting records for this account within the selected dates."
              icon={<FiCalendar />}
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppTable
              columns={columns}
              rows={ledgerEntries}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1100}
              maxHeight="calc(100vh - 340px)"
              sx={tableSx}
              headSx={tableHeadSx}
              cellSx={tableCellSx}
            />
          )}

          {/* Table Footer */}
          {totalEntries > pageSize ? (
            <TableFooter
              totalEntries={totalEntries}
              currentPage={currentPage}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          ) : null}
        </AppCard>
      </div>
    </section>
  );
};

const TableFooter = ({
  totalEntries,
  currentPage,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;

  return (
    <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
      <AppText variant="body2" sx={footerTextSx}>
        Showing {startEntry} to {endEntry} of {totalEntries} ledger entries
      </AppText>

      <AppStack direction="row" align="center" gap={1}>
        <AppMenu
          trigger={
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              endIcon={<FiChevronRight className="rotate-90" />}
              sx={pageSizeButtonSx}
            >
              {pageSize} per page
            </AppButton>
          }
          items={[
            {
              id: "10",
              label: "10 per page",
              onClick: () => handlePageSizeChange(10),
            },
            {
              id: "25",
              label: "25 per page",
              onClick: () => handlePageSizeChange(25),
            },
            {
              id: "50",
              label: "50 per page",
              onClick: () => handlePageSizeChange(50),
            },
            {
              id: "100",
              label: "100 per page",
              onClick: () => handlePageSizeChange(100),
            },
          ]}
          dense
          minWidth={120}
        />

        <AppIconButton
          icon={<FiChevronLeft />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />

        <span className="flex h-[31px] min-w-[31px] items-center justify-center rounded-md bg-primary px-2 text-[12px] font-bold text-text-inverse">
          {currentPage}
        </span>

        <AppIconButton
          icon={<FiChevronRight />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </AppStack>
    </div>
  );
};

// Styling variables
const pageHeaderSx = { width: "100%" };
const pageHeaderSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};

const breadcrumbSx = { mt: 1 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };

const statCardSx = {
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  p: 1.5,
  "& p:first-of-type": { fontSize: "11px" },
  "& h1, & h2, & h3, & h4": { fontSize: "18px" },
  "& p:last-of-type": { fontSize: "11px" },
};
const statIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "11px",
};

const tableCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  "& > div": { minWidth: 0 },
};

const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const filterLabelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const recalcBtnSx = {
  height: 36,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};

const tableSx = {
  "& .MuiTableContainer-root": {
    borderRadius: 0,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": { display: "none" },
  },
};
const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11.2px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};
const tableCellSx = {
  py: 1.2,
  fontSize: "12px",
  borderColor: "var(--app-color-border)",
};

const tableValueSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};
const tableValueMonoSx = {
  fontSize: "12px",
  fontWeight: 700,
  fontFamily: "var(--font-mono, monospace)",
  color: "var(--app-color-text)",
};
const narrationSx = {
  fontSize: "12px",
  fontWeight: 550,
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 320,
};
const debitAmountSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-success)",
};
const creditAmountSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-error)",
};
const balanceAmountSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const tagSx = {
  width: "fit-content",
  height: 22,
  px: 1,
  fontSize: "10.5px",
  fontWeight: 700,
};

const footerTextSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };
const pageSizeButtonSx = {
  height: 34,
  minWidth: 122,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 600,
};
const stateSx = { minHeight: 430 };

const FiChevronRight = (props) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
const FiChevronLeft = (props) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export default LedgerDesktopPage;
