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

const BankSlipsMobilePage = ({
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
}) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

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

  const handleCardClick = (slipId) => {
    navigate(ROUTES.BANK_SLIP_DETAILS(slipId));
  };

  const getTypeBadge = (type) => {
    const isDeposit = String(type).toUpperCase() === "CASH_DEPOSIT";
    const bg = isDeposit ? "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]" : "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]";
    const label = isDeposit ? "Deposit" : "Withdrawal";

    return (
      <span className={`inline-flex items-center rounded-md px-1.5 py-0.2 text-[9px] font-semibold border ${bg}`}>
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
      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8.5px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const totalPages = Math.ceil(totalSlips / pageSize) || 1;
  const shouldRenderPagination = bankSlips.length > 0;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Bank pay-in Slips
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Verify counter cash deposits/withdrawals
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
                placeholder="Search slips..."
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
                  label="Slip Type"
                  name="slipType"
                  value={searchParams.slipType}
                  onChange={(e) => handleFilterChange("slipType", e.target.value)}
                  options={typeOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />

                <AppSelect
                  label="Verification Status"
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
                  label="Linked settlement bank"
                  name="bankAccountId"
                  value={searchParams.bankAccountId}
                  onChange={(e) => handleFilterChange("bankAccountId", e.target.value)}
                  options={bankAccountOptions}
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
                Querying bank slips...
              </AppText>
            </div>
          ) : bankSlips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiInbox className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Bank Slips Found
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                Try adjusting your filters or search keywords.
              </AppText>
            </div>
          ) : (
            bankSlips.map((slip) => {
              const linkedBank = slip.bankAccountId;
              const bankLabel = linkedBank
                ? `${linkedBank.bankName || "Bank"} - *${String(linkedBank.accountNumber || "").slice(-4)}`
                : "-";

              return (
                <AppCard
                  key={slip._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  onClick={() => handleCardClick(slip._id)}
                  sx={slipCardSx}
                >
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-primary text-[12.5px]">
                        {slip.slipNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {getTypeBadge(slip.slipType)}
                        {getStatusBadge(slip.status)}
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[11.5px] font-semibold text-text block">
                          {bankLabel}
                        </span>
                        <span className="text-[10px] text-text-muted block">
                          Date: {formatDate(slip.slipDate)}
                        </span>
                        {slip.bankSlipReference && (
                          <span className="text-[10px] text-text-muted block font-mono">
                            Ref: {slip.bankSlipReference}
                          </span>
                        )}
                      </div>
                      <span className="text-[14.5px] font-black text-text">
                        {formatCurrency(slip.amount)}
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
                totalItems={totalSlips}
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
  pb: 1.2,
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

const slipCardSx = {
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

export default BankSlipsMobilePage;
