import { apiClient, ENDPOINTS } from "@/services";

const cashTransactionService = {
  createCashTransaction(payload) {
    return apiClient.post(ENDPOINTS.CASH_TRANSACTION.CREATE, payload);
  },

  getCashTransactions(params = {}) {
    return apiClient.get(ENDPOINTS.CASH_TRANSACTION.LIST, {
      params,
    });
  },

  getCashTransactionById(cashTransactionId) {
    return apiClient.get(ENDPOINTS.CASH_TRANSACTION.BY_ID(cashTransactionId));
  },

  cancelCashTransaction(cashTransactionId, payload) {
    return apiClient.post(
      ENDPOINTS.CASH_TRANSACTION.CANCEL(cashTransactionId),
      payload,
    );
  },
};

export default cashTransactionService;
