import { useDispatch, useSelector } from "react-redux";

import {
  setAccountOpeningBalance,
  setCustomerOpeningBalance,
  setSupplierOpeningBalance,
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

  const submitAccountOpeningBalance = (payload) => {
    return dispatch(setAccountOpeningBalance(payload)).unwrap();
  };

  const submitCustomerOpeningBalance = (payload) => {
    return dispatch(setCustomerOpeningBalance(payload)).unwrap();
  };

  const submitSupplierOpeningBalance = (payload) => {
    return dispatch(setSupplierOpeningBalance(payload)).unwrap();
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

    setAccountOpeningBalance: submitAccountOpeningBalance,
    setCustomerOpeningBalance: submitCustomerOpeningBalance,
    setSupplierOpeningBalance: submitSupplierOpeningBalance,

    clearError,
    clearMessage,
    clearResult,
  };
};

export default useOpeningBalance;
