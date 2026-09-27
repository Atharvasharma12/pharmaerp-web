// src/features/purchases/pages/mobile/CreatePurchaseBillMobilePage.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CheckCircle2,
  FileSpreadsheet,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  UICard,
  UIButton,
  WorkspaceProductSearchBar,
  WorkspaceProductBatchSelectorModal
} from "@/components";
import { cn } from "@/lib/utils";
import { SupplierSearchBar } from "@/components";

export const CreatePurchaseBillMobilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details"); // "details" | "catalog" | "cart"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const [purchaseBillNo, setPurchaseBillNo] = useState("");
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [rateBasis, setRateBasis] = useState("PTS");

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
      retailerMarginPercent: Number(p.retailerMarginPercent || 20),
      stockistMarginPercent: Number(p.stockistMarginPercent || 10),
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
    setToastMessage(`Added ${newItem.name} to cart.`);
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

  const handleUpdateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const handleRemoveItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const getItemAmount = (item) => {
    const rate = Number(item.rate) || 0;
    const qty = Number(item.qty) || 0;
    return rate * qty;
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + getItemAmount(item), 0);
  const estTax = cart.reduce((acc, item) => acc + (getItemAmount(item) * (Number(item.gst) || 12)) / 100, 0);
  const cartGrandTotal = Math.round(cartSubtotal + estTax);
  const cartItemCount = cart.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);

  const handleSubmit = () => {
    if (!selectedSupplier) {
      setToastMessage("⚠️ Select supplier first.");
      setActiveTab("details");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setToastMessage(`✅ Purchase Bill submitted.`);
    setTimeout(() => {
      setToastMessage(null);
      navigate("/purchases");
    }, 2000);
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-3.5 pt-3 pb-24 font-sans space-y-4">
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-surface/95 p-3 text-xs font-semibold text-text shadow-xl backdrop-blur-md">
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg bg-surface-alt border border-border">
            <ArrowLeft className="size-4 text-text-muted" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-text tracking-tight flex items-center gap-1.5">
               Purchase Bill
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-surface-alt p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("details")}
            className={cn("py-2 rounded-lg text-xs font-bold transition-all text-center", activeTab === "details" ? "bg-surface text-primary shadow-xs" : "text-text-muted hover:text-text")}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={cn("py-2 rounded-lg text-xs font-bold transition-all text-center", activeTab === "catalog" ? "bg-surface text-primary shadow-xs" : "text-text-muted hover:text-text")}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab("cart")}
            className={cn("py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5", activeTab === "cart" ? "bg-surface text-primary shadow-xs" : "text-text-muted hover:text-text")}
          >
            <ShoppingCart className="size-3.5" /> ({cartItemCount})
          </button>
        </div>
      </div>

      {activeTab === "details" && (
        <div className="space-y-4">
          <UICard variant="default" className="p-4 rounded-2xl bg-surface border-border shadow-xs space-y-4">
             <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Supplier
                </span>
                <SupplierSearchBar
                  selectedSupplier={selectedSupplier}
                  onSelectSupplier={(cust) => setSelectedSupplier(cust)}
                  placeholder="Search supplier..."
                  size="md"
                />
             </div>
             <div className="grid grid-cols-2 gap-2">
               <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Bill Number (Auto)
                  </span>
                  <input
                    type="text"
                    className="h-10 text-sm w-full px-3 rounded-xl border border-border bg-surface-alt cursor-not-allowed text-text-muted"
                    placeholder="Auto"
                    value={purchaseBillNo}
                    disabled
                  />
               </div>
               <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Supplier Inv No
                  </span>
                  <input
                    type="text"
                    className="h-10 text-sm w-full px-3 rounded-xl border border-border bg-surface-alt"
                    placeholder="INV-001"
                    value={supplierInvoiceNo}
                    onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                  />
               </div>
             </div>
             <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Invoice Date
                </span>
                <input
                  type="date"
                  className="h-10 text-sm w-full px-3 rounded-xl border border-border bg-surface-alt"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
             </div>
             <UIButton variant="primary" className="w-full justify-center" onClick={() => setActiveTab("catalog")}>Continue to Products</UIButton>
          </UICard>
        </div>
      )}

      {activeTab === "catalog" && (
        <div className="space-y-3">
          <WorkspaceProductSearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSelectProduct={handleSelectWorkspaceProduct}
            placeholder="Search products..."
            size="md"
            showDetailsPreview
          />
          <div className="text-center text-text-muted py-8 px-4 text-xs bg-surface rounded-xl border border-border shadow-xs">
             Type above to search and add items to your purchase bill.
          </div>
        </div>
      )}

      {activeTab === "cart" && (
        <div className="space-y-4">
          {cart.length > 0 ? (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-surface border border-border rounded-xl p-3 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-text">{item.name}</h3>
                    <p className="text-[11px] text-text-muted font-mono mt-0.5">Batch: {item.batch} | Exp: {item.expiry}</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1">Rate: ₹{item.rate} x {item.qty}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => handleRemoveItem(item.id)} className="text-error/80 hover:text-error p-1">
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-surface-alt rounded-lg border border-border p-1">
                      <button onClick={() => handleUpdateQty(item.id, -1)} className="size-6 flex items-center justify-center rounded hover:bg-surface-hover">
                        <Minus className="size-3" />
                      </button>
                      <span className="text-xs font-bold font-mono w-4 text-center">{item.qty}</span>
                      <button onClick={() => handleUpdateQty(item.id, 1)} className="size-6 flex items-center justify-center rounded hover:bg-surface-hover">
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-surface p-4 rounded-xl border border-border space-y-2 mt-4">
                <div className="flex justify-between text-xs text-text-muted"><p>Subtotal</p><p>₹{cartSubtotal.toFixed(2)}</p></div>
                <div className="flex justify-between text-xs text-text-muted"><p>Tax</p><p>₹{estTax.toFixed(2)}</p></div>
                <div className="flex justify-between text-sm font-bold text-text pt-2 border-t border-border/70"><p>Grand Total</p><p className="text-emerald-600">₹{cartGrandTotal.toFixed(2)}</p></div>
              </div>
              
              <UIButton variant="primary" className="w-full justify-center" onClick={handleSubmit} disabled={cart.length === 0} rightIcon={<Receipt className="size-4" />}>
                Submit Bill
              </UIButton>
            </div>
          ) : (
            <div className="text-center text-text-muted py-12 px-4 bg-surface rounded-xl border border-border">
              <ShoppingCart className="size-10 mx-auto opacity-30 mb-3" />
              <p className="text-sm font-bold">Cart is empty</p>
              <p className="text-xs mt-1">Go to Catalog to add items</p>
            </div>
          )}
        </div>
      )}

    </section>
  );
};

export default CreatePurchaseBillMobilePage;
