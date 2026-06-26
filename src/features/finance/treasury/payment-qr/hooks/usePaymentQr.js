import { useDispatch, useSelector } from "react-redux";

import {
  createPaymentQr,
  getPaymentQrs,
  getPaymentQrById,
  updatePaymentQr,
  deletePaymentQr,
  setPrimaryPaymentQr,
} from "../store/paymentQrThunk";

import {
  clearPaymentQrError,
  clearPaymentQrMessage,
  setCurrentPaymentQr,
  clearCurrentPaymentQr,
  clearPaymentQrs,
  clearManagedPaymentQr,
} from "../store/paymentQrSlice";

import {
  selectPaymentQrs,
  selectCurrentPaymentQr,
  selectManagedPaymentQr,
  selectPaymentQrStatus,
  selectPaymentQrError,
  selectPaymentQrMessage,
  selectCreatePaymentQrStatus,
  selectGetPaymentQrsStatus,
  selectGetPaymentQrStatus,
  selectUpdatePaymentQrStatus,
  selectDeletePaymentQrStatus,
  selectSetPrimaryPaymentQrStatus,
} from "../store/paymentQrSelector";

const usePaymentQr = () => {
  const dispatch = useDispatch();

  const paymentQrs = useSelector(selectPaymentQrs);

  const currentPaymentQr = useSelector(selectCurrentPaymentQr);

  const managedPaymentQr = useSelector(selectManagedPaymentQr);

  const status = useSelector(selectPaymentQrStatus);

  const error = useSelector(selectPaymentQrError);

  const message = useSelector(selectPaymentQrMessage);

  const createPaymentQrStatus = useSelector(selectCreatePaymentQrStatus);

  const getPaymentQrsStatus = useSelector(selectGetPaymentQrsStatus);

  const getPaymentQrStatus = useSelector(selectGetPaymentQrStatus);

  const updatePaymentQrStatus = useSelector(selectUpdatePaymentQrStatus);

  const deletePaymentQrStatus = useSelector(selectDeletePaymentQrStatus);

  const setPrimaryPaymentQrStatus = useSelector(
    selectSetPrimaryPaymentQrStatus,
  );

  const submitCreatePaymentQr = (payload) => {
    return dispatch(createPaymentQr(payload)).unwrap();
  };

  const fetchPaymentQrs = (params = {}) => {
    return dispatch(getPaymentQrs(params)).unwrap();
  };

  const fetchPaymentQrById = (paymentQrId) => {
    return dispatch(getPaymentQrById(paymentQrId)).unwrap();
  };

  const submitUpdatePaymentQr = (paymentQrId, payload) => {
    return dispatch(
      updatePaymentQr({
        paymentQrId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeletePaymentQr = (paymentQrId) => {
    return dispatch(deletePaymentQr(paymentQrId)).unwrap();
  };

  const submitSetPrimaryPaymentQr = (paymentQrId) => {
    return dispatch(setPrimaryPaymentQr(paymentQrId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearPaymentQrError());
  };

  const clearMessage = () => {
    dispatch(clearPaymentQrMessage());
  };

  const saveCurrentPaymentQr = (payload) => {
    dispatch(setCurrentPaymentQr(payload));
  };

  const removeCurrentPaymentQr = () => {
    dispatch(clearCurrentPaymentQr());
  };

  const removePaymentQrs = () => {
    dispatch(clearPaymentQrs());
  };

  const removeManagedPaymentQr = () => {
    dispatch(clearManagedPaymentQr());
  };

  return {
    paymentQrs,
    currentPaymentQr,
    managedPaymentQr,

    status,
    error,
    message,

    createPaymentQrStatus,
    getPaymentQrsStatus,
    getPaymentQrStatus,
    updatePaymentQrStatus,
    deletePaymentQrStatus,
    setPrimaryPaymentQrStatus,

    createPaymentQr: submitCreatePaymentQr,
    getPaymentQrs: fetchPaymentQrs,
    getPaymentQrById: fetchPaymentQrById,
    updatePaymentQr: submitUpdatePaymentQr,
    deletePaymentQr: submitDeletePaymentQr,
    setPrimaryPaymentQr: submitSetPrimaryPaymentQr,

    clearError,
    clearMessage,

    setCurrentPaymentQr: saveCurrentPaymentQr,

    clearCurrentPaymentQr: removeCurrentPaymentQr,

    clearPaymentQrs: removePaymentQrs,

    clearManagedPaymentQr: removeManagedPaymentQr,
  };
};

export default usePaymentQr;
