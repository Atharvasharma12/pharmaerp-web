import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEye,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiMoreHorizontal,
  FiEdit2,
  FiRefreshCw,
} from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSelect,
  AppStack,
  AppText,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppStatCard,
  AppSearchInput,
  AppIconButton,
  AppMenu,
  AppEmptyState,
  AppAlert,
  PermissionGate,
} from "@/components";
import { usePermission } from "@/hooks";
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

const statusColorMap = {
  DRAFT: "neutral",
  PENDING_APPROVAL: "warning",
  PENDING: "warning",
  APPROVED: "info",
  POSTED: "success",
  CANCELLED: "error",
  REVERSED: "pink",
};

const typeColorMap = {
  JOURNAL: "purple",
  PAYMENT: "error",
  RECEIPT: "success",
  CONTRA: "info",
  PURCHASE: "warning",
  SALE: "teal",
  OPENING_BALANCE: "indigo",
};

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
  handleRefresh,
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

  const statsList = useMemo(() => [
    {
      id: "total_postings",
      title: "Total Postings",
      value: stats.total,
      description: "Total vouchers registered",
      colorVariant: "primary",
      icon: <FiFileText />,
    },
    {
      id: "posted_ledger",
      title: "Posted Ledger Entries",
      value: stats.posted,
      description: "Successfully posted entries",
      colorVariant: "success",
      icon: <FiCheckCircle />,
    },
    {
      id: "pending_approvals",
      title: "Pending Approvals",
      value: stats.pending,
      description: "Awaiting approval stage",
      colorVariant: "warning",
      icon: <FiClock />,
    },
    {
      id: "draft_vouchers",
      title: "Draft Vouchers",
      value: stats.draft,
      description: "In-progress drafts",
      colorVariant: "neutral",
      icon: <FiFileText />,
    },
  ], [stats]);

  const getTypeBadge = (type) => {
    const raw = String(type || "").toUpperCase();
    return (
      <AppTag
        label={raw}
        variant="soft"
        colorVariant={typeColorMap[raw] || "neutral"}
        rounded="md"
        sx={tagSx}
      />
    );
  };

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    return (
      <AppTag
        label={raw}
        variant="soft"
        colorVariant={statusColorMap[raw] || "neutral"}
        rounded="md"
        sx={statusBadgeSx}
      />
    );
  };

  const columns = useMemo(() => [
    {
      id: "voucherNumber",
      key: "voucherNumber",
      label: "Voucher Number",
      minWidth: 160,
      render: (_, voucher) => (
        <AppText
          variant="body2"
          onClick={() => handleRowClick(voucher._id)}
          sx={voucherNumberSx}
        >
          {voucher.voucherNumber}
        </AppText>
      ),
    },
    {
      id: "voucherType",
      key: "voucherType",
      label: "Type",
      minWidth: 140,
      render: (_, voucher) => getTypeBadge(voucher.voucherType),
    },
    {
      id: "voucherDate",
      key: "voucherDate",
      label: "Date",
      minWidth: 120,
      render: (_, voucher) => (
        <AppText variant="body2" sx={tableValueSx}>
          {formatDate(voucher.voucherDate)}
        </AppText>
      ),
    },
    {
      id: "totalDebit",
      key: "totalDebit",
      label: "Debit Amount",
      minWidth: 140,
      render: (_, voucher) => (
        <AppText variant="body2" sx={debitAmountSx}>
          {formatCurrency(voucher.totalDebit || 0)}
        </AppText>
      ),
    },
    {
      id: "totalCredit",
      key: "totalCredit",
      label: "Credit Amount",
      minWidth: 140,
      render: (_, voucher) => (
        <AppText variant="body2" sx={creditAmountSx}>
          {formatCurrency(voucher.totalCredit || 0)}
        </AppText>
      ),
    },
    {
      id: "referenceNumber",
      key: "referenceNumber",
      label: "Reference No.",
      minWidth: 130,
      render: (_, voucher) => (
        <AppText variant="body2" sx={tableValueMonoSx}>
          {voucher.referenceNumber || "-"}
        </AppText>
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      minWidth: 140,
      render: (_, voucher) => getStatusBadge(voucher.status),
    },
    {
      id: "actions",
      key: "actions",
      label: "Action",
      align: "right",
      width: 70,
      render: (_, voucher) => (
        <RowActions voucher={voucher} onView={handleRowClick} onEdit={(v) => navigate(ROUTES.EDIT_JOURNAL_VOUCHER(v._id))} />
      ),
    },
  ], []);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <AppBox
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={pageHeaderSx}
        >
          <AppBox sx={pageHeaderContentSx}>
            <AppHeading level={1} weight={650}>
              Journal Vouchers
            </AppHeading>
            <AppText variant="body2" sx={pageHeaderSubtitleSx}>
              Record ledger adjustments, contra transfers, and accounting double-entry allocations.
            </AppText>
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Finance & Accounting", href: "/finance" },
                { label: "Journal Vouchers", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          </AppBox>

          <AppStack
            direction="row"
            align="center"
            justify="flex-end"
            gap={1.1}
            sx={{ flexShrink: 0 }}
          >
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
              sx={secondaryButtonSx}
            >
              Refresh
            </AppButton>
            <PermissionGate permission="journal-voucher:create">
              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiPlus />}
                onClick={handleCreate}
                disabled={isLoading}
                sx={primaryButtonSx}
              >
                Create Voucher
              </AppButton>
            </PermissionGate>
          </AppStack>
        </AppBox>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {statsList.map((stat) => (
            <AppStatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.description}
              icon={stat.icon}
              colorVariant={stat.colorVariant}
              variant="default"
              sx={statCardSx}
              iconSx={statIconSx}
            />
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <AppAlert
            severity="error"
            variant="soft"
            title="Something went wrong"
            closable
            onClose={clearError}
            sx={alertSx}
          >
            {error}
          </AppAlert>
        )}

        {/* Table & Filters Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={tableCardSx}
        >
          {/* Filters Toolbar */}
          <div className="border-b border-border px-3.5 py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_180px_160px] items-center gap-3">
              <AppSearchInput
                name="search"
                value={searchParams.search}
                onChange={handleSearchChange}
                placeholder="Search voucher number or narration..."
                clearable
                onClear={() => handleSearchChange("")}
                size="small"
                variant="bordered"
                rounded="md"
                sx={searchSx}
                inputSx={filterInputSx}
              />

              <AppSelect
                name="voucherType"
                value={searchParams.voucherType}
                onChange={(e) => handleFilterChange("voucherType", e.target.value)}
                options={typeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={selectSx}
                inputSx={filterInputSx}
              />

              <AppSelect
                name="status"
                value={searchParams.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={statusOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={selectSx}
                inputSx={filterInputSx}
              />
            </div>
          </div>

          {/* Table Container */}
          {isLoading ? (
            <AppTableSkeleton rows={8} columns={8} showHeader={false} />
          ) : journalVouchers.length === 0 ? (
            <AppEmptyState
              title="No Vouchers Found"
              description="Try adjusting your filter options or register a new journal voucher."
              icon={<FiFileText />}
              action={
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  startIcon={<FiPlus />}
                  onClick={handleCreate}
                  sx={primaryButtonSx}
                >
                  Create Voucher
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppTable
              columns={columns}
              rows={journalVouchers}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1150}
              maxHeight="calc(100vh - 340px)"
              sx={tableSx}
              headSx={tableHeadSx}
              cellSx={tableCellSx}
            />
          )}

          {/* Table Footer */}
          {totalVouchers > pageSize ? (
            <TableFooter
              totalVouchers={totalVouchers}
              currentPage={currentPage}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          ) : null}
        </AppCard>
      </div>
    </section>
  );
};

const RowActions = ({ voucher, onView, onEdit }) => {
  const { can } = usePermission();

  const items = [
    { id: "view", label: "View Details", icon: <FiEye />, onClick: () => onView(voucher._id) },
    can("journal-voucher:update") && { id: "edit", label: "Edit Voucher", icon: <FiEdit2 />, onClick: () => onEdit(voucher) },
  ].filter(Boolean);

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          aria-label="Voucher actions"
          className="inline-flex h-auto w-auto items-center justify-center border-0 bg-transparent p-1.5 text-text-muted hover:text-primary rounded transition hover:bg-surface-hover/40 shadow-none outline-none focus:bg-transparent active:bg-transparent"
        >
          <FiMoreHorizontal className="text-[18px]" />
        </button>
      }
      items={items}
      dense
      minWidth={140}
    />
  );
};

