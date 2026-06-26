import { apiClient, ENDPOINTS } from "@/services";

const cashDenominationService = {
  createCashDenomination(payload) {
    return apiClient.post(ENDPOINTS.CASH_DENOMINATION.CREATE, payload);
  },

  getCashDenominations(params = {}) {
    return apiClient.get(ENDPOINTS.CASH_DENOMINATION.LIST, {
      params,
    });
  },

  getCashDenominationById(cashDenominationId) {
    return apiClient.get(ENDPOINTS.CASH_DENOMINATION.BY_ID(cashDenominationId));
  },

  confirmCashDenomination(cashDenominationId, payload) {
    return apiClient.post(
      ENDPOINTS.CASH_DENOMINATION.CONFIRM(cashDenominationId),
      payload,
    );
  },

  cancelCashDenomination(cashDenominationId, payload) {
    return apiClient.post(
      ENDPOINTS.CASH_DENOMINATION.CANCEL(cashDenominationId),
      payload,
    );
  },
};

export default cashDenominationService;
