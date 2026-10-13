import { useState, useEffect, useMemo, useRef } from "react";
import {
  Banknote,
  QrCode,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Percent,
  PlusCircle,
  MinusCircle,
  Calculator,
  Trash2,
  Receipt,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UIModal, UIButton, UIIconButton, UISelect } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";
import usePaymentQr from "@/features/finance/treasury/payment-qr/hooks/usePaymentQr";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { CashBreakdownModal, decomposeAmount } from "./CashBreakdownModal";
import { getBranchInitials } from "@/utils";
import invoiceService from "../services/invoiceService";
import customerService from "@/features/parties/customers/services/customerService";

/** Safe number parser */
const safeNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/** Compute scheme discount threshold check. */
const computeSchemeDiscount = (qty, schemePercent) => {
  const normalizedQty = safeNum(qty);
  const normalizedScheme = safeNum(schemePercent);
  if (normalizedQty <= 0 || normalizedScheme <= 0) {
    return { schemeApply: false, finalDiscountPercent: 0 };
  }
  if (normalizedScheme === 50) {
    if (normalizedQty < 2) return { schemeApply: false, finalDiscountPercent: 0 };
    return { schemeApply: true, finalDiscountPercent: normalizedScheme };
  }
  const fullFreeQty = (normalizedQty * normalizedScheme) / (100 - normalizedScheme);
  const quarterThreshold = (normalizedScheme / (100 - normalizedScheme)) / 0.4;
  if (fullFreeQty >= quarterThreshold) {
    return { schemeApply: true, finalDiscountPercent: normalizedScheme };
  }
  return { schemeApply: false, finalDiscountPercent: 0 };
};

/** Stable empty default so the payments-init effect doesn't re-run every render */
const EMPTY_PAYMENTS = [];

/** Convert a denominations array [{denomination, quantity}] into a {denom: qty} map + total */
const denomsToMap = (list = []) => {
  const map = {};
  let total = 0;
  list.forEach((d) => {
    const qty = Number(d?.quantity) || 0;
    const denom = Number(d?.denomination) || 0;
    if (qty > 0 && denom > 0) {
      map[denom] = (map[denom] || 0) + qty;
      total += denom * qty;
    }
  });
  return { map, total };
};

/** Map payments saved on an invoice back into checkout-modal row state */
const buildPaymentMethodLabel = (paymentRows = []) => {
  const unique = [...new Set(
    paymentRows
      .map((row) => String(row?.paymentType || row?.paymentMode || "").trim())
      .filter(Boolean)
  )];

  if (unique.length === 0) return "Cash";
  if (unique.length === 1) return unique[0];
  return unique.join(", ");
};

const mapSavedPayments = (saved, rootDenoms = [], rootReturnedDenoms = []) => {
  let cashRowCount = 0;
  return saved.map((p, idx) => {
    let paymentType = p.paymentType || p.paymentMode || "Cash";
    // Normalize to exact UI casing for display
    if (String(paymentType).toLowerCase() === "cash") paymentType = "Cash";
    if (String(paymentType).toLowerCase() === "upi") paymentType = "UPI";
    if (String(paymentType).toLowerCase() === "credit") paymentType = "Credit";
    if (String(paymentType).toLowerCase() === "advance" || String(paymentType).toLowerCase() === "wallet") paymentType = "Advance";
    if (String(paymentType).toLowerCase() === "card") paymentType = "Card";
    
    let cashDetails = p.cashDetails || null;
    
    if (paymentType === "Cash") {
      cashRowCount++;
      let denoms = Array.isArray(p.denominations) && p.denominations.length > 0 ? p.denominations : [];
      let retDenoms = Array.isArray(p.returnedDenominations) && p.returnedDenominations.length > 0 ? p.returnedDenominations : [];
      
      if (cashRowCount === 1) {
        if (denoms.length === 0 && Array.isArray(rootDenoms) && rootDenoms.length > 0) denoms = rootDenoms;
        if (retDenoms.length === 0 && Array.isArray(rootReturnedDenoms) && rootReturnedDenoms.length > 0) retDenoms = rootReturnedDenoms;
      }

      if (!cashDetails && (denoms.length > 0 || retDenoms.length > 0)) {
        const rec = denomsToMap(denoms);
        const ret = denomsToMap(retDenoms);
        cashDetails = {
          received: rec.map,
          receivedTotal: rec.total,
          returned: ret.map,
          returnedTotal: ret.total,
          netApplied: rec.total - ret.total,
        };
      }
    }
    
    return {
      ...p,
      id: p.id || p._id || `saved-${idx}`,
      paymentType,
      amount: Number(p.amount) || 0,
      cashDetails,
    };
  });
};

const PAYMENT_TYPE_OPTIONS = [
  { value: "Cash", label: "Cash", icon: <Banknote className="size-4 text-emerald-600" /> },
  { value: "UPI", label: "UPI / QR", icon: <QrCode className="size-4 text-purple-600" /> },
  { value: "Credit", label: "Credit (Pay Later)", icon: <Receipt className="size-4 text-rose-600" /> },
  { value: "Advance", label: "Advance Deposit", icon: <Wallet className="size-4 text-amber-600" /> },
  { value: "Card", label: "Card", icon: <CreditCard className="size-4 text-blue-600" /> },
];

