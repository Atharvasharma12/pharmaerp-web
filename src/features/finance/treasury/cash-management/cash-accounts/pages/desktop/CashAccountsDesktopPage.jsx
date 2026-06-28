import React from "react";
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
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { LuWallet, LuTrendingUp, LuActivity } from "react-icons/lu";

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

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const CashAccountsDesktopPage = ({
  filters,
  stats,
  pagedAccounts = [],
  totalAccounts = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  activeFilterChips = [],
  isLoading = false,
  hasError = false,
  serverError,
  serverMessage,
  handleFilterChange,
  handleRemoveChip,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  handleRefresh,
  handleCreateAccount,
  handleEditAccount,
  handleViewDetails,
  handleDeleteAccount,
  handleSetPrimary,
  clearError,
  clearMessage,
}) => {
  const columns = [
    {
      id: "accountName",
      key: "displayName",
      label: "Account Name",
      minWidth: 200,
      render: (_, account) => (
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <AppText variant="body2" sx={accountNameSx}>
              {account?.displayName || "-"}
            </AppText>
            {account?.isPrimary && (
              <span className="inline-flex items-center rounded bg-[#e6fcf5] px-1.5 py-0.2 text-[8.5px] font-bold text-[#0ca678] uppercase tracking-wide">
                Primary
              </span>
            )}
          </div>
          <AppText variant="body2" sx={descriptionSx}>
            {account?.displayDescription || "-"}
          </AppText>
        </div>
      ),
    },
    {
      id: "ledgerAccount",
      key: "ledgerAccountId",
      label: "Mapped Ledger Account",
      minWidth: 200,
      render: (_, account) => (
        <AppText variant="body2" sx={ledgerSx}>
          {account?.ledgerAccountId?.accountCode
            ? `[${account.ledgerAccountId.accountCode}] ${account.ledgerAccountId.accountName}`
            : "-"}
        </AppText>
      ),
    },
    {
      id: "balance",
      key: "balance",
      label: "Current Balance",
      minWidth: 150,
      align: "right",
      render: (_, account) => (
        <AppText variant="body2" sx={balanceSx}>
          ₹{" "}
          {account?.balance?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00"}
        </AppText>
      ),
    },
    {
      id: "status",
      key: "displayStatus",
      label: "Status",
      minWidth: 110,
      render: (_, account) => (
        <div className="flex items-center">
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${account?.displayStatus === "active" ? "bg-success" : "bg-danger"}`}
          ></span>
          <span
            className={`text-[11.5px] font-bold capitalize ${account?.displayStatus === "active" ? "text-success" : "text-danger"}`}
          >
            {account?.displayStatus}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 160,
      align: "right",
      render: (_, account) => (
        <AppStack direction="row" gap={0.5} justify="flex-end" align="center">
          {!account?.isPrimary && (
            <AppIconButton
              icon={<FiStar className="text-[14px]" />}
              variant="text"
              colorVariant="warning"
              size="small"
              rounded="md"
              onClick={() => handleSetPrimary(account)}
              title="Set as Primary"
            />
          )}
          <AppIconButton
            icon={<FiEye className="text-[14px]" />}
            variant="text"
            colorVariant="neutral"
            size="small"
            rounded="md"
            onClick={() => handleViewDetails(account)}
            title="View Details"
          />
          <AppIconButton
            icon={<FiEdit2 className="text-[14px]" />}
            variant="text"
            colorVariant="neutral"
            size="small"
            rounded="md"
            onClick={() => handleEditAccount(account)}
            title="Edit"
          />
          <AppIconButton
            icon={<FiTrash2 className="text-[14px]" />}
            variant="text"
            colorVariant="danger"
            size="small"
            rounded="md"
            onClick={() => handleDeleteAccount(account)}
            title="Delete"
          />
        </AppStack>
      ),
    },
  ];

  const hasFilteredAccounts = pagedAccounts.length > 0;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Cash Accounts"
          subtitle="Inspect and manage all corporate cash-in-hand accounts and petty cash ledger balances."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Cash Accounts", current: true },
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

        {/* Toolbar row */}
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
              type="button"
              variant="filled"
              colorVariant="primary"
              rounded="md"
              size="small"
              startIcon={<FiPlus />}
              onClick={handleCreateAccount}
              disabled={isLoading}
              sx={addAccountBtnSx}
            >
              Add Cash Account
            </AppButton>
          </AppStack>
        </div>

        {/* Notification banners */}
        {serverError && (
          <div className="mt-4 p-3 bg-danger-soft text-danger text-[12px] font-semibold rounded-md border border-danger/25 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FiAlertCircle />
              {serverError}
            </span>
            <button
              type="button"
              onClick={clearError}
              className="font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {serverMessage && (
          <div className="mt-4 p-3 bg-success-soft text-success text-[12px] font-semibold rounded-md border border-success/25 flex items-center justify-between">
            <span>{serverMessage}</span>
            <button
              type="button"
              onClick={clearMessage}
              className="font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Statistics Cards Grid */}
        <div className="mt-5 grid grid-cols-4 gap-5">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">
                  Total Accounts
                </span>
                <span className="text-[20px] font-extrabold text-text block mt-1">
                  {stats.totalAccounts}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary shrink-0">
                <LuWallet className="text-[20px]" />
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">
                  Total Cash Balance
                </span>
                <span className="text-[20px] font-extrabold text-text block mt-1">
                  ₹{" "}
                  {stats.totalBalance?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-success-soft flex items-center justify-center text-success shrink-0">
                <LuTrendingUp className="text-[20px]" />
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">
                  Active Cash Chests
                </span>
                <span className="text-[20px] font-extrabold text-success block mt-1">
                  {stats.activeAccounts}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#ebfbee] flex items-center justify-center text-[#2b8a3e] shrink-0">
                <LuActivity className="text-[20px]" />
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11.5px] text-text-muted font-bold block uppercase tracking-wider">
                  Inactive Accounts
                </span>
                <span className="text-[20px] font-extrabold text-text-muted block mt-1">
                  {stats.inactiveAccounts}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-text-muted shrink-0">
                <FiAlertCircle className="text-[20px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Filters Toolbar */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="none"
          padding="none"
          sx={filterCardSx}
        >
          <div className="p-4 flex items-center gap-4 justify-between">
            <AppStack direction="row" gap={3} align="center" sx={{ flex: 1 }}>
              {/* Search text input */}
              <AppInput
                placeholder="Search by cash account name..."
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
            </AppStack>
          </div>

          {/* Filter chips container */}
          {activeFilterChips.length > 0 && (
            <div className="px-4 pb-3 flex items-center gap-2 flex-wrap border-t border-border/40 pt-3">
              <span className="text-[11px] text-text-muted font-semibold mr-1">
                Active Filters:
              </span>
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
              <AppButton
                variant="text"
                colorVariant="primary"
                size="small"
                onClick={handleClearFilters}
                sx={clearAllBtnSx}
              >
                Clear All
              </AppButton>
            </div>
          )}
        </AppCard>

        {/* Data Table */}
        <div className="mt-5">
          {isLoading && !hasFilteredAccounts ? (
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              sx={emptyCardSx}
            >
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <FiRefreshCw className="text-[28px] text-primary animate-spin" />
                <AppText
                  variant="body2"
                  sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}
                >
                  Fetching cash accounts database...
                </AppText>
              </div>
            </AppCard>
          ) : !hasFilteredAccounts ? (
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              sx={emptyCardSx}
            >
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
                  No Cash Accounts Found
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  sx={emptyStateSubTextSx}
                >
                  Add a new cash-in-hand register or clear your search query to
                  inspect the list.
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
              <AppTable
                rows={pagedAccounts}
                columns={columns}
                getRowId={(row) => row._id}
              />
            </div>
          )}

          {/* Conditional Pagination Footer */}
          {hasFilteredAccounts && totalAccounts > pageSize ? (
            <TableFooter
              totalAccounts={totalAccounts}
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

const addAccountBtnSx = {
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
  fontSize: "11.8px",
  color: "var(--app-color-text-muted)",
  mt: 0.2,
};

const accountNameSx = {
  fontSize: "12.8px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const descriptionSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  mt: 0.3,
  maxWidth: 320,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const ledgerSx = {
  fontSize: "12.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const balanceSx = {
  fontSize: "12.8px",
  fontWeight: 700,
  fontFamily: "monospace",
  color: "var(--app-color-text)",
};

const footerTextSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };
const pageSizeButtonSx = {
  height: 34,
  minWidth: 122,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 600,
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
        Showing {startEntry} to {endEntry} of {totalAccounts} registries
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

export default CashAccountsDesktopPage;
