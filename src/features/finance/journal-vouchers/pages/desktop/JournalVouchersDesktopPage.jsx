import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiInbox,
  FiMoreVertical,
  FiEdit2,
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
  AppMenu,
} from "@/components";
import { ROUTES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";

const typeOptions = [
  { label: "All Voucher Types", value: "all" },
  { label: "Journal Voucher", value: "JOURNAL" },
  { label: "Payment Voucher", value: "PAYMENT" },
  { label: "Receipt Voucher", value: "RECEIPT" },
  { label: "Contra Voucher", value: "CONTRA" },
  { label: "Purchase Voucher", value: "PURCHASE" },
  { label: "Sale Voucher", value: "SALE" },
  { label: "Opening Balance", value: "OPENING_BALANCE" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Approval", value: "PENDING_APPROVAL" },
  { label: "Approved", value: "APPROVED" },
  { label: "Posted", value: "POSTED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Reversed", value: "REVERSED" },
];

const JournalVouchersDesktopPage = ({
  journalVouchers = [],
  searchParams,
  currentPage,
  pageSize,
  totalVouchers,
  isLoading = false,
  error,
  clearError,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(ROUTES.CREATE_JOURNAL_VOUCHER);
  };

  const handleRowClick = (voucherId) => {
    navigate(ROUTES.JOURNAL_VOUCHER_DETAILS(voucherId));
  };

  const stats = useMemo(() => {
    const counts = { total: totalVouchers, draft: 0, pending: 0, posted: 0 };
    journalVouchers.forEach((v) => {
      const raw = String(v.status || "").toUpperCase();
      if (raw === "DRAFT") counts.draft += 1;
      else if (raw === "PENDING_APPROVAL") counts.pending += 1;
      else if (raw === "POSTED") counts.posted += 1;
    });
    return counts;
  }, [journalVouchers, totalVouchers]);

  const getTypeBadge = (type) => {
    const raw = String(type || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "JOURNAL") bg = "bg-[#f3f0ff] text-[#7048e8] border-[#d0bfff]";
    else if (raw === "PAYMENT") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "RECEIPT") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CONTRA") bg = "bg-[#e7f5ff] text-[#1c7ed6] border-[#a5d8ff]";
    else if (raw === "PURCHASE") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "SALE") bg = "bg-[#e6fcf5] text-[#0ca678] border-[#96f2d7]";

    return (
      <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold border ${bg}`}>
        {raw}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "DRAFT") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";
    else if (raw === "PENDING_APPROVAL" || raw === "PENDING") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "APPROVED") bg = "bg-[#e8f2ff] text-[#1864ab] border-[#c3e3ff]";
    else if (raw === "POSTED") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CANCELLED") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "REVERSED") bg = "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const showPagination = journalVouchers.length > 0;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Journal Vouchers"
          subtitle="Record ledger adjustments, contra transfers, and accounting double-entry allocations."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Journal Vouchers", current: true },
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
                Create Voucher
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
                <FiFileText className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Posted Ledger Entries</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">{stats.posted}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiCheckCircle className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Pending Approvals</span>
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
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Draft Vouchers</span>
                <span className="text-[20px] font-extrabold text-[#868e96] mt-1 block">{stats.draft}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-hover/30 text-text-muted flex items-center justify-center border border-border/80">
                <FiFileText className="text-[18px]" />
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
                placeholder="Search voucher number or narration..."
                startIcon={<FiSearch />}
                size="small"
                sx={searchFieldSx}
                inputSx={searchFieldInputSx}
              />

              <div className="flex items-center gap-2">
                <AppSelect
                  name="voucherType"
                  value={searchParams.voucherType}
                  onChange={(e) => handleFilterChange("voucherType", e.target.value)}
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
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Querying journal vouchers...
                </AppText>
              </div>
            ) : journalVouchers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Vouchers Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Try adjusting your filter options or register a new journal voucher.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Voucher Number</th>
                    <th className="py-3 px-4 font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Debit Amount</th>
                    <th className="py-3 px-4 font-bold">Credit Amount</th>
                    <th className="py-3 px-4 font-bold">Reference No.</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {journalVouchers.map((voucher) => {
                    return (
                      <tr
                        key={voucher._id}
                        onClick={() => handleRowClick(voucher._id)}
                        className="border-b border-border hover:bg-surface-hover/20 transition cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-bold text-primary hover:underline">
                          {voucher.voucherNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          {getTypeBadge(voucher.voucherType)}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted font-semibold">
                          {formatDate(voucher.voucherDate)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#2b8a3e]">
                          {formatCurrency(voucher.totalDebit || 0)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#e64980]">
                          {formatCurrency(voucher.totalCredit || 0)}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted font-mono">
                          {voucher.referenceNumber || "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(voucher.status)}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end">
                            <AppMenu
                              trigger={
                                <button className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-hover/40 rounded transition cursor-pointer">
                                  <FiMoreVertical className="text-[15px]" />
                                </button>
                              }
                              items={[
                                {
                                  id: "view",
                                  label: "View Details",
                                  icon: <FiEye />,
                                  onClick: () => handleRowClick(voucher._id),
                                },
                                {
                                  id: "edit",
                                  label: "Edit Voucher",
                                  icon: <FiEdit2 />,
                                  onClick: () => navigate(ROUTES.EDIT_JOURNAL_VOUCHER(voucher._id)),
                                },
                              ]}
                              dense
                              minWidth={130}
                            />
                          </div>
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
                totalItems={totalVouchers}
                onPageChange={handlePageChange}
              />
            </AppBox>
          )}
        </AppCard>
      </div>
    </section>
  );
};

// Styling configurations
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

export default JournalVouchersDesktopPage;
