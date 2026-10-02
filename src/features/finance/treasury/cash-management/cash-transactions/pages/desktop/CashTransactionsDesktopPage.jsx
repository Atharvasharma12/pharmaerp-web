import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiInbox,
  FiMoreVertical,
  FiRefreshCw,
} from "react-icons/fi";

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
  AppTable,
  AppMenu,
  PageHeader,
} from "@/components";
import { ROUTES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Cash Inward", value: "CASH_IN" },
  { label: "Cash Outward", value: "CASH_OUT" },
  { label: "Direct Expense", value: "EXPENSE" },
  { label: "Petty Cash Log", value: "PETTY_CASH" },
  { label: "Other Transaction", value: "OTHER" },
];

const directionOptions = [
  { label: "All Directions", value: "all" },
  { label: "Inward (Credit)", value: "CREDIT" },
  { label: "Outward (Debit)", value: "DEBIT" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Posted to Ledger", value: "POSTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const CashTransactionsDesktopPage = ({
  cashTransactions = [],

  searchParams,
  currentPage,
  pageSize,
  totalTransactions,
  isLoading = false,
  error,
  clearError,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleRefresh,
}) => {
  const navigate = useNavigate();

  const partitionOptions = useMemo(() => {
    return [
      { label: "All Partitions", value: "all" },
      { label: "Running Cash", value: "running" },
      { label: "Frozen Cash", value: "frozen" },
    ];
  }, []);

  const handleCreate = () => {
    navigate(ROUTES.CREATE_CASH_TRANSACTION);
  };

  const handleRowClick = (transactionId) => {
    navigate(ROUTES.CASH_TRANSACTION_DETAILS(transactionId));
  };

  // Get statistics metrics
  const stats = useMemo(() => {
    const counts = { total: totalTransactions, credits: 0, debits: 0, drafts: 0 };
    cashTransactions.forEach((t) => {
      const amt = t.amount || 0;
      if (t.direction === "CREDIT") counts.credits += amt;
      if (t.direction === "DEBIT") counts.debits += amt;
      if (t.status === "DRAFT") counts.drafts += 1;
    });
    return counts;
  }, [cashTransactions, totalTransactions]);

  const getDirectionBadge = (direction) => {
    const isCredit = String(direction).toUpperCase() === "CREDIT";
    const bg = isCredit ? "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]" : "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    const label = isCredit ? "INWARD" : "OUTWARD";

    return (
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9.5px] font-bold border ${bg}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "DRAFT") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "POSTED") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CANCELLED") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const columns = useMemo(() => [
    {
      id: "transactionNumber",
      label: "Transaction Number",
      minWidth: 150,
      render: (_, tx) => (
        <AppText variant="body2" sx={tableValueMonoSx}>
          {tx.transactionNumber}
        </AppText>
      ),
    },
    {
      id: "transactionType",
      label: "Type",
      minWidth: 120,
      render: (_, tx) => (
        <AppText variant="body2" sx={tableValueSx}>
          {tx.transactionType}
        </AppText>
      ),
    },
    {
      id: "direction",
      label: "Direction",
      minWidth: 110,
      render: (_, tx) => getDirectionBadge(tx.direction),
    },
    {
      id: "cashPartition",
      label: "Cash Partition",
      minWidth: 150,
      render: (_, tx) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {tx.cashPartition === "running" ? "Running Cash" : "Frozen Cash"}
        </AppText>
      ),
    },
    {
      id: "transactionDate",
      label: "Transaction Date",
      minWidth: 130,
      render: (_, tx) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {formatDate(tx.transactionDate)}
        </AppText>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      minWidth: 130,
      align: "right",
      render: (_, tx) => {
        const isCredit = tx.direction === "CREDIT";
        return (
          <span className={`text-[12.5px] font-black ${isCredit ? "text-[#2b8a3e]" : "text-[#fa5252]"}`}>
            {isCredit ? "+" : "-"} {formatCurrency(tx.amount)}
          </span>
        );
      },
    },
    {
      id: "referenceNumber",
      label: "Reference / Voucher",
      minWidth: 140,
      render: (_, tx) => (
        <AppText variant="body2" sx={tableValueMonoSx}>
          {tx.referenceNumber || "-"}
        </AppText>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      minWidth: 110,
      render: (_, tx) => getStatusBadge(tx.status),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      width: 80,
      render: (_, tx) => (
        <AppStack direction="row" gap={0.5} justify="flex-end" align="center">
          <AppMenu
            trigger={
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-transparent text-text-muted hover:text-text hover:bg-surface-hover focus:outline-none cursor-pointer"
              >
                <FiMoreVertical className="text-[16px]" />
              </button>
            }
            items={[
              {
                id: "view",
                label: "View Details",
                icon: <FiEye />,
                onClick: () => handleRowClick(tx._id),
              },
            ]}
            dense
            minWidth={140}
          />
        </AppStack>
      ),
    },
  ], []);

  const showPagination = totalTransactions > pageSize;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Cash Transactions"
          subtitle="Audit direct cash receipts, petty cash vouchers, cash expenses, and physical drawer transfers."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard", onClick: () => navigate(ROUTES.DASHBOARD) },
                  { label: "Finance & Accounting", onClick: () => navigate(ROUTES.FINANCE) },
                  { label: "Treasury", onClick: () => navigate(ROUTES.TREASURY) },
                  { label: "Cash Transactions", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                startIcon={<FiRefreshCw />}
                onClick={handleRefresh}
                loading={isLoading}
                sx={importButtonSx}
              >
                Refresh
              </AppButton>
              <AppButton
                variant="filled"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleCreate}
                sx={primaryButtonSx}
              >
                Create Transaction
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-4 gap-4">
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Total Postings</span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">{stats.total}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                <FiActivity className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Credits (Inward)</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">{formatCurrency(stats.credits)}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiTrendingUp className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Debits (Outward)</span>
                <span className="text-[20px] font-extrabold text-[#fa5252] mt-1 block">{formatCurrency(stats.debits)}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff5f5] text-[#fa5252] flex items-center justify-center border border-[#ffc9c9]">
                <FiTrendingDown className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Draft Transactions</span>
                <span className="text-[20px] font-extrabold text-[#f08c00] mt-1 block">{stats.drafts}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff9db] text-[#f08c00] flex items-center justify-center border border-[#ffe066]">
                <FiActivity className="text-[18px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Main Content Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={mainCardSx}
        >
          {/* Filters Toolbar */}
          <div className="p-4 border-b border-border bg-surface-hover/20 flex items-center justify-between gap-4">
            {/* Left side: Search input */}
            <AppInput
              name="search"
              value={searchParams.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tx number or narration..."
              startIcon={<FiSearch />}
              size="small"
              sx={searchFieldSx}
              inputSx={searchFieldInputSx}
            />

            {/* Right side: Dropdown filters */}
            <div className="flex items-center gap-2">
              <AppSelect
                name="transactionType"
                value={searchParams.transactionType}
                onChange={(e) => handleFilterChange("transactionType", e.target.value)}
                options={typeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 145, minWidth: 145 }}
                inputSx={compactFilterInputSx}
              />

              <AppSelect
                name="direction"
                value={searchParams.direction}
                onChange={(e) => handleFilterChange("direction", e.target.value)}
                options={directionOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 145, minWidth: 145 }}
                inputSx={compactFilterInputSx}
              />

              <AppSelect
                name="status"
                value={searchParams.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={statusOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 125, minWidth: 125 }}
                inputSx={compactFilterInputSx}
              />

              <AppSelect
                name="cashPartition"
                value={searchParams.cashPartition}
                onChange={(e) => handleFilterChange("cashPartition", e.target.value)}
                options={partitionOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 150, minWidth: 150 }}
                inputSx={compactFilterInputSx}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Querying cash transactions...
                </AppText>
              </div>
            ) : cashTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Transactions Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Adjust search keyword or create a new cash transaction entry.
                </AppText>
              </div>
            ) : (
              <AppTable
                columns={columns}
                rows={cashTransactions}
                getRowId={(row) => row._id}
                sx={tableSx}
                headSx={tableHeadSx}
                cellSx={tableCellSx}
              />
            )}
          </div>

          {/* Table Footer */}
          {showPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalTransactions}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
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

