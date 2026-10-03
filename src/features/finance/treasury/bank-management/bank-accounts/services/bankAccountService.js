import { apiClient, ENDPOINTS } from "@/services";

const bankAccountService = {
  createBankAccount(payload) {
    return apiClient.post(ENDPOINTS.BANK_ACCOUNT.CREATE, payload);
  },

  getBankAccounts(params = {}) {
    return apiClient.get(ENDPOINTS.BANK_ACCOUNT.LIST, {
      params,
    });
  },

  getBankAccountById(bankAccountId) {
    return apiClient.get(ENDPOINTS.BANK_ACCOUNT.BY_ID(bankAccountId));
  },

  updateBankAccount(bankAccountId, payload) {
    return apiClient.patch(
      ENDPOINTS.BANK_ACCOUNT.BY_ID(bankAccountId),
      payload,
    );
  },

  deleteBankAccount(bankAccountId) {
    return apiClient.delete(ENDPOINTS.BANK_ACCOUNT.BY_ID(bankAccountId));
  },

  setPrimaryBankAccount(bankAccountId) {
    return apiClient.post(ENDPOINTS.BANK_ACCOUNT.SET_PRIMARY(bankAccountId));
  },
};

export default bankAccountService;
