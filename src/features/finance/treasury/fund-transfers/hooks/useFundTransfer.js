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

  const submitCreateFundTransfer = (payload) => {
    return dispatch(createFundTransfer(payload)).unwrap();
  };

  const fetchFundTransfers = (params = {}) => {
    return dispatch(getFundTransfers(params)).unwrap();
  };

  const fetchFundTransferById = (fundTransferId) => {
    return dispatch(getFundTransferById(fundTransferId)).unwrap();
  };

  const submitCancelFundTransfer = (fundTransferId, payload = {}) => {
    return dispatch(
      cancelFundTransfer({
        fundTransferId,
        payload,
      }),
    ).unwrap();
  };

  const clearError = () => {
    dispatch(clearFundTransferError());
  };

  const clearMessage = () => {
    dispatch(clearFundTransferMessage());
  };

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
