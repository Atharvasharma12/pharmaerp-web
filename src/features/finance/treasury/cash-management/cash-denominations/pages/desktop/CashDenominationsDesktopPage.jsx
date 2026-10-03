import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiClock,
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
  PermissionGate,
} from "@/components";
import { ROUTES } from "@/constants";
import { formatDate, formatCurrency } from "@/utils";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const CashDenominationsDesktopPage = ({
  denominations = [],
  filters,
  partitionOptions = [],
  branchOptions = [],
  currentPage,
  pageSize,
  totalItems,
  isLoading = false,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleCreateNew,
  handleViewDetails,
  handleRefresh,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "DRAFT") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "CONFIRMED") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CANCELLED") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const columns = useMemo(() => [
    {
      id: "countNumber",
      label: "Count Number",
      minWidth: 150,
      render: (_, item) => (
        <AppText variant="body2" sx={tableValueMonoSx}>
          {item.countNumber || "-"}
        </AppText>
      ),
    },
    {
      id: "countDate",
      label: "Count Date",
      minWidth: 130,
      render: (_, item) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {formatDate(item.countDate)}
        </AppText>
      ),
    },
    {
      id: "cashAccount",
      label: "Cash Register",
      minWidth: 180,
      render: (_, item) => (
        <AppText variant="body2" sx={tableValueSx}>
          {item.partition === "running" ? "Running Cash" : "Frozen Cash"}
        </AppText>
      ),
    },
    {
      id: "branch",
      label: "Branch",
      minWidth: 160,
      render: (_, item) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {item.branchId?.name || "Central Office"}
        </AppText>
      ),
    },
    {
      id: "physicalTotal",
      label: "Total Amount",
      minWidth: 140,
      align: "right",
      render: (_, item) => (
        <span className="text-[12.5px] font-black text-text">
          {formatCurrency(item.physicalTotal)}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      minWidth: 110,
      render: (_, item) => getStatusBadge(item.status),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      width: 80,
      render: (_, item) => (
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
                onClick: () => handleViewDetails(item._id),
              },
            ]}
            dense
            minWidth={140}
          />
        </AppStack>
      ),
    },
  ], []);

  const showPagination = totalItems > pageSize;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Physical Cash Counts"
          subtitle="Audit cash ledger entries against physical denomination calculations."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard", onClick: () => navigate(ROUTES.DASHBOARD) },
                  { label: "Finance & Accounting", onClick: () => navigate(ROUTES.FINANCE) },
                  { label: "Treasury", onClick: () => navigate(ROUTES.TREASURY) },
                  { label: "Cash Counts", current: true },
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
              <PermissionGate permission="cash-denomination:create">
                <AppButton
                  variant="filled"
                  colorVariant="success"
                  size="small"
                  rounded="md"
                  startIcon={<FiPlus />}
                  onClick={handleCreateNew}
                  sx={primaryButtonSx}
                >
                  New Cash Count
                </AppButton>
              </PermissionGate>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span>{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Table Card */}
        <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none" sx={mainCardSx}>
          <div className="p-4 border-b border-border bg-surface-hover/20 flex items-center justify-between gap-4">
            <AppInput
              name="search"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search count number or notes..."
              startIcon={<FiSearch />}
              size="small"
              sx={searchFieldSx}
              inputSx={searchFieldInputSx}
            />

            <div className="flex items-center gap-2">
              <AppSelect
                name="partition"
                value={filters.partition}
                onChange={(e) => handleFilterChange("partition", e.target.value)}
                options={partitionOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 220, minWidth: 220 }}
                inputSx={compactFilterInputSx}
              />

              <AppSelect
                name="branchId"
                value={filters.branchId}
                onChange={(e) => handleFilterChange("branchId", e.target.value)}
                options={branchOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 180, minWidth: 180 }}
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
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Retrieving cash count audits...
                </AppText>
              </div>
            ) : denominations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Cash Counts Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Adjust search criteria or create a new physical count record.
                </AppText>
              </div>
            ) : (
              <AppTable
                columns={columns}
                rows={denominations}
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
                totalItems={totalItems}
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

export default CashDenominationsDesktopPage;
