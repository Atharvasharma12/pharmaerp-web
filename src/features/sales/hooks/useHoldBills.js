// src/features/sales/hooks/useHoldBills.js

import { useState, useEffect, useCallback, useMemo } from "react";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import {
  getHeldBills,
  saveHeldBill,
  removeHeldBill,
  clearBranchHeldBills,
  HELD_BILLS_STORAGE_KEY,
  HELD_BILLS_SYNC_EVENT,
} from "../services/holdBillStorage";

/**
 * Custom hook to manage branch-scoped held bills with multi-tab reactivity.
 */
export const useHoldBills = () => {
  const { currentWorkspace } = useWorkspace();
  const { currentCompany } = useCompany();
  const { currentBranch } = useBranch();

  const workspaceId = useMemo(
    () => currentWorkspace?._id || currentWorkspace?.id || null,
    [currentWorkspace]
  );
  const companyId = useMemo(
    () => currentCompany?._id || currentCompany?.id || null,
    [currentCompany]
  );
  const branchId = useMemo(
    () => currentBranch?._id || currentBranch?.id || null,
    [currentBranch]
  );

  const [heldBills, setHeldBills] = useState(() => {
    return getHeldBills(workspaceId, companyId, branchId);
  });

  // Re-fetch bills from storage
  const refetch = useCallback(() => {
    if (!branchId) {
      setHeldBills([]);
      return;
    }
    const freshBills = getHeldBills(workspaceId, companyId, branchId);
    setHeldBills(freshBills);
  }, [workspaceId, companyId, branchId]);

  // Sync on branch or tenant change
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Listen for storage events (cross-tab) and custom events (same-tab)
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (!e.key || e.key === HELD_BILLS_STORAGE_KEY) {
        refetch();
      }
    };

    const handleCustomSyncEvent = () => {
      refetch();
    };

    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener(HELD_BILLS_SYNC_EVENT, handleCustomSyncEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener(HELD_BILLS_SYNC_EVENT, handleCustomSyncEvent);
    };
  }, [refetch]);

  /**
   * Hold the active bill
   */
  const holdBill = useCallback(
    ({
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
        console.warn("useHoldBills: Cannot hold bill without an active branch.");
        return null;
      }

      const created = saveHeldBill({
        workspaceId,
        companyId,
        branchId,
        billingMode,
        customer,
        customerName,
        customerPhone,
        doctorName,
        saleDate,
        cart,
        note,
      });

      refetch();
      return created;
    },
    [workspaceId, companyId, branchId, refetch]
  );

  /**
   * Resume a held bill by ID (removes it from held bills storage and returns it)
   */
  const resumeBill = useCallback(
    (billId) => {
      if (!billId) return null;
      const target = heldBills.find((b) => b.id === billId);
      if (target) {
        removeHeldBill(billId);
        refetch();
        return target;
      }
      return null;
    },
    [heldBills, refetch]
  );

  /**
   * Discard a held bill by ID
   */
  const discardBill = useCallback(
    (billId) => {
      if (!billId) return false;
      const success = removeHeldBill(billId);
      refetch();
      return success;
    },
    [refetch]
  );

  /**
   * Clear all held bills for current branch
   */
  const clearAll = useCallback(() => {
    if (!branchId) return false;
    const success = clearBranchHeldBills(workspaceId, companyId, branchId);
    refetch();
    return success;
  }, [workspaceId, companyId, branchId, refetch]);

  return {
    heldBills,
    count: heldBills.length,
    holdBill,
    resumeBill,
    discardBill,
    clearAll,
    refetch,
    branchId,
    currentBranch,
  };
};

export default useHoldBills;
