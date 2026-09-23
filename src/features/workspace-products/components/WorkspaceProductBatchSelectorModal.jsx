// src/features/workspace-products/components/WorkspaceProductBatchSelectorModal.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Package,
  Calendar,
  MapPin,
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UIButton from "@/components/ui/UIButton";
import workspaceProductService from "../services/workspaceProductService";

/**
 * Helper to parse expiry string into comparable Date object
 */
const parseExpiryDate = (raw) => {
  if (!raw) return new Date(9999, 11, 31);
  const str = String(raw).trim();
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10) - 1;
      let year = parseInt(parts[1], 10);
      if (year < 100) year += 2000;
      return new Date(year, isNaN(month) ? 0 : month, 1);
    }
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? new Date(9999, 11, 31) : parsed;
};

/** Safe number parser */
const safeNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/**
 * Compute scheme discount for a given qty and scheme %.
 * Applies schemePercent as a direct discount on the full available qty.
 * No free qty is given — pure percentage discount.
 * Uses quarter/half/full threshold tiers to determine how much of the scheme applies.
 * Returns { freeQty, schemeDiscountPercent, finalDiscountPercent, schemeApply }
 */
const computeSchemeDiscount = (qty, schemePercent, stock, calculatedFreeQty) => {
  const normalizedQty = safeNum(qty);
  const normalizedScheme = safeNum(schemePercent);
  if (normalizedQty <= 0 || normalizedScheme <= 0) {
    return { freeQty: 0, schemeDiscountPercent: 0, finalDiscountPercent: 0, schemeApply: false };
  }

  // Special case: 50% scheme — apply full discount directly when qty >= 2
  if (normalizedScheme === 50) {
    if (normalizedQty < 2) {
      return { freeQty: 0, schemeDiscountPercent: 0, finalDiscountPercent: 0, schemeApply: false };
    }
    return { freeQty: 0, schemeDiscountPercent: normalizedScheme, finalDiscountPercent: normalizedScheme, schemeApply: true };
  }

  // STEP 1 — CALCULATE FULL FREE QTY & SCHEME THRESHOLDS (same as original)
  const fullFreeQty = (normalizedQty * normalizedScheme) / (100 - normalizedScheme);

  const actualCalculatedFreeQty =
    calculatedFreeQty !== undefined && calculatedFreeQty !== null
      ? safeNum(calculatedFreeQty)
      : fullFreeQty;

  // SCHEME THRESHOLDS
  const quarterThreshold = (normalizedScheme / (100 - normalizedScheme)) / 0.4;
  const halfThreshold = quarterThreshold * 2;
  const fullThreshold = quarterThreshold * 4;

  // STEP 2 — DETERMINE TIER BASED ON CALCULATED FREE QTY vs THRESHOLDS
  let discountFraction = 0;
  let schemeApply = false;

  if (actualCalculatedFreeQty >= fullThreshold) {
    discountFraction = 1;       // Full scheme discount (100%)
    schemeApply = true;
  } else if (actualCalculatedFreeQty >= halfThreshold) {
    discountFraction = 0.5;     // Half scheme discount (50%)
    schemeApply = true;
  } else if (actualCalculatedFreeQty >= quarterThreshold) {
    discountFraction = 0.25;    // Quarter scheme discount (25%)
    schemeApply = true;
  }

  // STEP 3 — APPLY FRACTION OF SCHEME AS DIRECT DISCOUNT (no free qty)
  const finalDiscountPercent = schemeApply ? normalizedScheme * discountFraction : 0;

  return {
    freeQty: 0,
    schemeDiscountPercent: finalDiscountPercent,
    finalDiscountPercent,
    schemeApply,
  };
};

/**
 * WorkspaceProductBatchSelectorModal
 * Spacious, clean, and un-congested modal for branch batch selection.
 * Features single total Qty input with auto FEFO allocation across batches.
 */
