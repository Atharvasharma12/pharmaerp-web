import React, { useMemo } from "react";
import {
  FiPlus,
  FiSearch,
  FiActivity,
  FiLock,
  FiUnlock,
  FiCalendar,
  FiInfo,
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
import { formatDate } from "@/utils";

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Financial Year", value: "YEAR" },
  { label: "Quarterly Period", value: "QUARTER" },
  { label: "Monthly Period", value: "MONTH" },
  { label: "Adjustment Period", value: "ADJUSTMENT" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Open Period", value: "OPEN" },
  { label: "Closed Period", value: "CLOSED" },
  { label: "Locked Period", value: "LOCKED" },
];

const FinancialPeriodsDesktopPage = ({
  financialPeriods = [],
  searchParams,
  currentPage,
  pageSize,
  totalPeriods,
  isLoading = false,
  isUpdating = false,
  error,
  clearError,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleUpdateStatus,
  handleCreate,
}) => {
  const currentActivePeriod = useMemo(() => {
    return financialPeriods.find((p) => p.isCurrent)?.periodCode || "-";
  }, [financialPeriods]);

  const stats = useMemo(() => {
    const counts = { total: totalPeriods, open: 0, closed: 0, locked: 0 };
    financialPeriods.forEach((p) => {
      if (p.status === "OPEN") counts.open++;
      else if (p.status === "CLOSED") counts.closed++;
      else if (p.status === "LOCKED") counts.locked++;
    });
    return counts;
  }, [financialPeriods, totalPeriods]);

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "OPEN") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CLOSED") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "LOCKED") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";

    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[9.5px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const showPagination = financialPeriods.length > 0;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Financial Periods"
          subtitle="Manage fiscal periods, freeze account postings, or open new adjustment periods."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Financial Periods", current: true },
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
                disabled={isLoading}
                sx={createBtnSx}
              >
                Create Period
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
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Defined Periods</span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">{stats.total}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                <FiCalendar className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Active Period</span>
                <span className="text-[20px] font-extrabold text-primary mt-1 block truncate max-w-[180px]">
                  {currentActivePeriod}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                <FiActivity className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Closed Periods</span>
                <span className="text-[20px] font-extrabold text-[#f08c00] mt-1 block">{stats.closed}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#fff9db] text-[#f08c00] flex items-center justify-center border border-[#ffe066]">
                <FiLock className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Locked Periods</span>
                <span className="text-[20px] font-extrabold text-[#868e96] mt-1 block">{stats.locked}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#f1f3f5] text-[#868e96] flex items-center justify-center border border-[#e9ecef]">
                <FiLock className="text-[18px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Action errors */}
        {error && (
          <div className="mt-4 p-3 bg-danger-soft text-danger text-[12.5px] font-semibold rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-danger font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Table & Filters Card */}
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
            <AppInput
              name="search"
              value={searchParams.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search period code..."
              startIcon={<FiSearch />}
              size="small"
              sx={searchFieldSx}
              inputSx={searchFieldInputSx}
            />

            <div className="flex items-center gap-2">
              <AppSelect
                name="periodType"
                value={searchParams.periodType}
                onChange={(e) => handleFilterChange("periodType", e.target.value)}
                options={typeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                sx={{ width: 160 }}
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
                sx={{ width: 140 }}
                inputSx={compactFilterInputSx}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Retrieving fiscal periods...
                </AppText>
              </div>
            ) : financialPeriods.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiCalendar className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Financial Periods Defined
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  Click "Create Period" to initialize new fiscal calendar slots.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Period Code</th>
                    <th className="py-3 px-4 font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Start Date</th>
                    <th className="py-3 px-4 font-bold">End Date</th>
                    <th className="py-3 px-4 font-bold">Current Active</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {financialPeriods.map((p) => {
                    const isOpen = p.status === "OPEN";
                    const isClosed = p.status === "CLOSED";
                    const isLocked = p.status === "LOCKED";

                    return (
                      <tr
                        key={p._id}
                        className="border-b border-border hover:bg-surface-hover/20 transition"
                      >
                        <td className="py-3.5 px-4 font-bold text-text font-mono">
                          {p.periodCode}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text">
                          {p.periodType}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted">
                          {formatDate(p.startDate)}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted">
                          {formatDate(p.endDate)}
                        </td>
                        <td className="py-3.5 px-4">
                          {p.isCurrent ? (
                            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[8.5px] font-black uppercase bg-[#ebfbee] text-[#2b8a3e] border border-[#c3fae8]">
                              ACTIVE PERIOD
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <AppStack direction="row" gap={1} justify="center" align="center">
                            {isOpen && (
                              <AppButton
                                size="tiny"
                                variant="outlined"
                                colorVariant="warning"
                                onClick={() => handleUpdateStatus(p._id, "CLOSED")}
                                disabled={isUpdating}
                              >
                                Close Period
                              </AppButton>
                            )}

                            {isClosed && (
                              <>
                                <AppButton
                                  size="tiny"
                                  variant="outlined"
                                  colorVariant="danger"
                                  onClick={() => handleUpdateStatus(p._id, "LOCKED")}
                                  disabled={isUpdating}
                                >
                                  Lock Period
                                </AppButton>
                                <AppButton
                                  size="tiny"
                                  variant="outlined"
                                  colorVariant="neutral"
                                  onClick={() => handleUpdateStatus(p._id, "OPEN")}
                                  disabled={isUpdating}
                                >
                                  Reopen
                                </AppButton>
                              </>
                            )}
                          </AppStack>
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
                totalItems={totalPeriods}
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

export default FinancialPeriodsDesktopPage;
