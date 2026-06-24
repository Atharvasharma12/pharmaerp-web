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

  const fetchAccountBalances = (params = {}) => {
    return dispatch(getAccountBalances(params)).unwrap();
  };

  const fetchAccountBalanceByAccountId = (accountId) => {
    return dispatch(getAccountBalanceByAccountId(accountId)).unwrap();
  };

  const submitRecalculateAccountBalance = (accountId) => {
    return dispatch(recalculateAccountBalance(accountId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearAccountBalanceError());
  };

  const clearMessage = () => {
    dispatch(clearAccountBalanceMessage());
  };

  const saveCurrentAccountBalance = (payload) => {
    dispatch(setCurrentAccountBalance(payload));
  };

  const removeCurrentAccountBalance = () => {
    dispatch(clearCurrentAccountBalance());
  };

  const removeAccountBalances = () => {
    dispatch(clearAccountBalances());
  };

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
