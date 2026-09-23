import React, { useState, useMemo, useEffect } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components";
import { Tag, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/services";

export const PurchaseBillSchemeCheckModal = ({
  isOpen,
  onClose,
  items = [],
  onApply,
}) => {
  const [onlySchemeProducts, setOnlySchemeProducts] = useState(true);
  const [customPrevSchemes, setCustomPrevSchemes] = useState({});
  const [customSaleSchemes, setCustomSaleSchemes] = useState({});
  const [fetchedPrevSchemes, setFetchedPrevSchemes] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!isOpen || !items || items.length === 0) return;

    let isMounted = true;
    const fetchHistoryForItems = async () => {
      setLoadingHistory(true);
      const prevMap = {};

      try {
        await Promise.all(
          items.map(async (item) => {
            const rawId = String(item.productId || item._id || item.id || "");
            // CreatePurchaseBillDesktopPage appends a timestamp to item.id, e.g. "6ab39d13c836446fb5a7e76e-1790179261218"
            const pid = rawId.split('-')[0];
            if (!pid || pid.length < 24) return;

            if (item.prevBillScheme !== undefined || item.previousSchemePercent !== undefined) {
              prevMap[pid] = Number(item.prevBillScheme ?? item.previousSchemePercent ?? 0);
              return;
            }

            try {
              const res = await apiClient.get(`/catalog/purchase-bills/purchase-history/${pid}`, {
                params: { page: 1, limit: 5 }
              });

              // The array is deeply nested: axios data -> ApiResponse data -> repository return data
              const historyArray = res?.data?.data?.data || res?.data?.data || res?.data;

              if (historyArray && Array.isArray(historyArray) && historyArray.length > 0) {
                const latestPrev = historyArray[0];
                const prevSchemePct = Number(latestPrev?.schemeDiscountPercent || latestPrev?.schPct || 0);
                const prevFree = Number(latestPrev?.freeQty || 0);
                const prevQty = Number(latestPrev?.quantity || latestPrev?.qty || 0);

                const computedPrevScheme = prevSchemePct > 0
                  ? prevSchemePct
                  : (prevQty > 0 ? Math.round((prevFree / prevQty) * 100 * 100) / 100 : 0);

                prevMap[pid] = computedPrevScheme;
              }
            } catch (err) {
              console.error("Failed to fetch history for product", pid, err);
            }
          })
        );

        if (isMounted) {
          setFetchedPrevSchemes(prevMap);
        }
      } catch (e) {
        console.error("Error fetching scheme history", e);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };

    fetchHistoryForItems();

    return () => {
      isMounted = false;
    };
  }, [isOpen, items]);

  const processedRows = useMemo(() => {
    return items.map((item, index) => {
      const rawId = String(item.productId || item._id || item.id || index);
      const pid = rawId.split('-')[0];
      const productName = item.productTitle || item.productName || item.name || `Item ${index + 1}`;
      const batch = item.batch || "-";
      const qty = Number(item.qty || 0);
      const freeQty = Number(item.freeQty || 0);

      // We read `schPct` from the cart item since CreatePurchaseBillDesktopPage uses `schPct` for scheme
      const directScheme = Number(item.schPct || item.schemeDiscountPercent || 0);
      const totalUnits = qty + freeQty;
      const calculatedFreeScheme = totalUnits > 0 ? (freeQty / totalUnits) * 100 : 0;

      const billSchemeVal = directScheme > 0
        ? directScheme
        : Math.round(calculatedFreeScheme * 100) / 100;

      // Previous Scheme (User Override > Item default > Fetched > 0)
      let prevBillSchemeVal = 0;
      if (customPrevSchemes[pid] !== undefined && customPrevSchemes[pid] !== "") {
        prevBillSchemeVal = Number(customPrevSchemes[pid]);
      } else if (item.prevBillScheme !== undefined) {
        prevBillSchemeVal = Number(item.prevBillScheme);
      } else if (fetchedPrevSchemes[pid] !== undefined) {
        prevBillSchemeVal = Number(fetchedPrevSchemes[pid]);
      }

      // Sale Scheme (User Override > Item default > billSchemeVal)
      let saleSchemeVal = billSchemeVal;
      if (customSaleSchemes[pid] !== undefined && customSaleSchemes[pid] !== "") {
        saleSchemeVal = Number(customSaleSchemes[pid]);
      } else if (item.saleScheme !== undefined && item.saleScheme !== null && item.saleScheme !== "") {
        saleSchemeVal = Number(item.saleScheme);
      }

      const difference = Math.round((billSchemeVal - prevBillSchemeVal) * 100) / 100;
      const profit = Math.round((billSchemeVal - saleSchemeVal) * 100) / 100;

      const hasScheme = billSchemeVal > 0 || freeQty > 0 || directScheme > 0;

      return {
        pid,
        sn: index + 1,
        productName,
        batch,
        qty,
        freeQty,
        billScheme: billSchemeVal,
        prevBillScheme: prevBillSchemeVal,
        saleScheme: saleSchemeVal,
        difference,
        profit,
        hasScheme,
        originalItem: item,
      };
    });
  }, [items, customPrevSchemes, customSaleSchemes, fetchedPrevSchemes]);

  const filteredRows = useMemo(() => {
    if (!onlySchemeProducts) return processedRows;
    return processedRows.filter((r) => r.hasScheme);
  }, [processedRows, onlySchemeProducts]);

  const summary = useMemo(() => {
    const totalQty = filteredRows.reduce((sum, r) => sum + r.qty, 0);
    const avgProfit = filteredRows.length > 0
      ? Math.round((filteredRows.reduce((sum, r) => sum + r.profit, 0) / filteredRows.length) * 100) / 100
      : 0;
    return {
      count: filteredRows.length,
      totalQty,
      avgProfit,
    };
  }, [filteredRows]);

  const handleApply = () => {
    if (onApply) {
      const updatedSaleSchemesMap = {};
      processedRows.forEach((row) => {
        updatedSaleSchemesMap[row.pid] = row.saleScheme;
      });
      onApply(updatedSaleSchemesMap);
    }
    onClose();
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} className="max-w-7xl w-full mx-auto">
      <UIModalHeader>
        <UIModalTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Tag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">Scheme Check</span>
            <span className="text-xs text-text-muted font-normal mt-0.5">
              Compare current bill schemes against previous and sale schemes
            </span>
          </div>
        </UIModalTitle>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-primary w-4 h-4"
              checked={onlySchemeProducts}
              onChange={(e) => setOnlySchemeProducts(e.target.checked)}
            />
            <span className="text-sm font-bold text-text">only scheme products</span>
          </label>
        </div>
      </UIModalHeader>

      <UIModalBody className="bg-surface-alt/30 p-4">
        {loadingHistory && (
          <div className="w-full h-1 bg-primary/20 rounded mb-4 overflow-hidden">
            <div className="h-full bg-primary animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{ width: '50%' }}></div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface shadow-sm">
            <div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Scheme Products</div>
              <div className="text-2xl font-black text-text mt-1">{summary.count} items</div>
            </div>
            <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold">
              {onlySchemeProducts ? "Filtered" : "All Items"}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface shadow-sm">
            <div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Quantity</div>
              <div className="text-2xl font-black text-text mt-1">{summary.totalQty} pcs</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 shadow-sm">
            <div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Avg Scheme Profit</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{summary.avgProfit}%</div>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500 opacity-80" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto rounded-xl border border-border bg-surface max-h-[400px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-surface border-b border-border shadow-sm">
              <tr>
                <th className="py-2.5 px-3 font-bold text-text-muted text-center uppercase tracking-wider">SN</th>
                <th className="py-2.5 px-3 font-bold text-text-muted uppercase tracking-wider">Product</th>
                <th className="py-2.5 px-3 font-bold text-text-muted uppercase tracking-wider">Batch</th>
                <th className="py-2.5 px-3 font-bold text-text-muted uppercase tracking-wider text-right">Qty</th>
                <th className="py-2.5 px-3 font-bold text-primary uppercase tracking-wider text-right">Bill Scheme</th>
                <th className="py-2.5 px-3 font-bold text-text-muted uppercase tracking-wider text-right">Prev Bill Scheme</th>
                <th className="py-2.5 px-3 font-bold text-text-muted uppercase tracking-wider text-right">Sale Scheme</th>
                <th className="py-2.5 px-3 font-bold text-text-muted uppercase tracking-wider text-right">Difference</th>
                <th className="py-2.5 px-3 font-bold text-emerald-600 uppercase tracking-wider text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-text-muted text-sm">
                    No scheme products found in current bill.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr key={row.pid} className="border-b border-border/50 hover:bg-surface-hover/80 transition-colors">
                    <td className="py-2 px-3 text-center font-semibold text-text-muted">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text">{row.productName}</span>
                        {row.freeQty > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary whitespace-nowrap">
                            +{row.freeQty} free
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-text-muted font-mono">{row.batch}</td>
                    <td className="py-2 px-3 text-right font-semibold text-text">{row.qty}</td>
                    <td className="py-2 px-3 text-right font-black text-primary">{row.billScheme}%</td>
                    <td className="py-1 px-3 text-right">
                      <input
                        type="number"
                        className="w-20 text-right text-xs p-1 rounded border border-border bg-surface focus:border-primary focus:outline-none"
                        value={row.prevBillScheme === 0 && customPrevSchemes[row.pid] === undefined ? "" : row.prevBillScheme}
                        onChange={(e) => setCustomPrevSchemes(prev => ({ ...prev, [row.pid]: e.target.value }))}
                        placeholder="0"
                        min="0"
                      />
                    </td>
                    <td className="py-1 px-3 text-right">
                      <input
                        type="number"
                        className="w-20 text-right text-xs p-1 rounded border border-border bg-surface focus:border-primary focus:outline-none"
                        value={row.saleScheme === 0 && customSaleSchemes[row.pid] === undefined && row.billScheme === 0 ? "" : row.saleScheme}
                        onChange={(e) => setCustomSaleSchemes(prev => ({ ...prev, [row.pid]: e.target.value }))}
                        placeholder="0"
                        min="0"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-bold">
                      <span className={cn(
                        row.difference > 0 ? "text-emerald-600" : row.difference < 0 ? "text-rose-600" : "text-text-muted"
                      )}>
                        {row.difference}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-black",
                        row.profit > 0 ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                          row.profit < 0 ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" :
                            "bg-surface-alt text-text-muted border border-border"
                      )}>
                        {row.profit}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </UIModalBody>

      <UIModalFooter className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-text-muted">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-medium">
            Difference = Bill Scheme – Prev Scheme | Profit = Bill Scheme – Sale Scheme
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UIButton variant="outline" size="sm" onClick={onClose}>
            Close
          </UIButton>
          <UIButton variant="primary" size="sm" onClick={handleApply}>
            Apply & Save
          </UIButton>
        </div>
      </UIModalFooter>
    </UIModal>
  );
};
