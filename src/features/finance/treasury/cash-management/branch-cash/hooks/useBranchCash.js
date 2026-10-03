import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listBranchCash,
  fetchBranchCash,
  depositCash,
  withdrawCash,
} from "../store/branchCashThunk";
import {
  selectAllBranchCash,
  selectCurrentBranchCash,
  selectRunningCash,
  selectFrozenCash,
  selectRunningDenominations,
  selectFrozenDenominations,
  selectBranchCashListStatus,
  selectBranchCashFetchStatus,
  selectDepositStatus,
  selectWithdrawStatus,
  selectBranchCashError,
  selectBranchCashMessage,
} from "../store/branchCashSelector";
import {
  resetBranchCashStatus,
  clearCurrentBranchCash,
} from "../store/branchCashSlice";

export const useBranchCash = () => {
  const dispatch = useDispatch();

  // State selectors
  const allBranchCash = useSelector(selectAllBranchCash);
  const currentBranchCash = useSelector(selectCurrentBranchCash);
  const runningCash = useSelector(selectRunningCash);
  const frozenCash = useSelector(selectFrozenCash);
  const runningDenominations = useSelector(selectRunningDenominations);
  const frozenDenominations = useSelector(selectFrozenDenominations);

  // Status selectors
  const listStatus = useSelector(selectBranchCashListStatus);
  const fetchStatus = useSelector(selectBranchCashFetchStatus);
  const depositStatus = useSelector(selectDepositStatus);
  const withdrawStatus = useSelector(selectWithdrawStatus);
  const error = useSelector(selectBranchCashError);
  const message = useSelector(selectBranchCashMessage);

  // Actions
  const handleListBranchCash = useCallback(
    (params) => dispatch(listBranchCash(params)),
    [dispatch]
  );

  const handleFetchBranchCash = useCallback(
    (branchId) => dispatch(fetchBranchCash(branchId)),
    [dispatch]
  );

  const handleDepositCash = useCallback(
    (payload) => dispatch(depositCash(payload)),
    [dispatch]
  );

  const handleWithdrawCash = useCallback(
    (payload) => dispatch(withdrawCash(payload)),
    [dispatch]
  );

  const handleResetStatus = useCallback(
    () => dispatch(resetBranchCashStatus()),
    [dispatch]
  );

  const handleClearCurrent = useCallback(
    () => dispatch(clearCurrentBranchCash()),
    [dispatch]
  );

  return {
    // State
    allBranchCash,
    currentBranchCash,
    runningCash,
    frozenCash,
    runningDenominations,
    frozenDenominations,
    
    // Status
    listStatus,
    fetchStatus,
    depositStatus,
    withdrawStatus,
    error,
    message,
    
    // Actions
    listBranchCash: handleListBranchCash,
    fetchBranchCash: handleFetchBranchCash,
    depositCash: handleDepositCash,
    withdrawCash: handleWithdrawCash,
    resetStatus: handleResetStatus,
    clearCurrent: handleClearCurrent,
  };
};

export default useBranchCash;
