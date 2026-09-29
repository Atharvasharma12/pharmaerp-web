import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createCashAccount,
  getCashAccounts,
  getCashAccountById,
  updateCashAccount,
  deleteCashAccount,
  setPrimaryCashAccount,
} from "../store/cashAccountThunk";

import {
  clearCashAccountError,
  clearCashAccountMessage,
  setCurrentCashAccount,
  clearCurrentCashAccount,
  clearCashAccounts,
  clearManagedCashAccount,
} from "../store/cashAccountSlice";

import {
  selectCashAccounts,
  selectCurrentCashAccount,
  selectManagedCashAccount,
  selectCashAccountStatus,
  selectCashAccountError,
  selectCashAccountMessage,
  selectCreateCashAccountStatus,
  selectGetCashAccountsStatus,
  selectGetCashAccountStatus,
  selectUpdateCashAccountStatus,
  selectDeleteCashAccountStatus,
  selectSetPrimaryCashAccountStatus,
} from "../store/cashAccountSelector";

const useCashAccount = () => {
  const dispatch = useDispatch();

  const cashAccounts = useSelector(selectCashAccounts);

  const currentCashAccount = useSelector(selectCurrentCashAccount);

  const managedCashAccount = useSelector(selectManagedCashAccount);

  const status = useSelector(selectCashAccountStatus);

  const error = useSelector(selectCashAccountError);

  const message = useSelector(selectCashAccountMessage);

  const createCashAccountStatus = useSelector(selectCreateCashAccountStatus);

  const getCashAccountsStatus = useSelector(selectGetCashAccountsStatus);

  const getCashAccountStatus = useSelector(selectGetCashAccountStatus);

  const updateCashAccountStatus = useSelector(selectUpdateCashAccountStatus);

  const deleteCashAccountStatus = useSelector(selectDeleteCashAccountStatus);

  const setPrimaryCashAccountStatus = useSelector(
    selectSetPrimaryCashAccountStatus,
  );

  const submitCreateCashAccount = useCallback((payload) => {
    return dispatch(createCashAccount(payload)).unwrap();
  }, [dispatch]);

  const fetchCashAccounts = useCallback((params = {}) => {
    return dispatch(getCashAccounts(params)).unwrap();
  }, [dispatch]);

  const fetchCashAccountById = useCallback((cashAccountId) => {
    return dispatch(getCashAccountById(cashAccountId)).unwrap();
  }, [dispatch]);

  const submitUpdateCashAccount = useCallback((cashAccountId, payload) => {
    return dispatch(
      updateCashAccount({
        cashAccountId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitDeleteCashAccount = useCallback((cashAccountId) => {
    return dispatch(deleteCashAccount(cashAccountId)).unwrap();
  }, [dispatch]);

  const submitSetPrimaryCashAccount = useCallback((cashAccountId) => {
    return dispatch(setPrimaryCashAccount(cashAccountId)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearCashAccountError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearCashAccountMessage());
  }, [dispatch]);

  const saveCurrentCashAccount = useCallback((payload) => {
    dispatch(setCurrentCashAccount(payload));
  }, [dispatch]);

  const removeCurrentCashAccount = useCallback(() => {
    dispatch(clearCurrentCashAccount());
  }, [dispatch]);

  const removeCashAccounts = useCallback(() => {
    dispatch(clearCashAccounts());
  }, [dispatch]);

  const removeManagedCashAccount = useCallback(() => {
    dispatch(clearManagedCashAccount());
  }, [dispatch]);

  return {
    cashAccounts,
    currentCashAccount,
    managedCashAccount,

    status,
    error,
    message,

    createCashAccountStatus,
    getCashAccountsStatus,
    getCashAccountStatus,
    updateCashAccountStatus,
    deleteCashAccountStatus,
    setPrimaryCashAccountStatus,

    createCashAccount: submitCreateCashAccount,
    getCashAccounts: fetchCashAccounts,
    getCashAccountById: fetchCashAccountById,
    updateCashAccount: submitUpdateCashAccount,
    deleteCashAccount: submitDeleteCashAccount,
    setPrimaryCashAccount: submitSetPrimaryCashAccount,

    clearError,
    clearMessage,

    setCurrentCashAccount: saveCurrentCashAccount,

    clearCurrentCashAccount: removeCurrentCashAccount,

    clearCashAccounts: removeCashAccounts,

    clearManagedCashAccount: removeManagedCashAccount,
  };
};

export default useCashAccount;
