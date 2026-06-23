import { apiClient, ENDPOINTS } from "@/services";

const accountService = {
  createAccount(payload) {
    return apiClient.post(ENDPOINTS.ACCOUNT.CREATE, payload);
  },

  getAccounts(params = {}) {
    return apiClient.get(ENDPOINTS.ACCOUNT.LIST, {
      params,
    });
  },

  getAccountById(accountId) {
    return apiClient.get(ENDPOINTS.ACCOUNT.BY_ID(accountId));
  },

  updateAccount(accountId, payload) {
    return apiClient.patch(ENDPOINTS.ACCOUNT.BY_ID(accountId), payload);
  },

  deleteAccount(accountId) {
    return apiClient.delete(ENDPOINTS.ACCOUNT.BY_ID(accountId));
  },
};

export default accountService;