const primaryButtonSx = {
  height: 38,
  px: 2.5,
  fontSize: "12.5px",
  fontWeight: 700,
  bgcolor: "#00b85c",
  color: "white",
  whiteSpace: "nowrap",
  "&:hover": { bgcolor: "#009e4f" },
};

const importButtonSx = {
  height: 38,
  px: 2.5,
  fontSize: "12.5px",
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
  bgcolor: "white",
  whiteSpace: "nowrap",
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

const searchFieldSx = {
  width: 250,
};

const searchFieldInputSx = {
  height: 32,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const tableSx = {
  width: "100%",
  "& .MuiTable-root": {
    width: "100%",
  },
};

const tableHeadSx = {
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 25%, var(--app-color-surface))",
  "& th": {
    fontSize: "11px",
    fontWeight: 750,
    textTransform: "uppercase",
    color: "var(--app-color-text-muted)",
    py: 1.5,
    borderBottom: "1px solid var(--app-color-divider)",
  },
};

const tableCellSx = {
  py: 1.5,
  fontSize: "12.5px",
  borderBottom: "1px solid var(--app-color-divider)",
};

const tableValueSx = {
  fontSize: "12.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const tableValueMutedSx = {
  fontSize: "12.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const tableValueMonoSx = {
  fontSize: "12px",
  fontFamily: "var(--font-mono, monospace)",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const paginationFooterWrapperSx = {
  px: 2,
  py: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  width: "100%",
  "& > div": {
    width: "auto",
  },
};

export default CashTransactionsDesktopPage;
