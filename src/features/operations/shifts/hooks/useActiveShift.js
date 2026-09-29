import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOpenShift } from "../store/shiftThunk";
import { API_STATUS } from "@/constants";

// Module-level trackers to prevent duplicate concurrent network calls across any components
const inFlightRequests = new Set();
const lastFetchedByBranch = new Map();

export const useActiveShift = (branchId) => {
  const dispatch = useDispatch();
  const { activeShift, getOpenShiftStatus, error } = useSelector((state) => state.shift);
  const branchIdStr = branchId ? String(branchId) : null;

  const refetch = useCallback(() => {
    if (!branchIdStr) return;
    inFlightRequests.add(branchIdStr);
    lastFetchedByBranch.set(branchIdStr, Date.now());
    return dispatch(getOpenShift({ branchId: branchIdStr })).finally(() => {
      inFlightRequests.delete(branchIdStr);
    });
  }, [branchIdStr, dispatch]);

  useEffect(() => {
    if (!branchIdStr) return;

    // Check if current activeShift in Redux already belongs to this branch
    const activeShiftBranchId = activeShift?.branchId?._id
      ? String(activeShift.branchId._id)
      : activeShift?.branchId
      ? String(activeShift.branchId)
      : null;

    const isAlreadyLoaded =
      Boolean(activeShift) &&
      activeShiftBranchId === branchIdStr &&
      getOpenShiftStatus === API_STATUS.SUCCESS;

    // Don't fire if:
    // 1. Shift is already successfully loaded for this branch
    // 2. A request for this branch is currently in-flight
    // 3. getOpenShiftStatus is currently LOADING
    // 4. We already fetched for this branch in this session and status is terminal (SUCCESS or ERROR)
    if (
      isAlreadyLoaded ||
      inFlightRequests.has(branchIdStr) ||
      getOpenShiftStatus === API_STATUS.LOADING ||
      lastFetchedByBranch.has(branchIdStr)
    ) {
      return;
    }

    inFlightRequests.add(branchIdStr);
    lastFetchedByBranch.set(branchIdStr, Date.now());

    dispatch(getOpenShift({ branchId: branchIdStr })).finally(() => {
      inFlightRequests.delete(branchIdStr);
    });
  }, [branchIdStr, dispatch, getOpenShiftStatus, activeShift]);

  return { activeShift, status: getOpenShiftStatus, error, refetch };
};

export default useActiveShift;
