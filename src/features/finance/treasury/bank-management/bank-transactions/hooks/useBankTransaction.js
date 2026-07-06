import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createBankTransaction,
  getBankTransactions,
  getBankTransactionById,
  cancelBankTransaction,
} from "../store/bankTransactionThunk";

import {
  clearBankTransactionError,
  clearBankTransactionMessage,
  setCurrentBankTransaction,
  clearCurrentBankTransaction,
  clearBankTransactions,
  clearManagedBankTransaction,
} from "../store/bankTransactionSlice";

import {
  selectBankTransactions,
  selectCurrentBankTransaction,
  selectManagedBankTransaction,
  selectBankTransactionStatus,
  selectBankTransactionError,
  selectBankTransactionMessage,
  selectCreateBankTransactionStatus,
  selectGetBankTransactionsStatus,
  selectGetBankTransactionStatus,
  selectCancelBankTransactionStatus,
} from "../store/bankTransactionSelector";

const useBankTransaction = () => {
  const dispatch = useDispatch();

  const bankTransactions = useSelector(selectBankTransactions);

  const currentBankTransaction = useSelector(selectCurrentBankTransaction);

  const managedBankTransaction = useSelector(selectManagedBankTransaction);

  const status = useSelector(selectBankTransactionStatus);

  const error = useSelector(selectBankTransactionError);

  const message = useSelector(selectBankTransactionMessage);

  const createBankTransactionStatus = useSelector(
    selectCreateBankTransactionStatus,
  );

  const getBankTransactionsStatus = useSelector(
    selectGetBankTransactionsStatus,
  );

  const getBankTransactionStatus = useSelector(selectGetBankTransactionStatus);

  const cancelBankTransactionStatus = useSelector(
    selectCancelBankTransactionStatus,
  );

  const submitCreateBankTransaction = useCallback((payload) => {
    return dispatch(createBankTransaction(payload)).unwrap();
  }, [dispatch]);

  const fetchBankTransactions = useCallback((params = {}) => {
    return dispatch(getBankTransactions(params)).unwrap();
  }, [dispatch]);

  const fetchBankTransactionById = useCallback((bankTransactionId) => {
    return dispatch(getBankTransactionById(bankTransactionId)).unwrap();
  }, [dispatch]);

  const submitCancelBankTransaction = useCallback((bankTransactionId, payload) => {
    return dispatch(
      cancelBankTransaction({
        bankTransactionId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearBankTransactionError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearBankTransactionMessage());
  }, [dispatch]);

  const saveCurrentBankTransaction = (payload) => {
    dispatch(setCurrentBankTransaction(payload));
  };

  const removeCurrentBankTransaction = () => {
    dispatch(clearCurrentBankTransaction());
  };

  const removeBankTransactions = () => {
    dispatch(clearBankTransactions());
  };

  const removeManagedBankTransaction = () => {
    dispatch(clearManagedBankTransaction());
  };

  return {
    bankTransactions,
    currentBankTransaction,
    managedBankTransaction,

    status,
    error,
    message,

    createBankTransactionStatus,
    getBankTransactionsStatus,
    getBankTransactionStatus,
    cancelBankTransactionStatus,

    createBankTransaction: submitCreateBankTransaction,
    getBankTransactions: fetchBankTransactions,
    getBankTransactionById: fetchBankTransactionById,
    cancelBankTransaction: submitCancelBankTransaction,

    clearError,
    clearMessage,

    setCurrentBankTransaction: saveCurrentBankTransaction,
    clearCurrentBankTransaction: removeCurrentBankTransaction,

    clearBankTransactions: removeBankTransactions,

    clearManagedBankTransaction: removeManagedBankTransaction,
  };
};

export default useBankTransaction;
