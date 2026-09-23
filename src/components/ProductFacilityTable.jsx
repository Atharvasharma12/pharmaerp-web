// src/components/ProductFacilityTable.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiLayers,
  FiBox,
  FiCalendar,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiEye,
  FiX,
  FiCheck,
} from "react-icons/fi";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";
import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppText,
  AppStatusBadge,
  AppIconButton,
} from "./ui";
import workspaceProductService from "../features/workspace-products/services/workspaceProductService";

/**
 * Helper to reliably parse date string, handling DD-MMM-YY
 */
const parseDateSafely = (dateStr) => {
  if (!dateStr) return null;
  // Check if it matches DD-MMM-YY or DD-MMM-YYYY (e.g., 01-Oct-27)
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    let year = parseInt(parts[2], 10);
    // If year is 2 digits (e.g., 27), assume 2000s
    if (year < 100) year += 2000;

    const monthStr = parts[1].toLowerCase();
    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    const month = months[monthStr.substring(0, 3)];
    const day = parseInt(parts[0], 10);

    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
};

/**
 * Format expiry date into MM/YY string
 */
const formatExpDate = (expiryDate) => {
  if (!expiryDate) return "N/A";
  const dateObj = parseDateSafely(expiryDate);
  if (!dateObj) {
    return String(expiryDate);
  }
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const y = String(dateObj.getFullYear()).slice(-2);
  return `${m}/${y}`;
};

/**
 * Expiry Status Badge
 */
const HighlightedExpiryBadge = ({ expiryDate }) => {
  const isGarbage = typeof expiryDate === "string" && (expiryDate.toLowerCase() === "active" || expiryDate.toLowerCase() === "inactive");
  const actualExpiryDate = isGarbage ? "" : expiryDate;

  const status = useMemo(() => {
    if (!actualExpiryDate) return null;
    const dateObj = parseDateSafely(actualExpiryDate);
    if (!dateObj) return null;

    const expMonth = dateObj.getMonth() + 1;
    const expYear = Number(String(dateObj.getFullYear()).slice(-2));

    const now = new Date();
    const currMonth = now.getMonth() + 1;
    const currYear = Number(String(now.getFullYear()).slice(-2));

    if (expYear < currYear || (expYear === currYear && expMonth < currMonth)) {
      return "expired";
    }
    if (expYear === currYear && expMonth === currMonth) {
      return "thisMonth";
    }

    const diff = (expYear - currYear) * 12 + (expMonth - currMonth);
    if (diff <= 2) return "nearExpiry";

    return "valid";
  }, [actualExpiryDate]);

  if (!status) {
    return <span className="text-xs text-gray-500">{formatExpDate(actualExpiryDate)}</span>;
  }

  const badgeProps = {
    expired: { statusName: "rejected", label: `${formatExpDate(actualExpiryDate)}` },
    thisMonth: { statusName: "rejected", label: `${formatExpDate(actualExpiryDate)}` },
    nearExpiry: { statusName: "pending", label: `${formatExpDate(actualExpiryDate)}` },
    valid: { statusName: "completed", label: formatExpDate(actualExpiryDate) },
  }[status];

  return (
    <AppStatusBadge
      status={badgeProps.statusName}
      label={badgeProps.label}
      showDot={false}
      className="text-xs font-semibold px-2 py-0.5"
    />
  );
};

