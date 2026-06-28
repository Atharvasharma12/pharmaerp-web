import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiLayers,
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

  const showPagination = bankSlips.length > 0;
  const totalPages = Math.ceil(totalSlips / pageSize) || 1;

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
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Treasury" },
                  { label: "Bank Slips", current: true },
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
                Create Bank Slip
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
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Total Deposits</span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">{stats.deposits}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiPlus className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Total Withdrawals</span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">{stats.withdrawals}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff0f6] text-[#d6336c] flex items-center justify-center border border-[#fcc2d7]">
                <FiLayers className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Pending Slips</span>
                <span className="text-[20px] font-extrabold text-[#f08c00] mt-1 block">{stats.pending}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff9db] text-[#f08c00] flex items-center justify-center border border-[#ffe066]">
                <FiLayers className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Confirmed Slips</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">{stats.confirmed}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiLayers className="text-[18px]" />
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
          <div className="p-4 border-b border-border bg-surface-hover/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
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

              <div className="flex items-center gap-2">
                <AppSelect
                  name="slipType"
                  value={searchParams.slipType}
                  onChange={(e) => handleFilterChange("slipType", e.target.value)}
                  options={typeOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
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
                  inputSx={compactFilterInputSx}
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full relative">
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
                  No Bank Slips Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Try adjusting your search criteria or create a new bank slip entry.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Slip Number</th>
                    <th className="py-3 px-4 font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Linked Bank</th>
                    <th className="py-3 px-4 font-bold">Slip Date</th>
                    <th className="py-3 px-4 font-bold">Amount</th>
                    <th className="py-3 px-4 font-bold">Reference No.</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bankSlips.map((slip) => {
                    const linkedBank = slip.bankAccountId;
                    const bankLabel = linkedBank
                      ? `${linkedBank.bankName || "Bank"} - *${String(linkedBank.accountNumber || "").slice(-4)}`
                      : "-";

                    return (
                      <tr
                        key={slip._id}
                        onClick={() => handleRowClick(slip._id)}
                        className="border-b border-border hover:bg-surface-hover/20 transition cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-bold text-primary hover:underline">
                          {slip.slipNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          {getTypeBadge(slip.slipType)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text">
                          {bankLabel}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted">
                          {formatDate(slip.slipDate)}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-text">
                          {formatCurrency(slip.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted font-mono">
                          {slip.bankSlipReference || "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(slip.status)}
                        </td>
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleRowClick(slip._id)}
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
                totalItems={totalSlips}
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

export default BankSlipsDesktopPage;
