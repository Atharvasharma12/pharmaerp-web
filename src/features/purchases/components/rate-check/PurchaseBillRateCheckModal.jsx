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
import { Calculator, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeRateCheckRows, computeSummary, money, pct } from "../../utils/rateCheckUtils";

export const PurchaseBillRateCheckModal = ({
  isOpen,
  onClose,
  items = [],
  onApply,
  purchaseBillNo = "New Bill",
  supplierName = "Unknown Supplier",
  purchaseBillDate = new Date(),
  initialRateBasis = "PTS",
}) => {
  const [rateBasis, setRateBasis] = useState(initialRateBasis);
  const [editedRows, setEditedRows] = useState({});

  useEffect(() => {
    if (isOpen) {
      setRateBasis(initialRateBasis);
    }
  }, [isOpen, initialRateBasis]);

  const resolvedItems = useMemo(() => {
    return items.map((it) => {
      const pid = String(it.id || it.productId || it._id || "");
      const edit = editedRows[pid];

      const defaultRetail = Number(it.workspaceProduct?.retailerMarginPercent || it.retailerMarginPercent || 0);
      const stock = Number(it.workspaceProduct?.stockistMarginPercent || it.stockistMarginPercent || 0);


      return {
        ...it,
        retailerMarginPercent: edit?.derivedRetail ?? defaultRetail,
        defaultRetailerMarginPercent: defaultRetail,
        stockistMarginPercent: stock,
        rateCPercentage: edit?.rateCPercentage ?? (it.cRatePct ? it.cRatePct : (it.workspaceProduct?.marginPercent ?? it.workspaceProduct?.margin ?? it.rateCPercentage ?? defaultRetail)),
        rateC: edit?.rateC ?? it.rateC,
        rateB: edit?.rateB ?? it.rateB,
        rateA: edit?.rateA ?? it.rateA,
      };
    });
  }, [items, editedRows]);

  const rows = useMemo(() => computeRateCheckRows(resolvedItems, rateBasis), [resolvedItems, rateBasis]);
  const summary = useMemo(() => computeSummary(rows), [rows]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRow = rows[selectedIndex] || rows[0] || null;

  const handleRateChange = (pid, field, value) => {
    setEditedRows((prev) => ({
      ...prev,
      [pid]: {
        ...(prev[pid] || {}),
        [field]: value === "" ? undefined : Number(value),
      },
    }));
  };

  const handleApply = () => {
    if (onApply) {
      onApply(editedRows, rows);
    }
    onClose();
  };

  const gstDisplay = rows[0] ? `${rows[0].gst.toFixed(0)}%` : "—";
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "—";

  return (
    <UIModal isOpen={isOpen} onClose={onClose} className="max-w-[95vw] w-[1200px] mx-auto h-[90vh] flex flex-col">
      <UIModalHeader className="shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <UIModalTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-text">Rate Check</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-surface-alt text-text-muted border border-border">
                  Comparing vs: {rateBasis}
                </span>
              </div>
              <span className="text-sm font-medium text-text-muted mt-0.5">
                Validate supplier rates against configured product margins
              </span>
            </div>
          </UIModalTitle>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-surface-alt/50 rounded-xl p-1 border border-border">
              <button
                onClick={() => setRateBasis("PTS")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  rateBasis === "PTS" ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text"
                )}
              >
                vs PTS
              </button>
              <button
                onClick={() => setRateBasis("PTR")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  rateBasis === "PTR" ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text"
                )}
              >
                vs PTR
              </button>
            </div>
          </div>
        </div>

      </UIModalHeader>

      <UIModalBody className="bg-surface-alt/30 p-4 flex flex-col gap-4 overflow-hidden h-full">
        {/* Table Area */}
        <div className="flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-purple-600 text-white shadow-sm">
              <tr>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center">#</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Product</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">MRP</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">GST %</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Qty</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right bg-purple-700/50">Bill Rate</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right" title="Purchase Transfer Price">Exp. PTS</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right" title="Bill Rate * (1 - Stockist Margin)">Bill PTS</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Diff ₹</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Diff %</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right bg-purple-700/50">Total Diff</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Exp. PTR</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Bill PTR</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right text-emerald-100">Final B</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right text-blue-100">Final A</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right text-orange-100">Final C (₹)</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={17} className="py-8 text-center text-text-muted text-sm font-medium">
                    No items in bill to check rates.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => {
                  const pid = String(row.id || row.productId || row._id || idx);
                  const isSelected = selectedIndex === idx;
                  const diffColor = row.diffPerUnit > 0 ? "text-rose-600 font-bold" : row.diffPerUnit < 0 ? "text-emerald-600 font-bold" : "text-text-muted";
                  return (
                    <tr
                      key={pid}
                      onClick={() => setSelectedIndex(idx)}
                      className={cn(
                        "border-b border-border/50 cursor-pointer transition-colors",
                        isSelected ? "bg-purple-500/10 hover:bg-purple-500/15" : "hover:bg-surface-hover/80",
                        row.status === "HIGH" && !isSelected && "bg-rose-500/5"
                      )}
                    >
                      <td className="py-2 px-3 text-center font-semibold text-text-muted">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-text truncate max-w-[200px]">{row.productTitle || row.productName || row.name || `Item ${idx + 1}`}</td>
                      <td className="py-2 px-3 text-right font-semibold text-text-muted">{row.mrp.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-text-muted">{row.gst}%</td>
                      <td className="py-2 px-3 text-right text-text-muted">{row.qty}</td>
                      <td className="py-2 px-3 text-right font-black text-text bg-surface-alt/30">{row.billRate.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-text-muted">{row.expectedPTS.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-semibold text-text-muted">{row.billPTS.toFixed(2)}</td>
                      <td className={cn("py-2 px-3 text-right", diffColor)}>{money(row.diffPerUnit, true)}</td>
                      <td className={cn("py-2 px-3 text-right", diffColor)}>{pct(row.diffPct, true)}</td>
                      <td className={cn("py-2 px-3 text-right font-black bg-surface-alt/30", diffColor)}>{money(row.totalDiff, true)}</td>
                      <td className="py-2 px-3 text-right text-text-muted">{row.expectedPTR.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-semibold text-text-muted">{row.billPTR.toFixed(2)}</td>
                      <td className="py-1 px-2 text-right">
                        <input
                          type="number"
                          className="w-20 text-right text-xs p-1 rounded border border-border bg-surface focus:border-primary focus:outline-none"
                          value={row.rateB || ""}
                          onChange={(e) => handleRateChange(pid, "rateB", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={row.rateB.toFixed(2)}
                        />
                      </td>
                      <td className="py-1 px-2 text-right">
                        <input
                          type="number"
                          className="w-20 text-right text-xs p-1 rounded border border-border bg-surface focus:border-primary focus:outline-none"
                          value={row.rateA || ""}
                          onChange={(e) => handleRateChange(pid, "rateA", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={row.rateA.toFixed(2)}
                        />
                      </td>
                      <td className="py-1 px-2 text-right">
                        <input
                          type="number"
                          className="w-20 text-right text-xs p-1 rounded border border-border bg-surface focus:border-primary focus:outline-none"
                          value={row.rateC || ""}
                          onChange={(e) => handleRateChange(pid, "rateC", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={row.rateC.toFixed(2)}
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                          row.status === "OK" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                            row.status === "WARNING" ? "bg-orange-500/10 text-orange-600 border border-orange-500/20" :
                              "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Cards Area */}
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Summary Card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Overall Summary</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> OK</span>
                  <span>{summary.ok}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-orange-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Warn</span>
                  <span>{summary.warning}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-rose-600 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> High</span>
                  <span>{summary.high}</span>
                </div>
              </div>
              <div className="w-px h-16 bg-border"></div>
              <div className="flex-1 flex flex-col items-end">
                <span className="text-[10px] font-bold text-text-muted uppercase">Total Difference</span>
                <span className={cn("text-2xl font-black mt-1", summary.totalDifference > 0 ? "text-rose-600" : "text-emerald-600")}>
                  {money(summary.totalDifference, true)}
                </span>
              </div>
            </div>
          </div>

          {/* Margin Rules Card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Margin Rules (Selected)</h3>
            {selectedRow ? (
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-text-muted">Retail Margin</span>
                  <span className="text-lg font-black text-text">
                    {selectedRow.retail}%
                    {selectedRow.extraPct ? (
                      <span className="text-emerald-600 text-sm ml-1">+ {selectedRow.extraPct.toFixed(2)}%</span>
                    ) : (
                      <span className="text-text-muted text-sm ml-1">+ 0%</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-text-muted">Stockist Margin</span>
                  <span className="text-lg font-black text-text">
                    {selectedRow.stock}%
                    {selectedRow.rateAExtraPct ? (
                      <span className="text-emerald-600 text-sm ml-1">+ {selectedRow.rateAExtraPct.toFixed(2)}%</span>
                    ) : (
                      <span className="text-text-muted text-sm ml-1">+ 0%</span>
                    )}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-border flex justify-between items-center text-xs font-medium text-text-muted">
                  <span>Basis: <strong>{rateBasis}</strong></span>
                  <span>Exp Rate: <strong>₹{selectedRow.expectedRate.toFixed(2)}</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-text-muted flex items-center h-full">Select a row</div>
            )}
          </div>

          {/* Profit Impact Card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Unit Impact (Selected)</h3>
            {selectedRow ? (
              <div className="flex items-center gap-4 h-full">
                <div className={cn("flex items-center justify-center w-12 h-12 rounded-full", selectedRow.diffPerUnit < 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                  {selectedRow.diffPerUnit < 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-text-muted">Loss / Profit Per Unit</span>
                  <span className={cn("text-xl font-black", selectedRow.diffPerUnit < 0 ? "text-emerald-600" : "text-rose-600")}>
                    {money(-selectedRow.diffPerUnit, true)}
                  </span>
                  <span className="text-xs font-semibold text-text-muted mt-1">{pct(-selectedRow.diffPct, true)} impact on margin</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-text-muted flex items-center h-full">Select a row</div>
            )}
          </div>
        </div>
      </UIModalBody>

      <UIModalFooter className="shrink-0 flex justify-between items-center bg-surface border-t border-border">
        <div className="flex items-center gap-2 text-text-muted">
          <Info className="w-4 h-4" />
          <span className="text-xs font-medium">Positive diffs mean supplier charged more than expected.</span>
        </div>
        <div className="flex items-center gap-3">
          <UIButton variant="outline" onClick={onClose}>Cancel</UIButton>
          <UIButton variant="primary" onClick={handleApply}>Apply & Save</UIButton>
        </div>
      </UIModalFooter>
    </UIModal>
  );
};
