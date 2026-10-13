// src/features/sales/services/holdBillStorage.js

/**
 * Storage key for persistent browser-held bills
 */
export const HELD_BILLS_STORAGE_KEY = "pharmaerp_held_bills_v1";
export const HELD_BILLS_SYNC_EVENT = "pharmaerp_held_bills_change";

/**
 * Helper to dispatch in-window sync event (native 'storage' event only fires cross-tab)
 */
export const notifyHeldBillsUpdated = () => {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent(HELD_BILLS_SYNC_EVENT, {
          detail: { timestamp: Date.now() },
        })
      );
    } catch (err) {
      console.warn("Could not dispatch hold bills sync event:", err);
    }
  }
};

/**
 * Safe parser for localStorage
 */
export const loadAllRawHeldBills = () => {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(HELD_BILLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading held bills from localStorage:", err);
    return [];
  }
};

/**
 * Safe writer for localStorage
 */
export const saveAllRawHeldBills = (bills) => {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    const list = Array.isArray(bills) ? bills : [];
    window.localStorage.setItem(HELD_BILLS_STORAGE_KEY, JSON.stringify(list));
    notifyHeldBillsUpdated();
    return true;
  } catch (err) {
    console.error("Error writing held bills to localStorage:", err);
    return false;
  }
};

/**
 * Check whether a held bill matches tenant criteria
 */
export const isMatchingTenant = (bill, workspaceId, companyId, branchId) => {
  if (!bill) return false;

  const bBranch = bill.branchId ? String(bill.branchId) : null;
  const tBranch = branchId ? String(branchId) : null;
  // Branch is strictly mandatory
  if (!bBranch || !tBranch || bBranch !== tBranch) {
    return false;
  }

  const bComp = bill.companyId ? String(bill.companyId) : null;
  const tComp = companyId ? String(companyId) : null;
  if (tComp && bComp && bComp !== tComp) {
    return false;
  }

  const bWs = bill.workspaceId ? String(bill.workspaceId) : null;
  const tWs = workspaceId ? String(workspaceId) : null;
  if (tWs && bWs && bWs !== tWs) {
    return false;
  }

  return true;
};

/**
 * Generate human-friendly sequential token for current branch (e.g. HB-01)
 */
export const generateHoldNumber = (existingBranchBills) => {
  const count = Array.isArray(existingBranchBills) ? existingBranchBills.length : 0;
  const nextNum = count + 1;
  return `HB-${String(nextNum).padStart(2, "0")}`;
};

/**
 * Retrieve held bills strictly filtered by workspaceId, companyId, and branchId
 */
export const getHeldBills = (workspaceId, companyId, branchId) => {
  if (!branchId) return [];
  const allBills = loadAllRawHeldBills();
  return allBills
    .filter((bill) => isMatchingTenant(bill, workspaceId, companyId, branchId))
    .sort((a, b) => new Date(b.heldAt || 0) - new Date(a.heldAt || 0));
};

/**
 * Calculate totals snapshot for a cart
 */
export const computeCartSnapshot = (cart = [], billingMode = "B2C") => {
  const safeItems = Array.isArray(cart) ? cart : [];
  let itemCount = 0;
  let subtotal = 0;

  safeItems.forEach((item) => {
    const qty = Math.max(1, Number(item.qty) || 1);
    const rate = Number(item.price) || 0;
    const disc = Math.max(0, Math.min(100, Number(item.disc) || 0));

    itemCount += qty;
    if (billingMode === "B2B") {
      subtotal += rate * qty;
    } else {
      subtotal += rate * qty * (1 - disc / 100);
    }
  });

  const grandTotal = Math.round(subtotal);
  return {
    itemCount,
    uniqueItemCount: safeItems.length,
    subtotal: Math.round(subtotal * 100) / 100,
    grandTotal,
  };
};

/**
 * Save a new held bill to localStorage under tenant scope
 */
export const saveHeldBill = ({
  workspaceId,
  companyId,
  branchId,
  billingMode = "B2C",
  customer = null,
  customerName = "",
  customerPhone = "",
  doctorName = "",
  saleDate = null,
  cart = [],
  note = "",
}) => {
  if (!branchId) {
    console.warn("Cannot hold bill without branchId");
    return null;
  }

  const allBills = loadAllRawHeldBills();
  const existingBranchBills = allBills.filter((b) =>
    isMatchingTenant(b, workspaceId, companyId, branchId)
  );

  const holdNumber = generateHoldNumber(existingBranchBills);
  const snapshot = computeCartSnapshot(cart, billingMode);

  const newHeldBill = {
    id: `hold_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    holdNumber,
    heldAt: new Date().toISOString(),
    workspaceId: workspaceId ? String(workspaceId) : null,
    companyId: companyId ? String(companyId) : null,
    branchId: String(branchId),
    note: (note || "").trim(),

    // Context & customer metadata
    billingMode: billingMode === "B2B" ? "B2B" : "B2C",
    customer: customer || null,
    customerName: customerName || customer?.name || "",
    customerPhone: customerPhone || customer?.mobile || customer?.phone || "",
    doctorName: doctorName || "",
    saleDate: saleDate || new Date().toISOString(),

    // Deep serialized cart items
    cart: (cart || []).map((item) => ({
      ...item,
      qty: Number(item.qty) || 1,
      price: Number(item.price) || 0,
      disc: Number(item.disc) || 0,
    })),

    // Snapshot totals
    itemCount: snapshot.itemCount,
    uniqueItemCount: snapshot.uniqueItemCount,
    subtotal: snapshot.subtotal,
    grandTotal: snapshot.grandTotal,
  };

  // Add at beginning
  const updatedList = [newHeldBill, ...allBills];
  saveAllRawHeldBills(updatedList);

  return newHeldBill;
};

/**
 * Remove a specific held bill by ID
 */
export const removeHeldBill = (billId) => {
  if (!billId) return false;
  const allBills = loadAllRawHeldBills();
  const updatedList = allBills.filter((b) => b.id !== billId);
  return saveAllRawHeldBills(updatedList);
};

/**
 * Clear all held bills for a specific branch
 */
export const clearBranchHeldBills = (workspaceId, companyId, branchId) => {
  if (!branchId) return false;
  const allBills = loadAllRawHeldBills();
  const updatedList = allBills.filter(
    (b) => !isMatchingTenant(b, workspaceId, companyId, branchId)
  );
  return saveAllRawHeldBills(updatedList);
};

export default {
  HELD_BILLS_STORAGE_KEY,
  HELD_BILLS_SYNC_EVENT,
  getHeldBills,
  saveHeldBill,
  removeHeldBill,
  clearBranchHeldBills,
  computeCartSnapshot,
  notifyHeldBillsUpdated,
};
