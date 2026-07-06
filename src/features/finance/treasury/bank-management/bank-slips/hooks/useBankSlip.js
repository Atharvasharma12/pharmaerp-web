import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createBankSlip,
  getBankSlips,
  getBankSlipById,
  submitBankSlip,
  confirmBankSlip,
  rejectBankSlip,
  cancelBankSlip,
} from "../store/bankSlipThunk";

import {
  clearBankSlipError,
  clearBankSlipMessage,
  setCurrentBankSlip,
  clearCurrentBankSlip,
  clearBankSlips,
  clearManagedBankSlip,
} from "../store/bankSlipSlice";

import {
  selectBankSlips,
  selectCurrentBankSlip,
  selectManagedBankSlip,
  selectBankSlipStatus,
  selectBankSlipError,
  selectBankSlipMessage,
  selectCreateBankSlipStatus,
  selectGetBankSlipsStatus,
  selectGetBankSlipStatus,
  selectSubmitBankSlipStatus,
  selectConfirmBankSlipStatus,
  selectRejectBankSlipStatus,
  selectCancelBankSlipStatus,
} from "../store/bankSlipSelector";

const useBankSlip = () => {
  const dispatch = useDispatch();

  const bankSlips = useSelector(selectBankSlips);

  const currentBankSlip = useSelector(selectCurrentBankSlip);

  const managedBankSlip = useSelector(selectManagedBankSlip);

  const status = useSelector(selectBankSlipStatus);

  const error = useSelector(selectBankSlipError);

  const message = useSelector(selectBankSlipMessage);

  const createBankSlipStatus = useSelector(selectCreateBankSlipStatus);

  const getBankSlipsStatus = useSelector(selectGetBankSlipsStatus);

  const getBankSlipStatus = useSelector(selectGetBankSlipStatus);

  const submitBankSlipStatus = useSelector(selectSubmitBankSlipStatus);

  const confirmBankSlipStatus = useSelector(selectConfirmBankSlipStatus);

  const rejectBankSlipStatus = useSelector(selectRejectBankSlipStatus);

  const cancelBankSlipStatus = useSelector(selectCancelBankSlipStatus);

  const submitCreateBankSlip = useCallback((payload) => {
    return dispatch(createBankSlip(payload)).unwrap();
  }, [dispatch]);

  const fetchBankSlips = useCallback((params = {}) => {
    return dispatch(getBankSlips(params)).unwrap();
  }, [dispatch]);

  const fetchBankSlipById = useCallback((bankSlipId) => {
    return dispatch(getBankSlipById(bankSlipId)).unwrap();
  }, [dispatch]);

  const submitSubmitBankSlip = useCallback((bankSlipId, payload) => {
    return dispatch(
      submitBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitConfirmBankSlip = useCallback((bankSlipId, payload) => {
    return dispatch(
      confirmBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitRejectBankSlip = useCallback((bankSlipId, payload) => {
    return dispatch(
      rejectBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitCancelBankSlip = useCallback((bankSlipId, payload) => {
    return dispatch(
      cancelBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearBankSlipError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearBankSlipMessage());
  }, [dispatch]);

  const saveCurrentBankSlip = (payload) => {
    dispatch(setCurrentBankSlip(payload));
  };

  const removeCurrentBankSlip = () => {
    dispatch(clearCurrentBankSlip());
  };

  const removeBankSlips = () => {
    dispatch(clearBankSlips());
  };

  const removeManagedBankSlip = () => {
    dispatch(clearManagedBankSlip());
  };

  return {
    bankSlips,
    currentBankSlip,
    managedBankSlip,

    status,
    error,
    message,

    createBankSlipStatus,
    getBankSlipsStatus,
    getBankSlipStatus,
    submitBankSlipStatus,
    confirmBankSlipStatus,
    rejectBankSlipStatus,
    cancelBankSlipStatus,

    createBankSlip: submitCreateBankSlip,
    getBankSlips: fetchBankSlips,
    getBankSlipById: fetchBankSlipById,
    submitBankSlip: submitSubmitBankSlip,
    confirmBankSlip: submitConfirmBankSlip,
    rejectBankSlip: submitRejectBankSlip,
    cancelBankSlip: submitCancelBankSlip,

    clearError,
    clearMessage,

    setCurrentBankSlip: saveCurrentBankSlip,

    clearCurrentBankSlip: removeCurrentBankSlip,

    clearBankSlips: removeBankSlips,

    clearManagedBankSlip: removeManagedBankSlip,
  };
};

export default useBankSlip;
