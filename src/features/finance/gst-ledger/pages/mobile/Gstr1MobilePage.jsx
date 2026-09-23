import React, { useState } from "react";
import AppMobileHeader from "@/layouts/app/mobile/AppMobileHeader";
import { useGstLedger } from "../../hooks/useGstLedger";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
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
  const {
    entries,
    total,
    page,
    limit,
    loading,
    error,
    filters,
    stats,
    setPage,
    handleFilterChange,
    handleResetFilters,
    refetch,
    exportToCsv,
    createEntry,
  } = useGstLedger("GSTR-1");

  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    voucherNumber: "",
    voucherDate: new Date().toISOString().slice(0, 10),
    taxableAmount: "",
    cgst: "",
    sgst: "",
    igst: "",
    narration: "",
  });

  const totalPages = Math.ceil(total / limit) || 1;

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
        taxableAmount: "",
        cgst: "",
        sgst: "",
        igst: "",
        narration: "",
      });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AppMobileHeader title="GSTR-1 (Outward Supplies)" />

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* KPI Summary Cards Scrollable */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs min-w-[140px] flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Invoices
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1 block">
              {stats.count}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs min-w-[150px] flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Taxable Amount
            </span>
            <span className="text-base font-bold text-slate-900 mt-1 block">
              {formatCurrency(stats.totalTaxable)}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs min-w-[140px] flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Tax (GST)
            </span>
            <span className="text-base font-bold text-emerald-600 mt-1 block">
              {formatCurrency(stats.totalCgst + stats.totalSgst + stats.totalIgst)}
            </span>
          </div>

          <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xs min-w-[160px] flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Outward
            </span>
            <span className="text-base font-bold text-emerald-400 mt-1 block">
              {formatCurrency(stats.totalAmount)}
            </span>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search voucher #..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1"
          >
            <FiPlus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
              showFilters || filters.startDate || filters.endDate
                ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            <FiFilter className="w-4 h-4" />
          </button>

          <button
            onClick={exportToCsv}
            disabled={!entries.length}
            className="p-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-medium disabled:opacity-50"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Filter by Date</span>
              <button
                onClick={() => setShowFilters(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                />
              </div>
            </div>
            {(filters.search || filters.startDate || filters.endDate) && (
              <button
                onClick={handleResetFilters}
                className="w-full py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg font-medium"
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
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {entry.voucherNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDate(entry.voucherDate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Taxable Amount</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(entry.taxableAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CGST / SGST</span>
                    <span className="font-semibold text-slate-700">
                      {formatCurrency(entry.cgst)} / {formatCurrency(entry.sgst)}
                    </span>
                  </div>
                  {entry.igst > 0 && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">IGST</span>
                      <span className="font-semibold text-violet-600">
                        {formatCurrency(entry.igst)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Amount</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(entry.totalAmount)}
                    </span>
                  </div>
                </div>

                {entry.narration && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                    {entry.narration}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 space-y-2">
              <FiFileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-700">No GSTR-1 records</p>
              <p className="text-xs text-slate-400">
                Tap "+" to record outward sales transactions.
              </p>
            </div>
          )}
        </div>

        {/* Mobile Pagination */}
        {total > 0 && (
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs text-slate-600">
            <span>
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New GSTR-1 Mobile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-5 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">New GSTR-1 Entry</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Voucher Number *
                </label>
                <input
                  type="text"
                  name="voucherNumber"
                  required
                  placeholder="e.g. INV-2026-001"
                  value={formData.voucherNumber}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Voucher Date *
                </label>
                <input
                  type="date"
                  name="voucherDate"
                  required
                  value={formData.voucherDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Taxable Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="taxableAmount"
                  placeholder="0.00"
                  value={formData.taxableAmount}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 block mb-1">
                    CGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgst"
                    placeholder="0.00"
                    value={formData.cgst}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-700 block mb-1">
                    SGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="sgst"
                    placeholder="0.00"
                    value={formData.sgst}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-700 block mb-1">
                    IGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="igst"
                    placeholder="0.00"
                    value={formData.igst}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Narration
                </label>
                <input
                  type="text"
                  name="narration"
                  placeholder="Optional details..."
                  value={formData.narration}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gstr1MobilePage;
