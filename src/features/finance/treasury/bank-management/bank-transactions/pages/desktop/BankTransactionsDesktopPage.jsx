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
  PageHeader,
} from "@/components";
import { ROUTES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Deposit", value: "DEPOSIT" },
  { label: "Withdrawal", value: "WITHDRAWAL" },
  { label: "NEFT Transfer", value: "NEFT" },
  { label: "RTGS Transfer", value: "RTGS" },
  { label: "IMPS Transfer", value: "IMPS" },
  { label: "UPI Pay", value: "UPI" },
  { label: "Cheque", value: "CHEQUE" },
  { label: "Bank Charges", value: "BANK_CHARGES" },
  { label: "Interest Credited", value: "INTEREST" },
  { label: "Other", value: "OTHER" },
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

const BankTransactionsDesktopPage = ({
  bankTransactions = [],
  bankAccounts = [],
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
}) => {
  const navigate = useNavigate();

  const bankAccountOptions = useMemo(() => {
    return [
      { label: "All Bank Accounts", value: "all" },
      ...bankAccounts.map((b) => ({
        label: `${b.bankMasterId?.name || b.accountName || "Bank"} - *${String(b.accountNumber || "").slice(-4)}`,
        value: b._id,
      })),
    ];
  }, [bankAccounts]);

  const handleCreate = () => {
    navigate(ROUTES.CREATE_BANK_TRANSACTION);
  };

  const handleRowClick = (transactionId) => {
    navigate(ROUTES.BANK_TRANSACTION_DETAILS(transactionId));
  };

  // Get statistics metrics
  const stats = useMemo(() => {
    const counts = { total: totalTransactions, credits: 0, debits: 0, drafts: 0 };
    bankTransactions.forEach((t) => {
      const amt = t.amount || 0;
      if (t.direction === "CREDIT") counts.credits += amt;
      if (t.direction === "DEBIT") counts.debits += amt;
      if (t.status === "DRAFT") counts.drafts += 1;
    });
    return counts;
  }, [bankTransactions, totalTransactions]);

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

  const showPagination = bankTransactions.length > 0;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Bank Transactions"
          subtitle="Audit ledger transactions, credit/debit bank statements, and account postings."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Treasury" },
                  { label: "Bank Transactions", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
              <AppButton
                variant="contained"
                colorVariant="primary"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleCreate}
                sx={createBtnSx}
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
          <div className="overflow-x-auto w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Querying bank transactions...
                </AppText>
              </div>
            ) : bankTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Transactions Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Adjust search keyword or create a new bank transaction entry.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Transaction Number</th>
                    <th className="py-3 px-4 font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Direction</th>
                    <th className="py-3 px-4 font-bold">Linked Account</th>
                    <th className="py-3 px-4 font-bold">Transaction Date</th>
                    <th className="py-3 px-4 font-bold">Amount</th>
                    <th className="py-3 px-4 font-bold">Reference / UTR</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bankTransactions.map((tx) => {
                    const linkedBank = tx.bankAccountId;
                    const bankLabel = linkedBank
                      ? `${linkedBank.bankName || "Bank"} - *${String(linkedBank.accountNumber || "").slice(-4)}`
                      : "-";

                    const isCredit = tx.direction === "CREDIT";

                    return (
                      <tr
                        key={tx._id}
                        onClick={() => handleRowClick(tx._id)}
                        className="border-b border-border hover:bg-surface-hover/20 transition cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-bold text-primary hover:underline">
                          {tx.transactionNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text">
                          {tx.transactionType}
                        </td>
                        <td className="py-3.5 px-4">
                          {getDirectionBadge(tx.direction)}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted font-semibold">
                          {bankLabel}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted">
                          {formatDate(tx.transactionDate)}
                        </td>
                        <td
                          className={`py-3.5 px-4 font-black ${
                            isCredit ? "text-[#2b8a3e]" : "text-[#fa5252]"
                          }`}
                        >
                          {isCredit ? "+" : "-"} {formatCurrency(tx.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted font-mono">
                          {tx.referenceNumber || "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleRowClick(tx._id)}
                            className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-hover/40 rounded transition cursor-pointer"
                            title="View Details"
                          >
                            <FiEye className="text-[14px]" />
                          </button>
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
                totalItems={totalTransactions}
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

const createBtnSx = {
  height: 32,
  fontSize: "11.5px",
  fontWeight: 600,
  bgcolor: "var(--app-color-primary)",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
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

export default BankTransactionsDesktopPage;
