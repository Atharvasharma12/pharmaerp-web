import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAccountBalances,
  getAccountBalanceByAccountId,
  recalculateAccountBalance,
} from "../store/accountBalanceThunk";

import {
  clearAccountBalanceError,
  clearAccountBalanceMessage,
  setCurrentAccountBalance,
  clearCurrentAccountBalance,
  clearAccountBalances,
} from "../store/accountBalanceSlice";

import {
  selectAccountBalances,
  selectCurrentAccountBalance,
  selectAccountBalanceStatus,
  selectAccountBalanceError,
  selectAccountBalanceMessage,
  selectGetAccountBalancesStatus,
  selectGetAccountBalanceStatus,
  selectRecalculateAccountBalanceStatus,
} from "../store/accountBalanceSelector";

const useAccountBalance = () => {
  const dispatch = useDispatch();

  const accountBalances = useSelector(selectAccountBalances);
  const currentAccountBalance = useSelector(selectCurrentAccountBalance);

  const status = useSelector(selectAccountBalanceStatus);
  const error = useSelector(selectAccountBalanceError);
  const message = useSelector(selectAccountBalanceMessage);

  const getAccountBalancesStatus = useSelector(selectGetAccountBalancesStatus);

  const getAccountBalanceStatus = useSelector(selectGetAccountBalanceStatus);

  const recalculateAccountBalanceStatus = useSelector(
    selectRecalculateAccountBalanceStatus,
  );

  const fetchAccountBalances = useCallback((params = {}) => {
    return dispatch(getAccountBalances(params)).unwrap();
  }, [dispatch]);

  const fetchAccountBalanceByAccountId = useCallback((accountId) => {
    return dispatch(getAccountBalanceByAccountId(accountId)).unwrap();
  }, [dispatch]);

  const submitRecalculateAccountBalance = useCallback((accountId) => {
    return dispatch(recalculateAccountBalance(accountId)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAccountBalanceError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearAccountBalanceMessage());
  }, [dispatch]);

  const saveCurrentAccountBalance = useCallback((payload) => {
    dispatch(setCurrentAccountBalance(payload));
  }, [dispatch]);

  const removeCurrentAccountBalance = useCallback(() => {
    dispatch(clearCurrentAccountBalance());
  }, [dispatch]);

  const removeAccountBalances = useCallback(() => {
    dispatch(clearAccountBalances());
  }, [dispatch]);

  return {
    accountBalances,
    currentAccountBalance,

    status,
    error,
    message,

    getAccountBalancesStatus,
    getAccountBalanceStatus,
    recalculateAccountBalanceStatus,

    getAccountBalances: fetchAccountBalances,
    getAccountBalanceByAccountId: fetchAccountBalanceByAccountId,
    recalculateAccountBalance: submitRecalculateAccountBalance,

    clearError,
    clearMessage,

    setCurrentAccountBalance: saveCurrentAccountBalance,
    clearCurrentAccountBalance: removeCurrentAccountBalance,

    clearAccountBalances: removeAccountBalances,
  };
};

export default useAccountBalance;
