// src/features/subscription/subscriptions/store/subscriptionSelector.js

export const selectSubscription = (state) => state.subscription;

export const selectSubscriptions = (state) => state.subscription.subscriptions;

export const selectWorkspaceSubscriptions = (state) =>
  state.subscription.workspaceSubscriptions;

export const selectCurrentSubscription = (state) =>
  state.subscription.currentSubscription;

export const selectCurrentWorkspaceSubscription = (state) =>
  state.subscription.currentWorkspaceSubscription;

export const selectSeatAvailability = (state) =>
  state.subscription.seatAvailability;

export const selectSubscriptionStatus = (state) => state.subscription.status;

export const selectSubscriptionError = (state) => state.subscription.error;

export const selectSubscriptionMessage = (state) => state.subscription.message;

export const selectPurchaseSubscriptionStatus = (state) =>
  state.subscription.purchaseSubscriptionStatus;

export const selectRenewSubscriptionStatus = (state) =>
  state.subscription.renewSubscriptionStatus;

export const selectUpgradeSubscriptionStatus = (state) =>
  state.subscription.upgradeSubscriptionStatus;

export const selectScheduleDowngradeStatus = (state) =>
  state.subscription.scheduleDowngradeStatus;

export const selectChangeSeatQuantityStatus = (state) =>
  state.subscription.changeSeatQuantityStatus;

export const selectCancelSubscriptionStatus = (state) =>
  state.subscription.cancelSubscriptionStatus;

export const selectSyncActiveSeatCountStatus = (state) =>
  state.subscription.syncActiveSeatCountStatus;

export const selectValidateSeatAvailabilityStatus = (state) =>
  state.subscription.validateSeatAvailabilityStatus;
