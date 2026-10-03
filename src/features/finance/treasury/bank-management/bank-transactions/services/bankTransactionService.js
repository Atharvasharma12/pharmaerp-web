import { apiClient, ENDPOINTS } from "@/services";

const bankTransactionService = {
  createBankTransaction(payload) {
    return apiClient.post(ENDPOINTS.BANK_TRANSACTION.CREATE, payload);
  },

  getBankTransactions(params = {}) {
    return apiClient.get(ENDPOINTS.BANK_TRANSACTION.LIST, {
      params,
    });
  },

  getBankTransactionById(bankTransactionId) {
    return apiClient.get(ENDPOINTS.BANK_TRANSACTION.BY_ID(bankTransactionId));
  },

  cancelBankTransaction(bankTransactionId, payload) {
    return apiClient.post(
      ENDPOINTS.BANK_TRANSACTION.CANCEL(bankTransactionId),
      payload,
    );
  },
};

export default bankTransactionService;
