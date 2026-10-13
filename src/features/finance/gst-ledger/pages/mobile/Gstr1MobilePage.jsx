import React, { useState, useMemo } from "react";
import AppMobileHeader from "@/layouts/app/mobile/AppMobileHeader";
import { useGstLedger } from "../../hooks/useGstLedger";
import { UIInfiniteScroll } from "@/components/ui";
import useCompany from "@/features/company/hooks/useCompany";
import { calculateGstr1Summary, deduceGstrGroup } from "../../utils/gstr1SummaryCalculator";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiEye,
  FiFileText,
  FiX,
} from "react-icons/fi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Gstr1MobilePage = () => {
  const { currentCompany } = useCompany();
  const {
    entries,
    total,
    loading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
    filters,
    stats,
    branches = [],
    currentBranch,
    summaryData,
    summaryLoading,
    fetchSummary,
    handleFilterChange,
    handleResetFilters,
    refetch,
    exportToCsv,
    createEntry,
  } = useGstLedger("GSTR-1");

  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    voucherNumber: "",
    voucherDate: new Date().toISOString().slice(0, 10),
    branchId: currentBranch?._id || "",
    groupDescription: "B2B",
    taxableAmount: "",
    cgst: "",
    sgst: "",
    igst: "",
    narration: "",
  });

  // Fallback summary computation
  const fallbackSummary = useMemo(() => {
    return calculateGstr1Summary(entries, {
      companyGstin: currentCompany?.gstin || "",
      b2cLargeThreshold: 250000,
    });
  }, [entries, currentCompany?.gstin]);

  const activeSummary = summaryData || fallbackSummary;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.voucherNumber.trim()) {
      setFormError("Voucher Number is required");
      return;
    }

    setSubmitting(true);
    const result = await createEntry({
      voucherNumber: formData.voucherNumber,
      voucherDate: formData.voucherDate,
      branchId: formData.branchId || undefined,
      groupDescription: formData.groupDescription || "B2B",
      taxableAmount: Number(formData.taxableAmount || 0),
      cgst: Number(formData.cgst || 0),
      sgst: Number(formData.sgst || 0),
      igst: Number(formData.igst || 0),
      narration: formData.narration,
    });

    setSubmitting(false);
    if (result.success) {
      setIsModalOpen(false);
      setFormData({
        voucherNumber: "",
        voucherDate: new Date().toISOString().slice(0, 10),
        branchId: currentBranch?._id || "",
        groupDescription: "B2B",
        taxableAmount: "",
        cgst: "",
        sgst: "",
        igst: "",
        narration: "",
      });
      fetchSummary();
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-bg transition-colors">
      <AppMobileHeader title="GSTR-1 (Outward Supplies)" />

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* KPI Summary Cards Scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="bg-white dark:bg-surface px-3 py-2 rounded-lg border border-slate-200 dark:border-border shadow-xs min-w-[120px] flex-1 transition-colors">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-text-muted uppercase tracking-wider block">
              Invoices
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-text mt-0.5 block">
              {stats.count}
            </span>
          </div>

          <div className="bg-white dark:bg-surface px-3 py-2 rounded-lg border border-slate-200 dark:border-border shadow-xs min-w-[130px] flex-1 transition-colors">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-text-muted uppercase tracking-wider block">
              Taxable Amount
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-text mt-0.5 block">
              {formatCurrency(stats.totalTaxable)}
            </span>
          </div>

          <div className="bg-white dark:bg-surface px-3 py-2 rounded-lg border border-slate-200 dark:border-border shadow-xs min-w-[120px] flex-1 transition-colors">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-text-muted uppercase tracking-wider block">
              Total GST (Tax)
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
              {formatCurrency(stats.totalGst)}
            </span>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="bg-white dark:bg-surface p-3 rounded-xl border border-slate-200 dark:border-border shadow-xs flex items-center gap-2 transition-colors">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search voucher #..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-800 dark:text-text placeholder-slate-400 dark:placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => {
              fetchSummary();
              setIsSummaryModalOpen(true);
            }}
            className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs"
            title="GSTR-1 Summary"
          >
            <FiEye className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs"
            title="New GSTR-1 Record"
          >
            <FiPlus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
              showFilters || filters.startDate || filters.endDate
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 font-semibold"
                : "bg-white dark:bg-surface text-slate-600 dark:text-text-muted border-slate-200 dark:border-border"
            }`}
          >
            <FiFilter className="w-4 h-4" />
          </button>

          <button
            onClick={exportToCsv}
            disabled={!entries.length}
            className="p-2 bg-white dark:bg-surface text-slate-700 dark:text-text-muted border border-slate-200 dark:border-border rounded-lg text-xs font-medium disabled:opacity-50"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-surface p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-text">Filter by Date</span>
              <button
                onClick={() => setShowFilters(false)}
                className="text-slate-400 dark:text-text-muted hover:text-slate-600 dark:hover:text-text"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 dark:text-text-muted font-medium block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-800 dark:text-text"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 dark:text-text-muted font-medium block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-800 dark:text-text"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 dark:text-text-muted font-medium block mb-1">
                Branch
              </label>
              <select
                value={filters.branchId || "all"}
                onChange={(e) => handleFilterChange("branchId", e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-800 dark:text-text"
              >
                <option value="all">All Branches</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} {b._id === currentBranch?._id ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {(filters.search || filters.startDate || filters.endDate || (filters.branchId && filters.branchId !== currentBranch?._id)) && (
              <button
                onClick={handleResetFilters}
                className="w-full py-1.5 text-xs text-slate-600 dark:text-text-muted bg-slate-100 dark:bg-surface-alt hover:bg-slate-200 dark:hover:bg-surface-hover rounded-lg font-medium transition"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}

        {/* Entry List Cards */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-surface p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-200 dark:bg-surface-alt rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 dark:bg-surface-alt rounded w-2/3"></div>
                <div className="h-6 bg-slate-200 dark:bg-surface-alt rounded w-1/2"></div>
              </div>
            ))
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white dark:bg-surface p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                      {entry.voucherNumber}
                    </span>
                    {(entry.groupDescription || deduceGstrGroup(entry)) && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-surface-alt text-slate-700 dark:text-text-muted border border-slate-200/80 dark:border-border">
                        {entry.groupDescription || deduceGstrGroup(entry)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.branchId?.name && (
                      <span className="text-[10px] bg-slate-100 dark:bg-surface-alt text-slate-600 dark:text-text-muted px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-border/60">
                        {entry.branchId.name}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-text-muted font-medium">
                      {formatDate(entry.voucherDate)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-border/60">
                  <div>
                    <span className="text-slate-400 dark:text-text-muted block text-[10px]">Taxable Amount</span>
                    <span className="font-semibold text-slate-800 dark:text-text">
                      {formatCurrency(entry.taxableAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-text-muted block text-[10px]">CGST / SGST</span>
                    <span className="font-semibold text-slate-700 dark:text-text-muted">
                      {formatCurrency(entry.cgst)} / {formatCurrency(entry.sgst)}
                    </span>
                  </div>
                  {entry.igst > 0 && (
                    <div>
                      <span className="text-slate-400 dark:text-text-muted block text-[10px]">IGST</span>
                      <span className="font-semibold text-violet-600 dark:text-violet-400">
                        {formatCurrency(entry.igst)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 dark:text-text-muted block text-[10px]">Total Amount</span>
                    <span className="font-bold text-slate-900 dark:text-text">
                      {formatCurrency(entry.totalAmount)}
                    </span>
                  </div>
                </div>

                {entry.narration && (
                  <p className="text-xs text-slate-500 dark:text-text-muted bg-slate-50 dark:bg-surface-alt p-2 rounded-lg italic">
                    {entry.narration}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-surface p-8 rounded-xl border border-slate-200 dark:border-border text-center text-slate-500 dark:text-text-muted space-y-2">
              <FiFileText className="w-8 h-8 text-slate-300 dark:text-text-muted/40 mx-auto" />
              <p className="text-sm font-medium text-slate-700 dark:text-text">No GSTR-1 records</p>
              <p className="text-xs text-slate-400 dark:text-text-muted">
                Tap "+" to record outward sales transactions.
              </p>
            </div>
          )}
        </div>

        {/* Mobile Infinite Scroll */}
        {!loading && entries.length > 0 && (
          <UIInfiniteScroll
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoadingMore}
            rootMargin="40px"
            endMessage={
              !hasMore && entries.length > 0 ? (
                <span className="font-mono text-[11px] text-slate-400 dark:text-text-muted select-none">
                  ✓ All {total} records loaded
                </span>
              ) : null
            }
          />
        )}

        {/* Mobile Record Count Summary */}
        {entries.length > 0 && (
          <div className="bg-white dark:bg-surface p-3 rounded-xl border border-slate-200 dark:border-border shadow-xs flex items-center justify-between text-xs text-slate-600 dark:text-text-muted transition-colors">
            <span>
              Loaded <span className="font-semibold text-slate-900 dark:text-text">{entries.length}</span> of{" "}
              <span className="font-semibold text-slate-900 dark:text-text">{total}</span> records
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.totalAmount)}
            </span>
          </div>
        )}
      </div>

      {/* New GSTR-1 Mobile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-surface rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200 dark:border-border w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-5 duration-150">
            <div className="p-4 border-b border-slate-100 dark:border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-text">New GSTR-1 Entry</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 dark:text-text-muted hover:text-slate-600 dark:hover:text-text p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              {formError && (
                <div className="p-2.5 bg-red-50 dark:bg-error-soft border border-red-200 dark:border-error/30 rounded-lg text-xs text-red-700 dark:text-error">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                  Voucher Number *
                </label>
                <input
                  type="text"
                  name="voucherNumber"
                  required
                  placeholder="e.g. INV-2026-001"
                  value={formData.voucherNumber}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                  Voucher Date *
                </label>
                <input
                  type="date"
                  name="voucherDate"
                  required
                  value={formData.voucherDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                  Group Description *
                </label>
                <select
                  name="groupDescription"
                  required
                  value={formData.groupDescription}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="B2B">1. B2B (Registered Recipient)</option>
                  <option value="B2C (Large) Invoice">2. B2C (Large) Invoice</option>
                  <option value="B2C (Small) Invoice">3. B2C (Small) Invoice</option>
                  <option value="Nil Rated">4.1 Nil Rated Supplies</option>
                  <option value="Exempted">4.2 Exempted Supplies</option>
                  <option value="Export Invoices">5. Export Invoices</option>
                  <option value="Tax Liability on Advance">6. Tax Liability on Advance</option>
                  <option value="Set/off Tax on Advance of prior period">7. Set/off Tax on Advance</option>
                  <option value="Credit Note - Registered">8.1 Credit Note - Registered</option>
                  <option value="Credit Note - Unregistered">8.2 Credit Note - Unregistered</option>
                  <option value="Debit Note - Registered">8.3 Debit Note - Registered</option>
                  <option value="Debit Note - Unregistered">8.4 Debit Note - Unregistered</option>
                  <option value="Refund from Advance">8.5 Refund from Advance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                  Branch
                </label>
                <select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">No Branch / Global</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} {b._id === currentBranch?._id ? "(Current)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                  Taxable Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="taxableAmount"
                  placeholder="0.00"
                  value={formData.taxableAmount}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                    CGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgst"
                    placeholder="0.00"
                    value={formData.cgst}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                    SGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="sgst"
                    placeholder="0.00"
                    value={formData.sgst}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                    IGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="igst"
                    placeholder="0.00"
                    value={formData.igst}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-text-muted block mb-1">
                  Narration
                </label>
                <input
                  type="text"
                  name="narration"
                  placeholder="Optional details..."
                  value={formData.narration}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-alt border border-slate-200 dark:border-border rounded-lg text-xs text-slate-900 dark:text-text focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-text-muted bg-slate-100 dark:bg-surface-alt hover:bg-slate-200 dark:hover:bg-surface-hover rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition"
                >
                  {submitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GSTR-1 Mobile Summary Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-surface rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200 dark:border-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-150">
            <div className="p-4 border-b border-slate-100 dark:border-border flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-text">
                    GSTR-1 Statutory Summary
                  </h3>
                  {summaryLoading && (
                    <span className="text-[10px] text-indigo-500 animate-pulse font-medium">Calculating...</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-text-muted mt-0.5">
                  Across all {total} database outward records
                </p>
              </div>
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                className="text-slate-400 dark:text-text-muted hover:text-slate-600 dark:hover:text-text p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto overflow-x-auto flex-1">
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-border shadow-xs">
                <table className="w-full text-[11px] text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-100 dark:bg-surface-alt text-slate-700 dark:text-text-muted font-semibold sticky top-0 z-10 border-b border-slate-200 dark:border-border">
                    <tr>
                      <th className="px-3 py-2 text-left min-w-[180px]">Description</th>
                      <th className="px-2 py-2 text-right w-12">Count</th>
                      <th className="px-2 py-2 text-right min-w-[80px]">Taxable</th>
                      <th className="px-2 py-2 text-right min-w-[70px]">SGST</th>
                      <th className="px-2 py-2 text-right min-w-[70px]">CGST</th>
                      <th className="px-2 py-2 text-right min-w-[70px]">IGST</th>
                      <th className="px-2 py-2 text-right min-w-[60px]">Cess</th>
                      <th className="px-2 py-2 text-right min-w-[85px]">Total Tax</th>
                      <th className="px-3 py-2 text-right min-w-[95px]">Invoice Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-border/40">
                    {(activeSummary.groups || []).map((group, idx) => {
                      const isTotal = group.isTotal;
                      const isSummaryBox = group.isSummaryBox;
                      const isSub = group.isSubItem;

                      let rowClasses = "transition-colors ";
                      if (isTotal) {
                        rowClasses += "bg-slate-100/90 dark:bg-surface-alt font-bold text-slate-900 dark:text-text border-t-2 border-b-2 border-slate-300 dark:border-border";
                      } else if (isSummaryBox) {
                        rowClasses += "bg-indigo-50/40 dark:bg-indigo-500/5 font-semibold text-slate-800 dark:text-text";
                      } else if (isSub) {
                        rowClasses += "hover:bg-slate-50 dark:hover:bg-surface-hover/50 text-slate-600 dark:text-text-muted text-[10px]";
                      } else {
                        rowClasses += "hover:bg-slate-50 dark:hover:bg-surface-hover/50 text-slate-800 dark:text-text font-medium";
                      }

                      return (
                        <tr key={idx} className={rowClasses}>
                          <td className="px-3 py-2">
                            {isSub ? (
                              <div className="pl-4 flex items-center gap-1">
                                <span className="text-slate-400 dark:text-text-muted/60">-</span>
                                <span>{group.description}</span>
                              </div>
                            ) : isTotal ? (
                              <span className="font-bold uppercase tracking-wider">{group.description}</span>
                            ) : isSummaryBox ? (
                              <span className="font-semibold text-indigo-700 dark:text-indigo-400">{group.description}</span>
                            ) : (
                              <span>{group.description}</span>
                            )}
                          </td>
                          <td className="px-2 py-2 text-right font-mono text-[10px]">{group.count}</td>
                          <td className="px-2 py-2 text-right font-mono">{formatCurrency(group.taxable)}</td>
                          <td className="px-2 py-2 text-right font-mono">{formatCurrency(group.sgst)}</td>
                          <td className="px-2 py-2 text-right font-mono">{formatCurrency(group.cgst)}</td>
                          <td className="px-2 py-2 text-right font-mono">{formatCurrency(group.igst)}</td>
                          <td className="px-2 py-2 text-right font-mono">{formatCurrency(group.cess)}</td>
                          <td className={`px-2 py-2 text-right font-mono ${isTotal ? "text-indigo-700 dark:text-indigo-400 font-bold" : "font-semibold text-slate-900 dark:text-text"}`}>
                            {formatCurrency(group.totalTax)}
                          </td>
                          <td className={`px-3 py-2 text-right font-mono ${isTotal ? "text-slate-900 dark:text-text font-bold" : "font-semibold text-slate-900 dark:text-text"}`}>
                            {formatCurrency(group.invoiceValue)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-border bg-slate-50 dark:bg-surface-alt flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gstr1MobilePage;
