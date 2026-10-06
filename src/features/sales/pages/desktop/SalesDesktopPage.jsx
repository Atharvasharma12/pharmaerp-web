// src/features/sales/pages/desktop/SalesDesktopPage.jsx

import React, { useState, useEffect, useRef } from "react";
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
  Building2,
  Users,
  Briefcase,
  Store,
  FileCheck,
  CreditCard,
  ShieldCheck,
  Tag,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  UICard,
  UIButton,
  UIIconButton,
  UIBadge,
  UISearchInput,
  WorkspaceProductSearchBar,
  WorkspaceProductBatchSelectorModal,
  B2cCustomerSearchBar,
  B2bCustomerSearchBar,
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
} from "@/components";
import { PermissionGate } from "@/components/common/PermissionGate";
import { cn } from "@/lib/utils";
import {
  POS_AVAILABLE_MEDICINES,
  POS_DEFAULT_CUSTOMERS,
  POS_B2B_PARTIES,
} from "../../constants/salesData";
import { SalesCheckoutModal } from "../../components/SalesCheckoutModal";
import { SalesReceiptModal } from "../../components/SalesReceiptModal";
import { SalesCustomerSidebar } from "../../components/SalesCustomerSidebar";
import { SalesCustomerDoctorInfo } from "../../components/SalesCustomerDoctorInfo";
import customerService from "@/features/parties/customers/services/customerService";
import invoiceService from "@/features/sales/services/invoiceService";
import workspaceProductService from "@/features/workspace-products/services/workspaceProductService";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import useBranch from "@/features/branch/hooks/useBranch";
import { useActiveShift } from "@/features/operations/shifts/hooks/useActiveShift";

/** Safe number parser */
const safeNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/**
 * Compute scheme discount for a given qty and scheme %.
 * Applies schemePercent as a direct discount (no free qty).
 * Uses quarter/half/full threshold tiers.
 */
const computeSchemeDiscount = (qty, schemePercent) => {
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

  const fullFreeQty = (normalizedQty * normalizedScheme) / (100 - normalizedScheme);
  const quarterThreshold = (normalizedScheme / (100 - normalizedScheme)) / 0.4;
  const halfThreshold = quarterThreshold * 2;
  const fullThreshold = quarterThreshold * 4;

  let discountFraction = 0;
  let schemeApply = false;

  if (fullFreeQty >= fullThreshold) {
    discountFraction = 1;
    schemeApply = true;
  } else if (fullFreeQty >= halfThreshold) {
    discountFraction = 0.5;
    schemeApply = true;
  } else if (fullFreeQty >= quarterThreshold) {
    discountFraction = 0.25;
    schemeApply = true;
  }

  const finalDiscountPercent = schemeApply ? normalizedScheme * discountFraction : 0;

  return {
    freeQty: 0,
    schemeDiscountPercent: finalDiscountPercent,
    finalDiscountPercent,
    schemeApply,
  };
};

const QuickCreateCustomerModal = ({ open, onClose, defaultName, customerType, billingMode = "B2C", onSuccess }) => {
  const [name, setName] = useState(defaultName || "");
  const [mobile, setMobile] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setName(defaultName || "");
      setMobile("");
      setGstNumber("");
      setError(null);
    }
  }, [open, defaultName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: name.trim(),
        customerType: customerType,
      };
      if (mobile.trim()) payload.mobile = mobile.trim();
      if (gstNumber.trim() && billingMode === "B2B") payload.gstNumber = gstNumber.trim().toUpperCase();

      const res = await customerService.createCustomer(payload);
      const newCustomer = res.data?.data || res.data;
      onSuccess(newCustomer);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal isOpen={open} onClose={onClose} className="max-w-md">
      <form onSubmit={handleSubmit}>
        <UIModalHeader>
          <UIModalTitle>Create Quick {billingMode === "B2C" ? "B2C" : "B2B"} Customer</UIModalTitle>
          <UIModalDescription>Add a new customer on the fly.</UIModalDescription>
        </UIModalHeader>
        <UIModalBody className="space-y-4 p-5">
          {error && <div className="text-error text-sm font-semibold">{error}</div>}
          <div>
            <label className="text-xs font-bold text-text-muted">Customer Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe or Acme Corp" required className="w-full mt-1 h-9 rounded-lg border border-border px-3 text-sm bg-surface-alt text-text" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-muted">Mobile Number</label>
              <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Optional" className="w-full mt-1 h-9 rounded-lg border border-border px-3 text-sm bg-surface-alt text-text" />
            </div>
            {billingMode === "B2B" && (
              <div>
                <label className="text-xs font-bold text-text-muted">GST Number</label>
                <input type="text" value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="Optional" className="w-full mt-1 h-9 rounded-lg border border-border px-3 text-sm bg-surface-alt text-text uppercase" />
              </div>
            )}
          </div>
        </UIModalBody>
        <UIModalFooter>
          <UIButton type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</UIButton>
          <UIButton type="submit" variant="primary" disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? "Creating..." : "Create Customer"}
          </UIButton>
        </UIModalFooter>
      </form>
    </UIModal>
  );
};

