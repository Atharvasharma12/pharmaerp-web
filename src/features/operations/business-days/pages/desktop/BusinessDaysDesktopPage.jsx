// src/features/operations/business-days/pages/desktop/BusinessDaysDesktopPage.jsx

import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  Landmark,
  Plus,
  Download,
  RotateCcw,
  AlertTriangle,
  Search,
  Filter,
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
  BusinessDayCard,
  BusinessDayTableView,
  OpenBusinessDayDialog,
  ViewBusinessDayDialog,
  CloseBusinessDayDialog,
} from "../../components";

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

export const BusinessDaysDesktopPage = ({
  businessDays = [],
  paginatedBusinessDays = [],
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

  totalBusinessDays = 0,
  filteredBusinessDaysCount = 0,
  hasBusinessDays,
  hasFilteredBusinessDays,

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

  // Business Day specific actions & dialog controls
  openBusinessDay,
  isOpenDialogOpen,
  setIsOpenDialogOpen,
  selectedDay,
  setSelectedDay,
  dialogType,
  setDialogType,
  handleOpenDialog,
  handleCloseDialog,
}) => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const activeCount =
    stats.find((s) => s.id === "open")?.value ??
    businessDays.filter((d) => d.status === "open").length;
  const closedCount =
    stats.find((s) => s.id === "closed")?.value ??
    businessDays.filter((d) => d.status === "closed").length;

  const topBarStats = [
    { label: "Total Days", value: totalBusinessDays, intent: "primary" },
    { label: "Open Days", value: activeCount, intent: "success" },
    { label: "Closed Days", value: closedCount, intent: "neutral" },
  ];

  const shouldShowPagination =
    hasFilteredBusinessDays && filteredBusinessDaysCount > pageSize;

  const handleExportCSV = () => {
    if (!businessDays.length) return;
    const headers = [
      "Business Day No",
      "Business Date",
      "Opened At",
      "Opened By",
      "Shifts Count",
      "Opening Float",
      "Closing Cash",
      "Status",
    ];
    const rows = businessDays.map((bd) => [
      `"${bd.businessDayNo || ""}"`,
      `"${bd.businessDate ? new Date(bd.businessDate).toLocaleDateString() : ""}"`,
      `"${bd.actualOpenedAt ? new Date(bd.actualOpenedAt).toLocaleTimeString() : ""}"`,
      `"${bd.createdBy?.fullName || bd.createdBy?.name || ""}"`,
      `"${bd.shifts?.length || 0}"`,
      `"${bd.openingFloatAmount || 0}"`,
      `"${bd.actualClosingCashAmount || 0}"`,
      `"${bd.status || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `business_days_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        searchPlaceholder="Search business day no, date, staff name..."
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
              onClick={() => navigate("/operations/shifts")}
              startIcon={<Clock className="size-4 text-text-muted" />}
            >
              Shifts
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

            {!openBusinessDay && (
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                className="h-9"
                onClick={() => setIsOpenDialogOpen(true)}
                startIcon={<Plus className="size-4" />}
              >
                Open Business Day
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
          <UIModalTitle>Filter Business Days</UIModalTitle>
          <UIModalDescription>Select criteria to filter business day sessions.</UIModalDescription>
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
            Unable to load business day records
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
      ) : !hasBusinessDays ? (
        /* Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<CalendarDays className="size-9 text-primary" />}
            title="No business day sessions opened yet"
            description="Open a Business Day session to start your daily pharmacy branch operations."
            primaryAction={
              <UIButton
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={() => setIsOpenDialogOpen(true)}
              >
                Open Business Day
              </UIButton>
            }
          />
        </div>
      ) : !hasFilteredBusinessDays ? (
        /* Filter Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Search className="size-9 text-text-muted" />}
            title="No matching business days found"
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
              {paginatedBusinessDays.map((bd) => (
                <BusinessDayCard
                  key={bd._id}
                  businessDay={bd}
                  onView={(day) => handleOpenDialog(day, "view")}
                  onCloseDay={(day) => handleOpenDialog(day, "close")}
                />
              ))}
            </div>
          ) : (
            <BusinessDayTableView
              businessDays={paginatedBusinessDays}
              onView={(day) => handleOpenDialog(day, "view")}
              onCloseDay={(day) => handleOpenDialog(day, "close")}
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
            totalItems={filteredBusinessDaysCount}
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
      <OpenBusinessDayDialog
        isOpen={isOpenDialogOpen}
        onClose={() => setIsOpenDialogOpen(false)}
      />
      <ViewBusinessDayDialog
        isOpen={dialogType === "view"}
        onClose={handleCloseDialog}
        businessDay={selectedDay}
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
