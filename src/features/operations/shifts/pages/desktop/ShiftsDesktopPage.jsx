// src/features/operations/shifts/pages/desktop/ShiftsDesktopPage.jsx

import React from "react";
import {
  Users,
  Play,
  CheckCircle2,
  XCircle,
  Plus,
  RotateCcw,
  Download,
  ChevronDown,
  Search,
  ArrowUpDown,
  Table2,
  LayoutGrid,
  Clock,
} from "lucide-react";
import {
  UIButton,
  UIInput,
  UIDatePicker,
  UISelect,
  UIEmptyState,
  UIAlert,
  UIPagination,
} from "@/components/ui";

import {
  ShiftTableView,
  ShiftCard,
  CreateShiftDialog,
  ViewShiftDialog,
  CloseShiftDialog,
} from "../../components";
import CloseBusinessDayDialog from "@/features/operations/business-days/components/CloseBusinessDayDialog";

const STATUS_SELECT_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Cancelled", value: "cancelled" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
];

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

export const ShiftsDesktopPage = ({
  shifts = [],
  paginatedShifts = [],
  allShifts = [],
  stats = [],

  filters = {},
  sortBy = "desc",
  onSortChange,
  viewMode = "table",
  onViewModeChange,

  isLoading,
  hasError,
  error,
  message,

  totalShifts = 0,
  filteredShiftsCount = 0,
  hasShifts = false,
  hasFilteredShifts = false,

  currentPage = 1,
  pageSize = 6,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,

  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,
  clearMessage,

  // Shift specific actions & dialog controls
  openBusinessDay,
  isCreateOpen,
  setIsCreateOpen,
  viewShift,
  setViewShift,
  closeShift,
  setCloseShift,
  isCloseBusinessDayOpen,
  setIsCloseBusinessDayOpen,
}) => {
  // ── Stat Calculations using Real Data (Matching Screenshot 4 Cards) ───────
  const activeDataset = allShifts.length > 0 ? allShifts : shifts;
  const totalCount = activeDataset.length;
  const openCount = activeDataset.filter((s) => s.status === "open").length;
  const closedCount = activeDataset.filter((s) => s.status === "closed").length;
  const cancelledCount = activeDataset.filter((s) => s.status === "cancelled").length;

  const displayShifts = paginatedShifts;
  const totalEntries = filteredShiftsCount || shifts.length;
  const isTableView = viewMode !== "card" && viewMode !== "grid";
  const hasOpenShift = openCount > 0;

  const handleExportCSV = () => {
    const listToExport = shifts.length ? shifts : allShifts;
    if (!listToExport.length) return;
    const headers = [
      "Shift No",
      "Shift Name",
      "Business Date",
      "Opened At",
      "Closed At",
      "Cashier",
      "Opening Float",
      "Cash Sales",
      "Deposits",
      "Withdrawals",
      "Status",
    ];
    const rows = listToExport.map((s) => [
      `"${s.shiftNo || ""}"`,
      `"${s.shiftName || ""}"`,
      `"${s.businessDate || s.date ? new Date(s.businessDate || s.date).toLocaleDateString("en-GB") : ""}"`,
      `"${s.openedAt ? new Date(s.openedAt).toLocaleTimeString() : ""}"`,
      `"${s.closedAt ? new Date(s.closedAt).toLocaleTimeString() : ""}"`,
      `"${s.openedBy?.fullName || s.openedBy?.name || ""}"`,
      `"${s.openingFloatAmount || 0}"`,
      `"${s.cashSalesTotal || s.summary?.cashNet || s.actualClosingCashAmount || 0}"`,
      `"${Array.isArray(s.manualDeposits) ? s.manualDeposits.reduce((acc, d) => acc + (d.amount || 0), 0) : s.totalFundDeposits || 0}"`,
      `"${Array.isArray(s.manualWithdrawals) ? s.manualWithdrawals.reduce((acc, w) => acc + (w.amount || 0), 0) : s.totalFundWithdrawals || 0}"`,
      `"${s.status || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shifts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* ── Page Header: Title, Subtitle & Action Buttons (No Breadcrumbs) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text tracking-tight leading-tight">
            Shifts
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage cashier shifts and cash drawer sessions
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <UIButton
            type="button"
            variant="outline"
            size="md"
            onClick={handleRefresh}
            startIcon={
              <RotateCcw
                className={`size-4 text-text-muted ${isLoading ? "animate-spin" : ""}`}
              />
            }
            className="h-10 px-3.5 shadow-2xs font-medium"
          >
            Refresh
          </UIButton>

          <UIButton
            type="button"
            variant="outline"
            size="md"
            onClick={handleExportCSV}
            startIcon={<Download className="size-4 text-text-muted" />}
            endIcon={<ChevronDown className="size-3.5 opacity-60 ml-0.5" />}
            className="h-10 px-3.5 shadow-2xs font-medium"
          >
            Export
          </UIButton>

          {!hasOpenShift && (
            <UIButton
              type="button"
              variant="primary"
              size="md"
              onClick={() => setIsCreateOpen(true)}
              startIcon={<Plus className="size-4 stroke-[2.5]" />}
              className="h-10 px-4 shadow-xs font-semibold"
            >
              New Shift
            </UIButton>
          )}
        </div>
      </div>

      {/* ── 4 Stat Cards Row (Exact Match from Screenshot & Active Color Tokens) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Shifts */}
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="size-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-text-muted truncate">
              Total Shifts
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {totalCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              All shift sessions
            </div>
          </div>
        </div>

        {/* Card 2: Open Shifts (Soft green tinted background per image) */}
        <div className="bg-emerald-500/[0.04] dark:bg-emerald-950/20 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Play className="size-5 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
              Open Shifts
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {openCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              Currently active
            </div>
          </div>
        </div>

        {/* Card 3: Closed Shifts */}
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-6 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-text-muted truncate">
              Closed Shifts
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {closedCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              Completed
            </div>
          </div>
        </div>

        {/* Card 4: Cancelled Shifts (Soft red tinted background per image) */}
        <div className="bg-red-500/[0.04] dark:bg-red-950/20 rounded-xl border border-red-500/20 dark:border-red-500/30 p-5 flex items-center gap-4 shadow-xs transition-colors">
          <div className="size-12 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
            <XCircle className="size-6 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-red-600 dark:text-red-400 truncate">
              Cancelled Shifts
            </div>
            <div className="text-2xl sm:text-[26px] font-bold text-text mt-0.5 leading-tight">
              {cancelledCount}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              Did not start
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Toolbar with Table / Card Toggle ────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Date, Search, Status, Sort By */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Reusable UIDatePicker */}
          <div className="w-[180px] sm:w-[210px]">
            <UIDatePicker
              value={filters.date || ""}
              onChange={(val) => handleFilterChange?.({ date: val || "" })}
              placeholder="Date..."
              size="md"
              presets
              isClearable
            />
          </div>

          {/* Reusable UIInput for Search */}
          <div className="flex-1 min-w-[240px] max-w-md">
            <UIInput
              type="text"
              value={filters.search || ""}
              onChange={(e) => handleSearchChange?.(e.target.value)}
              placeholder="Search by shift no, name or cashier..."
              startIcon={<Search className="size-4 text-text-muted" />}
              size="md"
              variant="outline"
              isClearable
              onClear={() => handleSearchChange?.("")}
              className="w-full"
            />
          </div>

          {/* Reusable UISelect for Status */}
          <div className="w-[130px]">
            <UISelect
              value={filters.status || "all"}
              onChange={(val) => handleFilterChange?.({ status: val })}
              options={STATUS_SELECT_OPTIONS}
              placeholder="Status"
              size="md"
            />
          </div>

          {/* Reusable UISelect for Sort By */}
          <div className="w-[155px]">
            <UISelect
              value={sortBy || "desc"}
              onChange={(val) => onSortChange?.(val)}
              options={SORT_OPTIONS}
              placeholder="Sort By"
              size="md"
              startIcon={<ArrowUpDown className="size-3.5 text-text-muted" />}
            />
          </div>

          {/* Reset Filters button if any active filter */}
          {(filters.search || filters.date || (filters.status && filters.status !== "all")) && (
            <UIButton
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClearFilters}
              className="h-10 px-3.5"
            >
              Reset
            </UIButton>
          )}
        </div>

        {/* Right Side: Segmented Table / Card View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-alt/70 border border-border rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange?.("table")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              isTableView
                ? "bg-primary text-primary-contrast shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-hover"
            }`}
          >
            <Table2 className="size-4" />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange?.("card")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              !isTableView
                ? "bg-primary text-primary-contrast shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-hover"
            }`}
          >
            <LayoutGrid className="size-4" />
            <span>Card</span>
          </button>
        </div>
      </div>

      {/* ── Main Data View (Table or Card Grid) or Empty State ──────────────── */}
      {displayShifts.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 shadow-xs">
          <UIEmptyState
            icon={<Clock className="size-8 text-primary" />}
            title="No shifts found"
            description={
              filters.search || filters.date || (filters.status && filters.status !== "all")
                ? "No shift sessions matched your filter criteria. Try clearing your filters."
                : hasOpenShift
                ? "No additional shifts found. Close the active shift before opening a new one."
                : "No shift sessions opened yet. Open a New Shift to start cashier operations."
            }
            actionText={
              filters.search || filters.date || (filters.status && filters.status !== "all")
                ? "Clear Filters"
                : !hasOpenShift
                ? "New Shift"
                : undefined
            }
            onAction={
              filters.search || filters.date || (filters.status && filters.status !== "all")
                ? handleClearFilters
                : !hasOpenShift
                ? () => setIsCreateOpen(true)
                : undefined
            }
            actionIcon={!hasOpenShift ? <Plus className="size-4" /> : undefined}
            variant="inline"
          />
        </div>
      ) : isTableView ? (
        /* ── Table View: Table & UIPagination Enclosed in Same Card with 0 Gap (Like Business Days) ── */
        <div className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden transition-colors">
          <ShiftTableView
            shifts={displayShifts}
            onView={setViewShift}
            onCloseShift={setCloseShift}
          />

          {totalEntries > 0 && (
            <UIPagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={totalEntries}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showSummary
              showPageSize
              className="border-t border-border/60 bg-transparent px-4 py-3"
            />
          )}
        </div>
      ) : (
        /* ── Card View: Grid of Shift Cards with Pagination ── */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayShifts.map((shift) => (
              <ShiftCard
                key={shift._id}
                shift={shift}
                onView={setViewShift}
                onCloseShift={setCloseShift}
              />
            ))}
          </div>

          {totalEntries > 0 && (
            <div className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden">
              <UIPagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={totalEntries}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showSummary
                showPageSize
                className="border-t-0 border-none bg-transparent px-4 py-3"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Dialog Modals (Fully Preserved Business & Backend Logic) ───────── */}
      <CreateShiftDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <ViewShiftDialog
        isOpen={!!viewShift}
        onClose={() => setViewShift(null)}
        shift={viewShift}
        onCloseShift={(s) => {
          setViewShift(null);
          setCloseShift(s);
        }}
      />
      <CloseShiftDialog
        isOpen={!!closeShift}
        onClose={() => setCloseShift(null)}
        shift={closeShift}
        onOpenNewShift={() => setIsCreateOpen(true)}
        onCreateDayClosing={() => setIsCloseBusinessDayOpen(true)}
      />
      <CloseBusinessDayDialog
        isOpen={isCloseBusinessDayOpen}
        onClose={() => setIsCloseBusinessDayOpen(false)}
        businessDay={openBusinessDay}
      />
    </div>
  );
};

export default ShiftsDesktopPage;
