import { useDispatch, useSelector } from "react-redux";

import { getLedger, recalculateLedger } from "../store/ledgerThunk";

import {
  clearLedgerError,
  clearLedgerMessage,
  clearLedgerEntries,
} from "../store/ledgerSlice";

import {
  selectLedgerEntries,
  selectLedgerStatus,
  selectLedgerError,
  selectLedgerMessage,
  selectGetLedgerStatus,
  selectRecalculateLedgerStatus,
} from "../store/ledgerSelector";

const useLedger = () => {
  const dispatch = useDispatch();

  const ledgerEntries = useSelector(selectLedgerEntries);

  const status = useSelector(selectLedgerStatus);
  const error = useSelector(selectLedgerError);
  const message = useSelector(selectLedgerMessage);

  const getLedgerStatus = useSelector(selectGetLedgerStatus);

  const recalculateLedgerStatus = useSelector(selectRecalculateLedgerStatus);

  const fetchLedger = (params = {}) => {
    return dispatch(getLedger(params)).unwrap();
  };

  const submitRecalculateLedger = (payload) => {
    return dispatch(recalculateLedger(payload)).unwrap();
  };

  const clearError = () => {
    dispatch(clearLedgerError());
  };

  const clearMessage = () => {
    dispatch(clearLedgerMessage());
  };

  const removeLedgerEntries = () => {
    dispatch(clearLedgerEntries());
  };

  return {
    ledgerEntries,

    status,
    error,
    message,

    getLedgerStatus,
    recalculateLedgerStatus,

    getLedger: fetchLedger,
    recalculateLedger: submitRecalculateLedger,

    clearError,
    clearMessage,

    clearLedgerEntries: removeLedgerEntries,
  };
};

export default useLedger;
