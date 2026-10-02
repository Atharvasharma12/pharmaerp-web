import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createBankDepositSlip,
  getBankDepositSlips,
  getBankDepositSlipById,
  confirmDeposit,
  cancelBankDepositSlip,
} from "../store/bankDepositSlipThunk";

import {
  clearBankDepositSlipError,
  clearBankDepositSlipMessage,
  setCurrentBankDepositSlip,
  clearCurrentBankDepositSlip,
  clearBankDepositSlips,
  clearManagedBankDepositSlip,
} from "../store/bankDepositSlipSlice";

import {
  selectBankDepositSlips,
  selectCurrentBankDepositSlip,
  selectManagedBankDepositSlip,
  selectBankDepositSlipStatus,
  selectBankDepositSlipError,
  selectBankDepositSlipMessage,
  selectCreateBankDepositSlipStatus,
  selectGetBankDepositSlipsStatus,
  selectGetBankDepositSlipStatus,
  selectConfirmDepositStatus,
  selectCancelBankDepositSlipStatus,
} from "../store/bankDepositSlipSelector";

const useBankDepositSlip = () => {
  const dispatch = useDispatch();

  const bankDepositSlips = useSelector(selectBankDepositSlips);

  const currentBankDepositSlip = useSelector(selectCurrentBankDepositSlip);

  const managedBankDepositSlip = useSelector(selectManagedBankDepositSlip);

  const status = useSelector(selectBankDepositSlipStatus);

  const error = useSelector(selectBankDepositSlipError);

  const message = useSelector(selectBankDepositSlipMessage);

  const createBankDepositSlipStatus = useSelector(selectCreateBankDepositSlipStatus);

  const getBankDepositSlipsStatus = useSelector(selectGetBankDepositSlipsStatus);

  const getBankDepositSlipStatus = useSelector(selectGetBankDepositSlipStatus);

  const confirmDepositStatus = useSelector(selectConfirmDepositStatus);

  const cancelBankDepositSlipStatus = useSelector(selectCancelBankDepositSlipStatus);

  const submitCreateBankDepositSlip = useCallback((payload) => {
    return dispatch(createBankDepositSlip(payload)).unwrap();
  }, [dispatch]);

  const fetchBankDepositSlips = useCallback((params = {}) => {
    return dispatch(getBankDepositSlips(params)).unwrap();
  }, [dispatch]);

  const fetchBankDepositSlipById = useCallback((slipId) => {
    return dispatch(getBankDepositSlipById(slipId)).unwrap();
  }, [dispatch]);

  const submitConfirmDeposit = useCallback((slipId, payload = {}) => {
    return dispatch(
      confirmDeposit({
        slipId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitCancelBankDepositSlip = useCallback((slipId, payload = {}) => {
    return dispatch(
      cancelBankDepositSlip({
        slipId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearBankDepositSlipError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearBankDepositSlipMessage());
  }, [dispatch]);

  const saveCurrentBankDepositSlip = useCallback((payload) => {
    dispatch(setCurrentBankDepositSlip(payload));
  }, [dispatch]);

  const removeCurrentBankDepositSlip = useCallback(() => {
    dispatch(clearCurrentBankDepositSlip());
  }, [dispatch]);

  const removeBankDepositSlips = useCallback(() => {
    dispatch(clearBankDepositSlips());
  }, [dispatch]);

  const removeManagedBankDepositSlip = useCallback(() => {
    dispatch(clearManagedBankDepositSlip());
  }, [dispatch]);

  return {
    bankDepositSlips,
    currentBankDepositSlip,
    managedBankDepositSlip,

    status,
    error,
    message,

    createBankDepositSlipStatus,
    getBankDepositSlipsStatus,
    getBankDepositSlipStatus,
    confirmDepositStatus,
    cancelBankDepositSlipStatus,

    createBankDepositSlip: submitCreateBankDepositSlip,
    getBankDepositSlips: fetchBankDepositSlips,
    getBankDepositSlipById: fetchBankDepositSlipById,
    confirmDeposit: submitConfirmDeposit,
    cancelBankDepositSlip: submitCancelBankDepositSlip,

    clearError,
    clearMessage,

    setCurrentBankDepositSlip: saveCurrentBankDepositSlip,

    clearCurrentBankDepositSlip: removeCurrentBankDepositSlip,

    clearBankDepositSlips: removeBankDepositSlips,

    clearManagedBankDepositSlip: removeManagedBankDepositSlip,
  };
};

export default useBankDepositSlip;
