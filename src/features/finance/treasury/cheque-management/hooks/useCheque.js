import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createCheque,
  getCheques,
  getChequeById,
  depositCheque,
  clearCheque,
  bounceCheque,
  cancelCheque,
} from "../store/chequeThunk";

import {
  clearChequeError,
  clearChequeMessage,
  setCurrentCheque,
  clearCurrentCheque,
  clearCheques,
  clearManagedCheque,
} from "../store/chequeSlice";

import {
  selectCheques,
  selectCurrentCheque,
  selectManagedCheque,
  selectChequeStatus,
  selectChequeError,
  selectChequeMessage,
  selectCreateChequeStatus,
  selectGetChequesStatus,
  selectGetChequeStatus,
  selectDepositChequeStatus,
  selectClearChequeStatus,
  selectBounceChequeStatus,
  selectCancelChequeStatus,
} from "../store/chequeSelector";

const useCheque = () => {
  const dispatch = useDispatch();

  const cheques = useSelector(selectCheques);

  const currentCheque = useSelector(selectCurrentCheque);

  const managedCheque = useSelector(selectManagedCheque);

  const status = useSelector(selectChequeStatus);

  const error = useSelector(selectChequeError);

  const message = useSelector(selectChequeMessage);

  const createChequeStatus = useSelector(selectCreateChequeStatus);

  const getChequesStatus = useSelector(selectGetChequesStatus);

  const getChequeStatus = useSelector(selectGetChequeStatus);

  const depositChequeStatus = useSelector(selectDepositChequeStatus);

  const clearChequeStatus = useSelector(selectClearChequeStatus);

  const bounceChequeStatus = useSelector(selectBounceChequeStatus);

  const cancelChequeStatus = useSelector(selectCancelChequeStatus);

  const submitCreateCheque = useCallback((payload) => {
    return dispatch(createCheque(payload)).unwrap();
  }, [dispatch]);

  const fetchCheques = useCallback((params = {}) => {
    return dispatch(getCheques(params)).unwrap();
  }, [dispatch]);

  const fetchChequeById = useCallback((chequeId) => {
    return dispatch(getChequeById(chequeId)).unwrap();
  }, [dispatch]);

  const submitDepositCheque = useCallback((chequeId) => {
    return dispatch(depositCheque(chequeId)).unwrap();
  }, [dispatch]);

  const submitClearCheque = useCallback((chequeId, payload = {}) => {
    return dispatch(
      clearCheque({
        chequeId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitBounceCheque = useCallback((chequeId, payload = {}) => {
    return dispatch(
      bounceCheque({
        chequeId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitCancelCheque = useCallback((chequeId, payload = {}) => {
    return dispatch(
      cancelCheque({
        chequeId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearChequeError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearChequeMessage());
  }, [dispatch]);

  const saveCurrentCheque = (payload) => {
    dispatch(setCurrentCheque(payload));
  };

  const removeCurrentCheque = () => {
    dispatch(clearCurrentCheque());
  };

  const removeCheques = () => {
    dispatch(clearCheques());
  };

  const removeManagedCheque = () => {
    dispatch(clearManagedCheque());
  };

  return {
    cheques,
    currentCheque,
    managedCheque,

    status,
    error,
    message,

    createChequeStatus,
    getChequesStatus,
    getChequeStatus,
    depositChequeStatus,
    clearChequeStatus,
    bounceChequeStatus,
    cancelChequeStatus,

    createCheque: submitCreateCheque,
    getCheques: fetchCheques,
    getChequeById: fetchChequeById,
    depositCheque: submitDepositCheque,
    clearCheque: submitClearCheque,
    bounceCheque: submitBounceCheque,
    cancelCheque: submitCancelCheque,

    clearError,
    clearMessage,

    setCurrentCheque: saveCurrentCheque,

    clearCurrentCheque: removeCurrentCheque,

    clearCheques: removeCheques,

    clearManagedCheque: removeManagedCheque,
  };
};

export default useCheque;