const TableFooter = ({
  totalVouchers,
  currentPage,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalVouchers);
  const totalPages = Math.ceil(totalVouchers / pageSize) || 1;

  return (
    <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
      <AppText variant="body2" sx={footerTextSx}>
        Showing {startEntry} to {endEntry} of {totalVouchers} vouchers
      </AppText>

      <AppStack direction="row" align="center" gap={1}>
        <AppMenu
          trigger={
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              endIcon={<FiChevronRight className="rotate-90" />}
              sx={pageSizeButtonSx}
            >
              {pageSize} per page
            </AppButton>
          }
          items={[
            { id: "10", label: "10 per page", onClick: () => handlePageSizeChange(10) },
            { id: "20", label: "20 per page", onClick: () => handlePageSizeChange(20) },
            { id: "50", label: "50 per page", onClick: () => handlePageSizeChange(50) },
            { id: "100", label: "100 per page", onClick: () => handlePageSizeChange(100) },
          ]}
          dense
          minWidth={120}
        />

        <AppIconButton
          icon={<FiChevronLeft />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />

        <span className="flex h-[31px] min-w-[31px] items-center justify-center rounded-md bg-primary px-2 text-[12px] font-bold text-text-inverse">
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

// Styling variables
const pageHeaderSx = { width: "100%" };
const pageHeaderSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};

const breadcrumbSx = { mt: 1 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const primaryButtonSx = {
  height: 36,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 700,
};
const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };

const statCardSx = {
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  p: 1.5,
  "& p:first-of-type": { fontSize: "11px" },
  "& h1, & h2, & h3, & h4": { fontSize: "18px" },
  "& p:last-of-type": { fontSize: "11px" },
};
const statIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "11px",
};

const tableCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  "& > div": { minWidth: 0 },
};