export const WorkspaceProductBatchSelectorModal = ({
  open,
  onClose,
  product,
  billingMode = "B2B",
  branchName = "Main Branch",
  onConfirmAddToCart,
}) => {
  const [batches, setBatches] = useState([]);
  const [totalQty, setTotalQty] = useState(1);
  const [allocations, setAllocations] = useState({});
  const [selectedBatchIds, setSelectedBatchIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const totalQtyInputRef = useRef(null);
  // Tracks whether user has manually toggled batch selection
  const userManuallySelectedRef = useRef(false);

  useEffect(() => {
    if (open && product) {
      setTotalQty(1);
      userManuallySelectedRef.current = false;
      fetchBatchesForProduct(product);
      setTimeout(() => {
        if (totalQtyInputRef.current) {
          totalQtyInputRef.current.focus();
          totalQtyInputRef.current.select();
        }
      }, 60);
    }
  }, [open, product]);

  // Escape key listener to close modal
  useEffect(() => {
    if (!open) return;

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [open, onClose]);

  const fetchBatchesForProduct = async (p) => {
    setIsLoading(true);
    userManuallySelectedRef.current = false;
    try {
      let list = [];

      if (Array.isArray(p.batches) && p.batches.length > 0) {
        list = p.batches;
      } else if (Array.isArray(p.facilityBatches) && p.facilityBatches.length > 0) {
        list = p.facilityBatches;
      } else if (p._id || p.id) {
        try {
          const prodId = p._id || p.id;
          const res = await workspaceProductService.getProductFacilityBatchesByQueryV2({
            workspaceProductId: prodId,
            productId: prodId,
            filter: { workspaceProductId: prodId },
            limit: 20,
          });
          const apiBatches = res.data?.data?.batches || res.data?.batches || res.data?.data || [];
          if (Array.isArray(apiBatches) && apiBatches.length > 0) {
            list = apiBatches;
          }
        } catch (apiErr) {
          console.warn("Batch query endpoint fallback:", apiErr);
        }
      }

      // Filter list strictly for selected product & non-zero stock
      const targetId = String(p._id || p.id || "").toLowerCase();
      const targetName = String(p.displayName || p.name || "").toLowerCase().trim();

      let matchedList = list.filter((b) => {
        if (!b) return false;
        const bStock = Number(b.stock ?? b.batchQty ?? b.qty ?? b.currentStock ?? (p.stock ?? 100));
        if (bStock <= 0) return false;

        if (!b.productId && !b.workspaceProductId && !b.productName && (Array.isArray(p.batches) || Array.isArray(p.facilityBatches))) {
          return true;
        }
        const bProdId = String(b.productId || b.workspaceProductId || b.product || "").toLowerCase();
        const bProdName = String(b.productName || b.displayName || b.name || "").toLowerCase().trim();

        if (targetId && bProdId && (bProdId === targetId || targetId.includes(bProdId) || bProdId.includes(targetId))) {
          return true;
        }
        if (targetName && bProdName && (bProdName === targetName || bProdName.includes(targetName) || targetName.includes(bProdName))) {
          return true;
        }
        return false;
      });

      // Single batch fallback for product if list is empty
      if (matchedList.length === 0) {
        const baseMrp = Number(p.mrp ?? p.mrpPrice ?? 160.0);
        const basePrice = Number(p.rateC ?? p.rate ?? p.price ?? p.ptr ?? 134.4);
        const baseBatchNo = p.batchNo || p.batch || p.displaySku || p.sku || "B-8801";
        const baseRack = p.rack || p.shelfLocation || "F1/AE2";
        const basePack = p.pack || p.packaging || p.displayDosageForm || "10S";
        const baseHsn =
          p.globalProduct?.hsn ||
          p.globalProduct?.hsnCode ||
          p.globalProduct?.hsnMaster?.code ||
          p.globalProduct?.HsnMaster?.code ||
          p.hsnCode ||
          p.hsn ||
          p.HsnMaster?.code ||
          "3004";
        const baseGst =
          p.globalProduct?.gstRate ??
          p.globalProduct?.hsnMaster?.gstRate ??
          p.globalProduct?.hsnMaster?.gst ??
          p.globalProduct?.hsnTaxpercent ??
          p.globalProduct?.HsnMaster?.gstRate ??
          p.gstRate ??
          p.taxRate ??
          p.hsnTaxpercent ??
          p.gst ??
          p.HsnMaster?.gstRate ??
          5;
        const baseExpiry = p.expiryDate || p.expDate || p.expiry || p.displayExpDate || "11/32";

        const baseRateB = Number(p.rateB ?? p.rateb ?? p.ptr ?? 0);
        const baseRateA = Number(p.rateA ?? p.ratea ?? 0);
        const baseSchemeDiscountPercent = Number(p.schemeDiscountPercent ?? 0);

        matchedList = [
          {
            id: `b-${p._id || p.id || "1"}`,
            batchNo: baseBatchNo,
            mrp: baseMrp,
            price: basePrice,
            rateB: baseRateB,
            rateA: baseRateA,
            stock: p.stock ?? 100,
            expiry: baseExpiry,
            rack: baseRack,
            pack: basePack,
            hsn: baseHsn,
            gst: baseGst,
            ratePct: p.ratePct || p.marginPct || "16%",
            productName: p.displayName || p.name,
            schemeDiscountPercent: baseSchemeDiscountPercent,
          },
        ];
      }

      // FEFO Sort: Nearest Expiry Date first
      matchedList.sort((a, b) => {
        const dateA = parseExpiryDate(a.expiry || a.expiryDate || a.expDate);
        const dateB = parseExpiryDate(b.expiry || b.expiryDate || b.expDate);
        return dateA - dateB;
      });

      setBatches(matchedList);
      autoAllocateFEFO(1, matchedList);
    } finally {
      setIsLoading(false);
    }
  };

  const maxTotalStock = batches.reduce((acc, b) => acc + Number(b.stock ?? b.batchQty ?? 0), 0);

  /**
   * Allocate qty across batches.
   * - If user has manually selected batches, allocate to those FIRST, then overflow to others in FEFO order.
   * - If no manual selection (initial load), pure FEFO allocation.
   */
  const autoAllocateFEFO = (targetTotal, batchList = batches) => {
    let remaining = Math.max(1, Number(targetTotal) || 1);
    const newAllocations = {};
    const newSelected = new Set();

    if (userManuallySelectedRef.current && selectedBatchIds.size > 0) {
      // User has manually picked batches — prioritize those first
      const manualBatches = batchList.filter((b) => {
        const bId = b.id || b._id || b.batchNo;
        return selectedBatchIds.has(bId);
      });
      const otherBatches = batchList.filter((b) => {
        const bId = b.id || b._id || b.batchNo;
        return !selectedBatchIds.has(bId);
      });

      // Allocate to manually selected batches first
      manualBatches.forEach((b) => {
        const bId = b.id || b._id || b.batchNo;
        const stock = Number(b.stock ?? b.batchQty ?? 100);
        if (remaining > 0 && stock > 0) {
          const take = Math.min(stock, remaining);
          newAllocations[bId] = take;
          newSelected.add(bId);
          remaining -= take;
        } else {
          newAllocations[bId] = 0;
          newSelected.add(bId); // keep it selected even if 0 allocated
        }
      });

      // Overflow to remaining batches in FEFO order
      otherBatches.forEach((b) => {
        const bId = b.id || b._id || b.batchNo;
        const stock = Number(b.stock ?? b.batchQty ?? 100);
        if (remaining > 0 && stock > 0) {
          const take = Math.min(stock, remaining);
          newAllocations[bId] = take;
          newSelected.add(bId);
          remaining -= take;
        } else {
          newAllocations[bId] = 0;
        }
      });
    } else {
      // Pure FEFO allocation (initial load / no manual selection)
      batchList.forEach((b) => {
        const bId = b.id || b._id || b.batchNo;
        const stock = Number(b.stock ?? b.batchQty ?? 100);

        if (remaining > 0 && stock > 0) {
          const take = Math.min(stock, remaining);
          newAllocations[bId] = take;
          newSelected.add(bId);
          remaining -= take;
        } else {
          newAllocations[bId] = 0;
        }
      });
    }

    setAllocations(newAllocations);
    setSelectedBatchIds(newSelected);
  };

  const handleTotalQtyChange = (val) => {
    let num = parseInt(val, 10);
    if (!isNaN(num) && maxTotalStock > 0 && num > maxTotalStock) {
      num = maxTotalStock;
      val = String(maxTotalStock);
    }
    setTotalQty(val);
    autoAllocateFEFO(val);
  };

  const handleBlurTotalQty = () => {
    const num = parseInt(totalQty, 10);
    const sanitized = isNaN(num) || num < 1 ? 1 : Math.min(maxTotalStock || 999, num);
    setTotalQty(sanitized);
    autoAllocateFEFO(sanitized);
  };

  const toggleBatchChecked = (bId) => {
    userManuallySelectedRef.current = true;
    setSelectedBatchIds((prev) => {
      const next = new Set(prev);
      if (next.has(bId)) {
        next.delete(bId);
        setAllocations((alloc) => ({ ...alloc, [bId]: 0 }));
      } else {
        next.add(bId);
        const targetBatch = batches.find((b) => (b.id || b._id || b.batchNo) === bId);
        const bStock = targetBatch ? (targetBatch.stock ?? 100) : 1;
        setAllocations((alloc) => ({ ...alloc, [bId]: Math.min(bStock, 1) }));
      }
      return next;
    });
  };

  if (!open || !product) return null;

  const productName = product.displayName || product.name || "Selected Product";
  const brand = product.displayManufacturer || product.manufacturer || product.brand || "Pharma";
  const category = product.displayCategory || product.category || "Medicine";
  const hsn =
    product.globalProduct?.hsn ||
    product.globalProduct?.hsnCode ||
    product.globalProduct?.hsnMaster?.code ||
    product.globalProduct?.HsnMaster?.code ||
    product.hsnCode ||
    product.hsn ||
    product.HsnMaster?.code ||
    "3004";

  const defaultGstRate =
    product.globalProduct?.gstRate ??
    product.globalProduct?.hsnMaster?.gstRate ??
    product.globalProduct?.hsnMaster?.gst ??
    product.globalProduct?.hsnTaxpercent ??
    product.globalProduct?.HsnMaster?.gstRate ??
    product.hsnTaxpercent ??
    product.gstRate ??
    product.taxRate ??
    product.gst ??
    product.HsnMaster?.gstRate ??
    5;

  // Calculate totals for confirmed list
  const selectedBatchesList = batches.filter((b) => {
    const bId = b.id || b._id || b.batchNo;
    return selectedBatchIds.has(bId) && (allocations[bId] || 0) > 0;
  });

  const totalAllocatedQty = selectedBatchesList.reduce((acc, b) => {
    const bId = b.id || b._id || b.batchNo;
    return acc + (allocations[bId] || 0);
  }, 0);

  const totalCombinedAmount = selectedBatchesList.reduce((acc, b) => {
    const bId = b.id || b._id || b.batchNo;
    const q = allocations[bId] || 0;
    const rate = Number(b.rateC ?? b.rate ?? b.price ?? b.saleRate ?? b.rateA ?? product.rateC ?? product.price ?? 134.4);
    return acc + rate * q;
  }, 0);

  const handleConfirmAdd = () => {
    if (selectedBatchesList.length === 0) return;

    const itemsToAdd = selectedBatchesList.map((b) => {
      const bId = b.id || b._id || b.batchNo;
      const bNo = b.batchNo || b.batchNumber || b.batch || "B-8801";
      const bRate = Number(b.rateC ?? b.rate ?? b.price ?? b.saleRate ?? b.rateA ?? product.rateC ?? product.price ?? 134.4);
      const bMrp = Number(b.mrp ?? product.mrp ?? 160.0);
      const bExp = b.expiry || b.expiryDate || b.expDate || "11/32";
      const bRack = b.rack || product.rack || "F1/AE2";
      const bPack = b.pack || product.pack || "10S";
      const bHsn = b.hsn || hsn;
      const bGst = b.gst ?? defaultGstRate;
      const bRatePct = b.ratePct || product.ratePct || "16%";
      const bStock = b.stock ?? b.batchQty ?? 100;

      const bRateB = Number(b.rateB ?? b.rateb ?? b.ptr ?? product.rateB ?? product.rateb ?? product.ptr ?? 0);
      const bRateA = Number(b.rateA ?? b.ratea ?? product.rateA ?? product.ratea ?? 0);
      const bSchemeDiscountPercent = Number(b.schemeDiscountPercent ?? product.schemeDiscountPercent ?? 0);

      // Compute scheme discount for this batch's allocated qty
      const batchQty = allocations[bId] || 1;
      const schemeResult = computeSchemeDiscount(batchQty, bSchemeDiscountPercent, bStock, undefined);

      return {
        id: `${product._id || product.id || "item"}-${bNo}`,
        productId: product._id || product.id,
        batchId: bId,
        name: productName,
        brand,
        category,
        batch: bNo,
        pack: bPack,
        rack: bRack,
        hsn: bHsn,
        gst: bGst,
        ratePct: bRatePct,
        expiry: bExp,
        stock: bStock,
        mrp: bMrp,
        price: bRate,
        rateB: bRateB,
        rateA: bRateA,
        disc: schemeResult.finalDiscountPercent,
        qty: batchQty,
        schemeDiscountPercent: bSchemeDiscountPercent,
        freeQty: schemeResult.freeQty,
        schemeApply: schemeResult.schemeApply,
      };
    });

    if (onConfirmAddToCart) {
      onConfirmAddToCart(itemsToAdd);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirmAdd();
        }}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4.5 bg-surface-alt/80 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Package className="size-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-text truncate max-w-[440px]">
                  {productName}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-bold bg-primary-soft text-primary border border-primary/20 shrink-0">
                  <MapPin className="size-3.5" /> {branchName}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate mt-0.5 font-medium">
                {brand} • {category} • HSN: {hsn}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Spacious Total Required Qty Input Bar with Prominent Max Qty */}
        <div className="bg-primary-soft/30 border-b border-primary/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl  border border-primary/30 font-mono text-sm font-bold shrink-0">
              Max Stock: <strong className="text-base font-extrabold ">{maxTotalStock} Units</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center rounded-xl border border-primary/40 bg-surface p-1 shadow-sm">
              <button
                type="button"
                onClick={() => handleTotalQtyChange(Math.max(1, (Number(totalQty) || 1) - 1))}
                className="size-9 rounded-lg flex items-center justify-center hover:bg-surface-hover text-text-muted hover:text-text cursor-pointer transition-colors"
              >
                <Minus className="size-4" />
              </button>

              <input
                ref={totalQtyInputRef}
                type="number"
                min="1"
                max={maxTotalStock || 999}
                value={totalQty}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleTotalQtyChange(e.target.value)}
                onBlur={handleBlurTotalQty}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAdd();
                  }
                }}
                className="w-16 text-center font-mono font-extrabold text-base text-text bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                type="button"
                onClick={() => handleTotalQtyChange(Math.min(maxTotalStock || 999, (Number(totalQty) || 1) + 1))}
                className="size-9 rounded-lg flex items-center justify-center hover:bg-surface-hover text-text-muted hover:text-text cursor-pointer transition-colors"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Spacious Batch List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-muted space-y-2">
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="text-xs font-medium">Loading branch batch stock...</p>
            </div>
          ) : batches.length > 0 ? (
            <div className="space-y-2.5">
              {batches.map((b, idx) => {
                const bId = b.id || b._id || b.batchNo;
                const isChecked = selectedBatchIds.has(bId);
                const allocated = allocations[bId];
                const isNearestExp = idx === 0;

                const bNo = b.batchNo || b.batchNumber || b.batch;
                const bMrp = Number(b.mrp ?? product.mrp);
                const bRate = Number(
                  billingMode === "B2C"
                    ? (b.rateC ?? b.rate ?? b.price ?? b.saleRate ?? product.rateC ?? product.price)
                    : (b.price ?? b.rate ?? b.rateC ?? product.price)
                );
                const bStock = b.stock ?? b.batchQty;
                const bExp = b.expiry || b.expiryDate || b.expDate;
                const bRack = b.rack || product.rack
                const bSchemeDiscount = b.schemeDiscountPercent || product.schemeDiscountPercent;

                // --- Scheme Discount Calculation ---
                const schemeResult = computeSchemeDiscount(
                  allocated,
                  safeNum(bSchemeDiscount),
                  bStock,
                  undefined // no override calculatedFreeQty
                );
                const discountPercent = schemeResult.finalDiscountPercent;
                const discountedRate = bRate * (1 - discountPercent / 100);

                return (
                  <div
                    key={bId}
                    onClick={() => toggleBatchChecked(bId)}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none",
                      isChecked && allocated > 0
                        ? "border-primary bg-primary-soft/50 shadow-xs ring-1 ring-primary/30"
                        : "border-border bg-surface-alt/40 hover:bg-surface-hover hover:border-border-hover"
                    )}
                  >
                    {/* Left: Checkbox & Batch Specs */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="shrink-0 text-primary">
                        {isChecked ? (
                          <CheckSquare className="size-5 fill-primary text-white" />
                        ) : (
                          <Square className="size-5 text-text-muted group-hover:text-primary transition-colors" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm text-text">
                            Batch: {bNo}
                          </span>

                          {isNearestExp && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                              <Clock className="size-3 text-amber-500" /> Near Exp
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-text-muted bg-surface px-2 py-0.5 rounded border border-border">
                            <Calendar className="size-3 text-amber-500" /> Exp: {bExp}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                          {
                            bRack && (
                              <span>
                                Rack: <strong className="text-text font-mono font-bold">{bRack}</strong>
                              </span>
                            )
                          }
                          {
                            bSchemeDiscount && (
                              <span>
                                Scheme: <strong className="text-text font-mono font-bold">{safeNum(bSchemeDiscount).toFixed(2)}%</strong>
                              </span>
                            )
                          }


                          {schemeResult.schemeApply && discountPercent > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                              sch dis: ₹{discountedRate.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Rate & Allocated Qty Badge */}
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="font-mono">
                        <div className="text-base font-extrabold text-primary">₹{bRate.toFixed(2)}</div>
                        <div className="text-xs text-text-muted">MRP ₹{bMrp.toFixed(2)}</div>
                      </div>

                      <div
                        className={cn(
                          "px-3 py-1.5 rounded-xl font-mono font-extrabold text-xs border shadow-2xs",
                          allocated > 0
                            ? "bg-primary text-white border-primary"
                            : "bg-surface-alt text-text-muted border-border"
                        )}
                      >
                        Qty: {allocated} / {bStock}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-text-muted border border-dashed border-border rounded-xl">
              <AlertCircle className="size-7 mx-auto opacity-50 mb-2 text-warning" />
              <p className="text-xs font-semibold">No active batches with stock found for this branch</p>
            </div>
          )}
        </div>

        {/* Spacious Footer Summary & Actions */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-surface-alt/80 shrink-0">
          <div className="text-xs text-text font-mono">
          </div>

          <div className="flex items-center gap-3">
            <UIButton variant="ghost" size="md" onClick={onClose}>
              Cancel
            </UIButton>

            <UIButton
              variant="primary"
              size="md"
              disabled={totalAllocatedQty === 0}
              onClick={handleConfirmAdd}
              rightIcon={<ShoppingCart className="size-4" />}
              className="font-bold shadow-sm px-5"
            >
              Add {totalAllocatedQty} Qty to Cart (₹{totalCombinedAmount.toFixed(2)})
            </UIButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkspaceProductBatchSelectorModal;
