// src/features/subscription/subscriptions/hooks/useSubscription.js

import { useDispatch, useSelector } from "react-redux";

import {
  purchaseSubscription,
  renewSubscription,
  upgradeSubscription,
  scheduleDowngrade,
  changeSeatQuantity,
  cancelSubscription,
  getSubscriptions,
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
  clearSubscriptions,
  clearWorkspaceSubscriptions,
  clearSeatAvailability,
} from "../store/subscriptionSlice";

import {
  selectSubscriptions,
  selectWorkspaceSubscriptions,
  selectCurrentSubscription,
  selectCurrentWorkspaceSubscription,
  selectSeatAvailability,
  selectSubscriptionStatus,
  selectSubscriptionError,
  selectSubscriptionMessage,
  selectPurchaseSubscriptionStatus,
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

  const subscriptions = useSelector(selectSubscriptions);

  const workspaceSubscriptions = useSelector(selectWorkspaceSubscriptions);

  const currentSubscription = useSelector(selectCurrentSubscription);

  const currentWorkspaceSubscription = useSelector(
    selectCurrentWorkspaceSubscription,
  );

  const seatAvailability = useSelector(selectSeatAvailability);

  const status = useSelector(selectSubscriptionStatus);

  const error = useSelector(selectSubscriptionError);

  const message = useSelector(selectSubscriptionMessage);

  const purchaseSubscriptionStatus = useSelector(
    selectPurchaseSubscriptionStatus,
  );

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

  const submitPurchaseSubscription = (payload) => {
    return dispatch(purchaseSubscription(payload)).unwrap();
  };

  const submitRenewSubscription = (payload) => {
    return dispatch(renewSubscription(payload)).unwrap();
  };

  const submitUpgradeSubscription = (payload) => {
    return dispatch(upgradeSubscription(payload)).unwrap();
  };

  const submitScheduleDowngrade = (payload) => {
    return dispatch(scheduleDowngrade(payload)).unwrap();
  };

  const submitChangeSeatQuantity = (payload) => {
    return dispatch(changeSeatQuantity(payload)).unwrap();
  };

  const submitCancelSubscription = (payload) => {
    return dispatch(cancelSubscription(payload)).unwrap();
  };

  const fetchSubscriptions = (params = {}) => {
    return dispatch(getSubscriptions(params)).unwrap();
  };

  const fetchSubscriptionById = (subscriptionId) => {
    return dispatch(getSubscriptionById(subscriptionId)).unwrap();
  };

  const fetchWorkspaceCurrentSubscription = (workspaceId) => {
    return dispatch(getWorkspaceCurrentSubscription(workspaceId)).unwrap();
  };

  const fetchWorkspaceSubscriptions = (workspaceId) => {
    return dispatch(getWorkspaceSubscriptions(workspaceId)).unwrap();
  };

  const submitSyncActiveSeatCount = (workspaceId) => {
    return dispatch(syncActiveSeatCount(workspaceId)).unwrap();
  };

  const submitValidateSeatAvailability = (workspaceId, params = {}) => {
    return dispatch(
      validateSeatAvailability({
        workspaceId,
        params,
      }),
    ).unwrap();
  };

  const clearError = () => {
    dispatch(clearSubscriptionError());
  };

  const clearMessage = () => {
    dispatch(clearSubscriptionMessage());
  };

  const saveCurrentSubscription = (payload) => {
    dispatch(setCurrentSubscription(payload));
  };

  const removeCurrentSubscription = () => {
    dispatch(clearCurrentSubscription());
  };

  const removeSubscriptions = () => {
    dispatch(clearSubscriptions());
  };

  const removeWorkspaceSubscriptions = () => {
    dispatch(clearWorkspaceSubscriptions());
  };

  const removeSeatAvailability = () => {
    dispatch(clearSeatAvailability());
  };

  return {
    subscriptions,
    workspaceSubscriptions,

    currentSubscription,
    currentWorkspaceSubscription,

    seatAvailability,

    status,
    error,
    message,

    purchaseSubscriptionStatus,
    renewSubscriptionStatus,
    upgradeSubscriptionStatus,
    scheduleDowngradeStatus,
    changeSeatQuantityStatus,
    cancelSubscriptionStatus,

    syncActiveSeatCountStatus,
    validateSeatAvailabilityStatus,

    purchaseSubscription: submitPurchaseSubscription,

    renewSubscription: submitRenewSubscription,

    upgradeSubscription: submitUpgradeSubscription,

    scheduleDowngrade: submitScheduleDowngrade,

    changeSeatQuantity: submitChangeSeatQuantity,

    cancelSubscription: submitCancelSubscription,

    getSubscriptions: fetchSubscriptions,

    getSubscriptionById: fetchSubscriptionById,

    getWorkspaceCurrentSubscription: fetchWorkspaceCurrentSubscription,

    getWorkspaceSubscriptions: fetchWorkspaceSubscriptions,

    syncActiveSeatCount: submitSyncActiveSeatCount,

    validateSeatAvailability: submitValidateSeatAvailability,

    clearError,
    clearMessage,

    setCurrentSubscription: saveCurrentSubscription,

    clearCurrentSubscription: removeCurrentSubscription,

    clearSubscriptions: removeSubscriptions,

    clearWorkspaceSubscriptions: removeWorkspaceSubscriptions,

    clearSeatAvailability: removeSeatAvailability,
  };
};

export default useSubscription;
