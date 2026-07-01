import { useDispatch, useSelector } from "react-redux";

import {
  setAccountOpeningBalance,
  setCustomerOpeningBalance,
  setSupplierOpeningBalance,
  setBankAccountOpeningBalance,
  setCashAccountOpeningBalance,
} from "../store/openingBalanceThunk";

import {
  clearOpeningBalanceError,
  clearOpeningBalanceMessage,
  clearOpeningBalanceResult,
} from "../store/openingBalanceSlice";

import {
  selectOpeningBalanceResult,
  selectOpeningBalanceStatus,
  selectOpeningBalanceError,
  selectOpeningBalanceMessage,
  selectSetAccountOpeningBalanceStatus,
  selectSetCustomerOpeningBalanceStatus,
  selectSetSupplierOpeningBalanceStatus,
  selectSetBankAccountOpeningBalanceStatus,
  selectSetCashAccountOpeningBalanceStatus,
} from "../store/openingBalanceSelector";

const useOpeningBalance = () => {
  const dispatch = useDispatch();

  const result = useSelector(selectOpeningBalanceResult);

  const status = useSelector(selectOpeningBalanceStatus);
  const error = useSelector(selectOpeningBalanceError);
  const message = useSelector(selectOpeningBalanceMessage);

  const setAccountOpeningBalanceStatus = useSelector(
    selectSetAccountOpeningBalanceStatus,
  );

  const setCustomerOpeningBalanceStatus = useSelector(
    selectSetCustomerOpeningBalanceStatus,
  );

  const setSupplierOpeningBalanceStatus = useSelector(
    selectSetSupplierOpeningBalanceStatus,
  );

  const setBankAccountOpeningBalanceStatus = useSelector(
    selectSetBankAccountOpeningBalanceStatus,
  );

  const setCashAccountOpeningBalanceStatus = useSelector(
    selectSetCashAccountOpeningBalanceStatus,
  );

  const submitAccountOpeningBalance = (payload) => {
    return dispatch(setAccountOpeningBalance(payload)).unwrap();
  };

  const submitCustomerOpeningBalance = (payload) => {
    return dispatch(setCustomerOpeningBalance(payload)).unwrap();
  };

  const submitSupplierOpeningBalance = (payload) => {
    return dispatch(setSupplierOpeningBalance(payload)).unwrap();
  };

  const submitBankAccountOpeningBalance = (payload) => {
    return dispatch(setBankAccountOpeningBalance(payload)).unwrap();
  };

  const submitCashAccountOpeningBalance = (payload) => {
    return dispatch(setCashAccountOpeningBalance(payload)).unwrap();
  };

  const clearError = () => {
    dispatch(clearOpeningBalanceError());
  };

  const clearMessage = () => {
    dispatch(clearOpeningBalanceMessage());
  };

  const clearResult = () => {
    dispatch(clearOpeningBalanceResult());
  };

  return {
    result,

    status,
    error,
    message,

    setAccountOpeningBalanceStatus,
    setCustomerOpeningBalanceStatus,
    setSupplierOpeningBalanceStatus,
    setBankAccountOpeningBalanceStatus,
    setCashAccountOpeningBalanceStatus,

    setAccountOpeningBalance: submitAccountOpeningBalance,
    setCustomerOpeningBalance: submitCustomerOpeningBalance,
    setSupplierOpeningBalance: submitSupplierOpeningBalance,
    setBankAccountOpeningBalance: submitBankAccountOpeningBalance,
    setCashAccountOpeningBalance: submitCashAccountOpeningBalance,

    clearError,
    clearMessage,
    clearResult,
  };
};

export default useOpeningBalance;
