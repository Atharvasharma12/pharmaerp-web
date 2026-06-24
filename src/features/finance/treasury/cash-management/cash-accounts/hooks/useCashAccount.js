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

  const submitCreateCashAccount = (payload) => {
    return dispatch(createCashAccount(payload)).unwrap();
  };

  const fetchCashAccounts = (params = {}) => {
    return dispatch(getCashAccounts(params)).unwrap();
  };

  const fetchCashAccountById = (cashAccountId) => {
    return dispatch(getCashAccountById(cashAccountId)).unwrap();
  };

  const submitUpdateCashAccount = (cashAccountId, payload) => {
    return dispatch(
      updateCashAccount({
        cashAccountId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteCashAccount = (cashAccountId) => {
    return dispatch(deleteCashAccount(cashAccountId)).unwrap();
  };

  const submitSetPrimaryCashAccount = (cashAccountId) => {
    return dispatch(setPrimaryCashAccount(cashAccountId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearCashAccountError());
  };

  const clearMessage = () => {
    dispatch(clearCashAccountMessage());
  };

  const saveCurrentCashAccount = (payload) => {
    dispatch(setCurrentCashAccount(payload));
  };

  const removeCurrentCashAccount = () => {
    dispatch(clearCurrentCashAccount());
  };

  const removeCashAccounts = () => {
    dispatch(clearCashAccounts());
  };

  const removeManagedCashAccount = () => {
    dispatch(clearManagedCashAccount());
  };

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
