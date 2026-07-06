import React, { useMemo } from "react";
import {
  FiSearch,
  FiBookOpen,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiEye,
  FiRefreshCw,
  FiMoreHorizontal,
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
  AppSearchInput,
  AppIconButton,
  AppMenu,
  AppEmptyState,
  AppAlert,
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
  handleRefresh,
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

  const statsList = useMemo(() => [
    {
      id: "accounts_tracked",
      title: "Accounts Tracked",
      value: stats.total,
      description: "Chart of accounts monitored",
      colorVariant: "primary",
      icon: <FiBookOpen />,
    },
    {
      id: "debit_balances",
      title: "Debit Balances (DR)",
      value: stats.dr,
      description: "Accounts with active debits",
      colorVariant: "success",
      icon: <FiArrowUpCircle />,
    },
    {
      id: "credit_balances",
      title: "Credit Balances (CR)",
      value: stats.cr,
      description: "Accounts with active credits",
      colorVariant: "error",
      icon: <FiArrowDownCircle />,
    },
  ], [stats]);

  const getBalanceTypeBadge = (type) => {
    const raw = String(type || "").toUpperCase();
    return (
      <AppTag
        label={raw}
        variant="soft"
        colorVariant={balanceTypeColorMap[raw] || "neutral"}
        rounded="md"
        sx={tagSx}
      />
    );
  };

  const columns = useMemo(() => [
    {
      id: "accountCode",
      key: "accountCode",
      label: "Account Code",
      minWidth: 140,
      render: (_, b) => (
        <AppText variant="body2" sx={tableValueMonoSx}>
          {b.accountId?.accountCode || "-"}
        </AppText>
      ),
    },
    {
      id: "accountName",
      key: "accountName",
      label: "Account Name",
      minWidth: 220,
      render: (_, b) => (
        <AppText
          variant="body2"
          onClick={() => handleViewDetails(b.accountId?._id || b.accountId)}
          sx={accountNameSx}
        >
          {b.accountId?.accountName || "Unknown Account"}
        </AppText>
      ),
    },
    {
      id: "debitTotal",
      key: "debitTotal",
      label: "Debit Total (Dr)",
      minWidth: 150,
      align: "right",
      render: (_, b) => (
        <AppText variant="body2" sx={debitAmountSx}>
          {formatCurrency(b.debitTotal || 0)}
        </AppText>
      ),
    },
    {
      id: "creditTotal",
      key: "creditTotal",
      label: "Credit Total (Cr)",
      minWidth: 150,
      align: "right",
      render: (_, b) => (
        <AppText variant="body2" sx={creditAmountSx}>
          {formatCurrency(b.creditTotal || 0)}
        </AppText>
      ),
    },
    {
      id: "balance",
      key: "balance",
      label: "Current Balance",
      minWidth: 180,
      align: "right",
      render: (_, b) => (
        <AppStack direction="row" align="center" justify="flex-end" gap={0.8}>
          <AppText variant="body2" sx={balanceAmountSx}>
            {formatCurrency(b.balance || 0)}
          </AppText>
          {getBalanceTypeBadge(b.balanceType)}
        </AppStack>
      ),
    },
    {
      id: "lastTransactionAt",
      key: "lastTransactionAt",
      label: "Last Activity",
      minWidth: 150,
      align: "center",
      render: (_, b) => (
        <AppText variant="body2" sx={tableValueSx}>
          {b.lastTransactionAt ? formatDate(b.lastTransactionAt) : "Never"}
        </AppText>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Action",
      align: "right",
      width: 70,
      render: (_, b) => (
        <RowActions
          balance={b}
          onView={handleViewDetails}
          onRecalculate={handleRecalculate}
          disabled={isRecalculating}
        />
      ),
    },
  ], [isRecalculating, handleViewDetails, handleRecalculate]);

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
              Account Balances
            </AppHeading>
            <AppText variant="body2" sx={pageHeaderSubtitleSx}>
              Audit aggregate balances, track debit/credit ledger sums, and verify chart of accounts.
            </AppText>
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Finance & Accounting", href: "/finance" },
                { label: "Account Balances", current: true },
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

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-3 gap-3">
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
            <div className="grid grid-cols-[minmax(0,1fr)_180px] items-center gap-3">
              <AppSearchInput
                name="search"
                value={searchParams.search}
                onChange={handleSearchChange}
                placeholder="Search account name/code..."
                clearable
                onClear={() => handleSearchChange("")}
                size="small"
                variant="bordered"
                rounded="md"
                sx={searchSx}
                inputSx={filterInputSx}
              />

              <AppSelect
                name="balanceType"
                value={searchParams.balanceType}
                onChange={(e) => handleFilterChange("balanceType", e.target.value)}
                options={balanceTypeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={selectSx}
                inputSx={filterInputSx}
              />
            </div>
          </div>

          {/* Table Container */}
          {isLoading ? (
            <AppTableSkeleton rows={8} columns={7} showHeader={false} />
          ) : accountBalances.length === 0 ? (
            <AppEmptyState
              title="No Account Balances Found"
              description="There are no balances matching your search criteria."
              icon={<FiBookOpen />}
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppTable
              columns={columns}
              rows={accountBalances}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1150}
              maxHeight="calc(100vh - 340px)"
              sx={tableSx}
              headSx={tableHeadSx}
              cellSx={tableCellSx}
            />
          )}

          {/* Table Footer */}
          {totalBalances > pageSize ? (
            <TableFooter
              totalBalances={totalBalances}
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

const RowActions = ({ balance, onView, onRecalculate, disabled }) => {
  const items = [
    { id: "view", label: "View Details", icon: <FiEye />, onClick: () => onView(balance.accountId?._id || balance.accountId) },
    {
      id: "recalculate",
      label: "Recalculate",
      icon: <FiRefreshCw />,
      onClick: () => onRecalculate(balance.accountId?._id || balance.accountId),
      disabled
    },
  ];

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          aria-label="Balance actions"
          className="inline-flex h-auto w-auto items-center justify-center border-0 bg-transparent p-1.5 text-text-muted hover:text-primary rounded transition hover:bg-surface-hover/40 shadow-none outline-none focus:bg-transparent active:bg-transparent"
        >
          <FiMoreHorizontal className="text-[18px]" />
        </button>
      }
      items={items}
      dense
      minWidth={140}
    />
  );
};

const TableFooter = ({
  totalBalances,
  currentPage,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalBalances);
  const totalPages = Math.ceil(totalBalances / pageSize) || 1;

  return (
    <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
      <AppText variant="body2" sx={footerTextSx}>
        Showing {startEntry} to {endEntry} of {totalBalances} balances
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
            { id: "10", label: "10 per page", onClick: () => handlePageSizeChange(10) },
            { id: "20", label: "20 per page", onClick: () => handlePageSizeChange(20) },
            { id: "50", label: "50 per page", onClick: () => handlePageSizeChange(50) },
            { id: "100", label: "100 per page", onClick: () => handlePageSizeChange(100) },
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

const searchSx = { width: "100%" };
const selectSx = { width: "100%" };
const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
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

const accountNameSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-primary)",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
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
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const FiChevronLeft = (props) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>
);

export default AccountBalancesDesktopPage;
