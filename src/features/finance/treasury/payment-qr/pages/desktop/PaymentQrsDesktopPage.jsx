import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  FiMoreVertical,
} from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";

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
  AppMenu,
  PageHeader,
  AppTablePagination,
  PermissionGate,
} from "@/components";
import { usePermission } from "@/hooks";
import { ROUTES } from "@/constants";

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
  const navigate = useNavigate();
  const { can } = usePermission();
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
        label: "Provider",
        minWidth: 100,
        render: (_, row) => getProviderBadge(row.provider),
      },
      {
        id: "upiId",
        label: "UPI Address",
        minWidth: 200,
        render: (_, row) => (
          <div className="flex items-center gap-1.5 group">
            <AppText variant="body2" sx={{ fontWeight: 650, color: "var(--app-color-text)", fontFamily: "var(--font-mono, monospace)" }}>
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
        label: "Label / Name",
        minWidth: 150,
        render: (_, row) => (
          <AppText variant="body2" sx={{ color: "var(--app-color-text)", fontWeight: 600 }}>
            {row.label || "-"}
          </AppText>
        ),
      },
      {
        id: "bankAccount",
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
        label: "Status",
        minWidth: 110,
        render: (_, row) => {
          const isActive = String(row.status || "").toUpperCase() === "ACTIVE";
          return (
            <div className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-[#2b8a3e]" : "bg-[#fa5252]"}`} />
              <AppText variant="body2" sx={{ textTransform: "capitalize", fontWeight: 650, color: isActive ? "#2b8a3e" : "#fa5252" }}>
                {String(row.status || "").toLowerCase()}
              </AppText>
            </div>
          );
        },
      },
      {
        id: "primary",
        label: "Primary",
        minWidth: 80,
        align: "center",
        render: (_, row) => (
          <FiStar className={row.isPrimary ? "fill-warning text-warning" : "text-text-muted/40"} />
        ),
      },
      {
        id: "actions",
        label: "Actions",
        minWidth: 100,
        align: "right",
        render: (_, row) => {
          const menuItems = [
            {
              id: "view",
              label: "View Details",
              icon: <FiEye />,
              onClick: () => handleViewDetails(row._id),
            },
            can("payment-qr:update") && {
              id: "edit",
              label: "Edit Configuration",
              icon: <FiEdit2 />,
              onClick: () => handleEditQr(row._id),
            },
          ].filter(Boolean);

          if (!row.isPrimary && can("payment-qr:update")) {
            menuItems.push({
              id: "set-primary",
              label: "Set As Primary",
              icon: <FiStar />,
              onClick: () => handleSetPrimary(row._id),
            });
          }

          if (can("payment-qr:delete")) {
            menuItems.push({
              id: "delete",
              label: "Delete Register",
              icon: <FiTrash2 />,
              danger: true,
              onClick: () => handleDeleteQr(row._id),
            });
          }

          return (
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
                items={menuItems}
                dense
                minWidth={150}
              />
            </AppStack>
          );
        },
      },
    ],
    [handleSetPrimary, handleViewDetails, handleEditQr, handleDeleteQr]
  );

  const showPagination = totalQrs > pageSize;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Payment QR & UPI"
          subtitle="Manage store payment receiver QR codes and linked settlement bank accounts."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard", onClick: () => navigate(ROUTES.DASHBOARD) },
                  { label: "Finance & Accounting", onClick: () => navigate(ROUTES.FINANCE) },
                  { label: "Treasury", onClick: () => navigate(ROUTES.TREASURY) },
                  { label: "Payment QR & UPI", current: true },
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
              <PermissionGate permission="payment-qr:create">
                <AppButton
                  variant="filled"
                  colorVariant="success"
                  size="small"
                  rounded="md"
                  startIcon={<FiPlus />}
                  onClick={handleCreateQr}
                  sx={primaryButtonSx}
                >
                  Add UPI QR
                </AppButton>
              </PermissionGate>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

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
            <div className="flex items-center justify-between p-4">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">Total UPI QRs</span>
                <span className="text-[20px] font-extrabold text-text block mt-1">{stats.totalCount}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                <LuQrCode className="text-[20px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="flex items-center justify-between p-4">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">Active Codes</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] block mt-1">{stats.activeCount}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <LuQrCode className="text-[20px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="flex items-center justify-between p-4">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">Primary Channel</span>
                <span className="text-[20px] font-extrabold text-[#f08c00] block mt-1">{stats.primaryCount}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff9db] text-[#f08c00] flex items-center justify-center border border-[#ffe066]">
                <LuQrCode className="text-[20px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Main Content Table & Filters block */}
        <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none" sx={mainCardSx}>
          <div className="p-4 border-b border-border bg-surface-hover/20 flex items-center justify-between gap-4">
            <AppInput
              placeholder="Search UPI Address or label..."
              name="search"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              size="small"
              startIcon={<FiSearch />}
              sx={{ width: 280 }}
              inputSx={compactFilterInputSx}
            />

            <div className="flex items-center gap-2">
              <AppSelect
                name="provider"
                value={filters.provider}
                onChange={(e) => handleFilterChange("provider", e.target.value)}
                options={providerOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 155, minWidth: 155 }}
                inputSx={compactFilterInputSx}
              />

              <AppSelect
                name="status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={statusFilterOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 145, minWidth: 145 }}
                inputSx={compactFilterInputSx}
              />

              {activeFilterChips.length > 0 && (
                <AppButton variant="text" colorVariant="primary" size="small" onClick={handleClearFilters}>
                  Clear Filters
                </AppButton>
              )}
            </div>
          </div>

          {/* Filter Chips row */}
          {activeFilterChips.length > 0 && (
            <div className="px-4 py-2 border-b border-border/40 flex items-center gap-1.5 flex-wrap">
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
            </div>
          )}

          {/* Table Container block */}
          <div className="w-full relative">
            {isLoading && !hasFilteredQrs ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Retrieving QR codes...
                </AppText>
              </div>
            ) : !hasFilteredQrs ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No UPI QRs Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Add a new UPI QR register or adjust search filters.
                </AppText>
              </div>
            ) : (
              <AppTable
                columns={columns}
                rows={pagedQrs}
                getRowId={(row) => row._id}
                sx={tableSx}
                headSx={tableHeadSx}
                cellSx={tableCellSx}
              />
            )}
          </div>

          {/* Table Footer Pagination */}
          {showPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalQrs}
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

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const filterChipSx = {
  height: 22,
  fontSize: "10px",
  bgcolor: "var(--app-color-surface-hover)",
  border: "1px solid var(--app-color-border)",
  "& svg": { fontSize: "10px" },
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

export default PaymentQrsDesktopPage;
