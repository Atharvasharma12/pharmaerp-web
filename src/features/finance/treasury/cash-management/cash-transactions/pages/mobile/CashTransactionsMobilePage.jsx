import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiInbox,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";

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

const CashTransactionsMobilePage = ({
  cashTransactions = [],
  cashAccounts = [],
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
  const [showFilters, setShowFilters] = useState(false);

  const cashAccountOptions = useMemo(() => {
    return [
      { label: "All Cash Registers", value: "all" },
      ...cashAccounts.map((c) => ({
        label: `${c.accountName} (${c.currency || "USD"})`,
        value: c._id,
      })),
    ];
  }, [cashAccounts]);

  const handleCreate = () => {
    navigate(ROUTES.CREATE_CASH_TRANSACTION);
  };

  const handleCardClick = (transactionId) => {
    navigate(ROUTES.CASH_TRANSACTION_DETAILS(transactionId));
  };

  const getDirectionBadge = (direction) => {
    const isCredit = String(direction).toUpperCase() === "CREDIT";
    const bg = isCredit ? "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]" : "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    const label = isCredit ? "IN" : "OUT";

    return (
      <span className={`inline-flex items-center rounded-md px-1.5 py-0.2 text-[8.5px] font-bold border ${bg}`}>
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
      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const shouldRenderPagination = cashTransactions.length > 0;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Cash Transactions
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Verify and manage cash ledger entries
              </AppText>
            </AppBox>

            <AppIconButton
              icon={<FiPlus />}
              variant="filled"
              colorVariant="primary"
              size="small"
              rounded="md"
              onClick={handleCreate}
              sx={actionHeaderIconBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* Filters Toolbar */}
        <div className="px-2 mb-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <AppInput
                name="search"
                value={searchParams.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search transactions..."
                startIcon={<FiSearch />}
                size="small"
                inputSx={compactFilterInputSx}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 border rounded-md flex items-center gap-1.5 text-[11.5px] font-bold transition ${
                showFilters
                  ? "bg-primary-soft border-primary/40 text-primary"
                  : "bg-surface border-border text-text"
              }`}
            >
              <FiFilter />
              <span>Filters</span>
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

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
                  label="Transaction Type"
                  name="transactionType"
                  value={searchParams.transactionType}
                  onChange={(e) => handleFilterChange("transactionType", e.target.value)}
                  options={typeOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />

                <AppSelect
                  label="Flow Direction"
                  name="direction"
                  value={searchParams.direction}
                  onChange={(e) => handleFilterChange("direction", e.target.value)}
                  options={directionOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />

                <AppSelect
                  label="Post Status"
                  name="status"
                  value={searchParams.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  options={statusOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />

                <AppSelect
                  label="Linked Cash Account"
                  name="cashAccountId"
                  value={searchParams.cashAccountId}
                  onChange={(e) => handleFilterChange("cashAccountId", e.target.value)}
                  options={cashAccountOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />
              </div>
            </AppCard>
          )}
        </div>

        {/* Content list */}
        <div className="px-2 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying cash statements...
              </AppText>
            </div>
          ) : cashTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiInbox className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Statements Found
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                Adjust search keyword filters.
              </AppText>
            </div>
          ) : (
            cashTransactions.map((tx) => {
              const linkedCash = tx.cashAccountId;
              const cashLabel = linkedCash ? linkedCash.accountName : "-";
              const isCredit = tx.direction === "CREDIT";

              return (
                <AppCard
                  key={tx._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  onClick={() => handleCardClick(tx._id)}
                  sx={transactionCardSx}
                >
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-primary text-[12.5px] truncate max-w-[150px]">
                        {tx.transactionNumber}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {getDirectionBadge(tx.direction)}
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-text block truncate max-w-[200px]">
                          {tx.transactionType} ({cashLabel})
                        </span>
                        <span className="text-[9.5px] text-text-muted block">
                          Date: {formatDate(tx.transactionDate)}
                        </span>
                        {tx.referenceNumber && (
                          <span className="text-[9.5px] text-text-muted block font-mono">
                            Ref/Voucher: {tx.referenceNumber}
                          </span>
                        )}
                      </div>
                      <span className={`text-[14.5px] font-black shrink-0 ${isCredit ? "text-[#2b8a3e]" : "text-[#fa5252]"}`}>
                        {isCredit ? "+" : "-"} {formatCurrency(tx.amount)}
                      </span>
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
                totalItems={totalTransactions}
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
  bgcolor: "var(--app-color-primary)",
  color: "white",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const filterCardSx = {
  mt: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const labelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};

const transactionCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: "var(--app-color-primary)",
    transform: "translateY(-1px)",
  },
};

const paginationFooterWrapperSx = {
  pt: 2,
  pb: 2,
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": { width: "100%" },
};

export default CashTransactionsMobilePage;
