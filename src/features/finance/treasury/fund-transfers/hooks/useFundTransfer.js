import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createFundTransfer,
  getFundTransfers,
  getFundTransferById,
  cancelFundTransfer,
} from "../store/fundTransferThunk";

import {
  clearFundTransferError,
  clearFundTransferMessage,
  setCurrentFundTransfer,
  clearCurrentFundTransfer,
  clearFundTransfers,
  clearManagedFundTransfer,
} from "../store/fundTransferSlice";

import {
  selectFundTransfers,
  selectCurrentFundTransfer,
  selectManagedFundTransfer,
  selectFundTransferStatus,
  selectFundTransferError,
  selectFundTransferMessage,
  selectCreateFundTransferStatus,
  selectGetFundTransfersStatus,
  selectGetFundTransferStatus,
  selectCancelFundTransferStatus,
} from "../store/fundTransferSelector";

const useFundTransfer = () => {
  const dispatch = useDispatch();

  const fundTransfers = useSelector(selectFundTransfers);

  const currentFundTransfer = useSelector(selectCurrentFundTransfer);

  const managedFundTransfer = useSelector(selectManagedFundTransfer);

  const status = useSelector(selectFundTransferStatus);

  const error = useSelector(selectFundTransferError);

  const message = useSelector(selectFundTransferMessage);

  const createFundTransferStatus = useSelector(selectCreateFundTransferStatus);

  const getFundTransfersStatus = useSelector(selectGetFundTransfersStatus);

  const getFundTransferStatus = useSelector(selectGetFundTransferStatus);

  const cancelFundTransferStatus = useSelector(selectCancelFundTransferStatus);

  const submitCreateFundTransfer = useCallback((payload) => {
    return dispatch(createFundTransfer(payload)).unwrap();
  }, [dispatch]);

  const fetchFundTransfers = useCallback((params = {}) => {
    return dispatch(getFundTransfers(params)).unwrap();
  }, [dispatch]);

  const fetchFundTransferById = useCallback((fundTransferId) => {
    return dispatch(getFundTransferById(fundTransferId)).unwrap();
  }, [dispatch]);

  const submitCancelFundTransfer = useCallback((fundTransferId, payload = {}) => {
    return dispatch(
      cancelFundTransfer({
        fundTransferId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearFundTransferError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearFundTransferMessage());
  }, [dispatch]);

  const saveCurrentFundTransfer = (payload) => {
    dispatch(setCurrentFundTransfer(payload));
  };

  const removeCurrentFundTransfer = () => {
    dispatch(clearCurrentFundTransfer());
  };

  const removeFundTransfers = () => {
    dispatch(clearFundTransfers());
  };

  const removeManagedFundTransfer = () => {
    dispatch(clearManagedFundTransfer());
  };

  return {
    fundTransfers,
    currentFundTransfer,
    managedFundTransfer,

    status,
    error,
    message,

    createFundTransferStatus,
    getFundTransfersStatus,
    getFundTransferStatus,
    cancelFundTransferStatus,

    createFundTransfer: submitCreateFundTransfer,
    getFundTransfers: fetchFundTransfers,
    getFundTransferById: fetchFundTransferById,
    cancelFundTransfer: submitCancelFundTransfer,

    clearError,
    clearMessage,

    setCurrentFundTransfer: saveCurrentFundTransfer,

    clearCurrentFundTransfer: removeCurrentFundTransfer,

    clearFundTransfers: removeFundTransfers,

    clearManagedFundTransfer: removeManagedFundTransfer,
  };
};

export default useFundTransfer;
