import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createCashDenomination,
  getCashDenominations,
  getCashDenominationById,
  confirmCashDenomination,
  cancelCashDenomination,
} from "../store/cashDenominationThunk";

import {
  clearCashDenominationError,
  clearCashDenominationMessage,
  setCurrentCashDenomination,
  clearCurrentCashDenomination,
  clearCashDenominations,
  clearManagedCashDenomination,
} from "../store/cashDenominationSlice";

import {
  selectCashDenominations,
  selectCurrentCashDenomination,
  selectManagedCashDenomination,
  selectCashDenominationStatus,
  selectCashDenominationError,
  selectCashDenominationMessage,
  selectCreateCashDenominationStatus,
  selectGetCashDenominationsStatus,
  selectGetCashDenominationStatus,
  selectConfirmCashDenominationStatus,
  selectCancelCashDenominationStatus,
} from "../store/cashDenominationSelector";

const useCashDenomination = () => {
  const dispatch = useDispatch();

  const cashDenominations = useSelector(selectCashDenominations);

  const currentCashDenomination = useSelector(selectCurrentCashDenomination);

  const managedCashDenomination = useSelector(selectManagedCashDenomination);

  const status = useSelector(selectCashDenominationStatus);

  const error = useSelector(selectCashDenominationError);

  const message = useSelector(selectCashDenominationMessage);

  const createCashDenominationStatus = useSelector(
    selectCreateCashDenominationStatus,
  );

  const getCashDenominationsStatus = useSelector(
    selectGetCashDenominationsStatus,
  );

  const getCashDenominationStatus = useSelector(
    selectGetCashDenominationStatus,
  );

  const confirmCashDenominationStatus = useSelector(
    selectConfirmCashDenominationStatus,
  );

  const cancelCashDenominationStatus = useSelector(
    selectCancelCashDenominationStatus,
  );

  const submitCreateCashDenomination = useCallback((payload) => {
    return dispatch(createCashDenomination(payload)).unwrap();
  }, [dispatch]);

  const fetchCashDenominations = useCallback((params = {}) => {
    return dispatch(getCashDenominations(params)).unwrap();
  }, [dispatch]);

  const fetchCashDenominationById = useCallback((cashDenominationId) => {
    return dispatch(getCashDenominationById(cashDenominationId)).unwrap();
  }, [dispatch]);

  const submitConfirmCashDenomination = useCallback((cashDenominationId, payload) => {
    return dispatch(
      confirmCashDenomination({
        cashDenominationId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitCancelCashDenomination = useCallback((cashDenominationId, payload) => {
    return dispatch(
      cancelCashDenomination({
        cashDenominationId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearCashDenominationError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearCashDenominationMessage());
  }, [dispatch]);

  const saveCurrentCashDenomination = (payload) => {
    dispatch(setCurrentCashDenomination(payload));
  };

  const removeCurrentCashDenomination = () => {
    dispatch(clearCurrentCashDenomination());
  };

  const removeCashDenominations = () => {
    dispatch(clearCashDenominations());
  };

  const removeManagedCashDenomination = () => {
    dispatch(clearManagedCashDenomination());
  };

  return {
    cashDenominations,
    currentCashDenomination,
    managedCashDenomination,

    status,
    error,
    message,

    createCashDenominationStatus,
    getCashDenominationsStatus,
    getCashDenominationStatus,
    confirmCashDenominationStatus,
    cancelCashDenominationStatus,

    createCashDenomination: submitCreateCashDenomination,

    getCashDenominations: fetchCashDenominations,

    getCashDenominationById: fetchCashDenominationById,

    confirmCashDenomination: submitConfirmCashDenomination,

    cancelCashDenomination: submitCancelCashDenomination,

    clearError,
    clearMessage,

    setCurrentCashDenomination: saveCurrentCashDenomination,

    clearCurrentCashDenomination: removeCurrentCashDenomination,

    clearCashDenominations: removeCashDenominations,

    clearManagedCashDenomination: removeManagedCashDenomination,
  };
};

export default useCashDenomination;