export const SalesDesktopPage = () => {
  const location = useLocation();
  const initialInvoice = location.state?.invoice;
  const isEditMode = Boolean(initialInvoice);

  const [billingMode, setBillingMode] = useState(initialInvoice?.billingMode || "B2C"); // "B2C" | "B2B"
  const [b2bPartyType, setB2bPartyType] = useState("all"); // "all" | "wholesaler" | "retailer"

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedB2cCustomer, setSelectedB2cCustomer] = useState(
    initialInvoice?.billingMode !== "B2B" && (initialInvoice?.customerId || initialInvoice?.customer)
      ? { id: initialInvoice.customerId || "legacy", _id: initialInvoice.customerId || "legacy", name: initialInvoice.customer || "Walk-in Customer", mobile: initialInvoice.phone }
      : null
  );
  const [selectedB2bParty, setSelectedB2bParty] = useState(
    initialInvoice?.billingMode === "B2B" && (initialInvoice?.customerId || initialInvoice?.customer)
      ? { id: initialInvoice.customerId || "legacy", _id: initialInvoice.customerId || "legacy", name: initialInvoice.customer, mobile: initialInvoice.phone }
      : null
  );
  const [b2bPartiesFromBackend, setB2bPartiesFromBackend] = useState([]);

  const [isQuickCreateCustomerModalOpen, setIsQuickCreateCustomerModalOpen] = useState(false);
  const [quickCreateCustomerName, setQuickCreateCustomerName] = useState("");
  const [quickCreateCustomerType, setQuickCreateCustomerType] = useState("retail");

  const [cart, setCart] = useState(() => {
    if (!initialInvoice?.items) return [];
    return initialInvoice.items.map(item => ({
      ...item,
      id: item.productId || item.id || `legacy-${Math.random()}`,
      name: item.name,
      brand: item.brand || item.manufacturer || "Pharma",
      category: item.category || "Tablet",
      batch: item.batch || item.batchNo || "",
      pack: item.pack || item.packSize || "10S",
      rack: item.rack || "F1/AE2",
      hsn: item.hsn || "3004",
      gst: item.gst || item.gstRate || 0,
      ratePct: item.ratePct || (item.rateCPercentage !== undefined ? `${item.rateCPercentage}%` : "16%"),
      rateCPercentage: item.rateCPercentage,
      expiry: item.expiry || null,
      stock: item.stock ?? 100,
      mrp: item.mrp || item.price || 0,
      price: item.price || 0,
      disc: item.disc || item.itemDiscount || 0,
      qty: item.qty || 1,
      schemeDiscountPercent: item.schemeDiscountPercent || 0,
    }));
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [customerName, setCustomerName] = useState(
    initialInvoice?.billingMode !== "B2B" ? (initialInvoice?.customer || "") : ""
  );
  const [doctorName, setDoctorName] = useState(initialInvoice?.doctorName || "");
  const [customerPhone, setCustomerPhone] = useState(
    initialInvoice?.billingMode !== "B2B" ? (initialInvoice?.phone || "") : ""
  );

  const { currentBranch } = useBranch();
  const { activeShift, status: shiftStatus } = useActiveShift(currentBranch?._id);
  const navigate = useNavigate();

  const getLocalDateString = (dateObj) => {
    const d = dateObj ? new Date(dateObj) : new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const [saleDate, setSaleDate] = useState(
    activeShift?.date ? getLocalDateString(activeShift.date) : getLocalDateString()
  );

  useEffect(() => {
    if (activeShift?.date) {
      setSaleDate(getLocalDateString(activeShift.date));
    }
  }, [activeShift]);

  // Workspace Product Batch Selector Modal state
  const [selectedProductForBatches, setSelectedProductForBatches] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [showCustomerHistory, setShowCustomerHistory] = useState(false);

  const activeCustomer = billingMode === "B2C" ? selectedB2cCustomer : selectedB2bParty;

  const searchBarRef = useRef(null);
  const customerSearchBarRef = useRef(null);
  const b2bCustomerSearchBarRef = useRef(null);

  // Auto-focus handler: focuses Customer Search Bar first if customer not selected, else Product Search Bar
  useEffect(() => {
    const handleGlobalTyping = (e) => {
      // Ignore if a modal is open
      if (isBatchModalOpen || isCheckoutOpen || isReceiptOpen) return;
      // Ignore if modifier keys are pressed
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;

      // Single printable character keypress
      if (e.key && e.key.length === 1) {
        if (billingMode === "B2C" && !selectedB2cCustomer) {
          customerSearchBarRef.current?.focus();
        } else if (billingMode === "B2B" && !selectedB2bParty) {
          b2bCustomerSearchBarRef.current?.focus();
        } else {
          searchBarRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalTyping);
    return () => window.removeEventListener("keydown", handleGlobalTyping);
  }, [isBatchModalOpen, isCheckoutOpen, isReceiptOpen, billingMode, selectedB2cCustomer, selectedB2bParty]);

  /* if (shiftStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] space-y-4 p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-text-muted">Loading POS...</p>
      </div>
    );
  } */

  /* if (!activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] space-y-4 p-8">
        <Store className="size-16 text-text-muted" />
        <h2 className="text-2xl font-bold text-text">No open shift is present</h2>
        <p className="text-text-muted">You must open a shift before you can access POS billing.</p>
        <UIButton variant="primary" onClick={() => navigate("/operations/shifts")}>Go to Shifts</UIButton>
      </div>
    );
  } */

  const handleProceedToCheckout = () => {
    if (billingMode === "B2C" && (!selectedB2cCustomer || !selectedB2cCustomer.name || selectedB2cCustomer.name.trim() === "")) {
      setToastMessage("Please enter a customer name before creating the bill.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (billingMode === "B2B" && (!selectedB2bParty || !selectedB2bParty.name || selectedB2bParty.name.trim() === "")) {
      setToastMessage("Please select a B2B party before creating the bill.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Ctrl + Enter (or Cmd + Enter) keyboard shortcut to Proceed to Checkout
  useEffect(() => {
    const handleCtrlEnter = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.key === "Enter") {
        e.preventDefault();
        if (cart.length > 0) {
          handleProceedToCheckout();
        }
      }
    };

    window.addEventListener("keydown", handleCtrlEnter);
    return () => window.removeEventListener("keydown", handleCtrlEnter);
  }, [cart, billingMode, selectedB2cCustomer, selectedB2bParty]);

  useEffect(() => {
    const fetchB2bParties = async () => {
      try {
        const types = b2bPartyType === "all" ? "retail,wholesale" : (b2bPartyType === "wholesaler" ? "wholesale" : "retail");
        const res = await customerService.getCustomers({
          status: "active",
          customerType: types,
          limit: 100,
        });
        const customers = res.data?.data?.customers || res.data?.customers || [];
        const mapped = customers.map((c) => ({
          ...c,
          id: c._id || c.id,
          name: c.name,
          companyName: c.companyName || c.name,
          gstin: c.gstNumber || "N/A",
          partyType: c.customerType,
          creditLimit: c.creditLimit || 0,
          creditDays: c.creditDays || 0,
        }));
        setB2bPartiesFromBackend(mapped);

        if (mapped.length > 0) {
          setSelectedB2bParty(prev => {
            if (!prev) return null;
            const match = mapped.find(m => m.id === prev.id || m.id === prev._id || (prev.id === "legacy" && m.name === prev.name));
            return match || prev;
          });
        } else {
          setSelectedB2bParty(null);
        }
      } catch (err) {
        console.error("Failed to fetch B2B parties:", err);
      }
    };
    if (billingMode === "B2B") {
      fetchB2bParties();
    }
  }, [b2bPartyType, billingMode]);

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

  const filteredB2bParties = b2bPartiesFromBackend;

  const getGstRate = (p) => {
    if (!p) return 5;
    const val =
      p.globalProduct?.gstRate ??
      p.globalProduct?.hsnMaster?.gstRate ??
      p.globalProduct?.hsnMaster?.gst ??
      p.globalProduct?.hsnTaxpercent ??
      p.globalProduct?.HsnMaster?.gstRate ??
      p.hsnTaxpercent ??
      p.gstRate ??
      p.taxRate ??
      p.gst ??
      p.gstPercentage ??
      p.taxPercentage ??
      p.gstPct ??
      p.HsnMaster?.gstRate ??
      p.HsnMaster?.gst ??
      p.hsnMaster?.gstRate ??
      p.hsnMaster?.gst;
    if (val !== undefined && val !== null && val !== "") {
      return Number(val);
    }
    return 5;
  };

  const getHsnCode = (p) => {
    if (!p) return "3004";
    const val =
      p.globalProduct?.hsn ||
      p.globalProduct?.hsnCode ||
      p.globalProduct?.hsnMaster?.code ||
      p.globalProduct?.HsnMaster?.code ||
      p.hsn ||
      p.hsnCode ||
      p.HsnMaster?.code ||
      p.hsnMaster?.code;
    return val ? String(val) : "3004";
  };

  const getExpiryString = (p) => {
    if (!p) return "11/32";
    const raw = p.expiry || p.expDate || p.expiryDate || p.displayExpDate || p.batchExpiry || p.exp_date;
    if (raw) return String(raw);
    if (p.createdAt) {
      const d = new Date(p.createdAt);
      d.setFullYear(d.getFullYear() + 2);
      return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
    }
    return "11/32";
  };

  const handleAddToCart = (medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.id === medicine.id
            ? { ...item, qty: Math.min(medicine.stock || 999, item.qty + 1) }
            : item
        );
      }

      let basePrice = Number(medicine.price ?? 134.4);
      if (billingMode === "B2B") {
        basePrice = Number(medicine.rateB || medicine.rateb || (medicine.price ?? 134.4));
        if (selectedB2bParty?.defaultDiscount) {
          basePrice = Math.round(basePrice * (1 - selectedB2bParty.defaultDiscount / 100));
        }
      }

      return [
        ...prev,
        {
          id: medicine.id || `item-${Date.now()}`,
          name: medicine.name || medicine.displayName || "VB7 BLACK TAB 10S",
          brand: medicine.brand || medicine.displayManufacturer || medicine.manufacturer || "Pharma",
          category: medicine.category || medicine.displayCategory || "Tablet",
          batch: medicine.batch || medicine.displaySku || medicine.sku || "bbbbb",
          pack: medicine.pack || medicine.packaging || medicine.displayDosageForm || "10S",
          rack: medicine.rack || medicine.shelfLocation || "F1/AE2",
          hsn: getHsnCode(medicine),
          gst: getGstRate(medicine),
          ratePct: medicine.rateCPercentage !== undefined && medicine.rateCPercentage !== null ? `${medicine.rateCPercentage}%` : (medicine.ratePct || medicine.marginPct || "16%"),
          rateCPercentage: medicine.rateCPercentage,
          expiry: getExpiryString(medicine),
          stock: medicine.stock ?? 100,
          mrp: Number(medicine.mrp ?? 160.0),
          price: basePrice,
          disc: Number(medicine.disc ?? 0),
          qty: medicine.qty || 1,
          schemeDiscountPercent: medicine.schemeDiscountPercent || 0
        },
      ];
    });
  };

  const handleAddFromHistory = async (productId) => {
    try {
      if (!productId) return;
      const res = await workspaceProductService.getWorkspaceProductById(productId);
      const product = res.data?.data || res.data;
      if (product) {
        handleSelectWorkspaceProduct(product);
      }
    } catch (err) {
      console.error("Failed to fetch past product details:", err);
    }
  };

  const handleSelectWorkspaceProduct = (prod, details) => {
    const p = details || prod;
    setSelectedProductForBatches(p);
    setIsBatchModalOpen(true);
    setSearchQuery("");
    searchBarRef.current?.clear?.();
  };

  const handleConfirmAddBatchToCart = (itemsToAdd) => {
    const itemsList = Array.isArray(itemsToAdd) ? itemsToAdd : [itemsToAdd];
    if (itemsList.length === 0) return;

    setCart((prev) => {
      let updatedCart = [...prev];

      itemsList.forEach((item) => {
        let basePrice = item.price;
        if (billingMode === "B2B") {
          // Use rateB for B2B billing if available
          basePrice = Number(item.rateB || item.rateb || item.price || 0);

          if (selectedB2bParty?.defaultDiscount) {
            basePrice = Math.round(basePrice * (1 - selectedB2bParty.defaultDiscount / 100));
          }
        }

        const finalItem = {
          ...item,
          price: basePrice,
        };

        const existingIdx = updatedCart.findIndex((i) => i.id === finalItem.id);
        if (existingIdx >= 0) {
          const maxStock = Number(updatedCart[existingIdx].stock ?? 999999);
          const nextQty = Math.min(maxStock, updatedCart[existingIdx].qty + finalItem.qty);
          updatedCart[existingIdx] = {
            ...updatedCart[existingIdx],
            qty: nextQty,
          };
        } else {
          const maxStock = Number(finalItem.stock ?? 999999);
          updatedCart.push({
            ...finalItem,
            qty: Math.min(maxStock, finalItem.qty),
          });
        }
      });

      return updatedCart;
    });

    const totalAddedQty = itemsList.reduce((acc, i) => acc + (i.qty || 1), 0);
    setToastMessage(`Added ${itemsList.length} batch(es) (${totalAddedQty} items) for "${itemsList[0].name}" to cart.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const current = Number(item.qty) || 1;
            const maxStock = Number(item.stock ?? 999999);
            const newQty = Math.min(maxStock, current + delta);
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleSetQty = (id, qtyVal) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const num = parseInt(qtyVal, 10);
          const maxStock = Number(item.stock ?? 999999);
          if (!isNaN(num) && num > maxStock) {
            return { ...item, qty: maxStock };
          }
          return { ...item, qty: qtyVal };
        }
        return item;
      })
    );
  };

  const handleBlurQty = (id, qtyVal) => {
    const num = parseInt(qtyVal, 10);
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxStock = Number(item.stock ?? 999999);
          const finalQty = isNaN(num) || num < 1 ? 1 : Math.min(maxStock, num);
          return { ...item, qty: finalQty };
        }
        return item;
      })
    );
  };

  const handleUpdateItemDisc = (id, discVal) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, disc: discVal } : item))
    );
  };

  const handleBlurItemDisc = (id, discVal) => {
    const num = parseFloat(discVal);
    const finalDisc = isNaN(num) || num < 0 ? 0 : Math.min(100, num);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, disc: finalDisc } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Line item amount calculation
  // B2B: Rate * Qty (no disc deducted here — all discounts applied in Invoice Preview)
  // B2C: Rate * Qty * (1 - Disc/100)
  const getItemAmount = (item) => {
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    if (billingMode === "B2B") {
      return rate * qty;
    }
    const disc = Math.max(0, Math.min(100, Number(item.disc) || 0));
    return rate * qty * (1 - disc / 100);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + getItemAmount(item), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);
  const estTax = cart.reduce((acc, item) => {
    const lineAmt = getItemAmount(item);
    const gstPct = Number(item.gst) || 5;

    // B2B tax is exclusive (added on top), B2C is inclusive (already in lineAmt, we just extract it for display if needed)
    // Actually, in the footer we show "estTax" that gets added to Subtotal ONLY if it's exclusive.
    return billingMode === "B2B" ? acc + (lineAmt * gstPct) / 100 : acc;
  }, 0);

  // For B2C, cartSubtotal already includes tax. For B2B, it doesn't.
  const cartGrandTotal = Math.round(cartSubtotal + estTax);

  const handleCompleteSale = async (saleData) => {
    let targetCustomerId = activeCustomer?.id || activeCustomer?._id;

    // Fallback: If no customer explicitly selected (e.g. walk-in B2C), fetch or use first customer from backend
    if (!targetCustomerId || targetCustomerId === "legacy") {
      try {
        const cRes = await customerService.getCustomers({ limit: 1 });
        const cList = cRes.data?.data?.customers || cRes.data?.customers || cRes.data?.data || [];
        if (cList.length > 0) {
          targetCustomerId = cList[0]._id || cList[0].id;
        }
      } catch (cErr) {
        console.warn("Could not fetch fallback customer for sale:", cErr);
      }
    }

    // Post to backend API
    if (targetCustomerId) {
      const activeBranchId = saleData.items?.[0]?.branchId || saleData.items?.[0]?.facilityId || null;
      const payload = {
        invoiceNo: saleData.invoiceNo,
        billingMode,
        branchId: activeBranchId,
        subtotal: saleData.subtotal || saleData.subTotal,
        discount: saleData.extraDiscount || saleData.discount || saleData.totalDiscount,
        tax: saleData.tax || saleData.taxAmount,
        grandTotal: saleData.grandTotal,
        roundOff: saleData.roundOff,
        paymentMethod: saleData.paymentMethod,
        payments: saleData.payments,
        items: saleData.items,
        date: activeShift?.date ? new Date(activeShift.date).toISOString() : new Date().toISOString(),
      };

      if (isEditMode && initialInvoice?.id) {
        await invoiceService.updateCustomerSale(targetCustomerId, initialInvoice.id, payload);
      } else {
        await invoiceService.recordCustomerSale(targetCustomerId, payload);
      }
    }

    // On confirmed backend success, close checkout, set completed sale state, open receipt, and clear cart
    setIsCheckoutOpen(false);
    setCompletedSale({
      ...saleData,
      date: activeShift?.date ? new Date(activeShift.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      billingMode,
      partyType: billingMode === "B2B" ? selectedB2bParty?.partyType || "wholesaler" : "retail",
    });
    setIsReceiptOpen(true);
    setCart([]);
    setToastMessage(`✅ ${billingMode} Invoice ${saleData.invoiceNo} created & saved in backend.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (shiftStatus === "loading" && !activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] space-y-4 p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-text-muted">Loading POS...</p>
      </div>
    );
  }

  if (!activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] space-y-4 p-8">
        <Store className="size-16 text-text-muted" />
        <h2 className="text-2xl font-bold text-text">No open shift is present</h2>
        <p className="text-text-muted">You must open a shift before you can access POS billing.</p>
        <UIButton variant="primary" onClick={() => navigate("/operations/shifts")}>Go to Shifts</UIButton>
      </div>
    );
  }

  return (
    <section className="h-[100dvh] w-full bg-bg flex flex-col font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-8 z-[9999] flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-surface/95 px-4 py-3 text-sm font-semibold text-text shadow-xl backdrop-blur-md"
        >
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Top Header & B2C / B2B Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface p-4 border-b border-border shadow-2xs z-20 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary animate-pulse" />
            <h1 className="text-2xl font-extrabold text-text tracking-tight">
              POS Billing Terminal
            </h1>
            <span
              className={cn(
                "ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border",
                billingMode === "B2B"
                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              )}
            >
              {billingMode === "B2B" ? "B2B Commercial Mode" : "B2C Retail Mode"}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Switch between Consumer (B2C) & Commercial Party (B2B Wholesaler / Retailer) invoicing
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          

          {/* Billing Mode Switcher (B2C vs B2B) */}
          <div className="flex items-center gap-2 bg-surface-alt p-1.5 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setBillingMode("B2C")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                billingMode === "B2C"
                  ? "bg-surface text-primary shadow-xs border border-border"
                  : "text-text-muted hover:text-text"
              )}
            >
              <User className="size-4" />
              <span>B2C Retail Billing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setBillingMode("B2B");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                billingMode === "B2B"
                  ? "bg-surface text-purple-600 dark:text-purple-400 shadow-xs border border-border"
                  : "text-text-muted hover:text-text"
              )}
            >
              <Building2 className="size-4" />
              <span>B2B Commercial Billing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-width Customer Search Area */}
      <div className="p-4 border-b border-border bg-surface z-10 shrink-0 w-full">
        {billingMode === "B2C" ? (
          /* B2C Retail Customer Search Bar */
          <SalesCustomerDoctorInfo
            selectedCustomer={selectedB2cCustomer}
            onSelectCustomer={setSelectedB2cCustomer}
            customerName={customerName}
            onChangeCustomerName={setCustomerName}
            customerPhone={customerPhone}
            onChangeCustomerPhone={setCustomerPhone}
            doctorName={doctorName}
            onChangeDoctorName={setDoctorName}
            saleDate={saleDate}
            onChangeSaleDate={setSaleDate}
            onAddNewCustomer={(name) => {
              setQuickCreateCustomerName(name);
              setQuickCreateCustomerType("other");
              setIsQuickCreateCustomerModalOpen(true);
            }}
          />
        ) : (
          /* B2B Commercial Party Bar (Wholesaler vs Retailer) */
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex flex-col gap-3 flex-1 max-w-xl">
                <div className="w-full">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Search & Select Commercial Party (B2B)
                  </span>
                  <B2bCustomerSearchBar
                    ref={b2bCustomerSearchBarRef}
                    selectedCustomer={selectedB2bParty}
                    onSelectCustomer={(party) => {
                      setSelectedB2bParty(party);
                      setTimeout(() => searchBarRef.current?.focus(), 80);
                    }}
                    b2bPartyType={b2bPartyType}
                    showAddNewAction={true}
                    onAddNewCustomer={(name) => {
                      setQuickCreateCustomerName(name);
                      setQuickCreateCustomerType(b2bPartyType === "wholesaler" ? "wholesale" : "retail");
                      setIsQuickCreateCustomerModalOpen(true);
                    }}
                    placeholder="Search B2B party by name, GST, or phone..."
                    size="sm"
                  />
                </div>

                {/* Party Type Filter (Wholesaler vs Retailer) */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-1">
                    Party Type:
                  </span>
                  <button
                    type="button"
                    onClick={() => setB2bPartyType("all")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      b2bPartyType === "all"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-surface-alt text-text-muted hover:text-text border border-border"
                    )}
                  >
                    All B2B Parties
                  </button>
                  <button
                    type="button"
                    onClick={() => setB2bPartyType("wholesaler")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      b2bPartyType === "wholesaler"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-surface-alt text-text-muted hover:text-text border border-border"
                    )}
                  >
                    <Briefcase className="size-3.5" />
                    Wholesaler
                  </button>
                  <button
                    type="button"
                    onClick={() => setB2bPartyType("retailer")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      b2bPartyType === "retailer"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-surface-alt text-text-muted hover:text-text border border-border"
                    )}
                  >
                    <Store className="size-3.5" />
                    Retailer
                  </button>
                </div>
              </div>

              <div className="text-xs text-text-muted shrink-0 text-right bg-surface-alt/70 px-3 py-2 rounded-xl border border-border/60">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Invoice Mode
                </span>
                <span className="font-bold text-text">Commercial Tax Invoice</span>
              </div>
            </div>

            {/* B2B Selected Party Specs Card */}
            {selectedB2bParty && (
              <div className="flex items-center gap-4 px-1 py-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mr-1.5">
                    Credit:
                  </span>
                  <span className="font-bold text-danger">
                    {(selectedB2bParty.outstandingAmount || selectedB2bParty.openingBalance || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })} {(selectedB2bParty.balanceType || selectedB2bParty.openingBalanceType || "DR").toUpperCase()}
                  </span>
                </div>
                
                {(selectedB2bParty.creditLimit > 0) && (
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mr-1.5">
                      Credit Limit:
                    </span>
                    <span className="font-bold text-text">
                      {selectedB2bParty.creditLimit.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                    </span>
                  </div>
                )}

                {(selectedB2bParty.creditDays > 0) && (
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mr-1.5">
                      Credit Days:
                    </span>
                    <span className="font-bold text-text">
                      {selectedB2bParty.creditDays}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
          
      </div>
      <div className="flex-1 flex overflow-hidden">

        {/* Main POS Area (Right, flex-1) */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto bg-surface-alt/50">
          <div className="w-full">
        <UICard
          variant="default"
          className="p-6 rounded-2xl bg-surface border-border shadow-xs flex flex-col justify-between min-h-[620px] space-y-5"
        >
          <div className="space-y-4">
            {/* Line 1: Cart Header with Billed To Info */}
            <div className="flex items-center justify-between pb-3.5 border-b border-border/70">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <ShoppingCart className="size-5.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-text">
                      {billingMode === "B2B" ? "B2B Tax Invoice Cart" : "Retail Sale Cart"}
                    </h2>
                    <span className="rounded-full bg-primary-soft text-primary px-2.5 py-0.5 text-xs font-extrabold font-mono">
                      {cartItemCount} Items
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    <span className="font-semibold text-text">Billed To: </span>
                    {activeCustomer ? (
                      <>
                        <span className="font-extrabold text-primary">{billingMode === "B2C" ? (customerName || activeCustomer?.name || "Walk-in") : activeCustomer.name}</span>
                          {(billingMode === "B2C" ? (customerPhone || activeCustomer?.phone) : activeCustomer.phone) && (
                            <span className="font-mono text-text-muted"> ({billingMode === "B2C" ? (customerPhone || activeCustomer?.phone) : activeCustomer.phone})</span>
                          )}
                      </>
                    ) : (
                      <span
                        onClick={() => customerSearchBarRef.current?.focus()}
                        className="font-bold text-amber-600 dark:text-amber-400 cursor-pointer hover:underline"
                      >
                        No Customer Selected (Type to Search Customer First)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs font-semibold text-error hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                  <span>Clear Cart</span>
                </button>
              )}
            </div>

            {/* Line 2: Workspace Product Search Bar directly in Cart */}
            <div>
              <WorkspaceProductSearchBar
                ref={searchBarRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSelectProduct={handleSelectWorkspaceProduct}
                placeholder="Scan barcode or search product / medicine by name, SKU, brand..."
                size="md"
                showDetailsPreview
              />
            </div>

            {/* High-Density 14-Column POS Cart Table */}
            <div className="overflow-x-auto rounded-xl border border-border bg-surface-alt/30 max-h-[380px]">
              {cart.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt/80 text-[10.5px] font-bold text-text-muted uppercase tracking-wider select-none">
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-2">Batch</th>
                      <th className="py-2.5 px-2">Pack</th>
                      <th className="py-2.5 px-2">Rack</th>
                      <th className="py-2.5 px-2 font-mono">HSN</th>
                      <th className="py-2.5 px-2 font-mono">GST %</th>
                      {billingMode === "B2C" ? (
                        <th className="py-2.5 px-2 font-mono">Rate %</th>
                      ) : cart.some((i) => Number(i.schemeDiscountPercent) > 0) && (
                        <th className="py-2.5 px-2 font-mono">Scheme Disc %</th>
                      )}
                      <th className="py-2.5 px-2 font-mono text-right">MRP</th>
                      <th className="py-2.5 px-2 font-mono text-right">Rate</th>
                      {billingMode !== "B2C" && <th className="py-2.5 px-2 font-mono text-center">Disc %</th>}
                      <th className="py-2.5 px-2 font-mono text-center">Qty</th>
                      <th className="py-2.5 px-2 font-mono">Expiry</th>
                      <th className="py-2.5 px-3 font-mono text-right">Amount</th>
                      <th className="py-2.5 px-2 text-center">Act</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {cart.map((item) => {
                      const lineAmt = getItemAmount(item);

                      return (
                        <tr key={item.id} className="hover:bg-surface-hover/80 transition-colors">
                          {/* 1. Item Name */}
                          <td className="py-2 px-3">
                            <span className="font-bold text-text text-xs block truncate max-w-[200px]">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-text-muted block">
                              {item.brand} • {item.category}
                            </span>
                          </td>

                          {/* 2. Batch */}
                          <td className="py-2 px-2 font-mono text-[11px] text-text-muted font-semibold">
                            {item.batch}
                          </td>

                          {/* 3. Pack */}
                          <td className="py-2 px-2 font-medium text-text-muted">
                            {item.pack}
                          </td>

                          {/* 4. Rack */}
                          <td className="py-2 px-2 font-mono text-[11px] text-primary font-bold">
                            {item.rack}
                          </td>

                          {/* 5. HSN */}
                          <td className="py-2 px-2 font-mono text-[11px] text-text-muted">
                            {item.hsn}
                          </td>

                          {/* 6. GST % */}
                          <td className="py-2 px-2 font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400">
                            {item.gst !== undefined && item.gst !== null ? `${item.gst}%` : `${getGstRate(item)}%`}
                          </td>

                          {/* 7. Rate % (B2C) / Scheme Disc % (B2B, only if applied) */}
                          {billingMode === "B2C" ? (
                            <td className="py-2 px-2 font-mono text-[11px] text-emerald-600 font-semibold">
                              {item.rateCPercentage !== undefined && item.rateCPercentage !== null ? `${item.rateCPercentage}%` : item.ratePct}
                            </td>
                          ) : cart.some((i) => Number(i.schemeDiscountPercent) > 0) && (() => {
                            const schemeCheck = computeSchemeDiscount(Number(item.qty) || 1, Number(item.schemeDiscountPercent) || 0);
                            return (
                              <td className="py-2 px-2 font-mono text-[11px] text-emerald-600 font-semibold">
                                {schemeCheck.schemeApply ? item.schemeDiscountPercent : "-"}
                              </td>
                            );
                          })()}

                          {/* 8. MRP */}
                          <td className="py-2 px-2 font-mono text-right text-text font-medium">
                            ₹{Number(item.mrp).toFixed(2)}
                          </td>

                          {/* 9. Rate */}
                          <td className="py-2 px-2 font-mono text-right font-bold text-text">
                            ₹{Number(item.price).toFixed(2)}
                          </td>

                          {/* 10. Disc % (B2B only — separate editable discount) */}
                          {billingMode !== "B2C" && (
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.disc ?? 0}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => handleUpdateItemDisc(item.id, e.target.value)}
                                onBlur={(e) => handleBlurItemDisc(item.id, e.target.value)}
                                className="w-12 text-center rounded border border-border bg-surface px-1 py-0.5 font-mono text-xs text-text focus:border-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </td>
                          )}

                          {/* 11. Qty */}
                          <td className="py-2 px-2 text-center">
                            <div className="inline-flex items-center gap-1 bg-surface rounded-md border border-border p-0.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, -1)}
                                className="size-5 rounded flex items-center justify-center hover:bg-surface-hover text-text-muted hover:text-text cursor-pointer"
                              >
                                <Minus className="size-3" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => handleSetQty(item.id, e.target.value)}
                                onBlur={(e) => handleBlurQty(item.id, e.target.value)}
                                className="w-11 text-center bg-transparent border-0 font-mono font-bold text-xs text-text outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                disabled={Number(item.qty) >= Number(item.stock ?? 999999)}
                                onClick={() => handleUpdateQty(item.id, 1)}
                                className={cn(
                                  "size-5 rounded flex items-center justify-center transition-colors",
                                  Number(item.qty) >= Number(item.stock ?? 999999)
                                    ? "opacity-30 cursor-not-allowed text-text-muted"
                                    : "hover:bg-surface-hover text-text-muted hover:text-text cursor-pointer"
                                )}
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                          </td>

                          {/* 12. Expiry */}
                          <td className="py-2 px-2 font-mono text-[11px] text-text font-semibold">
                            {item.expiry || item.expDate || item.expiryDate || "11/32"}
                          </td>

                          {/* 13. Amount */}
                          <td className="py-2 px-3 font-mono text-right font-extrabold text-primary text-xs tabular-nums">
                            ₹{lineAmt.toFixed(2)}
                          </td>

                          {/* 14. Act */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-text-muted hover:text-error transition-colors p-1 cursor-pointer"
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
                  <p className="text-xs font-semibold">Sale Cart is empty</p>
                  <p className="text-[11px] text-text-muted">
                    Use the search bar above to scan or search medicines directly into cart
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Footer Calculation & Checkout Button */}
          <div className="pt-4 border-t border-border/70 space-y-3">
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
                onClick={handleProceedToCheckout}
                rightIcon={<Receipt className="size-4" />}
              >
                Proceed to {billingMode} Checkout (₹{cartGrandTotal}) <span className="ml-1.5 opacity-80 text-xs font-mono font-normal">(Ctrl + ↵)</span>
              </UIButton>
            </PermissionGate>
          </div>
        </UICard>
          </div>
        </div>
      
          {/* Floating History Toggle Button */}
          <button
            type="button"
            onClick={() => setShowCustomerHistory(!showCustomerHistory)}
            className={`absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center size-10 rounded-full border shadow-md transition-all cursor-pointer ${
              showCustomerHistory
                ? "right-[320px] lg:right-[384px] bg-primary text-white border-primary/20 hover:bg-primary/90 hover:scale-105"
                : "right-4 bg-surface text-text border-border hover:bg-surface-hover hover:scale-105"
            }`}
            title="Toggle Customer History"
          >
            {showCustomerHistory ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>

          {/* Right Sidebar - Customer History */}
          <AnimatePresence>
            {showCustomerHistory && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-80 lg:w-96 border-l border-border bg-surface flex flex-col shadow-[inset_1px_0_0_0_rgba(0,0,0,0.05)] z-10 shrink-0"
              >
                <div className="flex-1 overflow-y-auto bg-surface-alt/50">
                   <SalesCustomerSidebar 
                      customer={billingMode === 'B2C' ? (activeCustomer || { name: customerName, phone: customerPhone }) : activeCustomer}
                      onAddProduct={handleAddFromHistory}
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Checkout Modal */}
      <SalesCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        customer={activeCustomer}
        customerPhone={customerPhone}
        doctor={doctorName}
        saleDate={saleDate}
        billingMode={billingMode}
        activeShift={activeShift}
        cartSummary={{ items: cart, subtotal: cartSubtotal }}
        initialPayments={initialInvoice?.payments}
        initialDenominations={initialInvoice?.denominations}
        initialReturnedDenominations={initialInvoice?.returnedDenominations}
        onCompleteSale={handleCompleteSale}
      />

      {/* Printable Receipt Modal */}
      <SalesReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        saleData={completedSale}
      />

      {/* Workspace Branch Batch Selector Modal */}
      <WorkspaceProductBatchSelectorModal
        open={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        product={selectedProductForBatches}
        billingMode={billingMode}
        onConfirmAddToCart={handleConfirmAddBatchToCart}
      />

      <QuickCreateCustomerModal
        open={isQuickCreateCustomerModalOpen}
        onClose={() => setIsQuickCreateCustomerModalOpen(false)}
        defaultName={quickCreateCustomerName}
        customerType={quickCreateCustomerType}
        billingMode={billingMode}
        onSuccess={(newCustomer) => {
          if (billingMode === "B2C") {
            setSelectedB2cCustomer(newCustomer);
          } else {
            setSelectedB2bParty(newCustomer);
          }
        }}
      />
    </section>
  );
};

export default SalesDesktopPage;

