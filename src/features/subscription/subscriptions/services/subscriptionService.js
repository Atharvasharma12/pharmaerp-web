import { apiClient, ENDPOINTS } from "@/services";

const subscriptionService = {
  purchaseSubscription(payload) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.PURCHASE, payload);
  },

  startTrialSubscription(payload) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.TRIAL, payload);
  },

  renewSubscription(payload) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.RENEW, payload);
  },

  upgradeSubscription(payload) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.UPGRADE, payload);
  },

  scheduleDowngrade(payload) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.DOWNGRADE, payload);
  },

  changeSeatQuantity(payload) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.CHANGE_SEATS, payload);
  },

  cancelSubscription(payload) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.CANCEL, payload);
  },

  getSubscriptionById(subscriptionId) {
    return apiClient.get(ENDPOINTS.SUBSCRIPTION.BY_ID(subscriptionId));
  },

  getWorkspaceCurrentSubscription(workspaceId) {
    return apiClient.get(ENDPOINTS.SUBSCRIPTION.WORKSPACE_CURRENT(workspaceId));
  },

  getWorkspaceSubscriptions(workspaceId) {
    return apiClient.get(ENDPOINTS.SUBSCRIPTION.WORKSPACE_HISTORY(workspaceId));
  },

  syncActiveSeatCount(workspaceId) {
    return apiClient.post(ENDPOINTS.SUBSCRIPTION.SYNC_SEATS(workspaceId));
  },

  validateSeatAvailability(workspaceId, params = {}) {
    return apiClient.get(ENDPOINTS.SUBSCRIPTION.CHECK_SEATS(workspaceId), {
      params,
    });
  },
};

export default subscriptionService;
