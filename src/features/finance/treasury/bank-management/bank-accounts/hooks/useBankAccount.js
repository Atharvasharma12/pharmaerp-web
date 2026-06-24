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

  const submitCreateBankAccount = (payload) => {
    return dispatch(createBankAccount(payload)).unwrap();
  };

  const fetchBankAccounts = (params = {}) => {
    return dispatch(getBankAccounts(params)).unwrap();
  };

  const fetchBankAccountById = (bankAccountId) => {
    return dispatch(getBankAccountById(bankAccountId)).unwrap();
  };

  const submitUpdateBankAccount = (bankAccountId, payload) => {
    return dispatch(
      updateBankAccount({
        bankAccountId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteBankAccount = (bankAccountId) => {
    return dispatch(deleteBankAccount(bankAccountId)).unwrap();
  };

  const submitSetPrimaryBankAccount = (bankAccountId) => {
    return dispatch(setPrimaryBankAccount(bankAccountId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearBankAccountError());
  };

  const clearMessage = () => {
    dispatch(clearBankAccountMessage());
  };

  const saveCurrentBankAccount = (payload) => {
    dispatch(setCurrentBankAccount(payload));
  };

  const removeCurrentBankAccount = () => {
    dispatch(clearCurrentBankAccount());
  };

  const removeBankAccounts = () => {
    dispatch(clearBankAccounts());
  };

  const removeManagedBankAccount = () => {
    dispatch(clearManagedBankAccount());
  };

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
