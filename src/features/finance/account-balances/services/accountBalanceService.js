import { apiClient, ENDPOINTS } from "@/services";

const accountBalanceService = {
  getAccountBalances(params = {}) {
    return apiClient.get(ENDPOINTS.ACCOUNT_BALANCE.LIST, {
      params,
    });
  },

  getAccountBalanceByAccountId(accountId) {
    return apiClient.get(ENDPOINTS.ACCOUNT_BALANCE.BY_ACCOUNT_ID(accountId));
  },

  recalculateAccountBalance(accountId) {
    return apiClient.post(ENDPOINTS.ACCOUNT_BALANCE.RECALCULATE(accountId));
  },
};

export default accountBalanceService;
