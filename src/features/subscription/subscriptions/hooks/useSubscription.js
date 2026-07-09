// src/features/subscription/subscriptions/hooks/useSubscription.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  renewSubscription,
  upgradeSubscription,
  scheduleDowngrade,
  changeSeatQuantity,
  cancelSubscription,
  getSubscriptionById,
  getWorkspaceCurrentSubscription,
  getWorkspaceSubscriptions,
  syncActiveSeatCount,
  validateSeatAvailability,
} from "../store/subscriptionThunk";

import {
  clearSubscriptionError,
  clearSubscriptionMessage,
  setCurrentSubscription,
  clearCurrentSubscription,
  clearWorkspaceSubscriptions,
  clearSeatAvailability,
} from "../store/subscriptionSlice";

import {
  selectWorkspaceSubscriptions,
  selectCurrentSubscription,
  selectCurrentWorkspaceSubscription,
  selectSeatAvailability,
  selectSubscriptionStatus,
  selectSubscriptionError,
  selectSubscriptionMessage,
  selectRenewSubscriptionStatus,
  selectUpgradeSubscriptionStatus,
  selectScheduleDowngradeStatus,
  selectChangeSeatQuantityStatus,
  selectCancelSubscriptionStatus,
  selectSyncActiveSeatCountStatus,
  selectValidateSeatAvailabilityStatus,
} from "../store/subscriptionSelector";

const useSubscription = () => {
  const dispatch = useDispatch();

  const workspaceSubscriptions = useSelector(selectWorkspaceSubscriptions);

  const currentSubscription = useSelector(selectCurrentSubscription);

  const currentWorkspaceSubscription = useSelector(
    selectCurrentWorkspaceSubscription,
  );

  const seatAvailability = useSelector(selectSeatAvailability);

  const status = useSelector(selectSubscriptionStatus);

  const error = useSelector(selectSubscriptionError);

  const message = useSelector(selectSubscriptionMessage);

  const renewSubscriptionStatus = useSelector(selectRenewSubscriptionStatus);

  const upgradeSubscriptionStatus = useSelector(
    selectUpgradeSubscriptionStatus,
  );

  const scheduleDowngradeStatus = useSelector(selectScheduleDowngradeStatus);

  const changeSeatQuantityStatus = useSelector(selectChangeSeatQuantityStatus);

  const cancelSubscriptionStatus = useSelector(selectCancelSubscriptionStatus);

  const syncActiveSeatCountStatus = useSelector(
    selectSyncActiveSeatCountStatus,
  );

  const validateSeatAvailabilityStatus = useSelector(
    selectValidateSeatAvailabilityStatus,
  );

  const submitRenewSubscription = useCallback((payload) => {
    return dispatch(renewSubscription(payload)).unwrap();
  }, [dispatch]);

  const submitUpgradeSubscription = useCallback((payload) => {
    return dispatch(upgradeSubscription(payload)).unwrap();
  }, [dispatch]);

  const submitScheduleDowngrade = useCallback((payload) => {
    return dispatch(scheduleDowngrade(payload)).unwrap();
  }, [dispatch]);

  const submitChangeSeatQuantity = useCallback((payload) => {
    return dispatch(changeSeatQuantity(payload)).unwrap();
  }, [dispatch]);

  const submitCancelSubscription = useCallback((payload) => {
    return dispatch(cancelSubscription(payload)).unwrap();
  }, [dispatch]);

  const fetchSubscriptionById = useCallback((subscriptionId) => {
    return dispatch(getSubscriptionById(subscriptionId)).unwrap();
  }, [dispatch]);

  const fetchWorkspaceCurrentSubscription = useCallback((workspaceId) => {
    return dispatch(getWorkspaceCurrentSubscription(workspaceId)).unwrap();
  }, [dispatch]);

  const fetchWorkspaceSubscriptions = useCallback((workspaceId) => {
    return dispatch(getWorkspaceSubscriptions(workspaceId)).unwrap();
  }, [dispatch]);

  const submitSyncActiveSeatCount = useCallback((workspaceId) => {
    return dispatch(syncActiveSeatCount(workspaceId)).unwrap();
  }, [dispatch]);

  const submitValidateSeatAvailability = useCallback((workspaceId, params = {}) => {
    return dispatch(
      validateSeatAvailability({
        workspaceId,
        params,
      }),
    ).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearSubscriptionError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearSubscriptionMessage());
  }, [dispatch]);

  const saveCurrentSubscription = useCallback((payload) => {
    dispatch(setCurrentSubscription(payload));
  }, [dispatch]);

  const removeCurrentSubscription = useCallback(() => {
    dispatch(clearCurrentSubscription());
  }, [dispatch]);

  const removeWorkspaceSubscriptions = useCallback(() => {
    dispatch(clearWorkspaceSubscriptions());
  }, [dispatch]);

  const removeSeatAvailability = useCallback(() => {
    dispatch(clearSeatAvailability());
  }, [dispatch]);

  return {
    workspaceSubscriptions,

    currentSubscription,
    currentWorkspaceSubscription,

    seatAvailability,

    status,
    error,
    message,

    renewSubscriptionStatus,
    upgradeSubscriptionStatus,
    scheduleDowngradeStatus,
    changeSeatQuantityStatus,
    cancelSubscriptionStatus,

    syncActiveSeatCountStatus,
    validateSeatAvailabilityStatus,

    renewSubscription: submitRenewSubscription,

    upgradeSubscription: submitUpgradeSubscription,

    scheduleDowngrade: submitScheduleDowngrade,

    changeSeatQuantity: submitChangeSeatQuantity,

    cancelSubscription: submitCancelSubscription,

    getSubscriptionById: fetchSubscriptionById,

    getWorkspaceCurrentSubscription: fetchWorkspaceCurrentSubscription,

    getWorkspaceSubscriptions: fetchWorkspaceSubscriptions,

    syncActiveSeatCount: submitSyncActiveSeatCount,

    validateSeatAvailability: submitValidateSeatAvailability,

    clearError,
    clearMessage,

    setCurrentSubscription: saveCurrentSubscription,

    clearCurrentSubscription: removeCurrentSubscription,

    clearWorkspaceSubscriptions: removeWorkspaceSubscriptions,

    clearSeatAvailability: removeSeatAvailability,
  };
};

export default useSubscription;
