import { useDispatch, useSelector } from "react-redux";

import {
  createJournalVoucher,
  getJournalVouchers,
  getJournalVoucherById,
  updateJournalVoucher,
  postJournalVoucher,
  cancelJournalVoucher,
  submitJournalVoucherApproval,
  approveJournalVoucher,
  reverseJournalVoucher,
} from "../store/journalVoucherThunk";

import {
  clearJournalVoucherError,
  clearJournalVoucherMessage,
  setCurrentJournalVoucher,
  clearCurrentJournalVoucher,
  clearJournalVouchers,
  clearManagedJournalVoucher,
} from "../store/journalVoucherSlice";

import {
  selectJournalVouchers,
  selectCurrentJournalVoucher,
  selectManagedJournalVoucher,
  selectJournalVoucherStatus,
  selectJournalVoucherError,
  selectJournalVoucherMessage,
  selectCreateJournalVoucherStatus,
  selectGetJournalVouchersStatus,
  selectGetJournalVoucherStatus,
  selectUpdateJournalVoucherStatus,
  selectPostJournalVoucherStatus,
  selectCancelJournalVoucherStatus,
  selectSubmitJournalVoucherApprovalStatus,
  selectApproveJournalVoucherStatus,
  selectReverseJournalVoucherStatus,
} from "../store/journalVoucherSelector";

const useJournalVoucher = () => {
  const dispatch = useDispatch();

  const journalVouchers = useSelector(selectJournalVouchers);

  const currentJournalVoucher = useSelector(selectCurrentJournalVoucher);

  const managedJournalVoucher = useSelector(selectManagedJournalVoucher);

  const status = useSelector(selectJournalVoucherStatus);
  const error = useSelector(selectJournalVoucherError);
  const message = useSelector(selectJournalVoucherMessage);

  const createJournalVoucherStatus = useSelector(
    selectCreateJournalVoucherStatus,
  );

  const getJournalVouchersStatus = useSelector(selectGetJournalVouchersStatus);

  const getJournalVoucherStatus = useSelector(selectGetJournalVoucherStatus);

  const updateJournalVoucherStatus = useSelector(
    selectUpdateJournalVoucherStatus,
  );

  const postJournalVoucherStatus = useSelector(selectPostJournalVoucherStatus);

  const cancelJournalVoucherStatus = useSelector(
    selectCancelJournalVoucherStatus,
  );

  const submitJournalVoucherApprovalStatus = useSelector(
    selectSubmitJournalVoucherApprovalStatus,
  );

  const approveJournalVoucherStatus = useSelector(
    selectApproveJournalVoucherStatus,
  );

  const reverseJournalVoucherStatus = useSelector(
    selectReverseJournalVoucherStatus,
  );

  const submitCreateJournalVoucher = (payload) => {
    return dispatch(createJournalVoucher(payload)).unwrap();
  };

  const fetchJournalVouchers = (params = {}) => {
    return dispatch(getJournalVouchers(params)).unwrap();
  };

  const fetchJournalVoucherById = (voucherId) => {
    return dispatch(getJournalVoucherById(voucherId)).unwrap();
  };

  const submitUpdateJournalVoucher = (voucherId, payload) => {
    return dispatch(
      updateJournalVoucher({
        voucherId,
        payload,
      }),
    ).unwrap();
  };

  const submitPostJournalVoucher = (voucherId) => {
    return dispatch(postJournalVoucher(voucherId)).unwrap();
  };

  const submitCancelJournalVoucher = (voucherId) => {
    return dispatch(cancelJournalVoucher(voucherId)).unwrap();
  };

  const submitJournalVoucherForApproval = (voucherId) => {
    return dispatch(submitJournalVoucherApproval(voucherId)).unwrap();
  };

  const submitApproveJournalVoucher = (voucherId) => {
    return dispatch(approveJournalVoucher(voucherId)).unwrap();
  };

  const submitReverseJournalVoucher = (voucherId) => {
    return dispatch(reverseJournalVoucher(voucherId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearJournalVoucherError());
  };

  const clearMessage = () => {
    dispatch(clearJournalVoucherMessage());
  };

  const saveCurrentJournalVoucher = (payload) => {
    dispatch(setCurrentJournalVoucher(payload));
  };

  const removeCurrentJournalVoucher = () => {
    dispatch(clearCurrentJournalVoucher());
  };

  const removeJournalVouchers = () => {
    dispatch(clearJournalVouchers());
  };

  const removeManagedJournalVoucher = () => {
    dispatch(clearManagedJournalVoucher());
  };

  return {
    journalVouchers,
    currentJournalVoucher,
    managedJournalVoucher,

    status,
    error,
    message,

    createJournalVoucherStatus,
    getJournalVouchersStatus,
    getJournalVoucherStatus,
    updateJournalVoucherStatus,
    postJournalVoucherStatus,
    cancelJournalVoucherStatus,
    submitJournalVoucherApprovalStatus,
    approveJournalVoucherStatus,
    reverseJournalVoucherStatus,

    createJournalVoucher: submitCreateJournalVoucher,
    getJournalVouchers: fetchJournalVouchers,
    getJournalVoucherById: fetchJournalVoucherById,
    updateJournalVoucher: submitUpdateJournalVoucher,
    postJournalVoucher: submitPostJournalVoucher,
    cancelJournalVoucher: submitCancelJournalVoucher,
    submitJournalVoucherApproval: submitJournalVoucherForApproval,
    approveJournalVoucher: submitApproveJournalVoucher,
    reverseJournalVoucher: submitReverseJournalVoucher,

    clearError,
    clearMessage,

    setCurrentJournalVoucher: saveCurrentJournalVoucher,

    clearCurrentJournalVoucher: removeCurrentJournalVoucher,

    clearJournalVouchers: removeJournalVouchers,

    clearManagedJournalVoucher: removeManagedJournalVoucher,
  };
};

export default useJournalVoucher;
