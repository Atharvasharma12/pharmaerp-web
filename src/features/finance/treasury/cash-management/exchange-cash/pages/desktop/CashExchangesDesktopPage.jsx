// src/features/finance/treasury/cash-management/exchange-cash/pages/desktop/CashExchangesDesktopPage.jsx

import React, { useMemo } from "react";
import {
  UIButton,
  UIAlert,
  UISkeleton,
  UIPagination,
} from "@/components/ui";
import {
  Repeat,
  Plus,
  RefreshCw,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  Building2,
  SlidersHorizontal,
  Banknote,
  ShieldAlert,
  ArrowDownToLine,
  ArrowUpFromLine,
  Filter,
} from "lucide-react";

const formatCurrency = (val) =>
  `₹ ${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (val) => {
  if (!val) return "—";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(val);
  }
};

const formatTime = (val) => {
  if (!val) return "";
  try {
    const d = new Date(val);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const CashExchangesDesktopPage = ({
  cashExchanges = [],
  searchParams = { search: "", status: "all", partition: "all" },
  currentPage = 1,
  pageSize = 10,
  totalExchanges = 0,
  isLoading = false,
  isShiftActive = false,
  activeShift = null,
  currentBranch = null,

  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,

  handleViewDetails,
  handleCreateNew,
  handleRefresh,
}) => {
  // Compute KPI Statistics
  const stats = useMemo(() => {
    let totalAmt = 0;
    let completed = 0;
    let cancelled = 0;
    cashExchanges.forEach((e) => {
      if (e.status === "COMPLETED") {
        totalAmt += Number(e.totalReceived || 0);
        completed++;
      } else if (e.status === "CANCELLED") {
        cancelled++;
      }
    });
    return { totalAmt, completed, cancelled, count: totalExchanges };
  }, [cashExchanges, totalExchanges]);

  // Client-side filtering when backend search/filter is passed
  const filteredExchanges = useMemo(() => {
    return cashExchanges.filter((item) => {
      if (searchParams.partition && searchParams.partition !== "all") {
        if (item.cashPartition !== searchParams.partition && item.partition !== searchParams.partition) {
          return false;
        }
      }
      return true;
    });
  }, [cashExchanges, searchParams.partition]);

  const totalPages = Math.ceil((totalExchanges || 1) / pageSize);

  return (
    <div className="p-4 sm:p-6 bg-[#f8fafc] dark:bg-bg min-h-[calc(100vh-60px)] space-y-6 max-w-[1480px] mx-auto select-none">
      {/* ── Page Header: Title & Action Buttons ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-text tracking-tight">
              Cash Exchanges
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              DENOMINATION SWAPS
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Record denomination exchanges and give change to customers without altering total drawer balances
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <UIButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            startIcon={<RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            className="rounded-xl text-xs font-semibold px-3 py-2 bg-surface hover:bg-surface-alt shadow-2xs border-border text-text cursor-pointer"
          >
            Refresh
          </UIButton>

          {/* New Exchange Button: ONLY SHOWN WHEN SHIFT IS ACTIVE */}
          {isShiftActive ? (
            <UIButton
              type="button"
              size="sm"
              onClick={handleCreateNew}
              startIcon={<Plus className="size-3.5" />}
              className="rounded-xl text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition"
            >
              New Exchange
            </UIButton>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <Clock className="size-3.5" />
              <span>Shift Closed • Exchanges Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Global Alert Banner ── */}
      {(error || message) && (
        <UIAlert
          intent={error ? "danger" : "success"}
          title={error ? "Notice" : "Success"}
          description={error || message}
          onClose={clearFeedback}
        />
      )}

      {/* ── 4 Top KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Exchanges */}
        <div className="bg-surface rounded-2xl border border-border p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Total Exchanges
            </span>
            <div className="size-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Repeat className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-text">
              {stats.count}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Recorded denomination swaps
            </div>
          </div>
        </div>

        {/* Card 2: Completed Swaps */}
        <div className="bg-surface rounded-2xl border border-border p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Completed
            </span>
            <div className="size-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {stats.completed}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Successfully balanced & settled
            </div>
          </div>
        </div>

        {/* Card 3: Total Volume Swapped */}
        <div className="bg-surface rounded-2xl border border-border p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Total Swapped Volume
            </span>
            <div className="size-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Banknote className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 truncate">
              {formatCurrency(stats.totalAmt)}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Net zero drawer variance
            </div>
          </div>
        </div>

        {/* Card 4: Active Shift Status */}
        <div className="bg-surface rounded-2xl border border-border p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Shift Status
            </span>
            <div
              className={`size-8 rounded-xl flex items-center justify-center ${
                isShiftActive
                  ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
              }`}
            >
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div
              className={`text-sm font-black truncate ${
                isShiftActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {isShiftActive
                ? activeShift?.name || activeShift?.shiftNo || "Active Shift Open"
                : "No Active Shift"}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5 truncate">
              {isShiftActive
                ? "Exchanges enabled for current shift"
                : "Open shift to enable cash exchanges"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Container: Filters & Table ── */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        {/* Toolbar Bar */}
        <div className="p-4 border-b border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface">
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchParams.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search exchange #, narration, notes..."
                className="w-full bg-surface-alt/60 hover:bg-surface-alt focus:bg-surface border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-text placeholder:text-text-muted/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
            {/* Status Filter */}
            <select
              value={searchParams.status || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              aria-label="Filter by Status"
              className="bg-surface-alt/70 border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-text outline-none cursor-pointer hover:bg-surface-alt focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Partition Filter */}
            <select
              value={searchParams.partition || "all"}
              onChange={(e) => handleFilterChange("partition", e.target.value)}
              aria-label="Filter by Drawer Partition"
              className="bg-surface-alt/70 border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-text outline-none cursor-pointer hover:bg-surface-alt focus:border-blue-500"
            >
              <option value="all">All Drawers</option>
              <option value="running">Running Drawer</option>
              <option value="frozen">Frozen Vault</option>
            </select>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-alt/60 text-text-muted font-bold border-b border-border text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Exchange #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Drawer</th>
                <th className="py-3 px-4 text-right">Swapped Amount</th>
                <th className="py-3 px-4">Processed By</th>
                <th className="py-3 px-4">Narration</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={8} className="py-3 px-4">
                      <UISkeleton className="h-7 w-full rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : filteredExchanges.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="size-12 rounded-2xl bg-surface-alt flex items-center justify-center text-text-muted">
                        <Repeat className="size-6" />
                      </div>
                      <div className="text-sm font-bold text-text">No Cash Exchanges Found</div>
                      <p className="text-xs text-text-muted">
                        {isShiftActive
                          ? "No cash exchanges have been recorded matching your criteria."
                          : "Shift is currently closed. Open an active shift to record new cash exchanges."}
                      </p>
                      {isShiftActive && (
                        <UIButton
                          type="button"
                          size="sm"
                          onClick={handleCreateNew}
                          startIcon={<Plus className="size-3.5" />}
                          className="mt-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          New Cash Exchange
                        </UIButton>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExchanges.map((row) => {
                  const isCompleted = row.status === "COMPLETED";
                  const isCancelled = row.status === "CANCELLED";
                  const partitionName =
                    row.cashPartition === "frozen" || row.partition === "frozen"
                      ? "Frozen Vault"
                      : "Running Drawer";

                  return (
                    <tr
                      key={row._id}
                      className="hover:bg-surface-alt/40 transition-colors cursor-pointer group"
                      onClick={() => handleViewDetails(row._id)}
                    >
                      {/* Exchange # */}
                      <td className="py-3 px-4 font-mono font-bold text-text">
                        <span className="px-2 py-0.5 rounded-md bg-surface-alt border border-border/80 text-[11px] group-hover:border-blue-500/40 transition-colors">
                          {row.exchangeNumber || "—"}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text">
                          {formatDate(row.exchangeDate || row.createdAt)}
                        </div>
                        <div className="text-[10px] text-text-muted font-mono">
                          {formatTime(row.exchangeDate || row.createdAt)}
                        </div>
                      </td>

                      {/* Drawer */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            partitionName === "Frozen Vault"
                              ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                              : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {partitionName}
                        </span>
                      </td>

                      {/* Swapped Amount */}
                      <td className="py-3 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(row.totalReceived || row.totalGiven)}
                      </td>

                      {/* Processed By */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text truncate max-w-[130px]">
                          {row.createdBy?.name || row.createdBy?.fullName || "Staff Cashier"}
                        </div>
                        <div className="text-[10px] text-text-muted truncate max-w-[130px]">
                          {row.createdBy?.email || "Cashier"}
                        </div>
                      </td>

                      {/* Narration */}
                      <td className="py-3 px-4 max-w-[180px] truncate text-text-muted text-[11px]">
                        {row.narration || "—"}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="size-3" /> Completed
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <XCircle className="size-3" /> Cancelled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <UIButton
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleViewDetails(row._id)}
                          aria-label={`View details of ${row.exchangeNumber || "cash exchange"}`}
                          className="size-7 p-0 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                        </UIButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        {totalExchanges > 0 && (
          <div className="p-3 border-t border-border/80 flex items-center justify-between bg-surface">
            <div className="text-xs text-text-muted">
              Showing <span className="font-bold text-text">{filteredExchanges.length}</span> of{" "}
              <span className="font-bold text-text">{totalExchanges}</span> exchanges
            </div>
            {totalExchanges > pageSize && (
              <UIPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashExchangesDesktopPage;
