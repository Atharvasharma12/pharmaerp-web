import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createBankAccount,
  getBankAccounts,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
  setPrimaryBankAccount,
} from "../store/bankAccountThunk";

import {
  clearBankAccountError,
  clearBankAccountMessage,
  setCurrentBankAccount,
  clearCurrentBankAccount,
  clearBankAccounts,
  clearManagedBankAccount,
} from "../store/bankAccountSlice";

import {
  selectBankAccounts,
  selectCurrentBankAccount,
  selectManagedBankAccount,
  selectBankAccountStatus,
  selectBankAccountError,
  selectBankAccountMessage,
  selectCreateBankAccountStatus,
  selectGetBankAccountsStatus,
  selectGetBankAccountStatus,
  selectUpdateBankAccountStatus,
  selectDeleteBankAccountStatus,
  selectSetPrimaryBankAccountStatus,
} from "../store/bankAccountSelector";

const useBankAccount = () => {
  const dispatch = useDispatch();

  const bankAccounts = useSelector(selectBankAccounts);
  const currentBankAccount = useSelector(selectCurrentBankAccount);

  const managedBankAccount = useSelector(selectManagedBankAccount);

  const status = useSelector(selectBankAccountStatus);
  const error = useSelector(selectBankAccountError);
  const message = useSelector(selectBankAccountMessage);

  const createBankAccountStatus = useSelector(selectCreateBankAccountStatus);

  const getBankAccountsStatus = useSelector(selectGetBankAccountsStatus);

  const getBankAccountStatus = useSelector(selectGetBankAccountStatus);

  const updateBankAccountStatus = useSelector(selectUpdateBankAccountStatus);

  const deleteBankAccountStatus = useSelector(selectDeleteBankAccountStatus);

  const setPrimaryBankAccountStatus = useSelector(
    selectSetPrimaryBankAccountStatus,
  );

  const submitCreateBankAccount = useCallback((payload) => {
    return dispatch(createBankAccount(payload)).unwrap();
  }, [dispatch]);

  const fetchBankAccounts = useCallback((params = {}) => {
    return dispatch(getBankAccounts(params)).unwrap();
  }, [dispatch]);

  const fetchBankAccountById = useCallback((bankAccountId) => {
    return dispatch(getBankAccountById(bankAccountId)).unwrap();
  }, [dispatch]);

  const submitUpdateBankAccount = useCallback((bankAccountId, payload) => {
    return dispatch(
      updateBankAccount({
        bankAccountId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitDeleteBankAccount = useCallback((bankAccountId) => {
    return dispatch(deleteBankAccount(bankAccountId)).unwrap();
  }, [dispatch]);

  const submitSetPrimaryBankAccount = useCallback((bankAccountId) => {
    return dispatch(setPrimaryBankAccount(bankAccountId)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearBankAccountError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearBankAccountMessage());
  }, [dispatch]);

  const saveCurrentBankAccount = useCallback((payload) => {
    dispatch(setCurrentBankAccount(payload));
  }, [dispatch]);

  const removeCurrentBankAccount = useCallback(() => {
    dispatch(clearCurrentBankAccount());
  }, [dispatch]);

  const removeBankAccounts = useCallback(() => {
    dispatch(clearBankAccounts());
  }, [dispatch]);

  const removeManagedBankAccount = useCallback(() => {
    dispatch(clearManagedBankAccount());
  }, [dispatch]);

  return {
    bankAccounts,
    currentBankAccount,
    managedBankAccount,

    status,
    error,
    message,

    createBankAccountStatus,
    getBankAccountsStatus,
    getBankAccountStatus,
    updateBankAccountStatus,
    deleteBankAccountStatus,
    setPrimaryBankAccountStatus,

    createBankAccount: submitCreateBankAccount,
    getBankAccounts: fetchBankAccounts,
    getBankAccountById: fetchBankAccountById,
    updateBankAccount: submitUpdateBankAccount,
    deleteBankAccount: submitDeleteBankAccount,
    setPrimaryBankAccount: submitSetPrimaryBankAccount,

    clearError,
    clearMessage,

    setCurrentBankAccount: saveCurrentBankAccount,

    clearCurrentBankAccount: removeCurrentBankAccount,

    clearBankAccounts: removeBankAccounts,

    clearManagedBankAccount: removeManagedBankAccount,
  };
};

export default useBankAccount;
