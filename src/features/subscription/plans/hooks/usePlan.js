import { useDispatch, useSelector } from "react-redux";

import { getPlans, getActivePlans, getPlanById } from "../store/planThunk";

import {
  clearPlanError,
  clearPlanMessage,
  setCurrentPlan,
  clearCurrentPlan,
  clearPlans,
  clearActivePlans,
} from "../store/planSlice";

import {
  selectPlans,
  selectActivePlans,
  selectCurrentPlan,
  selectPlanStatus,
  selectPlanError,
  selectPlanMessage,
  selectGetActivePlansStatus,
} from "../store/planSelector";

const usePlan = () => {
  const dispatch = useDispatch();

  const plans = useSelector(selectPlans);
  const activePlans = useSelector(selectActivePlans);
  const currentPlan = useSelector(selectCurrentPlan);

  const status = useSelector(selectPlanStatus);
  const error = useSelector(selectPlanError);
  const message = useSelector(selectPlanMessage);

  const getActivePlansStatus = useSelector(selectGetActivePlansStatus);

  const fetchPlans = (params = {}) => {
    return dispatch(getPlans(params)).unwrap();
  };

  const fetchActivePlans = () => {
    return dispatch(getActivePlans()).unwrap();
  };

  const fetchPlanById = (planId) => {
    return dispatch(getPlanById(planId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearPlanError());
  };

  const clearMessage = () => {
    dispatch(clearPlanMessage());
  };

  const saveCurrentPlan = (payload) => {
    dispatch(setCurrentPlan(payload));
  };

  const removeCurrentPlan = () => {
    dispatch(clearCurrentPlan());
  };

  const removePlans = () => {
    dispatch(clearPlans());
  };

  const removeActivePlans = () => {
    dispatch(clearActivePlans());
  };

  return {
    plans,
    activePlans,
    currentPlan,

    status,
    error,
    message,

    getActivePlansStatus,

    getPlans: fetchPlans,
    getActivePlans: fetchActivePlans,
    getPlanById: fetchPlanById,

    clearError,
    clearMessage,

    setCurrentPlan: saveCurrentPlan,
    clearCurrentPlan: removeCurrentPlan,
    clearPlans: removePlans,
    clearActivePlans: removeActivePlans,
  };
};

export default usePlan;