const searchSx = { width: "100%" };
const selectSx = { width: "100%" };
const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const tableSx = {
  "& .MuiTableContainer-root": {
    borderRadius: 0,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": { display: "none" },
  },
};
const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11.2px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};
const tableCellSx = {
  py: 1.2,
  fontSize: "12px",
  borderColor: "var(--app-color-border)",
};

const voucherNumberSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-primary)",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
};

const tableValueSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};
const tableValueMonoSx = {
  fontSize: "12px",
  fontWeight: 700,
  fontFamily: "var(--font-mono, monospace)",
  color: "var(--app-color-text)",
};
const debitAmountSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-success)",
};
const creditAmountSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-error)",
};

const tagSx = {
  width: "fit-content",
  height: 22,
  px: 0.8,
  fontSize: "10.5px",
  fontWeight: 700,
};

const statusBadgeSx = {
  width: "fit-content",
  height: 22,
  px: 1.5,
  fontSize: "10.5px",
  fontWeight: 700,
  textTransform: "uppercase",
};

const footerTextSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };
const pageSizeButtonSx = {
  height: 34,
  minWidth: 122,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 600,
};
const stateSx = { minHeight: 430 };

const FiChevronRight = (props) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const FiChevronLeft = (props) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>
);

export default JournalVouchersDesktopPage;
