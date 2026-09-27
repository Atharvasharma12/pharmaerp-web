// src/features/parties/customers/pages/desktop/CustomersDesktopPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Download,
  RotateCcw,
  Search,
  MoreVertical,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Building2,
  Contact,
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
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIIconButton,
} from "@/components/ui";
import { TopBarStats } from "@/layouts/app/components/header";
import { AppTable } from "@/components";
import { ROUTES } from "@/constants";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const CustomersDesktopPage = ({
  customers = [],
  paginatedCustomers: propPaginatedCustomers, // Allow passing paginated if handled by parent
  stats,
  
  filters,
  sortBy,
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  activeFilterChips = [],

  isLoading,
  isDeleting,
  hasError,
  error,
  message,

  totalCustomers = 0,
  filteredCustomersCount = 0,
  hasCustomers,
  hasFilteredCustomers,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleCreateCustomer,
  handleViewCustomer,
  handleEditCustomer,
  handleDeleteCustomer,
  handleRefresh,

  clearMessage,
  activeSegment,
}) => {
  const segmentNavigate = useNavigate();
  // Local pagination if parent doesn't provide it
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const paginatedCustomers = propPaginatedCustomers || customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const totalPages = Math.ceil(filteredCustomersCount / pageSize) || 1;

  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s === "active") return "success";
    if (s === "inactive") return "error";
    if (s === "blocked") return "warning";
    return "primary";
  };

  const getAddressText = (party) => {
    const addr = party?.address || party?.billingAddress || party?.shippingAddress;
    
    const parts = [];
    if (addr?.city) parts.push(addr.city);
    else if (addr?.district) parts.push(addr.district);
    
    if (addr?.state) parts.push(addr.state);
    else if (addr?.pincode) parts.push(addr.pincode);
    
    if (parts.length > 0) {
      return parts.join(", ");
    }
    
    return "No Address";
  };

  const getRandomCompany = (id) => {
    const companies = [
      { name: "Starlink", color: "text-[#8B5CF6] border-[#8B5CF6]/20 bg-[#F5F3FF]" },
      { name: "Marvel", color: "text-[#94A3B8] border-[#94A3B8]/20 bg-[#F1F5F9]" },
      { name: "BMW", color: "text-[#EAB308] border-[#EAB308]/20 bg-[#FEF9C3]" },
      { name: "MBM", color: "text-[#0EA5E9] border-[#0EA5E9]/20 bg-[#E0F2FE]" },
      { name: "KFC", color: "text-[#94A3B8] border-[#94A3B8]/20 bg-[#F1F5F9]" },
      { name: "TATA", color: "text-[#EC4899] border-[#EC4899]/20 bg-[#FDF2F8]" },
      { name: "Saltbox", color: "text-[#3B82F6] border-[#3B82F6]/20 bg-[#EFF6FF]" },
      { name: "TOYOTA", color: "text-[#EF4444] border-[#EF4444]/20 bg-[#FEF2F2]" },
      { name: "Clorio", color: "text-[#06B6D4] border-[#06B6D4]/20 bg-[#ECFEFF]" },
      { name: "TikTok", color: "text-[#64748B] border-[#64748B]/20 bg-[#F8FAFC]" },
      { name: "Dribbble", color: "text-[#8B5CF6] border-[#8B5CF6]/20 bg-[#F5F3FF]" },
      { name: "Behance", color: "text-[#F97316] border-[#F97316]/20 bg-[#FFF7ED]" }
    ];
    const hash = String(id).split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return companies[hash % companies.length];
  };

  const activeCount = stats?.active ?? customers.filter(c => String(c.displayStatus).toLowerCase() === 'active').length;
  const inactiveCount = stats?.inactive ?? customers.filter(c => String(c.displayStatus).toLowerCase() === 'inactive').length;
  const blockedCount = stats?.blocked ?? customers.filter(c => String(c.displayStatus).toLowerCase() === 'blocked').length;

  const topBarStats = [
    { label: "Total", value: totalCustomers, intent: "primary" },
    { label: "Active", value: activeCount, intent: "success" },
    { label: "Inactive", value: inactiveCount, intent: "error" },
    { label: "Blocked", value: blockedCount, intent: "warning" },
  ];

  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const shouldShowPagination = hasFilteredCustomers && filteredCustomersCount > pageSize;

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-0 max-w-[1440px] mx-auto space-y-2.5">
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

      {/* ── B2B / B2C Segment Toggle ── */}
      <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border shadow-xs w-fit">
        <button
          type="button"
          onClick={() => segmentNavigate(`${ROUTES.CUSTOMERS}?segment=b2b`)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all duration-200 cursor-pointer ${
            activeSegment === "b2b"
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:bg-surface-hover hover:text-text"
          }`}
        >
          <Building2 className="size-3.5" />
          B2B
        </button>
        <button
          type="button"
          onClick={() => segmentNavigate(`${ROUTES.CUSTOMERS}?segment=b2c`)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all duration-200 cursor-pointer ${
            activeSegment === "b2c"
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:bg-surface-hover hover:text-text"
          }`}
        >
          <Contact className="size-3.5" />
          B2C
        </button>
        <button
          type="button"
          onClick={() => segmentNavigate(ROUTES.CUSTOMERS)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all duration-200 cursor-pointer ${
            !activeSegment
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:bg-surface-hover hover:text-text"
          }`}
        >
          <Users className="size-3.5" />
          All
        </button>
        {activeSegment && (
          <span className="ml-1 text-[11px] font-medium text-text-muted">
            {activeSegment === "b2b" ? "Retail & Wholesale" : "Hospital, Clinic, Corporate & Others"}
          </span>
        )}
      </div>

      {/* ── Enterprise UIFilterToolbar Component ── */}
      <UIFilterToolbar
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search customer name, email, or mobile..."
        sortBy={sortBy}
        onSortChange={onSortChange}
        sortOptions={SORT_OPTIONS}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        activeFilterChips={activeFilterChips}
        onClearFilters={handleClearFilters}
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
              // onClick={handleExportCSV}
            >
              Export
            </UIButton>

            <PermissionGate permission="customer:create">
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={handleCreateCustomer}
              >
                Add Customer
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
          <UIModalTitle>Filter Customers</UIModalTitle>
          <UIModalDescription>Select criteria to filter the customers list.</UIModalDescription>
        </UIModalHeader>
        <UIModalBody className="overflow-visible">
          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">Type</label>
              <UISelect
                value={filters.type}
                onChange={(val) => handleFilterChange({ type: val })}
                options={[
                  { label: "All Types", value: "all" },
                  { label: "Retail", value: "retail" },
                  { label: "Wholesale", value: "wholesale" },
                  { label: "Hospital", value: "hospital" },
                  { label: "Clinic", value: "clinic" },
                  { label: "Corporate", value: "corporate" },
                ]}
                placeholder="All Types"
                size="sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">Status</label>
              <UISelect
                value={filters.status}
                onChange={(val) => handleFilterChange({ status: val })}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Blocked", value: "blocked" },
                ]}
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
            Unable to load customers list
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-surface rounded-2xl border border-border shadow-xs p-5">
              <div className="flex items-center gap-3.5">
                <UISkeleton className="size-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <UISkeleton className="h-3.5 w-24 rounded" />
                  <UISkeleton className="h-2.5 w-16 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <UISkeleton className="h-2.5 w-12 rounded" />
                  <UISkeleton className="h-3.5 w-20 rounded" />
                </div>
                <div className="space-y-2">
                  <UISkeleton className="h-2.5 w-12 rounded" />
                  <UISkeleton className="h-3.5 w-24 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !hasCustomers ? (
        /* Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Users className="size-9 text-primary" />}
            title="No customers configured yet"
            description="Add customer profiles to start recording invoices and pipeline terms."
            primaryAction={
              <PermissionGate permission="customer:create">
                <UIButton
                  variant="primary"
                  size="sm"
                  startIcon={<Plus className="size-4" />}
                  onClick={handleCreateCustomer}
                >
                  Add Customer
                </UIButton>
              </PermissionGate>
            }
          />
        </div>
      ) : !hasFilteredCustomers ? (
        /* Filter Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Search className="size-9 text-text-muted" />}
            title="No matching customers found"
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
          {viewMode === "grid" || !viewMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedCustomers.map((customer) => {
                const co = getRandomCompany(customer.id || customer._id);
                return (
                <div 
                  key={customer.id || customer._id} 
                  className="bg-surface rounded-2xl border border-border shadow-xs p-5 flex flex-col hover:border-border-hover transition-all hover:shadow-sm cursor-pointer"
                  onClick={() => handleViewCustomer(customer)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      {customer.customerType === "corporate" ? (
                        <div className="size-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[15px]">
                          {getInitials(customer.displayName)}
                        </div>
                      ) : customer.customerType === "hospital" ? (
                        <div className="size-10 shrink-0 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center text-warning font-bold text-[15px]">
                          {getInitials(customer.displayName)}
                        </div>
                      ) : (
                        <div className="size-10 shrink-0 rounded-full bg-surface-alt border border-border flex items-center justify-center overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${customer.displayName}&backgroundColor=b6e3f4,c0aede,d1d4f9`} className="size-full object-cover" alt="Avatar" />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-[14px] font-bold text-text mb-0.5 leading-snug">{customer.displayName}</h4>
                        <p className="text-[11px] font-semibold text-text-muted flex items-center gap-1.5">
                          <span className={`size-1.5 rounded-full shrink-0 ${String(customer.displayStatus).toLowerCase() === 'active' ? 'bg-success' : 'bg-error'}`}></span> 
                          <span className="truncate max-w-[120px]">{getAddressText(customer)}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div onClick={(e) => e.stopPropagation()}>
                      <UIDropdown align="right">
                        <UIDropdownTrigger asChild>
                          <UIIconButton
                            variant="ghost"
                            size="sm"
                            className="text-text-muted hover:text-text p-1.5 -mr-1.5 rounded-md hover:bg-surface-hover transition-colors h-8 w-8"
                          >
                            <MoreVertical className="w-[18px] h-[18px]" />
                          </UIIconButton>
                        </UIDropdownTrigger>
            
                        <UIDropdownMenu width="w-48">
                          <UIDropdownItem
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => handleViewCustomer(customer)}
                          >
                            View Details
                          </UIDropdownItem>
                          <UIDropdownItem
                            icon={<Edit3 className="w-4 h-4" />}
                            onClick={() => handleEditCustomer(customer)}
                          >
                            Edit Customer
                          </UIDropdownItem>
                          <UIDropdownDivider />
                          <UIDropdownItem
                            destructive
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDeleteCustomer(customer)}
                          >
                            Delete Profile
                          </UIDropdownItem>
                        </UIDropdownMenu>
                      </UIDropdown>
                    </div>
                  </div>
                  
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wide text-text-muted mb-1">Mobile</p>
                      <p className="text-[13px] font-semibold text-text">{customer.displayMobile || "-"}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-wide text-text-muted mb-1">Email</p>
                      <p className="text-[13px] font-semibold text-text truncate" title={customer.displayEmail}>{customer.displayEmail || "-"}</p>
                    </div>
                  </div>
                  
                  {/* Footer Badges */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wide text-text-muted mb-1.5">Type</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border text-[10.5px] font-bold text-text-muted bg-surface-alt">
                        {customer.displayType || "Retail"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-semibold tracking-wide text-text-muted mb-1.5">Code</p>
                      <span className="inline-flex items-center text-[10.5px] font-bold text-text">
                        {customer.displayCode || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="bg-surface rounded-xl shadow-xs border border-border overflow-hidden">
              <AppTable
                columns={[
                  {
                    id: "name",
                    key: "displayName",
                    label: "Customer Name",
                    render: (_, row) => (
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(row.displayName)}
                        </div>
                        <div>
                          <p className="font-semibold text-[13px] text-text">{row.displayName}</p>
                          <p className="text-[11px] text-text-muted">{row.displayEmail || "-"}</p>
                        </div>
                      </div>
                    )
                  },
                  {
                    id: "code",
                    key: "displayCode",
                    label: "Code",
                    render: (_, row) => <span className="font-mono text-xs">{row.displayCode || "-"}</span>
                  },
                  {
                    id: "type",
                    key: "displayType",
                    label: "Type",
                    render: (_, row) => (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] border border-[#E2E8F0] text-[10.5px] font-bold text-[#64748B] bg-white">
                        {row.displayType || "Retail"}
                      </span>
                    )
                  },
                  {
                    id: "mobile",
                    key: "displayMobile",
                    label: "Mobile",
                    render: (_, row) => <span className="text-xs text-[#334155]">{row.displayMobile || "-"}</span>
                  },
                  {
                    id: "status",
                    key: "displayStatus",
                    label: "Status",
                    render: (_, row) => (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[5px] text-[10.5px] font-bold
                        ${getStatusColor(row.displayStatus) === 'success' ? 'bg-[#ECFDF5] text-[#10B981]' : ''}
                        ${getStatusColor(row.displayStatus) === 'error' ? 'bg-[#FEF2F2] text-[#EF4444]' : ''}
                        ${getStatusColor(row.displayStatus) === 'warning' ? 'bg-[#FFFBEB] text-[#F59E0B]' : ''}
                        ${getStatusColor(row.displayStatus) === 'primary' ? 'bg-[#F1F5F9] text-[#64748B]' : ''}
                      `}>
                        {row.displayStatus}
                      </span>
                    )
                  },
                  {
                    id: "actions",
                    key: "actions",
                    label: "",
                    align: "right",
                    render: (_, row) => (
                      <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                        <UIDropdown align="right">
                          <UIDropdownTrigger asChild>
                            <UIIconButton
                              variant="ghost"
                              size="sm"
                              className="text-[#94A3B8] hover:text-[#475569] p-1 rounded hover:bg-[#F1F5F9] transition-colors h-8 w-8"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </UIIconButton>
                          </UIDropdownTrigger>
              
                          <UIDropdownMenu width="w-48">
                            <UIDropdownItem
                              icon={<Eye className="w-4 h-4" />}
                              onClick={() => handleViewCustomer(row)}
                            >
                              View Details
                            </UIDropdownItem>
                            <UIDropdownItem
                              icon={<Edit3 className="w-4 h-4" />}
                              onClick={() => handleEditCustomer(row)}
                            >
                              Edit Customer
                            </UIDropdownItem>
                            <UIDropdownDivider />
                            <UIDropdownItem
                              destructive
                              icon={<Trash2 className="w-4 h-4" />}
                              onClick={() => handleDeleteCustomer(row)}
                            >
                              Delete Profile
                            </UIDropdownItem>
                          </UIDropdownMenu>
                        </UIDropdown>
                      </div>
                    )
                  }
                ]}
                rows={paginatedCustomers}
                hover
                bordered={false}
              />
            </div>
          )}
        </>
      )}

      {/* ── 4. Bottom Pagination Module ── */}
      {shouldShowPagination && (
        <div className="bg-surface rounded-xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden">
          <UIPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredCustomersCount}
            pageSize={pageSize}
            pageSizeOptions={[12, 24, 48]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSummary
            showPageSize
          />
        </div>
      )}
    </div>
  );
};

export default CustomersDesktopPage;
