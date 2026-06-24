import { apiClient, ENDPOINTS } from "@/services";

const cashAccountService = {
  createCashAccount(payload) {
    return apiClient.post(ENDPOINTS.CASH_ACCOUNT.CREATE, payload);
  },

  getCashAccounts(params = {}) {
    return apiClient.get(ENDPOINTS.CASH_ACCOUNT.LIST, {
      params,
    });
  },

  getCashAccountById(cashAccountId) {
    return apiClient.get(ENDPOINTS.CASH_ACCOUNT.BY_ID(cashAccountId));
  },

  updateCashAccount(cashAccountId, payload) {
    return apiClient.patch(
      ENDPOINTS.CASH_ACCOUNT.BY_ID(cashAccountId),
      payload,
    );
  },

  deleteCashAccount(cashAccountId) {
    return apiClient.delete(ENDPOINTS.CASH_ACCOUNT.BY_ID(cashAccountId));
  },

  setPrimaryCashAccount(cashAccountId) {
    return apiClient.post(ENDPOINTS.CASH_ACCOUNT.SET_PRIMARY(cashAccountId));
  },
};

export default cashAccountService;