export const SalesCheckoutModal = ({
  isOpen,
  onClose,
  customer,
  customerPhone,
  doctor,
  saleDate,
  billingMode = "B2C",
  cartSummary = {},
  initialPayments = EMPTY_PAYMENTS,
  initialDenominations = [],
  initialReturnedDenominations = [],
  onCompleteSale,
  activeShift: activeShiftProp,
  shiftId: shiftIdProp,
  existingInvoiceNo = null,
}) => {
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const branchId = currentBranch?._id || currentBranch?.id;
  const { paymentQrs, getPaymentQrs } = usePaymentQr();
  const { fetchBranchCash, runningCash, runningDenominations } = useBranchCash();
  const reduxActiveShift = useSelector((state) => state.shift?.activeShift);
  const activeShift = activeShiftProp ?? reduxActiveShift;

  useEffect(() => {
    if (isOpen && branchId) {
      getPaymentQrs({ branchId, status: "ACTIVE" });
      fetchBranchCash(branchId);
    }
  }, [isOpen, branchId, getPaymentQrs, fetchBranchCash]);

  // Branch-scoped serial invoice number (e.g. AEB-2627-0001)
  const defaultInvoiceNo = useMemo(() => {
    if (existingInvoiceNo) return existingInvoiceNo;
    const branchInitials = getBranchInitials(currentBranch);
    const dateObj = saleDate ? new Date(saleDate) : new Date();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const fyString = month >= 3
      ? `${year.toString().slice(-2)}${(year + 1).toString().slice(-2)}`
      : `${(year - 1).toString().slice(-2)}${year.toString().slice(-2)}`;
    return `${branchInitials}-${fyString}-0001`;
  }, [currentBranch, saleDate, existingInvoiceNo]);

  const [nextInvoiceNo, setNextInvoiceNo] = useState("");

  useEffect(() => {
    if (existingInvoiceNo) return;
    if (!isOpen || !branchId) return;
    let isMounted = true;
    invoiceService
      .getNextInvoiceNumber({
        branchId,
        date: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
      })
      .then((res) => {
        const fetchedNo =
          res?.data?.data?.nextInvoiceNo ||
          res?.data?.data?.nextInvoiceNumber ||
          res?.data?.nextInvoiceNo ||
          res?.data?.nextInvoiceNumber;
        if (isMounted && fetchedNo) {
          setNextInvoiceNo(fetchedNo);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch next invoice number:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen, branchId, saleDate, existingInvoiceNo]);

  const displayInvoiceNo = existingInvoiceNo || nextInvoiceNo || defaultInvoiceNo;

  // Main operating cash counter (Branch Running Cash)
  const availableCash = useMemo(() => {
    return runningCash || 0;
  }, [runningCash]);

  // Filter QRs strictly for the current branch
  const branchQrs = useMemo(() => {
    if (!paymentQrs || !branchId) return [];
    return paymentQrs.filter((q) => {
      const qBranchId = q.branchId?._id || q.branchId?.id || q.branchId;
      return !qBranchId || String(qBranchId) === String(branchId);
    });
  }, [paymentQrs, branchId]);

  // Primary QR — pre-selected for UPI payments (zero friction for cashier)
  const primaryQr = useMemo(() => {
    if (!branchQrs || branchQrs.length === 0) return null;
    return branchQrs.find((q) => q.isPrimary && q.status === "ACTIVE") ||
           branchQrs.find((q) => q.status === "ACTIVE") ||
           branchQrs[0] || null;
  }, [branchQrs]);

  const upiOptions = useMemo(() => {
    const activeList = (branchQrs || []).filter((q) => q.status === "ACTIVE");
    if (activeList.length === 0) {
      return [{ value: "", label: "No active UPI QR configured for this branch", disabled: true }];
    }
    return activeList.map((qr) => ({
      value: String(qr._id),
      label: qr.label ? `${qr.label} (${qr.upiId})${qr.isPrimary ? " ★" : ""}` : qr.upiId,
      icon: <QrCode className="size-3.5 text-purple-600" />,
    }));
  }, [branchQrs]);

  const [discountPercent, setDiscountPercent] = useState(customer?.defaultDiscount || 0);
  const [notes, setNotes] = useState("");

  // Real-time Customer Credit & Advance profile
  const [customerDetails, setCustomerDetails] = useState(null);

  useEffect(() => {
    const custId = customer?._id || customer?.id;
    if (isOpen && custId) {
      let isMounted = true;
      customerService
        .getCustomerById(custId)
        .then((res) => {
          if (isMounted) {
            setCustomerDetails(res?.data?.data || res?.data || null);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    } else {
      setCustomerDetails(null);
    }
  }, [isOpen, customer?._id, customer?.id]);

  const effectiveCustomer = customerDetails || customer;
  const creditLimit = Number(effectiveCustomer?.creditLimit || 0);
  const creditOutstanding = Number(effectiveCustomer?.creditOutstanding || 0);
  const availableCredit = Number(
    effectiveCustomer?.availableCredit !== undefined
      ? effectiveCustomer.availableCredit
      : Math.max(0, creditLimit - creditOutstanding)
  );
  const advanceBalance = Number(effectiveCustomer?.advanceBalance || 0);
  const creditDays = Number(effectiveCustomer?.creditDays || 15);

  // Detailed Billing & Tax Calculations
  const items = cartSummary?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * Math.max(1, Number(item.qty) || 1), 0);
  const isB2B = billingMode === "B2B";

  const itemDiscount = items.reduce((sum, item) => {
    return sum + ((Number(item.price) || 0) * Math.max(1, Number(item.qty) || 1) * (Number(item.disc) || 0)) / 100;
  }, 0);

  const schemeDiscount = isB2B ? items.reduce((sum, item) => {
    if (!item?.schemeDiscountPercent) return sum;
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    const schemePct = Number(item.schemeDiscountPercent) || 0;
    const schemeCheck = computeSchemeDiscount(qty, schemePct);
    if (!schemeCheck.schemeApply) return sum;
    return sum + (rate * qty * schemePct) / 100;
  }, 0) : 0;

  const subtotalAfterDiscounts = subtotal - itemDiscount - schemeDiscount;
  const extraDiscountAmt = (subtotalAfterDiscounts * (Number(discountPercent) || 0)) / 100;

  const gstSlabMap = {};
  items.forEach((item) => {
    const rate = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    const discPct = Number(item.disc) || 0;
    const rawSchemePct = isB2B ? (Number(item.schemeDiscountPercent) || 0) : 0;
    const schemeCheck = computeSchemeDiscount(qty, rawSchemePct);
    const schemePct = schemeCheck.schemeApply ? rawSchemePct : 0;
    const lineSubtotal = rate * qty * (1 - discPct / 100) * (1 - schemePct / 100);
    const lineFinal = lineSubtotal * (1 - (Number(discountPercent) || 0) / 100);
    const gstPct = Number(item.gst !== undefined && item.gst !== null ? item.gst : 5);

    let taxable, taxAmt;
    if (isB2B) {
      taxable = lineFinal;
      taxAmt = lineFinal * (gstPct / 100);
    } else {
      taxable = lineFinal / (1 + gstPct / 100);
      taxAmt = lineFinal - taxable;
    }
    const halfTax = taxAmt / 2;
    if (!gstSlabMap[gstPct]) gstSlabMap[gstPct] = { gstPct, taxable: 0, cgst: 0, sgst: 0, total: 0 };
    gstSlabMap[gstPct].taxable += taxable;
    gstSlabMap[gstPct].cgst += halfTax;
    gstSlabMap[gstPct].sgst += halfTax;
    gstSlabMap[gstPct].total += taxAmt;
  });

  const gstSlabs = Object.values(gstSlabMap).sort((a, b) => a.gstPct - b.gstPct);
  const totalTaxable = gstSlabs.reduce((acc, s) => acc + s.taxable, 0);
  const totalGst = gstSlabs.reduce((acc, s) => acc + s.total, 0);
  const exactGrandTotal = Math.max(0, totalTaxable + totalGst);
  const grandTotal = Math.round(exactGrandTotal);
  const roundOff = grandTotal - exactGrandTotal;

  // Multi-Row Payments State
  const [payments, setPayments] = useState([]);
  const [isSplitMode, setIsSplitMode] = useState(false);
  
  // Initialize payments ONLY when the modal transitions closed -> open.
  // Guarded by a ref so unstable prop/selector references can never cause a setState loop.
  const wasOpenRef = useRef(false);
  const hasSavedPayments = Array.isArray(initialPayments) && initialPayments.length > 0;
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const justOpened = isOpen && !wasOpenRef.current;
    wasOpenRef.current = isOpen;
    if (!justOpened) return;

    if (hasSavedPayments) {
      const mapped = mapSavedPayments(initialPayments, initialDenominations, initialReturnedDenominations);
      setPayments(mapped);
      setIsSplitMode(mapped.length > 1);
    } else {
      setIsSplitMode(false);
      setPayments([
        {
          id: Date.now(),
          paymentType: "Cash",
          amount: grandTotal,
          branchId: branchId || "",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // New bills: keep the single default cash row in sync when grandTotal changes (e.g. extra discount).
  // Functional update returns `prev` when nothing changes, so this can't loop.
  useEffect(() => {
    if (!isOpen || hasSavedPayments) return;
    setPayments((prev) => {
      if (prev.length !== 1) return prev;
      const row = prev[0];
      if (row.paymentType !== "Cash" || Number(row.amount) === grandTotal) return prev;
      return [{ ...row, amount: grandTotal, cashDetails: null }];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grandTotal]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const [cashBreakdownTarget, setCashBreakdownTarget] = useState(null); // index of row

  const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [payments]);
  const shortfall = Math.max(0, grandTotal - totalPaid);

  const handleUpdate = (index, field, value) => {
    const next = [...payments];
    const updated = { ...next[index], [field]: value };
    if (field === "paymentType" && value === "Cash") {
      updated.branchId = branchId || "";
      delete updated.paymentQrId;
      delete updated.creditDueDate;
    }
    // Auto-select primary QR when switching to UPI
    if (field === "paymentType" && (value === "UPI")) {
      if (!updated.paymentQrId && primaryQr?._id) {
        updated.paymentQrId = String(primaryQr._id);
      }
      delete updated.creditDueDate;
    }
    if (field === "paymentType" && value === "Credit") {
      if (!updated.creditDueDate) {
        const baseDate = saleDate ? new Date(saleDate) : new Date();
        const defaultDueDate = new Date(baseDate);
        defaultDueDate.setDate(defaultDueDate.getDate() + (creditDays || 15));
        updated.creditDueDate = defaultDueDate.toISOString().split("T")[0];
      }
      delete updated.paymentQrId;
    }
    if (field === "paymentType" && value === "Advance") {
      delete updated.paymentQrId;
      delete updated.creditDueDate;
    }
    if (field === "paymentType" && value !== "Cash") {
      delete updated.cashDetails;
    }
    if (field === "amount" && updated.paymentType === "Cash" && updated.cashDetails) {
      if (Number(value) !== Number(next[index].amount)) {
        updated.cashDetails = null;
      }
    }
    next[index] = updated;
    setPayments(next);
  };

  const hasUncapturedCash = useMemo(() => {
    return payments.some((p) => {
      if (p.paymentType !== "Cash") return false;
      const target = Number(p.amount) || 0;
      if (target <= 0) return false;
      if (!p.cashDetails) return true;
      const received = Number(p.cashDetails.receivedTotal) || 0;
      const returned = Number(p.cashDetails.returnedTotal) || 0;
      const expectedChange = Math.max(0, received - target);
      return received < target || returned !== expectedChange;
    });
  }, [payments]);

  const handleSelectPrimaryMode = (mode) => {
    if (mode === "Split") {
      setIsSplitMode(true);
      if (payments.length === 1) {
        const curType = payments[0]?.paymentType || "Cash";
        const otherType = curType === "Cash" ? "UPI" : "Cash";
        const half1 = Math.round(grandTotal / 2);
        const half2 = grandTotal - half1;
        setPayments([
          {
            ...payments[0],
            amount: half1,
            cashDetails: null,
          },
          {
            id: Date.now() + 1,
            paymentType: otherType,
            amount: half2,
            paymentQrId: otherType === "UPI" && primaryQr?._id ? String(primaryQr._id) : undefined,
            branchId: otherType === "Cash" ? branchId || "" : undefined,
          },
        ]);
      }
      return;
    }

    setIsSplitMode(false);
    if (mode === "Cash") {
      setPayments([
        {
          id: Date.now(),
          paymentType: "Cash",
          amount: grandTotal,
          branchId: branchId || "",
        },
      ]);
    } else if (mode === "UPI") {
      setPayments([
        {
          id: Date.now(),
          paymentType: "UPI",
          amount: grandTotal,
          paymentQrId: primaryQr?._id ? String(primaryQr._id) : undefined,
        },
      ]);
    } else if (mode === "Credit") {
      const baseDate = saleDate ? new Date(saleDate) : new Date();
      const defaultDueDate = new Date(baseDate);
      defaultDueDate.setDate(defaultDueDate.getDate() + (creditDays || 15));
      setPayments([
        {
          id: Date.now(),
          paymentType: "Credit",
          amount: grandTotal,
          creditDueDate: defaultDueDate.toISOString().split("T")[0],
        },
      ]);
    } else if (mode === "Advance") {
      setPayments([
        {
          id: Date.now(),
          paymentType: "Advance",
          amount: grandTotal,
        },
      ]);
    } else if (mode === "Card") {
      setPayments([
        {
          id: Date.now(),
          paymentType: "Card",
          amount: grandTotal,
        },
      ]);
    }
  };

  const handleAddRow = () => {
    setIsSplitMode(true);
    setPayments([
      ...payments,
      {
        id: Date.now(),
        paymentType: "UPI",
        amount: shortfall,
        branchId: branchId || "",
        paymentQrId: primaryQr?._id ? String(primaryQr._id) : undefined,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const next = [...payments];
    next.splice(index, 1);
    if (next.length === 0) next.push({ id: Date.now(), paymentType: "Cash", amount: grandTotal });
    setPayments(next);
  };

  const handleConfirmCashBreakdown = (data) => {
    if (cashBreakdownTarget !== null) {
      handleUpdate(cashBreakdownTarget, 'cashDetails', data);
      setCashBreakdownTarget(null);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleProcessSale = async () => {
    if (totalPaid < grandTotal) {
      setErrorMessage(`Cannot process sale. Collected amount (₹${totalPaid.toFixed(2)}) is less than Grand Total (₹${grandTotal.toFixed(2)}).`);
      return;
    }

    if (hasUncapturedCash) {
      setErrorMessage("Please capture the exact cash denominations given by the customer for all cash payments.");
      return;
    }

    const creditRow = payments.find((p) => p.paymentType === "Credit");
    const hasCredit = Boolean(creditRow);
    const advanceRow = payments.find((p) => p.paymentType === "Advance");
    const hasAdvance = Boolean(advanceRow);
    const hasCust = Boolean(effectiveCustomer?._id || effectiveCustomer?.id);

    if ((hasCredit || hasAdvance) && !hasCust) {
      setErrorMessage(
        hasCredit
          ? "Credit billing requires selecting a registered customer profile first."
          : "Advance payment requires selecting a registered customer profile with available deposit."
      );
      return;
    }

    if (hasCredit) {
      const totalCreditReq = payments
        .filter((p) => p.paymentType === "Credit")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      if (totalCreditReq > availableCredit) {
        setErrorMessage(
          `Credit limit exceeded! Requested ₹${totalCreditReq.toFixed(2)}, but customer available credit limit is ₹${availableCredit.toFixed(2)}.`
        );
        return;
      }
    }

    if (hasAdvance) {
      const totalAdvanceReq = payments
        .filter((p) => p.paymentType === "Advance")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      if (totalAdvanceReq > advanceBalance) {
        setErrorMessage(
          `Insufficient advance balance! Requested ₹${totalAdvanceReq.toFixed(2)}, but customer advance deposit is ₹${advanceBalance.toFixed(2)}.`
        );
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const salePayload = {
        invoiceNo: displayInvoiceNo,
        branchId: branchId || undefined,
        customer: customerPhone ? { ...customer, phone: customerPhone } : customer,
        doctor: doctor || null,
        date: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
        billingMode,
        partyType: isB2B ? customer?.partyType || "wholesaler" : "retail_consumer",
        items,
        subtotal,
        itemDiscount,
        schemeDiscount,
        extraDiscount: extraDiscountAmt,
        taxableAmount: totalTaxable,
        tax: totalGst,
        roundOff,
        grandTotal,
        gstSlabs,
        paymentMethod: (isSplitMode || payments.length > 1) ? "Split" : (payments[0]?.paymentType || "Cash"),
        shiftId: shiftIdProp || activeShift?._id || null,
        creditDueDate: creditRow?.creditDueDate || undefined,
        creditStatus: hasCredit ? "PENDING" : undefined,
        cashTendered: payments.reduce((sum, p) => p.paymentType === "Cash" ? sum + (p.cashDetails?.receivedTotal || Number(p.amount)) : sum, 0),
        changeDue: payments.reduce((sum, p) => p.paymentType === "Cash" ? sum + (p.cashDetails?.returnedTotal || 0) : sum, 0),
        denominations: [],
        payments: payments.map(p => ({
          paymentType: p.paymentType,
          amount: Number(p.amount),
          paymentQrId: p.paymentQrId,
          txnRefNo: p.txnRefNo,
          creditDueDate: p.paymentType === "Credit" ? p.creditDueDate : undefined,
          branchId: p.paymentType === "Cash" ? branchId : undefined,
          cashPartition: p.paymentType === "Cash" ? "running" : undefined,
          denominations: p.cashDetails?.received 
            ? Object.entries(p.cashDetails.received).map(([val, qty]) => ({ denomination: Number(val), quantity: qty }))
            : [],
          returnedDenominations: p.cashDetails?.returned 
            ? Object.entries(p.cashDetails.returned).map(([val, qty]) => ({ denomination: Number(val), quantity: qty }))
            : [],
        })),
        notes,
      };

      await onCompleteSale(salePayload);
    } catch (err) {
      console.error("Sale invoice creation error:", err);
      setErrorMessage(err?.response?.data?.message || err.message || "Failed to create invoice in backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="2xl" title="Sale Preview & Checkout" showCloseButton={false}>
      <div className="p-0 font-sans flex flex-col md:flex-row h-[84vh] max-h-[660px] overflow-hidden">

        {/* ── LEFT: Receipt Preview (Balanced width, ~48%) ── */}
        <div className="w-full md:w-[48%] shrink-0 border-r border-border bg-surface-alt/10 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
            {/* Receipt Paper */}
            <div className="w-full max-w-sm bg-surface shadow-md border border-border rounded-xl overflow-hidden">
              {/* Receipt Header Band */}
              <div className="bg-primary px-5 py-3 text-primary-contrast text-center">
                <h2 className="text-[12.5px] font-black uppercase tracking-widest">
                  {isB2B ? "Tax Invoice" : "Retail Receipt"}
                </h2>
                <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-mono font-bold tracking-wider">
                  <span>Inv:</span>
                  <span>{displayInvoiceNo}</span>
                </div>
                <p className="text-[10px] opacity-75 mt-1">
                  {new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {/* Billed To */}
              <div className="px-4 py-2.5 border-b border-dashed border-border/70">
                <div className="text-[9.5px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Billed To</div>
                <p className="font-bold text-xs text-text leading-tight">{customer?.name || "Walk-in Customer"}</p>
                {customer?.mobile && <p className="text-[10.5px] text-text-muted font-mono mt-0.5">{customer.mobile}</p>}
                {customer?.gstin && <p className="text-[10px] text-text-muted font-mono">GSTIN: {customer.gstin}</p>}
              </div>

              {/* Items list (compact) */}
              <div className="px-4 py-2.5 border-b border-dashed border-border/70">
                <div className="flex justify-between text-[9px] font-bold uppercase text-text-muted mb-1.5">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="space-y-1 font-mono text-[10.5px]">
                  {items.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-text-muted truncate max-w-[170px]">
                        {item.name} <span className="text-[9.5px]">×{item.qty}</span>
                      </span>
                      <span className="font-bold text-text tabular-nums">
                        ₹{((Number(item.price) || 0) * Math.max(1, Number(item.qty) || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {items.length > 6 && (
                    <div className="text-text-muted text-[9.5px] italic">+{items.length - 6} more items…</div>
                  )}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="px-4 py-2.5 space-y-1 font-mono text-[10.5px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text">₹{subtotal.toFixed(2)}</span>
                </div>
                {itemDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Item Disc.</span>
                    <span>-₹{itemDiscount.toFixed(2)}</span>
                  </div>
                )}
                {schemeDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Scheme Disc.</span>
                    <span>-₹{schemeDiscount.toFixed(2)}</span>
                  </div>
                )}
                {extraDiscountAmt > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Extra Disc. ({discountPercent}%)</span>
                    <span>-₹{extraDiscountAmt.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-dotted border-border/60">
                  <span className="text-text-muted">Taxable</span>
                  <span className="text-text">₹{totalTaxable.toFixed(2)}</span>
                </div>
                {gstSlabs.map((slab) => (
                  <div key={slab.gstPct} className="flex justify-between text-purple-600 dark:text-purple-400 text-[10px]">
                    <span>GST {slab.gstPct}%</span>
                    <span className="font-bold">₹{slab.total.toFixed(2)}</span>
                  </div>
                ))}
                {roundOff !== 0 && (
                  <div className="flex justify-between text-text-muted text-[10px]">
                    <span>Round Off</span>
                    <span>{roundOff > 0 ? "+" : "-"}₹{Math.abs(roundOff).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total Bar */}
              <div className="px-4 py-2.5 bg-primary text-primary-contrast flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Grand Total</span>
                <span className="text-lg font-black font-mono tabular-nums">₹{grandTotal.toFixed(2)}</span>
              </div>

              {/* Extra Discount Controls */}
              <div className="px-4 py-2.5 border-t border-dashed border-border/60 bg-surface-alt/50 space-y-1.5">
                <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
                  Extra Discount Preset (%)
                </label>
                <div className="flex gap-1 flex-wrap items-center">
                  {[0, 5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercent(pct)}
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[10.5px] font-bold transition-all border cursor-pointer",
                        Number(discountPercent) === pct
                          ? "bg-primary text-primary-contrast border-primary/20 shadow-xs"
                          : "border-border bg-surface text-text hover:bg-surface-hover"
                      )}
                    >
                      {pct}%
                    </button>
                  ))}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-14 h-[26px] rounded-md border border-border bg-surface px-1.5 text-[10px] font-mono font-bold text-center focus:border-primary focus:outline-none"
                    placeholder="Custom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Payment Collection (Balanced width, ~52%, 2-Column fields) ── */}
        <div className="w-full md:w-[52%] flex-1 flex flex-col min-h-0 bg-surface overflow-hidden">

          {/* Amount to Collect Header Bar */}
          <div className="px-5 py-3 border-b border-border bg-surface-alt/40 shrink-0 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Amount to Collect</p>
              <p className="text-2xl font-black text-text tabular-nums font-mono leading-none mt-0.5">
                ₹{grandTotal.toFixed(2)}
              </p>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-xl text-xs font-bold border transition-all",
              shortfall === 0
                ? "bg-success-soft text-success border-success/30"
                : "bg-warning-soft text-warning border-warning/30"
            )}>
              {shortfall === 0 ? "✓ Balanced" : `Short ₹${shortfall.toFixed(2)}`}
            </div>
          </div>

          {/* Quick Payment Mode Tabs */}
          <div className="px-5 pt-2.5 pb-2 border-b border-border bg-surface-alt/20 shrink-0">
            <div className="text-[9.5px] font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center justify-between">
              <span>Payment Mode</span>
              {isSplitMode && (
                <span className="text-[9.5px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Split Mode Active ({payments.length} parts)
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: "Cash", label: "Cash", icon: Banknote, color: "text-emerald-600", activeCls: "bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30" },
                { id: "UPI", label: "UPI", icon: QrCode, color: "text-purple-600", activeCls: "bg-purple-500/15 border-purple-500/50 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30" },
                { id: "Credit", label: "Credit", icon: Receipt, color: "text-rose-600", activeCls: "bg-rose-500/15 border-rose-500/50 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30" },
                { id: "Advance", label: "Advance", icon: Wallet, color: "text-amber-600", activeCls: "bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30" },
                { id: "Split", label: "Split", icon: Calculator, color: "text-indigo-600", activeCls: "bg-indigo-500/15 border-indigo-500/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30" },
              ].map((m) => {
                const Icon = m.icon;
                const isActive = isSplitMode ? m.id === "Split" : (!isSplitMode && payments.length === 1 && payments[0]?.paymentType === m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectPrimaryMode(m.id)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer",
                      isActive
                        ? m.activeCls
                        : "border-border bg-surface text-text hover:bg-surface-hover"
                    )}
                  >
                    <Icon className={cn("size-3.5", m.color)} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Methods (2-column grid layout, fits without scrolling) */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
            {payments.map((row, index) => (
              <div key={row.id} className="p-3.5 rounded-xl border border-border bg-surface shadow-xs space-y-2.5">

                {/* 2-Column: Payment Type (Col 1) + Amount (Col 2) */}
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                      Payment Method
                    </label>
                    <UISelect
                      value={row.paymentType}
                      onChange={(val) => handleUpdate(index, "paymentType", val)}
                      options={PAYMENT_TYPE_OPTIONS}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Amount (₹)
                      </label>
                      {payments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="text-text-muted hover:text-error transition-colors p-0.5 cursor-pointer rounded"
                          title="Remove payment row"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={row.amount}
                        onChange={(e) => handleUpdate(index, "amount", e.target.value)}
                        className="w-full h-8 rounded-lg border border-border bg-surface-alt text-xs font-mono font-bold text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 px-2.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* If UPI: 2-Column layout for UPI Account & Txn Ref */}
                {row.paymentType === "UPI" && (
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/50 animate-in fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        UPI Account
                      </label>
                      <UISelect
                        value={row.paymentQrId || (primaryQr?._id ? String(primaryQr._id) : "")}
                        onChange={(val) => handleUpdate(index, "paymentQrId", val)}
                        options={upiOptions}
                        size="sm"
                        placeholder="Select UPI Account"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Txn Ref No (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UPI Ref / Txn ID"
                        value={row.txnRefNo || ""}
                        onChange={(e) => handleUpdate(index, "txnRefNo", e.target.value)}
                        className="w-full h-8 rounded-lg border border-border bg-surface-alt text-xs focus:border-primary focus:outline-none px-2.5"
                      />
                    </div>
                  </div>
                )}

                {/* If Cash: 2-Column layout for Drawer Info & Denominations Action */}
                {row.paymentType === "Cash" && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-border/50 items-center">
                    {/* Col 1: Cash Drawer Available */}
                    <div className="p-2 rounded-lg border border-success/20 bg-success-soft/10 flex items-center gap-2">
                      <Wallet className="size-3.5 text-success shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-bold text-text-muted uppercase block leading-none">
                          {activeShift ? "Shift Drawer" : "Running Cash"}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-success truncate block">
                          ₹{Number(availableCash).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Col 2: Notes / Denominations Stepper Button */}
                    <div className="flex items-center gap-1.5">
                      {!row.cashDetails && (
                        <UIButton
                          variant="outline"
                          size="xs"
                          type="button"
                          onClick={() => {
                            const amt = Number(row.amount) || 0;
                            const exactMap = decomposeAmount(amt);
                            handleUpdate(index, "cashDetails", {
                              received: exactMap,
                              returned: {},
                              receivedTotal: amt,
                              returnedTotal: 0,
                              netApplied: amt,
                            });
                          }}
                          className="h-8 text-[10.5px] font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 shrink-0"
                          title="Instantly accept exact cash notes"
                        >
                          Exact ₹{Math.round(Number(row.amount) || 0)}
                        </UIButton>
                      )}
                      <UIButton
                        variant={row.cashDetails ? "soft" : "outline"}
                        size="xs"
                        fullWidth={!!row.cashDetails}
                        onClick={() => setCashBreakdownTarget(index)}
                        startIcon={<Calculator className="size-3" />}
                        className={cn(
                          "h-8 text-[11px] font-bold flex-1",
                          !row.cashDetails ? "border-amber-400/60 text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20" : ""
                        )}
                      >
                        {row.cashDetails ? "Edit Notes" : "Drawer Notes *"}
                      </UIButton>
                    </div>
                  </div>
                )}

                {/* Cash: Captured Denominations Summary (2-column badges) */}
                {row.paymentType === "Cash" && row.cashDetails && (() => {
                  const receivedMap = row.cashDetails.received || {};
                  const returnedMap = row.cashDetails.returned || {};
                  const receivedEntries = Object.entries(receivedMap).filter(([, qty]) => Number(qty) > 0).sort(([a], [b]) => Number(b) - Number(a));
                  const returnedEntries = Object.entries(returnedMap).filter(([, qty]) => Number(qty) > 0).sort(([a], [b]) => Number(b) - Number(a));

                  return (
                    <div className="p-2 rounded-lg border border-success/30 bg-success-soft/10 text-[10.5px] font-mono space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-[10px] font-bold text-success">
                        <span>Notes Received: ₹{Number(row.cashDetails.receivedTotal).toLocaleString("en-IN")}</span>
                        <span>Net: ₹{Number(row.cashDetails.netApplied || row.amount).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {receivedEntries.map(([denom, qty]) => (
                          <span key={`rec-${denom}`} className="px-1.5 py-0.5 rounded bg-surface border border-success/30 text-[10px] font-bold text-text">
                            ₹{denom}×{qty}
                          </span>
                        ))}
                      </div>
                      {Number(row.cashDetails.returnedTotal) > 0 && (
                        <div className="pt-1 border-t border-success/20 flex items-center justify-between text-[10px] text-warning font-bold">
                          <span>Change Returned:</span>
                          <span>₹{Number(row.cashDetails.returnedTotal).toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Cash: warning if denominations missing */}
                {row.paymentType === "Cash" && !row.cashDetails && (
                  <div className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center gap-1.5 text-[10.5px] text-amber-700 dark:text-amber-300 font-medium">
                    <AlertCircle className="size-3.5 text-amber-600 shrink-0" />
                    <span>Exact currency denominations required for this cash payment.</span>
                  </div>
                )}

                {/* If Credit: Customer Credit Balance & Due Date Selector */}
                {row.paymentType === "Credit" && (
                  <div className="pt-2 border-t border-rose-500/20 space-y-2 animate-in fade-in">
                    {!effectiveCustomer?._id && !effectiveCustomer?.id ? (
                      <div className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>Credit billing requires selecting a registered customer profile first.</span>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2 p-2 rounded-lg border border-rose-500/20 bg-rose-500/5 text-center">
                          <div>
                            <span className="text-[9px] font-bold text-text-muted uppercase block">Credit Limit</span>
                            <span className="text-[11px] font-mono font-bold text-text">
                              ₹{creditLimit.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-text-muted uppercase block">Outstanding</span>
                            <span className="text-[11px] font-mono font-bold text-rose-600">
                              ₹{creditOutstanding.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-text-muted uppercase block">Available</span>
                            <span className={cn(
                              "text-[11px] font-mono font-bold",
                              availableCredit >= Number(row.amount || 0) ? "text-emerald-600" : "text-rose-600"
                            )}>
                              ₹{availableCredit.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {Number(row.amount || 0) > availableCredit && (
                          <div className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>Requested amount exceeds available credit limit by ₹{(Number(row.amount || 0) - availableCredit).toFixed(2)}</span>
                          </div>
                        )}

                        {(() => {
                          const baseTime = saleDate
                            ? new Date(saleDate).getTime()
                            : new Date().setHours(0, 0, 0, 0);
                          const dueTime = row.creditDueDate
                            ? new Date(row.creditDueDate).getTime()
                            : 0;
                          const diffDays =
                            dueTime && !isNaN(dueTime)
                              ? Math.max(0, Math.round((dueTime - baseTime) / (1000 * 60 * 60 * 24)))
                              : (creditDays || 15);

                          return (
                            <div className="space-y-2 pt-1 border-t border-border/50">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                  Maturity Due Date
                                </label>
                                <span className="text-[11px] font-medium text-text-muted">
                                  Term: <strong className="text-primary font-mono font-bold">{diffDays} days</strong>
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                                <input
                                  type="date"
                                  value={row.creditDueDate || ""}
                                  min={new Date().toISOString().split("T")[0]}
                                  onChange={(e) => handleUpdate(index, "creditDueDate", e.target.value)}
                                  className="w-full h-8.5 rounded-lg border border-border bg-surface-alt text-xs font-mono font-bold text-text focus:border-primary focus:outline-none px-2.5"
                                />

                                <div className="flex items-center gap-1.5">
                                  {[7, 15, 30, 45].map((preset) => {
                                    const isSelected = diffDays === preset;
                                    return (
                                      <button
                                        key={preset}
                                        type="button"
                                        onClick={() => {
                                          const d = new Date(baseTime);
                                          d.setDate(d.getDate() + preset);
                                          handleUpdate(index, "creditDueDate", d.toISOString().split("T")[0]);
                                        }}
                                        className={cn(
                                          "flex-1 h-7 rounded-md text-[10.5px] font-semibold transition-all cursor-pointer border",
                                          isSelected
                                            ? "bg-primary text-primary-foreground border-primary shadow-2xs font-bold"
                                            : "bg-surface-alt hover:bg-surface border-border text-text-muted hover:text-text"
                                        )}
                                      >
                                        {preset}d
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}

                {/* If Advance: Prepaid Deposit Balance Info */}
                {row.paymentType === "Advance" && (
                  <div className="pt-2 border-t border-amber-500/20 space-y-2 animate-in fade-in">
                    {!effectiveCustomer?._id && !effectiveCustomer?.id ? (
                      <div className="p-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>Advance billing requires selecting a registered customer profile with prepaid deposit.</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-2 rounded-lg border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wallet className="size-4 text-amber-600" />
                            <div>
                              <span className="text-[9.5px] font-bold text-text-muted uppercase block leading-none">
                                Prepaid Advance Held
                              </span>
                              <span className="text-xs font-mono font-bold text-amber-600">
                                ₹{advanceBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[9.5px] font-bold text-text-muted uppercase block leading-none">
                              Remaining After Bill
                            </span>
                            <span className={cn(
                              "text-xs font-mono font-bold",
                              advanceBalance >= Number(row.amount || 0) ? "text-emerald-600" : "text-rose-600"
                            )}>
                              ₹{Math.max(0, advanceBalance - Number(row.amount || 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {Number(row.amount || 0) > advanceBalance && (
                          <div className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>Amount exceeds available advance deposit by ₹{(Number(row.amount || 0) - advanceBalance).toFixed(2)}. Consider Split mode.</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Compact Add Split Payment */}
            <button
              type="button"
              onClick={handleAddRow}
              className="w-full py-2 rounded-lg border border-dashed border-primary/40 text-primary text-xs font-bold bg-primary-soft/5 hover:bg-primary-soft/15 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="size-3.5" />
              Add Split Payment Method
            </button>
          </div>

          {/* Footer: Compact, Shorter Confirm Button (Fit) */}
          <div className="px-4 py-2.5 border-t border-border bg-surface shrink-0 flex items-center justify-between gap-3">
            <div className="min-w-0">
              {errorMessage ? (
                <span className="text-[11px] font-semibold text-error truncate block">
                  {errorMessage}
                </span>
              ) : hasUncapturedCash ? (
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 truncate block">
                  ⚠️ Select cash denominations to continue
                </span>
              ) : (
                <span className="text-[11px] text-text-muted truncate block">
                  {items.length} item{items.length !== 1 ? "s" : ""} · {isB2B ? "B2B Invoice" : "B2C Receipt"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <UIButton variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </UIButton>
              <PermissionGate
                permission="pos:create"
                fallback={
                  <UIButton variant="primary" size="sm" disabled>
                    Permission Required
                  </UIButton>
                }
              >
                <UIButton
                  variant="success"
                  size="sm"
                  className="px-5 font-bold"
                  isLoading={isSubmitting}
                  loadingText="Processing..."
                  disabled={isSubmitting || shortfall > 0 || hasUncapturedCash}
                  onClick={handleProcessSale}
                  startIcon={<CheckCircle2 className="size-4" />}
                >
                  Confirm Sale
                </UIButton>
              </PermissionGate>
            </div>
          </div>

        </div>
      </div>

      {(() => {
        return (
          <CashBreakdownModal
            isOpen={cashBreakdownTarget !== null}
            onClose={() => setCashBreakdownTarget(null)}
            onConfirm={handleConfirmCashBreakdown}
            targetAmount={cashBreakdownTarget !== null ? Number(payments[cashBreakdownTarget]?.amount || 0) : 0}
            initialReceived={cashBreakdownTarget !== null ? payments[cashBreakdownTarget]?.cashDetails?.received : {}}
            initialReturned={cashBreakdownTarget !== null ? payments[cashBreakdownTarget]?.cashDetails?.returned : {}}
            availableDenominations={runningDenominations || []}
            availableBalance={runningCash || 0}
            cashAccountName="Branch Cash (Running)"
          />
        );
      })()}
    </UIModal>
  );
};

export default SalesCheckoutModal;
