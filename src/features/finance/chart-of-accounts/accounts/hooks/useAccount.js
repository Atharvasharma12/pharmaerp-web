import { useDispatch, useSelector } from "react-redux";

import {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} from "../store/accountThunk";

import {
  clearAccountError,
  clearAccountMessage,
  setCurrentAccount,
  clearCurrentAccount,
  clearAccounts,
  clearManagedAccount,
} from "../store/accountSlice";

import {
  selectAccounts,
  selectCurrentAccount,
  selectManagedAccount,
  selectAccountStatus,
  selectAccountError,
  selectAccountMessage,
  selectCreateAccountStatus,
  selectGetAccountsStatus,
  selectGetAccountStatus,
  selectUpdateAccountStatus,
  selectDeleteAccountStatus,
} from "../store/accountSelector";

const useAccount = () => {
  const dispatch = useDispatch();

  const accounts = useSelector(selectAccounts);
  const currentAccount = useSelector(selectCurrentAccount);
  const managedAccount = useSelector(selectManagedAccount);

  const status = useSelector(selectAccountStatus);
  const error = useSelector(selectAccountError);
  const message = useSelector(selectAccountMessage);

  const createAccountStatus = useSelector(selectCreateAccountStatus);

  const getAccountsStatus = useSelector(selectGetAccountsStatus);

  const getAccountStatus = useSelector(selectGetAccountStatus);

  const updateAccountStatus = useSelector(selectUpdateAccountStatus);

  const deleteAccountStatus = useSelector(selectDeleteAccountStatus);

  const submitCreateAccount = (payload) => {
    return dispatch(createAccount(payload)).unwrap();
  };

  const fetchAccounts = (params = {}) => {
    return dispatch(getAccounts(params)).unwrap();
  };

  const fetchAccountById = (accountId) => {
    return dispatch(getAccountById(accountId)).unwrap();
  };

  const submitUpdateAccount = (accountId, payload) => {
    return dispatch(
      updateAccount({
        accountId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteAccount = (accountId) => {
    return dispatch(deleteAccount(accountId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearAccountError());
  };

  const clearMessage = () => {
    dispatch(clearAccountMessage());
  };

  const saveCurrentAccount = (payload) => {
    dispatch(setCurrentAccount(payload));
  };

  const removeCurrentAccount = () => {
    dispatch(clearCurrentAccount());
  };

  const removeAccounts = () => {
    dispatch(clearAccounts());
  };

  const removeManagedAccount = () => {
    dispatch(clearManagedAccount());
  };

  return {
    accounts,
    currentAccount,
    managedAccount,

    status,
    error,
    message,

    createAccountStatus,
    getAccountsStatus,
    getAccountStatus,
    updateAccountStatus,
    deleteAccountStatus,

    createAccount: submitCreateAccount,
    getAccounts: fetchAccounts,
    getAccountById: fetchAccountById,
    updateAccount: submitUpdateAccount,
    deleteAccount: submitDeleteAccount,

    clearError,
    clearMessage,

    setCurrentAccount: saveCurrentAccount,
    clearCurrentAccount: removeCurrentAccount,
    clearAccounts: removeAccounts,
    clearManagedAccount: removeManagedAccount,
  };
};

export default useAccount;
