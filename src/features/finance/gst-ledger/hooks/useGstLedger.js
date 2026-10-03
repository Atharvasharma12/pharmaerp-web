import { useState, useEffect, useCallback, useMemo } from "react";
import gstLedgerService from "../services/gstLedgerService";

export const useGstLedger = (type = "GSTR-1") => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
  });

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit,
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
      setEntries(data.entries || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(`Error fetching ${type} ledger entries:`, err);
      setError(
        err?.response?.data?.message || err.message || `Failed to fetch ${type} records`
      );
    } finally {
      setLoading(false);
    }
  }, [type, page, limit, filters]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const stats = useMemo(() => {
    return entries.reduce(
      (acc, curr) => {
        acc.totalTaxable += Number(curr.taxableAmount || 0);
        acc.totalCgst += Number(curr.cgst || 0);
        acc.totalSgst += Number(curr.sgst || 0);
        acc.totalIgst += Number(curr.igst || 0);
        acc.totalAmount += Number(curr.totalAmount || 0);
        return acc;
      },
      {
        totalTaxable: 0,
        totalCgst: 0,
        totalSgst: 0,
        totalIgst: 0,
        totalAmount: 0,
        count: total,
      }
    );
  }, [entries, total]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      search: "",
    });
    setPage(1);
  };

  const exportToCsv = () => {
    if (!entries.length) return;

    const headers = [
      "Voucher Date",
      "Voucher No",
      "GST Type",
      "Taxable Amount",
      "CGST",
      "SGST",
      "IGST",
      "Total Amount",
      "Narration",
    ];

    const rows = entries.map((e) => [
      e.voucherDate ? new Date(e.voucherDate).toLocaleDateString() : "-",
      `"${e.voucherNumber || ""}"`,
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
      if (type === "GSTR-1") {
        await gstLedgerService.createGstr1Ledger(payload);
      } else {
        await gstLedgerService.createGstr2Ledger(payload);
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
    limit,
    loading,
    error,
    filters,
    stats,
    setPage,
    setLimit,
    handleFilterChange,
    handleResetFilters,
    refetch: fetchEntries,
    exportToCsv,
    createEntry,
  };
};

export default useGstLedger;
