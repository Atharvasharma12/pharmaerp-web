// src/features/operations/business-days/pages/desktop/BusinessDaysDesktopPage.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
  LockKeyhole,
} from "lucide-react";
import {
  UIButton,
  UIInput,
  UIDatePicker,
  UISelect,
  UIBadge,
  UIEmptyState,
  UIPagination,
  UIAlert,
} from "@/components/ui";

import {
  OpenBusinessDayDialog,
  ViewBusinessDayDialog,
  CloseBusinessDayDialog,
} from "../../components";

const formatDate = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatCurrencyNumber = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0.00";
  return Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const STATUS_SELECT_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "With Issues", value: "with_issues" },
];

export const BusinessDaysDesktopPage = ({
  businessDays = [],
  paginatedBusinessDays = [],
  allBusinessDays = [],
  stats = [],

  filters = {},
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  handlePageChange,

  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,

  isLoading,
  hasError,
  error,
  clearMessage,

  hasBusinessDays = false,

  // Dialog controls
  openBusinessDay,
  isOpenDialogOpen,
  setIsOpenDialogOpen,
  selectedDay,
  dialogType,
  handleOpenDialog,
  handleCloseDialog,
}) => {
  const [activeMenuRowId, setActiveMenuRowId] = useState(null);

  // Close actions menu popover on outside mousedown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-actions-menu]")) {
        setActiveMenuRowId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Stat Calculations using Real Data (No Mock Data) ──────────────────────
  const totalCount = allBusinessDays.length;
  const openCount = allBusinessDays.filter((d) => d.status === "open").length;
  const closedCount = allBusinessDays.filter((d) => d.status === "closed").length;
  const issuesCount = allBusinessDays.filter(
    (d) =>
      d.status === "with_issues" ||
      d.status === "cancelled" ||
      d.hasDiscrepancy
  ).length;

  const hasOpenDay =
    Boolean(openBusinessDay) ||
    openCount > 0 ||
    allBusinessDays.some((d) => d.status === "open");

  const displayDays = paginatedBusinessDays;
  const totalEntries = businessDays.length || allBusinessDays.length;

  return (
    <div className="w-full bg-bg min-h-full p-6 lg:p-8 space-y-6 text-text font-sans transition-colors">
      {/* ── Global Error Message Banner ── */}
      {error && !hasError && (
        <UIAlert
          intent="danger"
          title="Something went wrong"
          description={error}
          onClose={clearMessage}
        />
      )}

      {/* ── Page Header Row: Title, Subtitle, & "+ Open Business Day" Primary Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text tracking-tight leading-tight">
            Business Day
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage daily business operations, monitor status, and view session summaries.
          </p>
        </div>

        {!hasOpenDay && (
          <UIButton
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsOpenDialogOpen(true)}
            startIcon={<Plus className="size-4 stroke-[2.5]" />}
            className="shadow-xs shrink-0"
          >
            Open Business Day
          </UIButton>
        )}
      </div>

      {/* ── 4 Stat Cards Row (Respects Active Color Theme & Light/Dark Mode) ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Business Days */}
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-info-soft text-info flex items-center justify-center shrink-0">
            <CalendarDays className="size-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-text-muted truncate">
              Total Business Days
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {totalCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              This month
            </div>
          </div>
        </div>

        {/* Card 2: Open */}
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-success-soft text-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-success truncate">
              Open
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {openCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              Currently active
            </div>
          </div>
        </div>

        {/* Card 3: Closed */}
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
            <Clock className="size-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-warning truncate">
              Closed
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {closedCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              This month
            </div>
          </div>
        </div>

        {/* Card 4: With Issues */}
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-error-soft text-error flex items-center justify-center shrink-0">
            <AlertCircle className="size-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-error truncate">
              With Issues
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {issuesCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              Requires attention
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Toolbar (Using Reusable UI Components) ─────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Reusable UIInput for Search */}
        <div className="flex-1 min-w-[280px]">
          <UIInput
            type="text"
            value={filters.search || ""}
            onChange={(e) => handleSearchChange?.(e.target.value)}
            placeholder="Search business date, session, or reference..."
            startIcon={<Search className="size-4 text-text-muted" />}
            size="md"
            variant="outline"
            isClearable
            onClear={() => handleSearchChange?.("")}
            className="w-full"
          />
        </div>

        {/* Reusable UIDatePicker for specific date or preset filtering */}
        <div className="w-[200px] sm:w-[230px]">
          <UIDatePicker
            value={filters.date || ""}
            onChange={(val) => handleFilterChange?.({ date: val || "" })}
            placeholder="Filter by date..."
            size="md"
            presets
            isClearable
          />
        </div>

        {/* Reusable UISelect for Status */}
        <div className="w-[150px]">
          <UISelect
            value={filters.status || "all"}
            onChange={(val) => handleFilterChange?.({ status: val })}
            options={STATUS_SELECT_OPTIONS}
            placeholder="All Statuses"
            size="md"
          />
        </div>

        {/* Reusable UIButton for Reset */}
        <UIButton
          type="button"
          variant="secondary"
          size="md"
          onClick={handleClearFilters}
          className="h-10 px-4"
        >
          Reset
        </UIButton>
      </div>

      {/* ── Main Data Table or Empty State (No Fake Mock Data) ──────────────── */}
      {displayDays.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 shadow-xs">
          <UIEmptyState
            icon={<CalendarDays className="size-8 text-primary" />}
            title="No business days found"
            description={
              filters.search || filters.date || (filters.status && filters.status !== "all")
                ? "No business day sessions matched your filter criteria. Try clearing your filters."
                : "No business day sessions opened yet. Open a Business Day to start operations."
            }
            actionText={
              filters.search || filters.date || (filters.status && filters.status !== "all")
                ? "Clear Filters"
                : !hasOpenDay
                ? "Open Business Day"
                : undefined
            }
            onAction={
              filters.search || filters.date || (filters.status && filters.status !== "all")
                ? handleClearFilters
                : !hasOpenDay
                ? () => setIsOpenDialogOpen(true)
                : undefined
            }
            actionIcon={
              filters.search || filters.date || (filters.status && filters.status !== "all")
                ? undefined
                : !hasOpenDay
                ? <Plus className="size-4" />
                : undefined
            }
            variant="inline"
          />
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-alt/40 text-[13px] font-semibold text-text select-none">
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Business Date
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Branch
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Opening Time
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Closing Time
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Total Sales (₱)
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Total Cash (₱)
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap text-center">
                    Sessions
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {displayDays.map((bd) => {
                  const dayDate = formatDate(bd.businessDate);
                  const branchName =
                    bd.branchName ||
                    bd.branch?.name ||
                    bd.branchId?.name ||
                    "Main Branch";
                  const openTime = formatTime(bd.actualOpenedAt || bd.createdAt);
                  const isDayOpen = bd.status === "open";
                  const isDayWithIssues =
                    bd.status === "with_issues" ||
                    bd.status === "cancelled" ||
                    bd.hasDiscrepancy;
                  const closeTime = isDayOpen
                    ? "-"
                    : formatTime(bd.actualClosedAt || bd.closedAt);

                  const totalSales = formatCurrencyNumber(
                    bd.totalSalesAmount ?? bd.summary?.totalSales ?? 0
                  );
                  const totalCash = formatCurrencyNumber(
                    bd.actualClosingCashAmount ??
                      bd.closingCash ??
                      bd.openingFloatAmount ??
                      0
                  );

                  const sessionsDisplay =
                    bd.sessionsRatio ||
                    `${bd.shifts?.filter((s) => s.status === "closed")?.length || 0} / ${
                      bd.shifts?.length || 1
                    }`;

                  return (
                    <tr
                      key={bd._id}
                      onClick={() => handleOpenDialog?.(bd, "view")}
                      className="border-b border-border/60 hover:bg-surface-hover transition-colors cursor-pointer text-sm text-text"
                    >
                      {/* Business Date */}
                      <td className="py-3.5 px-4 font-medium text-text whitespace-nowrap">
                        {dayDate}
                      </td>

                      {/* Branch */}
                      <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                        {branchName}
                      </td>

                      {/* Status: Reusable UIBadge with dot variant */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isDayOpen ? (
                          <UIBadge variant="dot" color="success">
                            Open
                          </UIBadge>
                        ) : isDayWithIssues ? (
                          <UIBadge variant="dot" color="error">
                            With Issues
                          </UIBadge>
                        ) : (
                          <UIBadge variant="dot" color="neutral">
                            Closed
                          </UIBadge>
                        )}
                      </td>

                      {/* Opening Time */}
                      <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                        {openTime}
                      </td>

                      {/* Closing Time */}
                      <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                        {closeTime}
                      </td>

                      {/* Total Sales (₱) */}
                      <td className="py-3.5 px-4 text-text whitespace-nowrap tabular-nums">
                        {totalSales}
                      </td>

                      {/* Total Cash (₱) */}
                      <td className="py-3.5 px-4 text-text whitespace-nowrap tabular-nums">
                        {totalCash}
                      </td>

                      {/* Sessions */}
                      <td className="py-3.5 px-4 text-center text-text-muted whitespace-nowrap">
                        {sessionsDisplay}
                      </td>

                      {/* Actions (⋮ 3 Dots Menu Button) */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="relative inline-block text-left"
                          data-actions-menu
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveMenuRowId((prev) =>
                                prev === bd._id ? null : bd._id
                              );
                            }}
                            className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
                            title="Actions"
                            aria-label="Actions"
                          >
                            <MoreVertical className="size-4" />
                          </button>

                          {activeMenuRowId === bd._id && (
                            <div
                              className="absolute right-0 top-full mt-1 w-44 bg-surface border border-border rounded-lg shadow-lg py-1 z-30"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveMenuRowId(null);
                                  handleOpenDialog?.(bd, "view");
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-text hover:bg-surface-hover flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Eye className="size-3.5 text-text-muted" />
                                <span>View Details</span>
                              </button>

                              {isDayOpen && (
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveMenuRowId(null);
                                    handleOpenDialog?.(bd, "close");
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-warning hover:bg-warning-soft flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <LockKeyhole className="size-3.5" />
                                  <span>Close Business Day</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Reusable UIPagination Component Touching Table with No Top Border Line ── */}
          {totalEntries > 0 && (
            <UIPagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={totalEntries}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              showSummary
              showPageSize={false}
              className="border-t-0 border-none bg-transparent px-4 py-3"
            />
          )}
        </div>
      )}

      {/* ── Dialog Modals (Fully Preserved Business & Backend Logic) ───────── */}
      <OpenBusinessDayDialog
        isOpen={isOpenDialogOpen}
        onClose={() => setIsOpenDialogOpen(false)}
      />
      <ViewBusinessDayDialog
        isOpen={dialogType === "view"}
        onClose={handleCloseDialog}
        businessDay={selectedDay}
        onRequestCloseDay={(day) => handleOpenDialog(day, "close")}
      />
      <CloseBusinessDayDialog
        isOpen={dialogType === "close"}
        onClose={handleCloseDialog}
        businessDay={selectedDay}
      />
    </div>
  );
};

export default BusinessDaysDesktopPage;
