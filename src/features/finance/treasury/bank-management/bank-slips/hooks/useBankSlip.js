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

  const submitCreateBankSlip = (payload) => {
    return dispatch(createBankSlip(payload)).unwrap();
  };

  const fetchBankSlips = (params = {}) => {
    return dispatch(getBankSlips(params)).unwrap();
  };

  const fetchBankSlipById = (bankSlipId) => {
    return dispatch(getBankSlipById(bankSlipId)).unwrap();
  };

  const submitSubmitBankSlip = (bankSlipId, payload) => {
    return dispatch(
      submitBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  };

  const submitConfirmBankSlip = (bankSlipId, payload) => {
    return dispatch(
      confirmBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  };

  const submitRejectBankSlip = (bankSlipId, payload) => {
    return dispatch(
      rejectBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  };

  const submitCancelBankSlip = (bankSlipId, payload) => {
    return dispatch(
      cancelBankSlip({
        bankSlipId,
        payload,
      }),
    ).unwrap();
  };

  const clearError = () => {
    dispatch(clearBankSlipError());
  };

  const clearMessage = () => {
    dispatch(clearBankSlipMessage());
  };

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
