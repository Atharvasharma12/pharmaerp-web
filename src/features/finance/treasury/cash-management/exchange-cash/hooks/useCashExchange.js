import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createCashExchange,
  getCashExchanges,
  getCashExchangeById,
  cancelCashExchange,
} from "../store/cashExchangeThunk";

import {
  clearCashExchangeError,
  clearCashExchangeMessage,
  setCurrentCashExchange,
  clearCurrentCashExchange,
  clearCashExchanges,
  clearManagedCashExchange,
} from "../store/cashExchangeSlice";

import {
  selectCashExchanges,
  selectCurrentCashExchange,
  selectManagedCashExchange,
  selectCashExchangeStatus,
  selectCashExchangeError,
  selectCashExchangeMessage,
  selectCreateCashExchangeStatus,
  selectGetCashExchangesStatus,
  selectGetCashExchangeStatus,
  selectCancelCashExchangeStatus,
} from "../store/cashExchangeSelector";

const useCashExchange = () => {
  const dispatch = useDispatch();

  const cashExchanges = useSelector(selectCashExchanges);
  const currentCashExchange = useSelector(selectCurrentCashExchange);
  const managedCashExchange = useSelector(selectManagedCashExchange);
  const status = useSelector(selectCashExchangeStatus);
  const error = useSelector(selectCashExchangeError);
  const message = useSelector(selectCashExchangeMessage);
  const createCashExchangeStatus = useSelector(selectCreateCashExchangeStatus);
  const getCashExchangesStatus = useSelector(selectGetCashExchangesStatus);
  const getCashExchangeStatus = useSelector(selectGetCashExchangeStatus);
  const cancelCashExchangeStatus = useSelector(selectCancelCashExchangeStatus);

  const submitCreateCashExchange = useCallback(
    (payload) => dispatch(createCashExchange(payload)).unwrap(),
    [dispatch],
  );

  const fetchCashExchanges = useCallback(
    (params = {}) => dispatch(getCashExchanges(params)).unwrap(),
    [dispatch],
  );

  const fetchCashExchangeById = useCallback(
    (cashExchangeId) => dispatch(getCashExchangeById(cashExchangeId)).unwrap(),
    [dispatch],
  );

  const submitCancelCashExchange = useCallback(
    (cashExchangeId, payload = {}) =>
      dispatch(cancelCashExchange({ cashExchangeId, payload })).unwrap(),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearCashExchangeError()),
    [dispatch],
  );

  const clearMessage = useCallback(
    () => dispatch(clearCashExchangeMessage()),
    [dispatch],
  );

  const saveCurrentCashExchange = (payload) =>
    dispatch(setCurrentCashExchange(payload));

  const removeCurrentCashExchange = () => dispatch(clearCurrentCashExchange());

  const removeCashExchanges = () => dispatch(clearCashExchanges());

  const removeManagedCashExchange = () => dispatch(clearManagedCashExchange());

  return {
    cashExchanges,
    currentCashExchange,
    managedCashExchange,

    status,
    error,
    message,

    createCashExchangeStatus,
    getCashExchangesStatus,
    getCashExchangeStatus,
    cancelCashExchangeStatus,

    createCashExchange: submitCreateCashExchange,
    getCashExchanges: fetchCashExchanges,
    getCashExchangeById: fetchCashExchangeById,
    cancelCashExchange: submitCancelCashExchange,

    clearError,
    clearMessage,

    setCurrentCashExchange: saveCurrentCashExchange,
    clearCurrentCashExchange: removeCurrentCashExchange,
    clearCashExchanges: removeCashExchanges,
    clearManagedCashExchange: removeManagedCashExchange,
  };
};

export default useCashExchange;
