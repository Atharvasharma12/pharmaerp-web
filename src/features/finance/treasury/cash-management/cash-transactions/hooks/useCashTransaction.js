import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createCashTransaction,
  getCashTransactions,
  getCashTransactionById,
  cancelCashTransaction,
} from "../store/cashTransactionThunk";

import {
  clearCashTransactionError,
  clearCashTransactionMessage,
  setCurrentCashTransaction,
  clearCurrentCashTransaction,
  clearCashTransactions,
  clearManagedCashTransaction,
} from "../store/cashTransactionSlice";

import {
  selectCashTransactions,
  selectCurrentCashTransaction,
  selectManagedCashTransaction,
  selectCashTransactionStatus,
  selectCashTransactionError,
  selectCashTransactionMessage,
  selectCreateCashTransactionStatus,
  selectGetCashTransactionsStatus,
  selectGetCashTransactionStatus,
  selectCancelCashTransactionStatus,
} from "../store/cashTransactionSelector";

const useCashTransaction = () => {
  const dispatch = useDispatch();

  const cashTransactions = useSelector(selectCashTransactions);

  const currentCashTransaction = useSelector(selectCurrentCashTransaction);

  const managedCashTransaction = useSelector(selectManagedCashTransaction);

  const status = useSelector(selectCashTransactionStatus);

  const error = useSelector(selectCashTransactionError);

  const message = useSelector(selectCashTransactionMessage);

  const createCashTransactionStatus = useSelector(
    selectCreateCashTransactionStatus,
  );

  const getCashTransactionsStatus = useSelector(
    selectGetCashTransactionsStatus,
  );

  const getCashTransactionStatus = useSelector(selectGetCashTransactionStatus);

  const cancelCashTransactionStatus = useSelector(
    selectCancelCashTransactionStatus,
  );

  const submitCreateCashTransaction = useCallback((payload) => {
    return dispatch(createCashTransaction(payload)).unwrap();
  }, [dispatch]);

  const fetchCashTransactions = useCallback((params = {}) => {
    return dispatch(getCashTransactions(params)).unwrap();
  }, [dispatch]);

  const fetchCashTransactionById = useCallback((cashTransactionId) => {
    return dispatch(getCashTransactionById(cashTransactionId)).unwrap();
  }, [dispatch]);

  const submitCancelCashTransaction = useCallback((cashTransactionId, payload) => {
    return dispatch(
      cancelCashTransaction({
        cashTransactionId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearCashTransactionError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearCashTransactionMessage());
  }, [dispatch]);

  const saveCurrentCashTransaction = (payload) => {
    dispatch(setCurrentCashTransaction(payload));
  };

  const removeCurrentCashTransaction = () => {
    dispatch(clearCurrentCashTransaction());
  };

  const removeCashTransactions = () => {
    dispatch(clearCashTransactions());
  };

  const removeManagedCashTransaction = () => {
    dispatch(clearManagedCashTransaction());
  };

  return {
    cashTransactions,
    currentCashTransaction,
    managedCashTransaction,

    status,
    error,
    message,

    createCashTransactionStatus,
    getCashTransactionsStatus,
    getCashTransactionStatus,
    cancelCashTransactionStatus,

    createCashTransaction: submitCreateCashTransaction,
    getCashTransactions: fetchCashTransactions,
    getCashTransactionById: fetchCashTransactionById,
    cancelCashTransaction: submitCancelCashTransaction,

    clearError,
    clearMessage,

    setCurrentCashTransaction: saveCurrentCashTransaction,
    clearCurrentCashTransaction: removeCurrentCashTransaction,

    clearCashTransactions: removeCashTransactions,

    clearManagedCashTransaction: removeManagedCashTransaction,
  };
};

export default useCashTransaction;
