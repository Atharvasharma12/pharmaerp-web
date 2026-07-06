import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiClock,
  FiInbox,
  FiTrendingUp,
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
  { label: "Cash Deposit", value: "CASH_DEPOSIT" },
  { label: "Cash Withdrawal", value: "CASH_WITHDRAWAL" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const BankSlipsDesktopPage = ({
  bankSlips = [],
  bankAccounts = [],
  searchParams,
  currentPage,
  pageSize,
  totalSlips,
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

  const bankAccountOptions = useMemo(() => {
    return [
      { label: "All Settlement Banks", value: "all" },
      ...bankAccounts.map((b) => ({
        label: `${b.bankMasterId?.name || b.accountName || "Bank"} - *${String(b.accountNumber || "").slice(-4)}`,
        value: b._id,
      })),
    ];
  }, [bankAccounts]);

  const handleCreate = () => {
    navigate(ROUTES.CREATE_BANK_SLIP);
  };

  const handleRowClick = (slipId) => {
    navigate(ROUTES.BANK_SLIP_DETAILS(slipId));
  };

  // Get enums count statistics
  const stats = useMemo(() => {
    const counts = { deposits: 0, withdrawals: 0, pending: 0, confirmed: 0 };
    bankSlips.forEach((s) => {
      if (s.slipType === "CASH_DEPOSIT") counts.deposits += 1;
      if (s.slipType === "CASH_WITHDRAWAL") counts.withdrawals += 1;
      if (s.status === "PENDING") counts.pending += 1;
      if (s.status === "CONFIRMED") counts.confirmed += 1;
    });
    return counts;
  }, [bankSlips]);

  const getTypeBadge = (type) => {
    const isDeposit = String(type).toUpperCase() === "CASH_DEPOSIT";
    const bg = isDeposit ? "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]" : "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]";
    const label = isDeposit ? "Deposit" : "Withdrawal";

    return (
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold border ${bg}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "PENDING") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "SUBMITTED") bg = "bg-[#e7f5ff] text-[#1c7ed6] border-[#a5d8ff]";
    else if (raw === "CONFIRMED") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "REJECTED") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "CANCELLED") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const columns = useMemo(() => [
    {
      id: "slipNumber",
      label: "Slip Number",
      minWidth: 150,
      render: (_, slip) => (
        <AppText variant="body2" sx={tableValueMonoSx}>
          {slip.slipNumber}
        </AppText>
      ),
    },
    {
      id: "slipType",
      label: "Slip Type",
      minWidth: 130,
      render: (_, slip) => getTypeBadge(slip.slipType),
    },
    {
      id: "linkedAccount",
      label: "Linked Account",
      minWidth: 200,
      render: (_, slip) => {
        const bank = slip.bankAccountId;
        return (
          <AppText variant="body2" sx={tableValueSx}>
            {bank ? `${bank.bankName || "Bank"} - *${String(bank.accountNumber || "").slice(-4)}` : "-"}
          </AppText>
        );
      },
    },
    {
      id: "slipDate",
      label: "Slip Date",
      minWidth: 130,
      render: (_, slip) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {formatDate(slip.slipDate)}
        </AppText>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      minWidth: 130,
      align: "right",
      render: (_, slip) => (
        <span className="text-[12.5px] font-black text-text">
          {formatCurrency(slip.amount)}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      minWidth: 110,
      render: (_, slip) => getStatusBadge(slip.status),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      width: 80,
      render: (_, slip) => (
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
                onClick: () => handleRowClick(slip._id),
              },
            ]}
            dense
            minWidth={140}
          />
        </AppStack>
      ),
    },
  ], []);

  const showPagination = totalSlips > pageSize;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Bank pay-in Slips"
          subtitle="Record counter cash deposits/withdrawals and manage verification slips."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard", onClick: () => navigate(ROUTES.DASHBOARD) },
                  { label: "Finance & Accounting", onClick: () => navigate(ROUTES.FINANCE) },
                  { label: "Treasury", onClick: () => navigate(ROUTES.TREASURY) },
                  { label: "Bank Slips", current: true },
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
                New Slip
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
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Deposits Count</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">{stats.deposits}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiTrendingUp className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Withdrawals Count</span>
                <span className="text-[20px] font-extrabold text-[#d6336c] mt-1 block">{stats.withdrawals}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff0f6] text-[#d6336c] flex items-center justify-center border border-[#fcc2d7]">
                <FiTrendingUp className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Pending Approval</span>
                <span className="text-[20px] font-extrabold text-[#f08c00] mt-1 block">{stats.pending}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff9db] text-[#f08c00] flex items-center justify-center border border-[#ffe066]">
                <FiClock className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Confirmed Postings</span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">{stats.confirmed}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                <FiClock className="text-[18px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mt-4 p-3 text-[12.5px] font-semibold bg-danger-soft text-danger rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="font-bold hover:underline text-danger">Dismiss</button>
          </div>
        )}

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
              placeholder="Search slip number or narration..."
              startIcon={<FiSearch />}
              size="small"
              sx={searchFieldSx}
              inputSx={searchFieldInputSx}
            />

            {/* Right side: Dropdown filters */}
            <div className="flex items-center gap-2">
              <AppSelect
                name="slipType"
                value={searchParams.slipType}
                onChange={(e) => handleFilterChange("slipType", e.target.value)}
                options={typeOptions}
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
                sx={{ width: 145, minWidth: 145 }}
                inputSx={compactFilterInputSx}
              />

              <AppSelect
                name="bankAccountId"
                value={searchParams.bankAccountId}
                onChange={(e) => handleFilterChange("bankAccountId", e.target.value)}
                options={bankAccountOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 220, minWidth: 220 }}
                inputSx={compactFilterInputSx}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Querying bank slips...
                </AppText>
              </div>
            ) : bankSlips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Slips Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Adjust search filters or record a new bank pay-in slip.
                </AppText>
              </div>
            ) : (
              <AppTable
                columns={columns}
                rows={bankSlips}
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
                totalItems={totalSlips}
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

export default BankSlipsDesktopPage;
