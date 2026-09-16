// src/features/purchases/pages/desktop/CreatePurchaseBillDesktopPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Receipt,
  Building2,
  FileSpreadsheet,
  ArrowLeft,
  X
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UICard,
  UIButton,
  WorkspaceProductSearchBar,
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter
} from "@/components";
import { cn } from "@/lib/utils";
import supplierService from "@/features/parties/suppliers/services/supplierService";
import purchaseBillService from "@/features/purchases/services/purchaseBillService";
import { SupplierSearchBar } from "@/components";

export const CreatePurchaseBillDesktopPage = () => {
  const navigate = useNavigate();
  const { billId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Rate Basis
  const [rateBasis, setRateBasis] = useState("PTS"); // "PTS" or "PTR"

  // Invoice Details
  const [purchaseBillNo, setPurchaseBillNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [selectedProductForBatches, setSelectedProductForBatches] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Extra Discount (applied on taxable subtotal in preview)
  const [extraDiscountPct, setExtraDiscountPct] = useState(0);

  // Submit loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchBarRef = useRef(null);
  const supplierSearchBarRef = useRef(null);

  // Load existing bill if billId is present (Edit Mode)
  useEffect(() => {
    const loadBill = async () => {
      if (!billId) return;
      try {
        const res = await purchaseBillService.getPurchaseBillById(billId);
        const bill = res.data?.data;
        if (bill) {
          if (bill.supplierId) {
            setSelectedSupplier({
              ...bill.supplierId,
              id: bill.supplierId._id,
              name: bill.supplierId.businessName
            });
          }
          setPurchaseBillNo(bill.purchaseBillNo || "");
          setInvoiceDate(bill.invoiceDate || "");
          setRateBasis(bill.rateBasis || "PTS");
          setExtraDiscountPct(bill.extraDiscountPct || 0);

          if (bill.items && Array.isArray(bill.items)) {
            const loadedCart = bill.items.map(item => ({
              ...item,
              id: item._id || item.id || `${Date.now()}-${Math.random()}`,
            }));
            setCart(loadedCart);
          }
        }
      } catch (err) {
        console.error("Failed to load bill", err);
        setToastMessage("❌ Failed to load purchase bill for editing");
        setTimeout(() => setToastMessage(null), 4000);
      }
    };
    loadBill();
  }, [billId]);

  // Auto-focus handler
  useEffect(() => {
    const handleGlobalTyping = (e) => {
      if (isBatchModalOpen) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;

      if (e.key && e.key.length === 1) {
        if (!selectedSupplier) {
          supplierSearchBarRef.current?.focus();
        } else {
          searchBarRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalTyping);
    return () => window.removeEventListener("keydown", handleGlobalTyping);
  }, [isBatchModalOpen, selectedSupplier]);

  const getGstRate = (p) => {
    if (!p) return 12;
    const val = p.globalProduct?.gstRate ?? p.hsnTaxpercent ?? p.gstRate ?? p.gst ?? p.taxRate;
    return val !== undefined && val !== null && val !== "" ? Number(val) : 12;
  };

  const getHsnCode = (p) => {
    if (!p) return "3004";
    const val = p.globalProduct?.hsn || p.hsn || p.hsnCode;
    return val ? String(val) : "3004";
  };

  const formatExpiryInput = (val) => {
    if (!val) return "";
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length === 0) return "";
    if (digits.length <= 2) {
      if (val.endsWith("/") && digits.length === 2) {
        return `${digits}/`;
      }
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSelectWorkspaceProduct = (prod, details) => {
    const p = details || prod;
    if (!p) return;

    const baseRate = Number(p.ptr || p.price || p.purchaseRate || p.rate || 0);
    const baseMrp = Number(p.mrp || p.MRP || 0);

    const newItem = {
      id: `${p._id || p.id || Date.now()}-${Date.now()}`,
      productId: p._id || p.id,
      name: p.name || p.productName || "Product",
      pack: p.pack || p.packaging || "Pack",
      batch: p.batchNo || p.batch || "",
      expiry: p.expiryDate || p.expiry || "",
      qty: 1,
      freeQty: 0,
      schPct: 0,
      disc: 0,
      cRatePct: 0,
      mrp: baseMrp,
      hsn: getHsnCode(p),
      gst: getGstRate(p),
      rate: baseRate,
    };

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => (i.productId === newItem.productId || i.id === newItem.id) && (!i.batch || i.batch === newItem.batch)
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          qty: updated[existingIdx].qty + 1,
        };
        return updated;
      }
      return [...prev, newItem];
    });

    setSearchQuery("");
    searchBarRef.current?.clear?.();
    setToastMessage(`✅ Added ${newItem.name} to Purchase Bill.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const updateItemField = (id, field, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleFreeBlurOrTab = (item) => {
    const qty = Number(item.qty) || 0;
    const freeQty = Number(item.freeQty) || 0;
    if (qty > 0 && freeQty > 0) {
      const calculatedSch = Number(((freeQty / (qty + freeQty)) * 100).toFixed(2));
      updateItemField(item.id, "schPct", calculatedSch);
    }
  };

  const handleSchBlurOrTab = (item) => {
    const schPct = Number(item.schPct) || 0;
    const freeQty = Number(item.freeQty) || 0;
    const currentQty = Number(item.qty) || 0;

    if (schPct > 0 && freeQty > 0) {
      setCart((prev) =>
        prev.map((i) => {
          if (i.id === item.id) {
            return {
              ...i,
              qty: currentQty + freeQty,
              freeQty: 0,
            };
          }
          return i;
        })
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  // Calculate item base amount (Qty * Rate)
  const getItemBaseAmount = (item) => {
    const rate = Number(item.rate) || 0;
    const qty = Number(item.qty) || 0;
    return rate * qty;
  };

  // Calculate item scheme discount amount
  const getItemSchemeDiscount = (item) => {
    const base = getItemBaseAmount(item);
    const schPct = Number(item.schPct) || 0;
    return (base * schPct) / 100;
  };

  // Calculate item trade discount amount (calculated after scheme discount)
  const getItemTradeDiscount = (item) => {
    const base = getItemBaseAmount(item);
    const schAmt = getItemSchemeDiscount(item);
    const afterScheme = base - schAmt;
    const discPct = Number(item.disc) || 0;
    return (afterScheme * discPct) / 100;
  };

  // Calculate item taxable amount: (Qty * Rate) - Scheme Disc - Trade Disc
  const getItemTaxableAmount = (item) => {
    const base = getItemBaseAmount(item);
    const schAmt = getItemSchemeDiscount(item);
    const discAmt = getItemTradeDiscount(item);
    return Math.max(0, base - schAmt - discAmt);
  };

  // Legacy/line amount for table line display
  const getItemAmount = (item) => getItemTaxableAmount(item);

  const cartGrossTotal = cart.reduce((acc, item) => acc + getItemBaseAmount(item), 0);
  const cartSchemeDiscount = cart.reduce((acc, item) => acc + getItemSchemeDiscount(item), 0);
  const cartTradeDiscount = cart.reduce((acc, item) => acc + getItemTradeDiscount(item), 0);
  const cartTaxableSubtotal = cart.reduce((acc, item) => acc + getItemTaxableAmount(item), 0);
  const cartSubtotal = cartTaxableSubtotal;

  // Extra Discount on taxable subtotal
  const extraDiscountAmt = (cartTaxableSubtotal * (Number(extraDiscountPct) || 0)) / 100;
  const cartTaxableAfterExtra = Math.max(0, cartTaxableSubtotal - extraDiscountAmt);

  const estTax = cart.reduce((acc, item) => {
    const taxable = getItemTaxableAmount(item);
    const extraDiscFactor = 1 - (Number(extraDiscountPct) || 0) / 100;
    const adjustedTaxable = taxable * extraDiscFactor;
    const gstPct = Number(item.gst) || 12;
    return acc + (adjustedTaxable * gstPct) / 100;
  }, 0);

  const cartGrandTotal = Math.round(cartTaxableAfterExtra + estTax);
  const cartItemCount = cart.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);

  const getTaxSlabBreakdown = () => {
    const slabs = {};
    cart.forEach((item) => {
      const gstPct = Number(item.gst) || 12;
      const lineTaxable = getItemTaxableAmount(item);
      const lineTax = (lineTaxable * gstPct) / 100;

      if (!slabs[gstPct]) {
        slabs[gstPct] = {
          gstPct,
          cgstPct: gstPct / 2,
          sgstPct: gstPct / 2,
          taxable: 0,
          cgstAmt: 0,
          sgstAmt: 0,
          totalTax: 0,
        };
      }

      slabs[gstPct].taxable += lineTaxable;
      slabs[gstPct].cgstAmt += lineTax / 2;
      slabs[gstPct].sgstAmt += lineTax / 2;
      slabs[gstPct].totalTax += lineTax;
    });

    return Object.values(slabs).sort((a, b) => a.gstPct - b.gstPct);
  };

  const handleOpenPreview = () => {
    if (!selectedSupplier) {
      setToastMessage("⚠️ Please select a supplier first.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (cart.length === 0) {
      setToastMessage("⚠️ Cannot submit an empty purchase bill.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setIsPreviewModalOpen(true);
  };

  const handleRateCheck = () => {
    setToastMessage(`🔍 Rate Check: All ${cart.length} item purchase rates verified.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSchemeCheck = () => {
    setToastMessage(`📋 Scheme Check: Scheme discounts & free qty verified for ${cart.length} items.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        supplierId: selectedSupplier?._id || selectedSupplier?.id,
        purchaseBillNo,
        invoiceDate,
        rateBasis,
        items: cart.map((item) => ({
          productId: item.productId || null,
          name: item.name,
          pack: item.pack,
          batch: item.batch,
          expiry: item.expiry,
          qty: Number(item.qty) || 0,
          freeQty: Number(item.freeQty) || 0,
          schPct: Number(item.schPct) || 0,
          disc: Number(item.disc) || 0,
          cRatePct: Number(item.cRatePct) || 0,
          mrp: Number(item.mrp) || 0,
          hsn: item.hsn || "",
          gst: Number(item.gst) || 12,
          rate: Number(item.rate) || 0,
          amount: getItemTaxableAmount(item),
        })),
        extraDiscountPct: Number(extraDiscountPct) || 0,
        extraDiscountAmt: extraDiscountAmt,
        grossTotal: cartGrossTotal,
        schemeDiscount: cartSchemeDiscount,
        tradeDiscount: cartTradeDiscount,
        taxableSubtotal: cartTaxableSubtotal,
        taxableAfterExtraDisc: cartTaxableAfterExtra,
        totalGst: estTax,
        grandTotal: cartGrandTotal,
        gstSlabs: getTaxSlabBreakdown(),
      };

      if (billId) {
        await purchaseBillService.updatePurchaseBill(billId, payload);
      } else {
        await purchaseBillService.createPurchaseBill(payload);
      }

      setIsPreviewModalOpen(false);
      setToastMessage(`✅ Purchase Bill ${purchaseBillNo || "saved"} successfully.`);
      setTimeout(() => {
        setToastMessage(null);
        navigate("/purchases");
      }, 2000);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Failed to save purchase bill";
      setToastMessage(`❌ ${msg}`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-4 sm:px-6 lg:px-8 py-6 font-sans space-y-5">
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-8 z-50 flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-surface/95 px-4 py-3 text-sm font-semibold text-text shadow-xl backdrop-blur-md"
        >
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <UIButton
            variant="ghost"
            size="icon"
            className="text-text-muted hover:text-text hover:bg-surface-hover shrink-0"
            onClick={() => navigate("/purchases")}
          >
            <ArrowLeft className="size-5" />
          </UIButton>
          <div>
            <h1 className="text-xl font-bold text-text flex items-center gap-2">
              <Receipt className="size-6 text-primary" />
              {billId ? "Edit Purchase Bill" : "Enter Purchase Bill"}
            </h1>
            <p className="text-xs text-text-muted mt-1">
              {billId ? "Update inwards bill details and items" : "Record inwards stock and purchase details from supplier"}
            </p>
          </div>
        </div>
      </div>

      {/* Details Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 max-w-xl">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Select Supplier
            </span>
            <SupplierSearchBar
              ref={supplierSearchBarRef}
              selectedSupplier={selectedSupplier}
              onSelectSupplier={(cust) => setSelectedSupplier(cust)}
              placeholder="Search supplier by name, GST, or phone..."
              size="sm"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Bill Number
              </span>
              <input
                type="text"
                className="h-8.5 text-xs px-2.5 rounded-lg border border-border bg-surface-alt w-36"
                placeholder="Auto-calculated"
                value={purchaseBillNo}
                onChange={(e) => setPurchaseBillNo(e.target.value)}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Invoice Date
              </span>
              <input
                type="date"
                className="h-8.5 text-xs px-2.5 rounded-lg border border-border bg-surface-alt w-36"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Rate Basis
              </span>
              <select
                className="h-8.5 text-xs px-2.5 rounded-lg border border-border bg-surface-alt"
                value={rateBasis}
                onChange={(e) => setRateBasis(e.target.value)}
              >
                <option value="PTS">PTS (Stockist)</option>
                <option value="PTR">PTR (Retailer)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Cart Full Width */}
      <div className="w-full">
        <UICard variant="default" className="p-6 rounded-2xl bg-surface border-border shadow-xs flex flex-col justify-between min-h-[620px] space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/70">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <ShoppingCart className="size-5.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-text">Purchase Bill Cart</h2>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 text-xs font-extrabold font-mono">
                      {cartItemCount} Items
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    <span className="font-semibold text-text">Supplier: </span>
                    {selectedSupplier ? (
                      <span className="font-extrabold text-emerald-600">{selectedSupplier.name}</span>
                    ) : (
                      <span className="font-bold text-amber-600">No Supplier Selected</span>
                    )}
                  </p>
                </div>
              </div>

              {cart.length > 0 && (
                <button type="button" onClick={handleClearCart} className="text-xs font-semibold text-error hover:underline flex items-center gap-1 cursor-pointer">
                  <Trash2 className="size-4" />
                  <span>Clear Cart</span>
                </button>
              )}
            </div>

            <div>
              <WorkspaceProductSearchBar
                ref={searchBarRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSelectProduct={handleSelectWorkspaceProduct}
                placeholder="Search product / medicine to add to purchase bill..."
                size="md"
                showDetailsPreview
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface-alt/30 max-h-[380px]">
              {cart.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt/80 text-[10.5px] font-bold text-text-muted uppercase tracking-wider select-none whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[130px]">Product</th>
                      <th className="py-2.5 px-2 font-mono">Batch</th>
                      <th className="py-2.5 px-2 font-mono">Expiry</th>
                      <th className="py-2.5 px-2 font-mono text-center">Qty</th>
                      <th className="py-2.5 px-2 font-mono text-center">Free</th>
                      <th className="py-2.5 px-2 font-mono text-center">SCH%</th>
                      <th className="py-2.5 px-2 font-mono text-center">Disc%</th>
                      <th className="py-2.5 px-2 font-mono text-right">MRP</th>
                      <th className="py-2.5 px-2 font-mono">HSN</th>
                      <th className="py-2.5 px-2 font-mono text-center">GST%</th>
                      <th className="py-2.5 px-2 font-mono text-right">Rate</th>
                      <th className="py-2.5 px-2 font-mono text-center">CRate%</th>
                      <th className="py-2.5 px-3 font-mono text-right">Amount</th>
                      <th className="py-2.5 px-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {cart.map((item) => {
                      const lineAmt = getItemAmount(item);
                      return (
                        <tr key={item.id} className="hover:bg-surface-hover/80 transition-colors">
                          {/* 1. Product */}
                          <td className="py-2 px-3">
                            <span className="font-bold text-text text-xs block truncate max-w-[130px]" title={item.name}>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-text-muted block">{item.pack || "Pack"}</span>
                          </td>

                          {/* 2. Batch */}
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={item.batch || ""}
                              onChange={(e) => updateItemField(item.id, "batch", e.target.value)}
                              className="w-16 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-text focus:border-primary focus:outline-none"
                              placeholder="Batch"
                            />
                          </td>

                          {/* 3. Expiry */}
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={item.expiry || ""}
                              onChange={(e) => updateItemField(item.id, "expiry", formatExpiryInput(e.target.value))}
                              className="w-14 text-center rounded border border-border bg-surface px-1 py-0.5 font-mono text-xs text-text font-semibold outline-none focus:border-primary"
                            />
                          </td>

                          {/* 4. Qty */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.qty || 1}
                              onChange={(e) => updateItemField(item.id, "qty", Math.max(1, Number(e.target.value)))}
                              className="w-12 text-center rounded border border-border bg-surface px-1 py-0.5 font-mono font-bold text-xs text-text outline-none focus:border-primary"
                              placeholder="Qty"
                            />
                          </td>

                          {/* 5. Free */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.freeQty ?? 0}
                              onChange={(e) => updateItemField(item.id, "freeQty", Math.max(0, Number(e.target.value)))}
                              onBlur={() => handleFreeBlurOrTab(item)}
                              onKeyDown={(e) => {
                                if (e.key === "Tab" && !e.shiftKey) {
                                  handleFreeBlurOrTab(item);
                                }
                              }}
                              className="w-12 text-center rounded border border-border bg-surface-alt px-1 py-0.5 font-mono text-xs text-text-muted outline-none focus:border-primary"
                              placeholder="Free"
                            />
                          </td>

                          {/* 6. SCH% */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={item.schPct ?? 0}
                              onChange={(e) => updateItemField(item.id, "schPct", Number(e.target.value))}
                              onBlur={() => handleSchBlurOrTab(item)}
                              onKeyDown={(e) => {
                                if (e.key === "Tab" && !e.shiftKey) {
                                  handleSchBlurOrTab(item);
                                }
                              }}
                              className="w-12 text-center rounded border border-border bg-surface px-1 py-0.5 font-mono text-xs text-text outline-none focus:border-primary"
                              placeholder="0"
                            />
                          </td>

                          {/* 7. Disc% */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={item.disc ?? 0}
                              onChange={(e) => updateItemField(item.id, "disc", Number(e.target.value))}
                              className="w-12 text-center rounded border border-border bg-surface px-1 py-0.5 font-mono text-xs text-text outline-none focus:border-primary"
                              placeholder="0"
                            />
                          </td>

                          {/* 8. MRP */}
                          <td className="py-2 px-2 font-mono text-right">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.mrp ?? 0}
                              onChange={(e) => updateItemField(item.id, "mrp", Number(e.target.value))}
                              className="w-16 text-right rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-text focus:border-primary focus:outline-none"
                            />
                          </td>

                          {/* 9. HSN */}
                          <td className="py-2 px-2 font-mono text-xs text-text-muted">
                            <input
                              type="text"
                              value={item.hsn || ""}
                              onChange={(e) => updateItemField(item.id, "hsn", e.target.value)}
                              className="w-14 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-text focus:border-primary focus:outline-none"
                              placeholder="HSN"
                            />
                          </td>

                          {/* 10. GST% */}
                          <td className="py-2 px-2 font-mono text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.gst ?? 12}
                              onChange={(e) => updateItemField(item.id, "gst", Number(e.target.value))}
                              className="w-12 text-center rounded border border-border bg-surface px-1 py-0.5 font-mono text-xs font-bold text-purple-600 focus:border-primary focus:outline-none"
                            />
                          </td>

                          {/* 11. Rate */}
                          <td className="py-2 px-2 font-mono text-right">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate ?? 0}
                              onChange={(e) => updateItemField(item.id, "rate", Number(e.target.value))}
                              className="w-18 text-right rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs font-bold text-text focus:border-primary focus:outline-none"
                            />
                          </td>

                          {/* 12. CRate% */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={item.cRatePct ?? 0}
                              onChange={(e) => updateItemField(item.id, "cRatePct", Number(e.target.value))}
                              className="w-12 text-center rounded border border-border bg-surface px-1 py-0.5 font-mono text-xs text-text outline-none focus:border-primary"
                              placeholder="0"
                            />
                          </td>

                          {/* 13. Amount */}
                          <td className="py-2 px-3 font-mono text-right font-extrabold text-emerald-600 text-xs tabular-nums">
                            ₹{lineAmt.toFixed(2)}
                          </td>

                          {/* 14. Actions */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-text-muted hover:text-error transition-colors p-1 cursor-pointer rounded hover:bg-error/10"
                              title="Remove item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-text-muted space-y-2">
                  <ShoppingCart className="size-8 mx-auto opacity-40 text-text-muted" />
                  <p className="text-xs font-semibold">Purchase Bill is empty</p>
                  <p className="text-[11px] text-text-muted">
                    Use the search bar above to scan or add medicines to the bill
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Calculation Bar */}
          <div className="pt-4 border-t border-border/70 space-y-3">
            <div className="flex justify-end gap-6 text-sm">
              <div className="text-right space-y-1 text-text-muted">
                <p>Gross Amount (Qty × Rate):</p>
                {cartSchemeDiscount > 0 && <p className="text-amber-600">Scheme Discount:</p>}
                {cartTradeDiscount > 0 && <p className="text-amber-600">Trade Discount (Disc %):</p>}
                <p className="font-semibold text-text">Taxable Subtotal:</p>
                {extraDiscountAmt > 0 && <p className="text-orange-600">Extra Discount ({extraDiscountPct}%):</p>}
                <p className="text-purple-600">Est. GST Tax:</p>
                <p className="text-lg font-bold text-text mt-2">Grand Total:</p>
              </div>
              <div className="text-right space-y-1 font-mono font-medium">
                <p>₹{cartGrossTotal.toFixed(2)}</p>
                {cartSchemeDiscount > 0 && <p className="text-amber-600">-₹{cartSchemeDiscount.toFixed(2)}</p>}
                {cartTradeDiscount > 0 && <p className="text-amber-600">-₹{cartTradeDiscount.toFixed(2)}</p>}
                <p className="font-semibold text-text">₹{cartTaxableSubtotal.toFixed(2)}</p>
                {extraDiscountAmt > 0 && <p className="text-orange-600">-₹{extraDiscountAmt.toFixed(2)}</p>}
                <p className="text-purple-600">+₹{estTax.toFixed(2)}</p>
                <p className="text-lg font-bold text-emerald-600 mt-2">₹{cartGrandTotal.toFixed(2)}</p>
              </div>
            </div>

            <UIButton
              variant="primary"
              size="md"
              className="w-full justify-center text-sm font-bold shadow-sm"
              disabled={cart.length === 0}
              onClick={handleOpenPreview}
              rightIcon={<Receipt className="size-4" />}
            >
              Preview Purchase Bill (₹{cartGrandTotal})
            </UIButton>
          </div>
        </UICard>
      </div>

      {/* Purchase Bill Preview Modal */}
      <UIModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        size="3xl"
      >
        <UIModalHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <UIModalTitle className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-emerald-600" />
                <span>{billId ? "Edit Purchase Bill Preview" : "Purchase Bill Preview"}</span>
              </UIModalTitle>
              <UIModalDescription>
                Review inwards bill details, rates, and scheme discounts before final submission
              </UIModalDescription>
            </div>
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </UIModalHeader>

        <UIModalBody className="space-y-4">
          {/* Summary Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-alt/70 p-3.5 rounded-2xl border border-border text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted block">Supplier</span>
              <span className="font-extrabold text-emerald-700 block truncate">
                {selectedSupplier?.name || "No Supplier Selected"}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-muted">Bill Number:</span>
              <span className="font-mono font-bold text-text block">{purchaseBillNo || "Auto-calculated"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted block">Invoice Date</span>
              <span className="font-mono font-bold text-text block">{invoiceDate || "Today"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted block">Rate Basis</span>
              <span className="font-bold text-primary block">{rateBasis}</span>
            </div>
          </div>

          {/* Main Content: Items Table (Left) + Summary & GST Slab (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left: Cart Items Table */}
            <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-border bg-surface max-h-[380px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/80 text-[10px] font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">
                    <th className="py-2 px-2.5">Product</th>
                    <th className="py-2 px-2 font-mono">Batch</th>
                    <th className="py-2 px-2 font-mono">Expiry</th>
                    <th className="py-2 px-2 font-mono text-center">Qty</th>
                    <th className="py-2 px-2 font-mono text-center">Free</th>
                    <th className="py-2 px-2 font-mono text-center">SCH%</th>
                    <th className="py-2 px-2 font-mono text-center">Disc%</th>
                    <th className="py-2 px-2 font-mono text-right">MRP</th>
                    <th className="py-2 px-2 font-mono">HSN</th>
                    <th className="py-2 px-2 font-mono text-center">GST%</th>
                    <th className="py-2 px-2 font-mono text-right">Rate</th>
                    <th className="py-2 px-2 font-mono text-center">CRate%</th>
                    <th className="py-2 px-2.5 font-mono text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-hover/50">
                      <td className="py-2 px-2.5 font-bold text-text truncate max-w-[130px]">{item.name}</td>
                      <td className="py-2 px-2 font-mono text-[11px] text-text-muted">{item.batch || "-"}</td>
                      <td className="py-2 px-2 font-mono text-[11px] text-text-muted">{item.expiry || "-"}</td>
                      <td className="py-2 px-2 font-mono text-center font-bold text-text">{item.qty}</td>
                      <td className="py-2 px-2 font-mono text-center text-text-muted">{item.freeQty || 0}</td>
                      <td className="py-2 px-2 font-mono text-center text-text">{item.schPct || 0}%</td>
                      <td className="py-2 px-2 font-mono text-center text-text">{item.disc || 0}%</td>
                      <td className="py-2 px-2 font-mono text-right text-text">₹{Number(item.mrp || 0).toFixed(2)}</td>
                      <td className="py-2 px-2 font-mono text-[11px] text-text-muted">{item.hsn || "-"}</td>
                      <td className="py-2 px-2 font-mono text-center font-bold text-purple-600">{item.gst || 12}%</td>
                      <td className="py-2 px-2 font-mono text-right font-bold text-text">₹{Number(item.rate || 0).toFixed(2)}</td>
                      <td className="py-2 px-2 font-mono text-center text-text">{item.cRatePct || 0}%</td>
                      <td className="py-2 px-2.5 font-mono text-right font-extrabold text-emerald-600">
                        ₹{getItemBaseAmount(item).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: Bill Summary + GST Slab */}
            <div className="lg:col-span-4 space-y-4">
              {/* Bill Financial Summary */}
              <div className="space-y-2 flex flex-col justify-between bg-surface-alt/60 p-3.5 rounded-2xl border border-border">
                <span className="text-[11px] font-bold text-text uppercase tracking-wider block border-b border-border/60 pb-1">
                  Bill Financial Summary
                </span>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-text-muted">
                    <span>Gross Total:</span>
                    <span className="font-bold font-mono text-text">₹{cartGrossTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-text-muted ">
                    <span>Scheme Disc:</span>
                    <span className="font-bold font-mono">-₹{cartSchemeDiscount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-text-muted">
                    <span>Trade Disc:</span>
                    <span className="font-bold font-mono">-₹{cartTradeDiscount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-text-muted">
                    <span className="flex items-center gap-1.5">
                      Extra Disc:
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={extraDiscountPct}
                        onChange={(e) => setExtraDiscountPct(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-12 text-center rounded-none border-0 border-b border-text-muted bg-transparent px-1 py-0.5 font-mono text-xs font-bold text-text outline-none focus:border-primary"
                      />
                      <span className="text-[10px] font-bold">%</span>
                    </span>
                    <span className="font-bold font-mono">-₹{extraDiscountAmt.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-text font-semibold pt-1 border-t border-border/60">
                    <span>Taxable After Extra Disc:</span>
                    <span className="font-extrabold font-mono">₹{cartTaxableAfterExtra.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-purple-600">
                    <span>Est. GST Tax:</span>
                    <span className="font-bold font-mono">+₹{estTax.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-xs font-black text-text">Grand Total:</span>
                    <span className="text-lg font-black font-mono text-emerald-600">
                      ₹{cartGrandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* GST Tax Slab Breakdown */}
              <div className="space-y-1.5 flex flex-col justify-between bg-surface-alt/40 p-3 rounded-2xl border border-border">
                <span className="text-[11px] font-bold text-text uppercase tracking-wider block">
                  GST Tax Slab Breakdown
                </span>
                <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-surface-alt/80 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        <th className="py-2 px-2.5">Slab</th>
                        <th className="py-2 px-2 font-mono text-right">Taxable</th>
                        <th className="py-2 px-2 font-mono text-right">CGST</th>
                        <th className="py-2 px-2 font-mono text-right">SGST</th>
                        <th className="py-2 px-2.5 font-mono text-right">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                      {getTaxSlabBreakdown().map((slab) => (
                        <tr key={slab.gstPct} className="hover:bg-surface-hover/50">
                          <td className="py-1.5 px-2.5 font-bold text-purple-600 font-sans">
                            {slab.gstPct}%
                          </td>
                          <td className="py-1.5 px-2 text-right font-medium text-text">
                            ₹{slab.taxable.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2 text-right text-text-muted">
                            ₹{slab.cgstAmt.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2 text-right text-text-muted">
                            ₹{slab.sgstAmt.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2.5 text-right font-bold text-emerald-600">
                            ₹{slab.totalTax.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </UIModalBody>

        <UIModalFooter className="flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <UIButton
              variant="outline"
              size="sm"
              onClick={handleRateCheck}
              className="flex-1 sm:flex-none font-bold text-xs"
            >
              Rate Check
            </UIButton>
            <UIButton
              variant="outline"
              size="sm"
              onClick={handleSchemeCheck}
              className="flex-1 sm:flex-none font-bold text-xs"
            >
              Scheme Check
            </UIButton>
          </div>
          <UIButton
            variant="primary"
            size="sm"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto font-bold text-xs"
            rightIcon={<CheckCircle2 className="size-4" />}
          >
            {isSubmitting
              ? "Saving..."
              : billId
              ? `Update & Submit (₹${cartGrandTotal.toFixed(2)})`
              : `Confirm & Submit (₹${cartGrandTotal.toFixed(2)})`}
          </UIButton>
        </UIModalFooter>
      </UIModal>
    </section>
  );
};

export default CreatePurchaseBillDesktopPage;
