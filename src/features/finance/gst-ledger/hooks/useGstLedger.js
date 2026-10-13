import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useBranch from "@/features/branch/hooks/useBranch";
import gstLedgerService from "../services/gstLedgerService";

export const useGstLedger = (type = "GSTR-1") => {
  const { currentBranch, branches = [], getCompanyBranches } = useBranch();

  const PAGE_LIMIT = 10;
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [serverStats, setServerStats] = useState(null);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
    branchId: currentBranch?._id || "all",
  });

  const hasUserScrolledRef = useRef(false);

  useEffect(() => {
    const markScrolled = () => {
      hasUserScrolledRef.current = true;
    };
    window.addEventListener("wheel", markScrolled, { passive: true });
    window.addEventListener("touchmove", markScrolled, { passive: true });
    return () => {
      window.removeEventListener("wheel", markScrolled);
      window.removeEventListener("touchmove", markScrolled);
    };
  }, []);

  const handleTableScroll = useCallback(() => {
    hasUserScrolledRef.current = true;
  }, []);

  // Ensure branches are loaded if needed
  useEffect(() => {
    if (getCompanyBranches && (!branches || branches.length === 0)) {
      getCompanyBranches().catch(() => {});
    }
  }, [getCompanyBranches, branches]);

  // Keep branchId filter synced if currentBranch changes and no explicit branch selection was made
  useEffect(() => {
    if (currentBranch?._id) {
      setFilters((prev) => {
        if (prev.branchId === "all") {
          return { ...prev, branchId: currentBranch._id };
        }
        return prev;
      });
    }
  }, [currentBranch?._id]);

  // Fetch initial batch (Page 1) or refresh on filter change
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    hasUserScrolledRef.current = false;

    try {
      const params = {
        page: 1,
        limit: PAGE_LIMIT,
        ...filters,
      };

      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response =
        type === "GSTR-1"
          ? await gstLedgerService.getGstr1Ledger(params)
          : await gstLedgerService.getGstr2Ledger(params);

      const data = response?.data?.data || response?.data || {};
      const fetchedEntries = data.entries || [];
      const totalCount = data.total !== undefined ? data.total : fetchedEntries.length;

      setEntries(fetchedEntries);
      setTotal(totalCount);
      setPage(1);
      setHasMore(fetchedEntries.length < totalCount);

      if (data.stats) {
        setServerStats(data.stats);
      }
    } catch (err) {
      console.error(`Error fetching ${type} ledger entries:`, err);
      setError(
        err?.response?.data?.message || err.message || `Failed to fetch ${type} records`
      );
      setEntries([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [type, filters]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Load next batch via Infinite Scroll
  const loadMore = useCallback(async () => {
    if (loading || isLoadingMore || !hasMore || !hasUserScrolledRef.current) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const params = {
        page: nextPage,
        limit: PAGE_LIMIT,
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response =
        type === "GSTR-1"
          ? await gstLedgerService.getGstr1Ledger(params)
          : await gstLedgerService.getGstr2Ledger(params);

      const data = response?.data?.data || response?.data || {};
      const newEntries = data.entries || [];
      const totalCount = data.total !== undefined ? data.total : total;

      if (newEntries.length > 0) {
        setEntries((prev) => {
          const existingIds = new Set(prev.map((e) => e._id));
          const filteredNew = newEntries.filter((e) => !existingIds.has(e._id));
          const combined = [...prev, ...filteredNew];
          setHasMore(combined.length < totalCount);
          return combined;
        });
        setPage(nextPage);
        setTotal(totalCount);
      } else {
        setHasMore(false);
      }

      if (data.stats) {
        setServerStats(data.stats);
      }
    } catch (err) {
      console.error(`Error loading more ${type} entries:`, err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [type, loading, isLoadingMore, hasMore, total, page, filters]);

  const stats = useMemo(() => {
    if (serverStats) {
      return serverStats;
    }
    return entries.reduce(
      (acc, curr) => {
        const cgst = Number(curr.cgst || 0);
        const sgst = Number(curr.sgst || 0);
        const igst = Number(curr.igst || 0);
        acc.totalTaxable += Number(curr.taxableAmount || 0);
        acc.totalCgst += cgst;
        acc.totalSgst += sgst;
        acc.totalIgst += igst;
        acc.totalGst += (cgst + sgst + igst);
        acc.totalAmount += Number(curr.totalAmount || 0);
        return acc;
      },
      {
        totalTaxable: 0,
        totalCgst: 0,
        totalSgst: 0,
        totalIgst: 0,
        totalGst: 0,
        totalAmount: 0,
        count: total || entries.length,
      }
    );
  }, [entries, total, serverStats]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      search: "",
      branchId: currentBranch?._id || "all",
    });
  };

  const exportToCsv = async () => {
    let exportRows = entries;
    try {
      const params = { all: true, ...filters };
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const response =
        type === "GSTR-1"
          ? await gstLedgerService.getGstr1Ledger(params)
          : await gstLedgerService.getGstr2Ledger(params);
      const data = response?.data?.data || response?.data || {};
      if (Array.isArray(data.entries) && data.entries.length > 0) {
        exportRows = data.entries;
      }
    } catch {
      // fallback to loaded entries
    }

    if (!exportRows.length) return;

    const headers = [
      "Voucher Date",
      "Voucher No",
      "Branch",
      "GST Type",
      "Taxable Amount",
      "CGST",
      "SGST",
      "IGST",
      "Total Amount",
      "Narration",
    ];

    const rows = exportRows.map((e) => [
      e.voucherDate ? new Date(e.voucherDate).toLocaleDateString() : "-",
      `"${e.voucherNumber || ""}"`,
      `"${e.branchId?.name || "-"}"`,
      e.gstType || type,
      e.taxableAmount || 0,
      e.cgst || 0,
      e.sgst || 0,
      e.igst || 0,
      e.totalAmount || 0,
      `"${(e.narration || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${type.toLowerCase()}_records_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createEntry = async (payload) => {
    try {
      const entryPayload = {
        ...payload,
        branchId: payload.branchId || (filters.branchId !== "all" ? filters.branchId : currentBranch?._id) || null,
      };

      if (type === "GSTR-1") {
        await gstLedgerService.createGstr1Ledger(entryPayload);
      } else {
        await gstLedgerService.createGstr2Ledger(entryPayload);
      }
      await fetchEntries();
      return { success: true };
    } catch (err) {
      console.error(`Error creating ${type} entry:`, err);
      const msg = err?.response?.data?.message || err.message || "Failed to create entry";
      return { success: false, error: msg };
    }
  };

  return {
    entries,
    total,
    page,
    limit: PAGE_LIMIT,
    loading,
    isLoadingMore,
    hasMore,
    loadMore,
    handleTableScroll,
    error,
    filters,
    stats,
    branches,
    currentBranch,
    setPage,
    handleFilterChange,
    handleResetFilters,
    refetch: fetchEntries,
    exportToCsv,
    createEntry,
  };
};

export default useGstLedger;
