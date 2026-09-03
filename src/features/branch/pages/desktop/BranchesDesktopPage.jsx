// src/features/branch/pages/desktop/BranchesDesktopPage.jsx

import React from "react";
import {
  GitBranch,
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
  UIPageHeader,
  UIFilterToolbar,
  PermissionGate,
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIIconButton
} from "@/components/ui";
import { TopBarStats } from "@/layouts/app/components/header";

import {
  BranchCard,
  BranchTableView,
  BranchEmployeesDrawer,
} from "../../components";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "members", label: "Most Employees" },
];

export const BranchesDesktopPage = ({
  branches = [],
  paginatedBranches = [],
  stats = [],

  filters,
  sortBy,
  onSortChange,
  viewMode = "grid",
  onViewModeChange,

  activeFilterChips = [],
  statusOptions = [],
  companyOptions = [],
  branchTypeOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalBranches = 0,
  filteredBranchesCount = 0,
  hasBranches,
  hasFilteredBranches,

  currentPage = 1,
  pageSize = 6,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleCreateBranch,
  handleViewBranch,
  handleEditBranch,
  handleOpenSettings,
  handleViewEmployees,
  handleDeleteBranch,
  handleRefresh,

  selectedBranchForEmployees,
  isEmployeeDrawerOpen,
  handleCloseEmployeesDrawer,

  clearMessage,
}) => {
  const activeCount =
    stats.find((s) => s.id === "active")?.value ??
    branches.filter((b) => (b.displayStatus || b.status) === "active").length;
  const inactiveCount =
    (stats.find((s) => s.id === "inactive")?.value || 0) +
    (stats.find((s) => s.id === "suspended")?.value || 0);

  const topBarStats = [
    { label: "Total", value: totalBranches, intent: "primary" },
    { label: "Active", value: activeCount, intent: "success" },
    { label: "Inactive", value: inactiveCount, intent: "error" },
  ];

  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const shouldShowPagination =
    hasFilteredBranches && filteredBranchesCount > pageSize;

  const handleExportCSV = () => {
    if (!branches.length) return;
    const headers = [
      "Branch Name",
      "Company",
      "Type",
      "Status",
      "Email",
      "Phone",
      "Location",
      "Employees With Access",
    ];
    const rows = branches.map((b) => [
      `"${b.displayName || b.name || ""}"`,
      `"${b.displayCompany || b.companyName || ""}"`,
      `"${b.type || ""}"`,
      `"${b.displayStatus || b.status || ""}"`,
      `"${b.email || ""}"`,
      `"${b.phones?.mobile || b.phone || ""}"`,
      `"${b.locationSummary || ""}"`,
      `"${b.memberCount ?? b.staffCount ?? 0}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `branches_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-0 max-w-[1440px] mx-auto space-y-2.5">
      {/* ── Global Error Banner ── */}
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
        searchPlaceholder="Search branch name, code, manager, or address..."
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
              startIcon={<Download className="size-4" />}
              onClick={handleExportCSV}
            >
              Export
            </UIButton>

            <PermissionGate permission="branch:create">
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={handleCreateBranch}
              >
                Add Branch
              </UIButton>
            </PermissionGate>
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
          <UIModalTitle>Filter Branches</UIModalTitle>
          <UIModalDescription>Select criteria to filter the branch list.</UIModalDescription>
        </UIModalHeader>
        <UIModalBody className="overflow-visible">
          <div className="space-y-5 py-2">
            {companyOptions.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted">Company</label>
                <UISelect
                  value={filters.company}
                  onChange={(val) => handleFilterChange({ company: val })}
                  options={companyOptions}
                  placeholder="All Companies"
                  size="sm"
                />
              </div>
            )}
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
              <label className="text-xs font-semibold text-text-muted">Type</label>
              <UISelect
                value={filters.type}
                onChange={(val) => handleFilterChange({ type: val })}
                options={branchTypeOptions}
                placeholder="All Types"
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
          <UIButton variant="ghost" onClick={() => handleClearFilters()}>
            Clear Filters
          </UIButton>
          <UIButton variant="primary" onClick={() => setIsFilterModalOpen(false)}>
            Apply Filters
          </UIButton>
        </UIModalFooter>
      </UIModal>

      {/* ── Main Content: Grid or List (Table) ── */}
      {hasError ? (
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] text-center space-y-3 p-6">
          <AlertTriangle className="size-9 text-error mx-auto" />
          <h3 className="text-base font-bold text-text">
            Unable to load branches list
          </h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            {error ||
              "An error occurred while connecting to branch servers. Please retry."}
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
      ) : !hasBranches ? (
        /* Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<GitBranch className="size-9 text-primary" />}
            title="No branches configured yet"
            description="Create retail outlets, distribution warehouses, or dispensary units to manage multi-location inventories."
            primaryAction={
              <PermissionGate permission="branch:create">
                <UIButton
                  variant="primary"
                  size="sm"
                  startIcon={<Plus className="size-4" />}
                  onClick={handleCreateBranch}
                >
                  Add First Branch
                </UIButton>
              </PermissionGate>
            }
          />
        </div>
      ) : !hasFilteredBranches ? (
        /* Filter Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Search className="size-9 text-text-muted" />}
            title="No matching branches found"
            description="Try changing your search query, status, or company filter criteria."
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
              {paginatedBranches.map((branch) => (
                <BranchCard
                  key={branch._id}
                  branch={branch}
                  onView={handleViewBranch}
                  onEdit={handleEditBranch}
                  onSettings={handleOpenSettings}
                  onViewEmployees={handleViewEmployees}
                  onDelete={handleDeleteBranch}
                />
              ))}
            </div>
          ) : (
            <BranchTableView
              branches={paginatedBranches}
              onView={handleViewBranch}
              onEdit={handleEditBranch}
              onSettings={handleOpenSettings}
              onViewEmployees={handleViewEmployees}
              onDelete={handleDeleteBranch}
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
            totalItems={filteredBranchesCount}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24, 48]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSummary
            showPageSize
          />
        </div>
      )}

      {/* ── Slide-over Branch Employees & Access Drawer ── */}
      <BranchEmployeesDrawer
        isOpen={isEmployeeDrawerOpen}
        onClose={handleCloseEmployeesDrawer}
        branch={selectedBranchForEmployees}
      />
    </div>
  );
};

export default BranchesDesktopPage;
