import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getPlans,
  getActivePlans,
  getPlanById,
  createPlan,
  updatePlan,
  archivePlan,
  restorePlan,
  deletePlan,
} from "../store/planThunk";

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
  selectCreatePlanStatus,
  selectUpdatePlanStatus,
  selectArchivePlanStatus,
  selectRestorePlanStatus,
  selectDeletePlanStatus,
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
  const createPlanStatus = useSelector(selectCreatePlanStatus);
  const updatePlanStatus = useSelector(selectUpdatePlanStatus);
  const archivePlanStatus = useSelector(selectArchivePlanStatus);
  const restorePlanStatus = useSelector(selectRestorePlanStatus);
  const deletePlanStatus = useSelector(selectDeletePlanStatus);

  const fetchPlans = useCallback((params = {}) => {
    return dispatch(getPlans(params)).unwrap();
  }, [dispatch]);

  const fetchActivePlans = useCallback(() => {
    return dispatch(getActivePlans()).unwrap();
  }, [dispatch]);

  const fetchPlanById = useCallback((planId) => {
    return dispatch(getPlanById(planId)).unwrap();
  }, [dispatch]);

  const handleCreatePlan = useCallback((payload) => {
    return dispatch(createPlan(payload)).unwrap();
  }, [dispatch]);

  const handleUpdatePlan = useCallback((planId, payload) => {
    return dispatch(updatePlan({ planId, payload })).unwrap();
  }, [dispatch]);

  const handleArchivePlan = useCallback((planId) => {
    return dispatch(archivePlan(planId)).unwrap();
  }, [dispatch]);

  const handleRestorePlan = useCallback((planId) => {
    return dispatch(restorePlan(planId)).unwrap();
  }, [dispatch]);

  const handleDeletePlan = useCallback((planId) => {
    return dispatch(deletePlan(planId)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearPlanError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearPlanMessage());
  }, [dispatch]);

  const saveCurrentPlan = useCallback((payload) => {
    dispatch(setCurrentPlan(payload));
  }, [dispatch]);

  const removeCurrentPlan = useCallback(() => {
    dispatch(clearCurrentPlan());
  }, [dispatch]);

  const removePlans = useCallback(() => {
    dispatch(clearPlans());
  }, [dispatch]);

  const removeActivePlans = useCallback(() => {
    dispatch(clearActivePlans());
  }, [dispatch]);

  return {
    plans,
    activePlans,
    currentPlan,

    status,
    error,
    message,

    getActivePlansStatus,
    createPlanStatus,
    updatePlanStatus,
    archivePlanStatus,
    restorePlanStatus,
    deletePlanStatus,

    getPlans: fetchPlans,
    getActivePlans: fetchActivePlans,
    getPlanById: fetchPlanById,
    createPlan: handleCreatePlan,
    updatePlan: handleUpdatePlan,
    archivePlan: handleArchivePlan,
    restorePlan: handleRestorePlan,
    deletePlan: handleDeletePlan,

    clearError,
    clearMessage,

    setCurrentPlan: saveCurrentPlan,
    clearCurrentPlan: removeCurrentPlan,
    clearPlans: removePlans,
    clearActivePlans: removeActivePlans,
  };
};

export default usePlan;