const ProductFacilityTable = ({ data }) => {
  /* ---------------- STATE ---------------- */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const { activeBranchId } = useUser();
  const [selectedBranch, setSelectedBranch] = useState(activeBranchId || "");
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const { branches, getCompanyBranches } = useBranch();

  /* ---------------- SELECTION ---------------- */
  const [selectedIds, setSelectedIds] = useState([]);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        page,
        limit,
        filters: { inStockOnly: true },
      };
      if (selectedBranch) {
        payload.filters.facility = selectedBranch;
      }
      if (lowStockFilter) {
        payload.filters.lowStock = true;
      }
      if (search) {
        payload.search = search;
      }

      const res = await workspaceProductService.getProductFacilityBatchesByQueryV2(payload);
      const items = res?.data?.data?.batches || [];
      const total = res?.data?.data?.total || items.length;

      setProducts(items);
      setTotalProducts(total);
    } catch (err) {
      console.error("Failed to load inventory stock matrix:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, selectedBranch, lowStockFilter]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log('ProductFacilityTable received data prop with', data.length, 'items');
      setProducts(data);
      setTotalProducts(data.length);
    } else {
      console.log('ProductFacilityTable fetching inventory from API');
      fetchInventory();
    }
  }, [data, fetchInventory]);

  // Load branches for filter on component mount
  useEffect(() => {
    getCompanyBranches();
  }, [getCompanyBranches]);

  /* ---------------- HANDLERS ---------------- */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p._id || p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  /* Total computations */
  const totalQty = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.qty || p.qoh || p.totalStock || 0), 0);
  }, [products]);

  const totalBatches = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.batchCount || p.batches?.length || (p.batchNo ? 1 : 0)), 0);
  }, [products]);

  const flatProducts = useMemo(() => {
    let list = [];
    products.forEach((p, pIdx) => {
      if (Array.isArray(p.batches) && p.batches.length > 0) {
        p.batches.forEach((b, bIdx) => {
          list.push({
            ...p,
            ...b,
            uniqueRowId: `${p._id || p.id || pIdx}-${b.batchNo || bIdx}`,
            batchQty: b.qoh ?? b.qty ?? b.batchQty ?? 0,
          });
        });
      } else {
        list.push({
          ...p,
          uniqueRowId: p._id || p.id || String(pIdx),
          batchNo: p.batchNo || "N/A",
          expiryDate: p.expiryDate || p.exp || null,
          batchQty: p.qty || p.qoh || p.totalStock || 0,
        });
      }
    });
    // Backend already handles lowStock and selectedBranch filters via API
    return list;
  }, [products]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Metrics & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <AppStatusBadge variant="primary" className="text-xs py-1 px-3 font-semibold">
            <FiBox className="mr-1.5 inline" />
            Total: {totalProducts} Products | Batches: {totalBatches} | Qty: {totalQty}
          </AppStatusBadge>
          {selectedIds.length > 0 && (
            <AppStatusBadge variant="info" className="text-xs py-1 px-3 font-medium">
              {selectedIds.length} Selected
            </AppStatusBadge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search product / brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b._id || b.id} value={b._id || b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Low Stock Toggle */}
          <button
            type="button"
            onClick={() => setLowStockFilter((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${lowStockFilter
              ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            <FiAlertTriangle className={lowStockFilter ? "text-rose-600" : "text-gray-400"} />
            Low Stock
          </button>

          {/* Refresh Button */}
          <AppIconButton
            onClick={fetchInventory}
            title="Refresh Inventory"
            className="border border-gray-200 hover:bg-gray-50 p-1.5 rounded-lg"
          >
            <FiRefreshCw className={`text-gray-600 text-xs ${loading ? "animate-spin" : ""}`} />
          </AppIconButton>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden min-h-[60vh]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 min-w-[180px]">Product Name</th>
                <th className="p-3">Brand / Marketer</th>
                <th className="p-3">Pack</th>
                <th className="p-3">Batch No</th>
                <th className="p-3 text-center">Expiry</th>
                <th className="p-3 text-right">QOH / Stock</th>
                <th className="p-3 text-right">MRP</th>
                <th className="p-3 text-right">Rate A</th>
                <th className="p-3 text-right">Rate B</th>
                <th className="p-3 text-right">Rate C</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={11} className="p-4 text-center text-gray-400">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : flatProducts.length > 0 ? (
                flatProducts.map((row) => {
                  const rowId = row.uniqueRowId;
                  const isSelected = selectedIds.includes(rowId);

                  return (
                    <tr
                      key={rowId}
                      onClick={() => handleSelectRow(rowId)}
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${isSelected ? "bg-primary-50/30" : ""
                        }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 font-semibold text-gray-900">
                        {row.name || "N/A"}
                      </td>

                      <td className="p-3 text-gray-600 font-medium">
                        {row.manufacturer || row.marketer || "FDC"}
                      </td>

                      <td className="p-3 text-gray-500">
                        {row.pack || row.qty || "10x10"}
                      </td>

                      <td className="p-3 font-mono font-medium text-gray-800">
                        {row.batchNo}
                      </td>

                      <td className="p-3 text-center">
                        <HighlightedExpiryBadge expiryDate={row.expiryDate} />
                      </td>

                      <td className="p-3 text-right font-bold text-gray-900">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md ${(row.batchQty || 0) < 10
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-50 text-emerald-700"
                            }`}
                        >
                          {row.batchQty}
                        </span>
                      </td>

                      <td className="p-3 text-right text-gray-700 font-medium">
                        ₹{Number(row.mrp || 0).toFixed(2)}
                      </td>

                      <td className="p-3 text-right text-emerald-700 font-semibold">
                        ₹{Number(row.rateA || 0).toFixed(2)}
                      </td>

                      <td className="p-3 text-right text-blue-700 font-semibold">
                        ₹{Number(row.rateB || 0).toFixed(2)}
                      </td>

                      <td className="p-3 text-right text-amber-700 font-semibold">
                        ₹{Number(row.rateC || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-400 text-sm">
                    No products or stock records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-700">{flatProducts.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalProducts}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 font-medium text-gray-700">Page {page}</span>
            <button
              disabled={flatProducts.length < limit || page * limit >= totalProducts}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFacilityTable;
