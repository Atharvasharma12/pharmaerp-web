// src/features/sales/pages/desktop/SalesDesktopPage.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  Barcode,
  CheckCircle2,
  RefreshCw,
  Receipt,
  Sparkles,
  Percent,
} from "lucide-react";
import {
  UICard,
  UIButton,
  UIIconButton,
  UIBadge,
  UISearchInput,
} from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";
import { cn } from "@/lib/utils";
import {
  POS_AVAILABLE_MEDICINES,
  POS_DEFAULT_CUSTOMERS,
} from "../../constants/salesData";
import { SalesCheckoutModal } from "../../components/SalesCheckoutModal";
import { SalesReceiptModal } from "../../components/SalesReceiptModal";

export const SalesDesktopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(POS_DEFAULT_CUSTOMERS[0]);
  const [cart, setCart] = useState([
    {
      ...POS_AVAILABLE_MEDICINES[0],
      qty: 2,
    },
    {
      ...POS_AVAILABLE_MEDICINES[5],
      qty: 1,
    },
  ]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const categories = ["all", "Tablet", "Capsule", "Syrup", "Injection"];

  const filteredMedicines = POS_AVAILABLE_MEDICINES.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hsn.includes(searchQuery);

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const handleAddToCart = (medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.id === medicine.id
            ? { ...item, qty: Math.min(medicine.stock, item.qty + 1) }
            : item
        );
      }
      return [...prev, { ...medicine, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const estTax = cartSubtotal * 0.12;
  const cartGrandTotal = Math.round(cartSubtotal + estTax);

  const handleCompleteSale = (saleData) => {
    setIsCheckoutOpen(false);
    setCompletedSale(saleData);
    setIsReceiptOpen(true);
    setCart([]);
    setToastMessage(`✅ Invoice ${saleData.invoiceNo} generated successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Dynamic Action Toast */}
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <h1 className="text-2xl font-extrabold text-text tracking-tight">
                POS Billing Terminal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Quick prescription dispensing, medicine lookup & instant invoicing
            </p>
          </div>

          {/* Customer Selector Strip */}
          <div className="flex items-center gap-3 bg-surface border border-border p-2 rounded-2xl shadow-xs">
            <User className="size-4 text-primary ml-2" />
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const c = POS_DEFAULT_CUSTOMERS.find((cust) => cust.id === e.target.value);
                if (c) setSelectedCustomer(c);
              }}
              className="bg-transparent text-xs font-semibold text-text border-none focus:outline-none cursor-pointer pr-4"
            >
              {POS_DEFAULT_CUSTOMERS.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.name} {cust.phone ? `(${cust.phone})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dual Pane Layout: Left Catalog (60%) | Right Live POS Cart (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left Column: Medicine Catalog (7 Cols) ────────────────── */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Category Filter */}
            <UICard variant="default" className="p-4 rounded-2xl bg-surface border-border shadow-xs space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan barcode or type medicine name / brand / HSN..."
                  className="w-full rounded-xl border border-border bg-surface-alt/70 pl-10 pr-4 py-2.5 text-xs text-text placeholder:text-text-muted transition-all hover:bg-surface-hover focus:border-primary focus:bg-surface focus:outline-none font-medium"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize whitespace-nowrap cursor-pointer",
                      selectedCategory === cat
                        ? "bg-primary text-primary-contrast shadow-xs"
                        : "bg-surface-alt/80 text-text-muted hover:bg-surface-hover hover:text-text border border-border/60"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </UICard>

            {/* Medicine Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredMedicines.map((med) => {
                const inCart = cart.find((c) => c.id === med.id);

                return (
                  <UICard
                    key={med.id}
                    variant="default"
                    className="p-4 rounded-2xl bg-surface border-border shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                            {med.name}
                          </h3>
                          <p className="text-xs text-text-muted font-medium">
                            {med.brand} • {med.category}
                          </p>
                        </div>
                        <UIBadge
                          variant="soft"
                          intent={med.stock > 100 ? "success" : "warning"}
                          className="text-[11px] font-mono shrink-0"
                        >
                          {med.stock} in stock
                        </UIBadge>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs font-mono">
                        <span className="text-text-muted">Batch: {med.batch}</span>
                        <span className="text-text-muted">Exp: {med.expDate}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold font-mono text-text">
                          ₹{med.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] font-mono line-through text-text-muted">
                          ₹{med.mrp.toFixed(2)}
                        </span>
                      </div>

                      <PermissionGate permission="pos:create">
                        <UIButton
                          variant={inCart ? "secondary" : "primary"}
                          size="xs"
                          onClick={() => handleAddToCart(med)}
                          leftIcon={<Plus className="size-3.5" />}
                        >
                          {inCart ? `Add (${inCart.qty})` : "Add"}
                        </UIButton>
                      </PermissionGate>
                    </div>
                  </UICard>
                );
              })}
            </div>
          </div>

          {/* ── Right Column: Live POS Cart (5 Cols) ────────────────── */}
          <div className="lg:col-span-5">
            <UICard
              variant="default"
              className="sticky top-6 p-5 sm:p-6 rounded-2xl bg-surface border-border shadow-xs flex flex-col justify-between min-h-[580px]"
            >
              <div>
                {/* Cart Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="size-5 text-primary" />
                    <h2 className="text-base font-bold text-text">Current Sale Cart</h2>
                    <span className="rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs font-bold font-mono">
                      {cartItemCount}
                    </span>
                  </div>

                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-xs font-semibold text-error hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {/* Patient / Customer Bar */}
                <div className="my-3 p-3 rounded-xl bg-surface-alt/70 border border-border/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-muted">Customer:</span>{" "}
                    <span className="font-bold text-text">{selectedCustomer.name}</span>
                  </div>
                  {selectedCustomer.doctor && (
                    <span className="text-text-muted text-[11px] truncate max-w-[150px]">
                      {selectedCustomer.doctor}
                    </span>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-border/60 max-h-[300px] overflow-y-auto pr-1">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-text truncate">{item.name}</p>
                          <p className="text-[11px] text-text-muted font-mono">
                            ₹{item.price.toFixed(2)} × {item.qty} ={" "}
                            <span className="font-bold text-text">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </span>
                          </p>
                        </div>

                        {/* Qty Controls */}
                        <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-lg border border-border/80">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            className="size-6 rounded flex items-center justify-center hover:bg-surface-hover text-text-muted hover:text-text cursor-pointer"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="font-mono font-bold text-text w-5 text-center">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 1)}
                            className="size-6 rounded flex items-center justify-center hover:bg-surface-hover text-text-muted hover:text-text cursor-pointer"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-text-muted hover:text-error transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-text-muted space-y-2">
                      <ShoppingCart className="size-8 mx-auto opacity-40 text-text-muted" />
                      <p className="text-xs">Cart is empty. Select medicines from catalog.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Footer Calculation & Checkout Button */}
              <div className="pt-4 border-t border-border/70 space-y-3">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-text-muted">
                    <span>Items Subtotal:</span>
                    <span>₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Estimated GST (12%):</span>
                    <span>₹{estTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-text pt-2 border-t border-border">
                    <span>Grand Total:</span>
                    <span className="text-primary text-xl">₹{cartGrandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <PermissionGate
                  permission="pos:create"
                  fallback={
                    <UIButton variant="primary" size="md" className="w-full justify-center" disabled>
                      Checkout (Requires pos:create)
                    </UIButton>
                  }
                >
                  <UIButton
                    variant="primary"
                    size="md"
                    className="w-full justify-center text-sm font-bold shadow-sm"
                    disabled={cart.length === 0}
                    onClick={() => setIsCheckoutOpen(true)}
                    rightIcon={<Receipt className="size-4" />}
                  >
                    Proceed to Pay (₹{cartGrandTotal})
                  </UIButton>
                </PermissionGate>
              </div>
            </UICard>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <SalesCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        customer={selectedCustomer}
        cartSummary={{ items: cart, subtotal: cartSubtotal }}
        onCompleteSale={handleCompleteSale}
      />

      {/* Printable Receipt Modal */}
      <SalesReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        saleData={completedSale}
      />
    </section>
  );
};

export default SalesDesktopPage;
