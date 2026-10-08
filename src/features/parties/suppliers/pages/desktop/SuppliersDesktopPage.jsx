// src/features/parties/suppliers/pages/desktop/SuppliersDesktopPage.jsx

import React, { useState, useRef } from "react";
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
  Filter
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
import { AppTable } from "@/components";
import { TopBarStats } from "@/layouts/app/components/header";
import supplierService from "../../services/supplierService";
import SupplierImportPreviewModal from "../../components/SupplierImportPreviewModal";
import SupplierImportConfigModal from "../../components/SupplierImportConfigModal";
import SupplierOutstandingImportPreviewModal from "../../components/SupplierOutstandingImportPreviewModal";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const SuppliersDesktopPage = ({
  suppliers = [],
  paginatedSuppliers: propPaginatedSuppliers, // Allow passing paginated if handled by parent
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

  totalSuppliers = 0,
  filteredSuppliersCount = 0,
  hasSuppliers,
  hasFilteredSuppliers,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleCreateSupplier,
  handleViewSupplier,
  handleEditSupplier,
  handleDeleteSupplier,
  handleRefresh,

  clearMessage,

  currentPage: propCurrentPage,
  pageSize: propPageSize,
  onPageChange: propOnPageChange,
  onPageSizeChange: propOnPageSizeChange,
}) => {
  // Local pagination if parent doesn't provide it
  const [localCurrentPage, setLocalCurrentPage] = React.useState(1);
  const [localPageSize, setLocalPageSize] = React.useState(8);

  const currentPage = propCurrentPage !== undefined ? propCurrentPage : localCurrentPage;
  const pageSize = propPageSize !== undefined ? propPageSize : localPageSize;

  const handlePageChange = (page) => {
    if (propOnPageChange) propOnPageChange(page);
    else setLocalCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    if (propOnPageSizeChange) propOnPageSizeChange(size);
    else setLocalPageSize(size);
  };

  // Import State
  const [isImportConfigOpen, setIsImportConfigOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isOutstandingImportModalOpen, setIsOutstandingImportModalOpen] = useState(false);
  const [activeImportType, setActiveImportType] = useState("standard");
  const [importPreviewData, setImportPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImportClick = () => {
    setIsImportConfigOpen(true);
  };

  const handleImportSubmit = async (file, importType) => {
    try {
      setIsUploading(true);
      setActiveImportType(importType);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("importType", importType);
      
      const res = await supplierService.previewImport(formData);
      setImportPreviewData(res.data?.data || []);
      
      setIsImportConfigOpen(false);

      if (importType === "outstanding") {
        setIsOutstandingImportModalOpen(true);
      } else {
        setIsImportModalOpen(true);
      }
    } catch (err) {
      console.error("Failed to upload for preview", err);
      alert(err?.response?.data?.message || "Failed to parse Excel file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportSuccess = (successful, failed, errors = []) => {
    setIsImportModalOpen(false);
    setIsOutstandingImportModalOpen(false);
    if (failed > 0) {
      alert(`Imported ${successful} successfully. ${failed} failed.\n\nErrors:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...and more' : ''}`); 
    } else {
      alert(`Imported ${successful} successfully.`);
    }
    if (successful > 0) {
      handleRefresh();
    }
  };

  const isServerPaginated = !!propOnPageChange;
  const paginatedSuppliers = isServerPaginated ? suppliers : suppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const totalPages = Math.ceil(filteredSuppliersCount / pageSize) || 1;



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

  const activeCount = stats?.active ?? suppliers.filter(c => String(c.displayStatus).toLowerCase() === 'active').length;
  const inactiveCount = stats?.inactive ?? suppliers.filter(s => String(s.displayStatus).toLowerCase() === 'inactive').length;
  const blockedCount = stats?.blocked ?? suppliers.filter(s => String(s.displayStatus).toLowerCase() === 'blocked').length;

  const topBarStats = [
    { label: "Total", value: totalSuppliers, intent: "primary" },
    { label: "Active", value: activeCount, intent: "success" },
    { label: "Inactive", value: inactiveCount, intent: "error" },
    { label: "Blocked", value: blockedCount, intent: "warning" },
  ];

  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const shouldShowPagination = hasFilteredSuppliers && filteredSuppliersCount > pageSize;

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

      {/* ── Enterprise UIFilterToolbar Component ── */}
      <UIFilterToolbar
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search supplier name, email, or mobile..."
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

            <PermissionGate permission="supplier:create">
              <UIButton
                type="button"
                variant="outline"
                size="sm"
                startIcon={<Download className="size-4" />}
                onClick={handleImportClick}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Import"}
              </UIButton>
            </PermissionGate>

            <PermissionGate permission="supplier:create">
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={handleCreateSupplier}
              >
                Add Supplier
              </UIButton>
            </PermissionGate>
          </div>
        }
      />

      {/* ── Financial Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-border shadow-xs p-5 flex flex-col justify-center">
          <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Payables</h4>
          <p className="text-xl font-bold text-rose-600">₹{(stats?.totalCr || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold">Cr</span></p>
        </div>
        <div className="bg-surface rounded-2xl border border-border shadow-xs p-5 flex flex-col justify-center">
          <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Receivables</h4>
          <p className="text-xl font-bold text-emerald-600">₹{(stats?.totalDr || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold">Dr</span></p>
        </div>
        <div className="bg-surface rounded-2xl border border-border shadow-xs p-5 flex flex-col justify-center">
          <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Net Running Balance</h4>
          <p className="text-xl font-bold text-primary">₹{(stats?.netRunning || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold">{stats?.runningType || 'Cr'}</span></p>
        </div>
      </div>

      {/* ── Filter Modal ── */}
      <UIModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        className="overflow-visible"
      >
        <UIModalHeader>
          <UIModalTitle>Filter Suppliers</UIModalTitle>
          <UIModalDescription>Select criteria to filter the suppliers list.</UIModalDescription>
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
                  { label: "Manufacturer", value: "manufacturer" },
                  { label: "Distributor", value: "distributor" },
                  { label: "Wholesaler", value: "wholesaler" },
                  { label: "Retailer", value: "retailer" },
                  { label: "Stockist", value: "stockist" },
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
            Unable to load suppliers list
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
      ) : !hasSuppliers ? (
        /* Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Users className="size-9 text-primary" />}
            title="No suppliers configured yet"
            description="Add supplier profiles to start managing your supply chain."
            primaryAction={
              <PermissionGate permission="supplier:create">
                <UIButton
                  variant="primary"
                  size="sm"
                  startIcon={<Plus className="size-4" />}
                  onClick={handleCreateSupplier}
                >
                  Add Supplier
                </UIButton>
              </PermissionGate>
            }
          />
        </div>
      ) : !hasFilteredSuppliers ? (
        /* Filter Empty State */
        <div className="py-10 bg-surface rounded-2xl shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <UIEmptyState
            icon={<Search className="size-9 text-text-muted" />}
            title="No matching suppliers found"
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
              {paginatedSuppliers.map((supplier) => {
                const co = getRandomCompany(supplier.id || supplier._id);
                return (
                <div 
                  key={supplier.id || supplier._id} 
                  className="bg-surface rounded-2xl border border-border shadow-xs p-5 flex flex-col hover:border-border-hover transition-all hover:shadow-sm cursor-pointer"
                  onClick={() => handleViewSupplier(supplier)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      {supplier.supplierType === "distributor" ? (
                        <div className="size-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[15px]">
                          {getInitials(supplier.displayName)}
                        </div>
                      ) : supplier.supplierType === "manufacturer" ? (
                        <div className="size-10 shrink-0 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center text-warning font-bold text-[15px]">
                          {getInitials(supplier.displayName)}
                        </div>
                      ) : (
                        <div className="size-10 shrink-0 rounded-full bg-surface-alt border border-border flex items-center justify-center overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${supplier.displayName}&backgroundColor=b6e3f4,c0aede,d1d4f9`} className="size-full object-cover" alt="Avatar" />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-[14px] font-bold text-text mb-0.5 leading-snug">{supplier.displayName}</h4>
                        <p className="text-[11px] font-semibold text-text-muted flex items-center gap-1.5">
                          <span className={`size-1.5 rounded-full shrink-0 ${String(supplier.displayStatus).toLowerCase() === 'active' ? 'bg-success' : 'bg-error'}`}></span> 
                          <span className="truncate max-w-[120px]">{getAddressText(supplier)}</span>
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
                            onClick={() => handleViewSupplier(supplier)}
                          >
                            View Details
                          </UIDropdownItem>
                          <UIDropdownItem
                            icon={<Edit3 className="w-4 h-4" />}
                            onClick={() => handleEditSupplier(supplier)}
                          >
                            Edit Supplier
                          </UIDropdownItem>
                          <UIDropdownDivider />
                          <UIDropdownItem
                            destructive
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDeleteSupplier(supplier)}
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
                      <p className="text-[13px] font-semibold text-text">{supplier.displayMobile || "-"}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-wide text-text-muted mb-1">Outstanding</p>
                      <p className={`text-[13px] font-bold truncate ${supplier.balanceType?.toLowerCase() === 'dr' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ₹{(supplier.outstandingAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} {supplier.balanceType?.toUpperCase() || "CR"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Footer Badges */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wide text-text-muted mb-1.5">Type</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border text-[10.5px] font-bold text-text-muted bg-surface-alt">
                        {supplier.displayType || "Supplier"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-semibold tracking-wide text-text-muted mb-1.5">Code</p>
                      <span className="inline-flex items-center text-[10.5px] font-bold text-text">
                        {supplier.displayCode || "-"}
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
                    label: "Supplier Name",
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
                        {row.displayType || "Supplier"}
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
                              onClick={() => handleViewSupplier(row)}
                            >
                              View Details
                            </UIDropdownItem>
                            <UIDropdownItem
                              icon={<Edit3 className="w-4 h-4" />}
                              onClick={() => handleEditSupplier(row)}
                            >
                              Edit Supplier
                            </UIDropdownItem>
                            <UIDropdownDivider />
                            <UIDropdownItem
                              destructive
                              icon={<Trash2 className="w-4 h-4" />}
                              onClick={() => handleDeleteSupplier(row)}
                            >
                              Delete Profile
                            </UIDropdownItem>
                          </UIDropdownMenu>
                        </UIDropdown>
                      </div>
                    )
                  }
                ]}
                rows={paginatedSuppliers}
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
            totalItems={filteredSuppliersCount}
            pageSize={pageSize}
            pageSizeOptions={[8, 12, 24, 48]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSummary
            showPageSize
          />
        </div>
      )}

      {/* ── Import Preview Modal ── */}
      <SupplierImportPreviewModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        previewData={importPreviewData}
        onImportSuccess={handleImportSuccess}
      />
      
      <SupplierImportConfigModal
        isOpen={isImportConfigOpen}
        onClose={() => setIsImportConfigOpen(false)}
        onImportSubmit={handleImportSubmit}
        isUploading={isUploading}
      />

      <SupplierOutstandingImportPreviewModal
        isOpen={isOutstandingImportModalOpen}
        onClose={() => setIsOutstandingImportModalOpen(false)}
        previewData={importPreviewData}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default SuppliersDesktopPage;
