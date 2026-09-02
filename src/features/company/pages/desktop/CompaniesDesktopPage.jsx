// src/features/company/pages/desktop/CompaniesDesktopPage.jsx

import React from "react";
import {
  Building2,
  Plus,
  Download,
  RotateCcw,
  AlertTriangle,
  Search,
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
} from "@/components/ui";

import {
  CompanyCard,
  CompanyTableView,
  CompanyEmployeesDrawer,
} from "../../components";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "members", label: "Most Employees" },
];

export const CompaniesDesktopPage = ({
  companies = [],
  paginatedCompanies = [],
  stats = [],

  filters,
  sortBy,
  onSortChange,
  viewMode = "grid",
  onViewModeChange,

  activeFilterChips = [],
  statusOptions = [],
  companyTypeOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalCompanies = 0,
  filteredCompaniesCount = 0,
  hasCompanies,
  hasFilteredCompanies,

  currentPage = 1,
  pageSize = 6,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleCreateCompany,
  handleViewCompany,
  handleEditCompany,
  handleOpenSettings,
  handleViewEmployees,
  handleDeleteCompany,
  handleRefresh,

  selectedCompanyForEmployees,
  isEmployeeDrawerOpen,
  handleCloseEmployeesDrawer,

  clearMessage,
}) => {
  const activeCount =
    stats.find((s) => s.id === "active")?.value ??
    companies.filter((c) => c.status === "active").length;
  const inactiveCount =
    (stats.find((s) => s.id === "inactive")?.value || 0) +
    (stats.find((s) => s.id === "suspended")?.value || 0);

  const shouldShowPagination =
    hasFilteredCompanies && filteredCompaniesCount > pageSize;

  const handleExportCSV = () => {
    if (!companies.length) return;
    const headers = [
      "Company Name",
      "Type",
      "Status",
      "Email",
      "Phone",
      "Location",
      "Employees With Access",
    ];
    const rows = companies.map((c) => [
      `"${c.displayName || c.name || ""}"`,
      `"${c.displayType || c.type || ""}"`,
      `"${c.status || ""}"`,
      `"${c.displayEmail || c.email || ""}"`,
      `"${c.displayPhone || ""}"`,
      `"${c.locationSummary || ""}"`,
      `"${c.memberCount ?? 0}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `companies_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-5 max-w-[1440px] mx-auto space-y-3.5">
      {/* ── Global Error Banner ── */}
      {error && !hasError && (
        <UIAlert
          intent="danger"
          title="Something went wrong"
          description={error}
          onClose={clearMessage}
        />
      )}

      {/* ── Standard UIPageHeader ── */}
      <UIPageHeader
        bordered={false}
        compact
        className="p-0 pb-0.5"
        title={
          <span className="flex items-center gap-2">
            <span className="font-mono tabular-nums">{totalCompanies}</span> Companies
          </span>
        }
        description={
          <span className="flex items-center gap-3.5 text-xs font-semibold mt-1">
            <span className="inline-flex items-center gap-1.5 text-text">
              <span className="size-2.5 rounded-full bg-success ring-2 ring-success/20" />
              Active{" "}
              <strong className="font-mono tabular-nums text-text font-bold">
                {activeCount}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-text">
              <span className="size-2.5 rounded-full bg-error ring-2 ring-error/20" />
              Inactive{" "}
              <strong className="font-mono tabular-nums text-text font-bold">
                {inactiveCount}
              </strong>
            </span>
          </span>
        }
        actions={
          <div className="flex items-center gap-2 shrink-0">
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              startIcon={
                <RotateCcw
                  className={`size-3.5 text-text-muted ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
              }
              onClick={handleRefresh}
            >
              Refresh
            </UIButton>

            <UIButton
              type="button"
              variant="outline"
              size="sm"
              startIcon={<Download className="size-3.5 text-text-muted" />}
              onClick={handleExportCSV}
            >
              Export
            </UIButton>

            <PermissionGate permission="company:create">
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={handleCreateCompany}
              >
                Add Company
              </UIButton>
            </PermissionGate>
          </div>
        }
      />

      {/* ── Enterprise UIFilterToolbar Component with Built-in View Switcher ── */}
      <UIFilterToolbar
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search company name, email, or code..."
        sortBy={sortBy}
        onSortChange={onSortChange}
        sortOptions={SORT_OPTIONS}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        activeFilterChips={activeFilterChips}
        onClearFilters={handleClearFilters}
        filters={
          <>
            <div className="w-36">
              <UISelect
                value={filters.type}
                onChange={(val) => handleFilterChange({ type: val })}
                options={companyTypeOptions}
                placeholder="All Types"
                size="sm"
              />
            </div>

            <div className="w-32">
              <UISelect
                value={filters.status}
                onChange={(val) => handleFilterChange({ status: val })}
                options={statusOptions}
                placeholder="All Status"
                size="sm"
              />
            </div>
          </>
        }
      />

      {/* ── Main Content: Grid or List (Table) ── */}
      {hasError ? (
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] text-center space-y-3 p-6">
          <AlertTriangle className="size-9 text-error mx-auto" />
          <h3 className="text-base font-bold text-text">
            Unable to load companies list
          </h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            {error || "An error occurred while connecting to workspace servers. Please retry."}
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
      ) : isLoading && !hasCompanies ? (
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
      ) : !hasCompanies ? (
        /* Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Building2 className="size-9 text-primary" />}
            title="No companies configured yet"
            description="Add business units or primary pharmacy company profiles to manage operations."
            primaryAction={
              <PermissionGate permission="company:create">
                <UIButton
                  variant="primary"
                  size="sm"
                  startIcon={<Plus className="size-4" />}
                  onClick={handleCreateCompany}
                >
                  Add First Company
                </UIButton>
              </PermissionGate>
            }
          />
        </div>
      ) : !hasFilteredCompanies ? (
        /* Filter Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Search className="size-9 text-text-muted" />}
            title="No matching companies found"
            description="Try changing your search query, status, or type filter criteria."
            primaryAction={
              <UIButton variant="outline" size="sm" onClick={handleClearFilters}>
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
              {paginatedCompanies.map((company) => (
                <CompanyCard
                  key={company._id}
                  company={company}
                  onView={handleViewCompany}
                  onEdit={handleEditCompany}
                  onSettings={handleOpenSettings}
                  onViewEmployees={handleViewEmployees}
                  onDelete={handleDeleteCompany}
                />
              ))}
            </div>
          ) : (
            <CompanyTableView
              companies={paginatedCompanies}
              onView={handleViewCompany}
              onEdit={handleEditCompany}
              onSettings={handleOpenSettings}
              onViewEmployees={handleViewEmployees}
              onDelete={handleDeleteCompany}
            />
          )}
        </>
      )}

      {/* ── 4. Bottom Pagination Module ── */}
      {shouldShowPagination && (
        <div className="bg-surface rounded-xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden">
          <UIPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredCompaniesCount}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24, 48]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSummary
            showPageSize
          />
        </div>
      )}

      {/* ── Slide-over Company Employees & Access Drawer ── */}
      <CompanyEmployeesDrawer
        isOpen={isEmployeeDrawerOpen}
        onClose={handleCloseEmployeesDrawer}
        company={selectedCompanyForEmployees}
      />
    </div>
  );
};

export default CompaniesDesktopPage;
