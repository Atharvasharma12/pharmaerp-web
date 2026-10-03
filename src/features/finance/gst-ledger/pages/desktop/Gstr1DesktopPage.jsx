import React, { useState } from "react";
import AppDesktopHeader from "@/layouts/app/desktop/AppDesktopHeader";
import { useGstLedger } from "../../hooks/useGstLedger";
import {
  FiSearch,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiFileText,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

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

const Gstr1DesktopPage = () => {
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
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      <AppDesktopHeader
        title="GSTR-1 (Outward Supplies)"
        description="View your outward supplies, sales transactions, tax breakdowns, and GSTR-1 filing records."
      />

      <div className="p-6 space-y-6">
        {/* KPI Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Invoices
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{stats.count}</span>
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FiFileText className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Taxable Amount
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(stats.totalTaxable)}
              </span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FaRupeeSign className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total CGST
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-emerald-600">
                {formatCurrency(stats.totalCgst)}
              </span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <FaRupeeSign className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total SGST
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-teal-600">
                {formatCurrency(stats.totalSgst)}
              </span>
              <span className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <FaRupeeSign className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total IGST
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-violet-600">
                {formatCurrency(stats.totalIgst)}
              </span>
              <span className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                <FaRupeeSign className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Total Outward Value
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">
                {formatCurrency(stats.totalAmount)}
              </span>
              <span className="p-2 bg-slate-700 text-emerald-400 rounded-lg">
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Controls Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search voucher # or narration..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="pl-3 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-slate-400 text-xs font-medium">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="pl-3 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {(filters.search || filters.startDate || filters.endDate) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-1.5 shadow-xs"
            >
              <FiPlus className="w-4 h-4" />
              New GSTR-1 Record
            </button>

            <button
              onClick={refetch}
              disabled={loading}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={exportToCsv}
              disabled={!entries.length}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refetch} className="underline font-semibold hover:text-red-900">
              Retry
            </button>
          </div>
        )}

        {/* Main Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Voucher No</th>
                  <th className="py-3.5 px-4 text-right">Taxable Amount</th>
                  <th className="py-3.5 px-4 text-right">CGST</th>
                  <th className="py-3.5 px-4 text-right">SGST</th>
                  <th className="py-3.5 px-4 text-right">IGST</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4">Narration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24 ml-auto"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-36"></div></td>
                    </tr>
                  ))
                ) : entries.length > 0 ? (
                  entries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {formatDate(entry.voucherDate)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {entry.voucherNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-800 whitespace-nowrap">
                        {formatCurrency(entry.taxableAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-600 font-medium whitespace-nowrap">
                        {formatCurrency(entry.cgst)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-teal-600 font-medium whitespace-nowrap">
                        {formatCurrency(entry.sgst)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-violet-600 font-medium whitespace-nowrap">
                        {formatCurrency(entry.igst)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(entry.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {entry.narration || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FiFileText className="w-10 h-10 text-slate-300" />
                        <p className="text-base font-medium text-slate-600">
                          No GSTR-1 records found
                        </p>
                        <p className="text-xs text-slate-400">
                          Click "+ New GSTR-1 Record" to record outward sales transactions.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {entries.length > 0 ? (page - 1) * limit + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{total}</span> records
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-700 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New GSTR-1 Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Create New GSTR-1 Entry</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Voucher Number *
                  </label>
                  <input
                    type="text"
                    name="voucherNumber"
                    required
                    placeholder="e.g. INV-2026-001"
                    value={formData.voucherNumber}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Voucher Date *
                  </label>
                  <input
                    type="date"
                    name="voucherDate"
                    required
                    value={formData.voucherDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Taxable Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="taxableAmount"
                  placeholder="0.00"
                  value={formData.taxableAmount}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    CGST (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgst"
                    placeholder="0.00"
                    value={formData.cgst}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    SGST (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="sgst"
                    placeholder="0.00"
                    value={formData.sgst}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    IGST (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="igst"
                    placeholder="0.00"
                    value={formData.igst}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Narration / Notes
                </label>
                <input
                  type="text"
                  name="narration"
                  placeholder="Optional details or customer info..."
                  value={formData.narration}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save GSTR-1 Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gstr1DesktopPage;
