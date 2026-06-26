import { useDispatch, useSelector } from "react-redux";

import {
  createFinancialPeriod,
  getFinancialPeriods,
  getCurrentFinancialPeriod,
  updateFinancialPeriodStatus,
} from "../store/financialPeriodThunk";

import {
  clearFinancialPeriodError,
  clearFinancialPeriodMessage,
  setCurrentFinancialPeriod,
  clearCurrentFinancialPeriod,
  clearFinancialPeriods,
  clearManagedFinancialPeriod,
} from "../store/financialPeriodSlice";

import {
  selectFinancialPeriods,
  selectCurrentFinancialPeriod,
  selectManagedFinancialPeriod,
  selectFinancialPeriodStatus,
  selectFinancialPeriodError,
  selectFinancialPeriodMessage,
  selectCreateFinancialPeriodStatus,
  selectGetFinancialPeriodsStatus,
  selectGetCurrentFinancialPeriodStatus,
  selectUpdateFinancialPeriodStatusStatus,
} from "../store/financialPeriodSelector";

const useFinancialPeriod = () => {
  const dispatch = useDispatch();

  const financialPeriods = useSelector(selectFinancialPeriods);

  const currentFinancialPeriod = useSelector(selectCurrentFinancialPeriod);

  const managedFinancialPeriod = useSelector(selectManagedFinancialPeriod);

  const status = useSelector(selectFinancialPeriodStatus);

  const error = useSelector(selectFinancialPeriodError);

  const message = useSelector(selectFinancialPeriodMessage);

  const createFinancialPeriodStatus = useSelector(
    selectCreateFinancialPeriodStatus,
  );

  const getFinancialPeriodsStatus = useSelector(
    selectGetFinancialPeriodsStatus,
  );

  const getCurrentFinancialPeriodStatus = useSelector(
    selectGetCurrentFinancialPeriodStatus,
  );

  const updateFinancialPeriodStatusStatus = useSelector(
    selectUpdateFinancialPeriodStatusStatus,
  );

  const submitCreateFinancialPeriod = (payload) => {
    return dispatch(createFinancialPeriod(payload)).unwrap();
  };

  const fetchFinancialPeriods = (params = {}) => {
    return dispatch(getFinancialPeriods(params)).unwrap();
  };

  const fetchCurrentFinancialPeriod = () => {
    return dispatch(getCurrentFinancialPeriod()).unwrap();
  };

  const submitUpdateFinancialPeriodStatus = (periodId, payload) => {
    return dispatch(
      updateFinancialPeriodStatus({
        periodId,
        payload,
      }),
    ).unwrap();
  };

  const clearError = () => {
    dispatch(clearFinancialPeriodError());
  };

  const clearMessage = () => {
    dispatch(clearFinancialPeriodMessage());
  };

  const saveCurrentFinancialPeriod = (payload) => {
    dispatch(setCurrentFinancialPeriod(payload));
  };

  const removeCurrentFinancialPeriod = () => {
    dispatch(clearCurrentFinancialPeriod());
  };

  const removeFinancialPeriods = () => {
    dispatch(clearFinancialPeriods());
  };

  const removeManagedFinancialPeriod = () => {
    dispatch(clearManagedFinancialPeriod());
  };

  return {
    financialPeriods,
    currentFinancialPeriod,
    managedFinancialPeriod,

    status,
    error,
    message,

    createFinancialPeriodStatus,
    getFinancialPeriodsStatus,
    getCurrentFinancialPeriodStatus,
    updateFinancialPeriodStatusStatus,

    createFinancialPeriod: submitCreateFinancialPeriod,
    getFinancialPeriods: fetchFinancialPeriods,
    getCurrentFinancialPeriod: fetchCurrentFinancialPeriod,
    updateFinancialPeriodStatus: submitUpdateFinancialPeriodStatus,

    clearError,
    clearMessage,

    setCurrentFinancialPeriod: saveCurrentFinancialPeriod,

    clearCurrentFinancialPeriod: removeCurrentFinancialPeriod,

    clearFinancialPeriods: removeFinancialPeriods,

    clearManagedFinancialPeriod: removeManagedFinancialPeriod,
  };
};

export default useFinancialPeriod;
