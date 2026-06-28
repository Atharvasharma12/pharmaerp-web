import React, { useMemo } from "react";
import {
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiInbox,
  FiAlertCircle,
  FiCopy,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { LuQrCode, LuTrendingUp, LuActivity } from "react-icons/lu";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppTable,
  AppTag,
  AppText,
  PageHeader,
} from "@/components";

const providerOptions = [
  { label: "All Providers", value: "all" },
  { label: "Google Pay", value: "gpay" },
  { label: "PhonePe", value: "phonepe" },
  { label: "Paytm", value: "paytm" },
  { label: "BHIM", value: "bhim" },
  { label: "Razorpay", value: "razorpay" },
  { label: "Cashfree", value: "cashfree" },
  { label: "Other", value: "other" },
];

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const PaymentQrsDesktopPage = ({
  filters,
  stats,
  pagedQrs = [],
  totalQrs = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  activeFilterChips = [],
  isLoading = false,
  serverError,
  serverMessage,
  handleFilterChange,
  handleRemoveChip,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  handleRefresh,
  handleCreateQr,
  handleEditQr,
  handleViewDetails,
  handleDeleteQr,
  handleSetPrimary,
  clearError,
  clearMessage,
}) => {
  const hasFilteredQrs = pagedQrs.length > 0;

  const handleCopyUpiId = (upiId) => {
    navigator.clipboard.writeText(upiId);
    alert(`Copied UPI ID: ${upiId}`);
  };

  const getProviderBadge = (provider) => {
    const raw = String(provider || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";
    if (raw === "GPAY") bg = "bg-[#e8f0fe] text-[#1a73e8] border-[#adcdfc]";
    else if (raw === "PHONEPE") bg = "bg-[#f3e8ff] text-[#7c3aed] border-[#ddd6fe]";
    else if (raw === "PAYTM") bg = "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]";
    else if (raw === "BHIM") bg = "bg-[#ccfbf1] text-[#0d9488] border-[#99f6e4]";
    else if (raw === "RAZORPAY") bg = "bg-[#e0e7ff] text-[#4f46e5] border-[#c7d2fe]";
    else if (raw === "CASHFREE") bg = "bg-[#ffedd5] text-[#ea580c] border-[#fed7aa]";

    return (
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        id: "provider",
        key: "provider",
        label: "Provider",
        minWidth: 100,
        render: (_, row) => getProviderBadge(row.provider),
      },
      {
        id: "upiId",
        key: "upiId",
        label: "UPI Address",
        minWidth: 200,
        render: (_, row) => (
          <div className="flex items-center gap-1.5 group">
            <AppText variant="body2" sx={{ fontWeight: 650, color: "var(--app-color-text)" }}>
              {row.upiId}
            </AppText>
            <AppIconButton
              icon={<FiCopy className="text-[12px]" />}
              variant="text"
              colorVariant="neutral"
              size="small"
              onClick={() => handleCopyUpiId(row.upiId)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              sx={{ p: "2px" }}
            />
          </div>
        ),
      },
      {
        id: "label",
        key: "label",
        label: "Label / Name",
        minWidth: 150,
        render: (_, row) => (
          <AppText variant="body2" sx={{ color: "var(--app-color-text)" }}>
            {row.label || "-"}
          </AppText>
        ),
      },
      {
        id: "bankAccount",
        key: "bankAccountId",
        label: "Linked Bank",
        minWidth: 200,
        render: (_, row) => {
          const bank = row.bankAccountId;
          if (!bank) return <span className="text-text-muted text-[12px]">-</span>;
          return (
            <div className="min-w-0">
              <AppText variant="body2" sx={{ fontWeight: 600, color: "var(--app-color-text)", m: 0 }}>
                {bank.bankName}
              </AppText>
              <AppText variant="caption" sx={{ color: "var(--app-color-text-muted)", display: "block" }}>
                A/C: *{String(bank.accountNumber || "").slice(-4)} ({bank.accountNickname || "Default"})
              </AppText>
            </div>
          );
        },
      },
      {
        id: "status",
        key: "status",
        label: "Status",
        minWidth: 110,
        render: (_, row) => {
          const isActive = String(row.status || "").toUpperCase() === "ACTIVE";
          return (
            <div className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-success" : "bg-danger"}`} />
              <AppText variant="body2" sx={{ textTransform: "capitalize", fontWeight: 650, color: isActive ? "var(--app-color-success)" : "var(--app-color-danger)" }}>
                {String(row.status || "").toLowerCase()}
              </AppText>
            </div>
          );
        },
      },
      {
        id: "primary",
        key: "isPrimary",
        label: "Primary",
        minWidth: 80,
        align: "center",
        render: (_, row) => (
          <AppIconButton
            icon={<FiStar className={row.isPrimary ? "fill-warning text-warning" : "text-text-muted"} />}
            variant="text"
            colorVariant={row.isPrimary ? "warning" : "neutral"}
            size="small"
            onClick={() => handleSetPrimary(row._id)}
            disabled={row.isPrimary}
          />
        ),
      },
      {
        id: "actions",
        key: "actions",
        label: "Actions",
        minWidth: 120,
        align: "right",
        render: (_, row) => (
          <AppStack direction="row" gap={0.5} justify="flex-end">
            <AppIconButton
              icon={<FiEye className="text-[13px]" />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              onClick={() => handleViewDetails(row._id)}
            />
            <AppIconButton
              icon={<FiEdit2 className="text-[13px]" />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              onClick={() => handleEditQr(row._id)}
            />
            <AppIconButton
              icon={<FiTrash2 className="text-[13px]" />}
              variant="outlined"
              colorVariant="danger"
              size="small"
              onClick={() => handleDeleteQr(row._id)}
            />
          </AppStack>
        ),
      },
    ],
    [handleSetPrimary, handleViewDetails, handleEditQr, handleDeleteQr]
  );

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Payment QR & UPI"
          subtitle="Manage store payment receiver QR codes and linked settlement bank accounts."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Payment QR & UPI", current: true },
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

        {/* Header Toolbar */}
        <div className="mt-4 flex items-center justify-between">
          <div></div>
          <AppStack direction="row" gap={1.5} align="center">
            <AppIconButton
              icon={<FiRefreshCw className={isLoading ? "animate-spin" : ""} />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              onClick={handleRefresh}
              disabled={isLoading}
              sx={refreshBtnSx}
            />
            <AppButton
              variant="contained"
              colorVariant="primary"
              size="small"
              startIcon={<FiPlus />}
              onClick={handleCreateQr}
              sx={addQrBtnSx}
            >
              Add UPI QR
            </AppButton>
          </AppStack>
        </div>

        {/* Server Success / Failure Banner Notifications */}
        {serverError && (
          <div className="mt-4 p-3.5 bg-danger-soft text-danger text-[12.2px] font-semibold rounded-md border border-danger/25 flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-1.5">
              <FiAlertCircle />
              {serverError}
            </span>
            <button type="button" onClick={clearError} className="font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {serverMessage && (
          <div className="mt-4 p-3.5 bg-success-soft text-success text-[12.2px] font-semibold rounded-md border border-success/25 flex items-center justify-between shadow-sm">
            <span>{serverMessage}</span>
            <button type="button" onClick={clearMessage} className="font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Statistics Overview */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">Total UPI QRs</span>
                <span className="text-[20px] font-extrabold text-text block mt-1">{stats.totalCount}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary shrink-0">
                <LuQrCode className="text-[20px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">Active Receivers</span>
                <span className="text-[20px] font-extrabold text-success block mt-1">{stats.activeCount}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-success-soft flex items-center justify-center text-success shrink-0">
                <LuActivity className="text-[20px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">Primary QR Registers</span>
                <span className="text-[20px] font-extrabold text-warning block mt-1">{stats.primaryCount}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-warning-soft flex items-center justify-center text-warning shrink-0">
                <FiStar className="text-[20px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Filters Toolbar */}
        <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={filterCardSx}>
          <div className="p-4 flex items-center gap-4 justify-between">
            <AppStack direction="row" gap={3} align="center" sx={{ flex: 1 }}>
              {/* Search text input */}
              <AppInput
                placeholder="Search by UPI address or label..."
                name="search"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                size="small"
                startIcon={<FiSearch className="text-text-muted text-[15px]" />}
                inputSx={filterSearchInputSx}
                sx={{ maxWidth: 320 }}
              />

              {/* Status filter dropdown */}
              <AppSelect
                label=""
                name="status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={statusFilterOptions}
                size="small"
                variant="bordered"
                rounded="md"
                inputSx={filterSelectInputSx}
                sx={{ minWidth: 150 }}
              />

              {/* Provider filter dropdown */}
              <AppSelect
                label=""
                name="provider"
                value={filters.provider}
                onChange={(e) => handleFilterChange("provider", e.target.value)}
                options={providerOptions}
                size="small"
                variant="bordered"
                rounded="md"
                inputSx={filterSelectInputSx}
                sx={{ minWidth: 150 }}
              />
            </AppStack>
          </div>

          {/* Filter chips container */}
          {activeFilterChips.length > 0 && (
            <div className="px-4 pb-3 flex items-center gap-2 flex-wrap border-t border-border/40 pt-3">
              <span className="text-[11px] text-text-muted font-semibold mr-1">Active Filters:</span>
              {activeFilterChips.map((chip) => (
                <AppTag
                  key={chip.key}
                  label={chip.label}
                  variant="soft"
                  colorVariant="primary"
                  onDelete={() => handleRemoveChip(chip.key)}
                  size="small"
                  rounded="md"
                  sx={filterChipSx}
                />
              ))}
              <AppButton variant="text" colorVariant="primary" size="small" onClick={handleClearFilters} sx={clearAllBtnSx}>
                Clear All
              </AppButton>
            </div>
          )}
        </AppCard>

        {/* Data Table */}
        <div className="mt-5">
          {isLoading && !hasFilteredQrs ? (
            <AppCard variant="default" rounded="lg" bordered shadow="none" sx={emptyCardSx}>
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <FiRefreshCw className="text-[28px] text-primary animate-spin" />
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Fetching UPI QR codes database...
                </AppText>
              </div>
            </AppCard>
          ) : !hasFilteredQrs ? (
            <AppCard variant="default" rounded="lg" bordered shadow="none" sx={emptyCardSx}>
              <div className="flex flex-col items-center justify-center text-center w-full py-12 px-4">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{
                    m: 0,
                    fontSize: "14px",
                    width: "100%",
                    color: "var(--app-color-text)",
                    mb: 1,
                  }}
                >
                  No Payment QRs Found
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  Add a new UPI QR register or clear your filter criteria to inspect the database.
                </AppText>
                {activeFilterChips.length > 0 && (
                  <AppButton
                    variant="text"
                    colorVariant="primary"
                    size="small"
                    onClick={handleClearFilters}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </AppButton>
                )}
              </div>
            </AppCard>
          ) : (
            <div className="border border-border rounded-lg bg-surface overflow-hidden shadow-sm">
              <AppTable rows={pagedQrs} columns={columns} getRowId={(row) => row._id} />
            </div>
          )}

          {/* Conditional Pagination Footer */}
          {hasFilteredQrs && totalQrs > pageSize ? (
            <TableFooter
              totalAccounts={totalQrs}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          ) : null}
        </div>
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

const refreshBtnSx = {
  height: 34,
  width: 34,
  minWidth: 34,
  borderColor: "var(--app-color-border)",
};

const addQrBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
  bgcolor: "var(--app-color-primary)",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
};

const statCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const filterCardSx = {
  mt: 5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const filterSearchInputSx = {
  height: 32,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const filterSelectInputSx = {
  height: 32,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const filterChipSx = {
  height: 24,
  fontSize: "11px",
  bgcolor: "var(--app-color-surface-hover)",
  border: "1px solid var(--app-color-border)",
  "& svg": { fontSize: "11px" },
};

const clearAllBtnSx = {
  fontSize: "11.5px",
  fontWeight: 600,
  height: 24,
  p: "0 6px",
};

const emptyCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const emptyStateSubTextSx = {
  color: "var(--app-color-text-muted)",
  fontSize: "12.5px",
  maxWidth: 380,
  mt: 0.5,
  lineHeight: 1.5,
};

const TableFooter = ({
  totalAccounts,
  currentPage,
  totalPages,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalAccounts);

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3.5 bg-white">
      <AppText variant="body2" sx={footerTextSx}>
        Showing {startEntry} to {endEntry} of {totalAccounts} records
      </AppText>

      <AppStack direction="row" align="center" gap={1}>
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          endIcon={<FiChevronRight className="rotate-90" />}
          sx={pageSizeButtonSx}
        >
          {pageSize} / page
        </AppButton>

        <AppIconButton
          icon={<FiChevronLeft />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />

        <span className="flex h-[31px] min-w-[31px] items-center justify-center rounded-md border border-[#00b85c] bg-[#e6fcf5] px-2 text-[12px] font-bold text-[#00b85c]">
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

const footerTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const pageSizeButtonSx = {
  height: 31,
  fontSize: "12px",
  fontWeight: 650,
  p: "0 10px",
};

export default PaymentQrsDesktopPage;
