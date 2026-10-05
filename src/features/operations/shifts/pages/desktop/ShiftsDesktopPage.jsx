// src/features/operations/shifts/pages/desktop/ShiftsDesktopPage.jsx

import React, { useState } from "react";
import {
  Clock,
  CalendarDays,
  Landmark,
  Plus,
  Download,
  RotateCcw,
  AlertTriangle,
  Search,
  Filter,
  LockKeyhole,
} from "lucide-react";
import {
  UIButton,
  UISelect,
  UIPagination,
  UIEmptyState,
  UIAlert,
  UISkeleton,
  UIFilterToolbar,
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIIconButton,
  UIInput,
} from "@/components/ui";
import { TopBarStats } from "@/layouts/app/components/header";
import { useNavigate } from "react-router-dom";

import {
  ShiftCard,
  ShiftTableView,
  CreateShiftDialog,
  ViewShiftDialog,
  CloseShiftDialog,
} from "../../components";
import CloseBusinessDayDialog from "@/features/operations/business-days/components/CloseBusinessDayDialog";

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

export const ShiftsDesktopPage = ({
  shifts = [],
  paginatedShifts = [],
  stats = [],

  filters,
  sortBy,
  onSortChange,
  viewMode = "grid",
  onViewModeChange,

  activeFilterChips = [],
  statusOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalShifts = 0,
  filteredShiftsCount = 0,
  hasShifts,
  hasFilteredShifts,

  currentPage = 1,
  pageSize = 6,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
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
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const activeCount =
    stats.find((s) => s.id === "open")?.value ??
    shifts.filter((s) => s.status === "open").length;
  const closedCount =
    stats.find((s) => s.id === "closed")?.value ??
    shifts.filter((s) => s.status === "closed").length;

  const topBarStats = [
    { label: "Total Shifts", value: totalShifts, intent: "primary" },
    { label: "Open Shifts", value: activeCount, intent: "success" },
    { label: "Closed Shifts", value: closedCount, intent: "neutral" },
  ];

  const shouldShowPagination =
    hasFilteredShifts && filteredShiftsCount > pageSize;

  const handleExportCSV = () => {
    if (!shifts.length) return;
    const headers = [
      "Shift No",
      "Shift Name",
      "Date",
      "Opened At",
      "Closed At",
      "Opened By",
      "Opening Float",
      "Closing Cash",
      "Status",
    ];
    const rows = shifts.map((s) => [
      `"${s.shiftNo || ""}"`,
      `"${s.shiftName || ""}"`,
      `"${s.date ? new Date(s.date).toLocaleDateString() : ""}"`,
      `"${s.openedAt ? new Date(s.openedAt).toLocaleTimeString() : ""}"`,
      `"${s.closedAt ? new Date(s.closedAt).toLocaleTimeString() : ""}"`,
      `"${s.openedBy?.fullName || s.openedBy?.name || ""}"`,
      `"${s.openingFloatAmount || 0}"`,
      `"${s.actualClosingCashAmount || 0}"`,
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

  const hasOpenShift = shifts.some((s) => s.status === "open");

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-0 max-w-[1440px] mx-auto space-y-2.5">
      {/* ── Global Error / Message Banners ── */}
      {error && !hasError && (
        <UIAlert
          intent="danger"
          title="Something went wrong"
          description={error}
          onClose={clearMessage}
        />
      )}

      {/* ── TopBar Stats Teleport ── */}
      <TopBarStats stats={topBarStats} />

      {/* ── Enterprise UIFilterToolbar Component with Built-in View Switcher ── */}
      <UIFilterToolbar
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search shift number, staff name, or notes..."
        activeFilterChips={activeFilterChips}
        onClearFilters={handleClearFilters}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        filters={
          <UIButton
            variant="outline"
            size="sm"
            startIcon={<Filter className="size-4" />}
            onClick={() => setIsFilterModalOpen(true)}
            className="w-10 px-0 sm:w-auto sm:px-3 justify-center"
          >
            <span className="hidden sm:inline">Filter</span>
          </UIButton>
        }
        actions={
          <div className="flex items-center gap-2 shrink-0 border-l border-border pl-2 ml-1">
            <UIIconButton
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-text h-9 w-9"
              onClick={handleRefresh}
              title="Refresh"
            >
              <RotateCcw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </UIIconButton>

            <UIButton
              type="button"
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigate("/operations/business-days")}
              startIcon={<CalendarDays className="size-4 text-text-muted" />}
            >
              Business Days
            </UIButton>

            <UIButton
              type="button"
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigate("/finance/treasury/bank-deposit-slips/create")}
              startIcon={<Landmark className="size-4 text-text-muted" />}
            >
              Bank Slip
            </UIButton>

            <UIButton
              type="button"
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handleExportCSV}
              startIcon={<Download className="size-4 text-text-muted" />}
            >
              Export
            </UIButton>

            {!hasOpenShift && (
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                className="h-9"
                onClick={() => setIsCreateOpen(true)}
                startIcon={<Plus className="size-4" />}
              >
                Open New Shift
              </UIButton>
            )}
          </div>
        }
      />

      {/* ── Filter Modal ── */}
      <UIModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        className="overflow-visible"
      >
        <UIModalHeader>
          <UIModalTitle>Filter Shifts</UIModalTitle>
          <UIModalDescription>Select criteria to filter shift sessions.</UIModalDescription>
        </UIModalHeader>
        <UIModalBody className="overflow-visible">
          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">Session Date</label>
              <UIInput
                type="date"
                value={filters.date || ""}
                onChange={(e) => handleFilterChange({ date: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">Status</label>
              <UISelect
                value={filters.status}
                onChange={(val) => handleFilterChange({ status: val })}
                options={statusOptions}
                placeholder="All Status"
                size="sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">Sort By</label>
              <UISelect
                value={sortBy}
                onChange={onSortChange}
                options={SORT_OPTIONS}
                placeholder="Sort By..."
                size="sm"
              />
            </div>
          </div>
        </UIModalBody>
        <UIModalFooter>
          <UIButton variant="outline" onClick={() => handleClearFilters()}>
            Clear
          </UIButton>
          <UIButton variant="primary" onClick={() => setIsFilterModalOpen(false)}>
            Apply
          </UIButton>
        </UIModalFooter>
      </UIModal>

      {/* ── Main Content: Grid or List (Table) ── */}
      {hasError ? (
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] text-center space-y-3 p-6">
          <AlertTriangle className="size-9 text-error mx-auto" />
          <h3 className="text-base font-bold text-text">
            Unable to load shift records
          </h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            {error || "An error occurred while connecting to servers. Please retry."}
          </p>
          <UIButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="mt-1"
          >
            Retry Connection
          </UIButton>
        </div>
      ) : isLoading ? (
        /* Shimmer Loading Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-2xl p-4 flex flex-col space-y-3 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <UISkeleton className="size-11 rounded-[12px]" />
                <div className="space-y-1.5 flex-1">
                  <UISkeleton className="h-4 w-32 rounded" />
                  <UISkeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <div className="w-full pt-3 border-t border-border/30 grid grid-cols-2 gap-3">
                <UISkeleton className="h-6 rounded" />
                <UISkeleton className="h-6 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasShifts ? (
        /* Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Clock className="size-9 text-primary" />}
            title="No operational shifts opened yet"
            description="Start a new register shift to process POS counter transactions and cash management."
            primaryAction={
              <UIButton
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={() => setIsCreateOpen(true)}
              >
                Open First Shift
              </UIButton>
            }
          />
        </div>
      ) : !hasFilteredShifts ? (
        /* Filter Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Search className="size-9 text-text-muted" />}
            title="No matching shifts found"
            description="Try changing your search query, date range, or status filter."
            primaryAction={
              <UIButton
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </UIButton>
            }
          />
        </div>
      ) : (
        /* ── Render Active View: Grid or List (Table) ── */
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {paginatedShifts.map((shift) => (
                <ShiftCard
                  key={shift._id}
                  shift={shift}
                  onView={setViewShift}
                  onCloseShift={setCloseShift}
                />
              ))}
            </div>
          ) : (
            <ShiftTableView
              shifts={paginatedShifts}
              onView={setViewShift}
              onCloseShift={setCloseShift}
            />
          )}
        </>
      )}

      {/* ── Bottom Pagination Module ── */}
      {shouldShowPagination && (
        <div className="bg-surface rounded-xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden">
          <UIPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredShiftsCount}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24, 48]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSummary
            showPageSize
          />
        </div>
      )}

      {/* ── Dialog Modals ── */}
      <CreateShiftDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <ViewShiftDialog isOpen={!!viewShift} onClose={() => setViewShift(null)} shift={viewShift} />
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
