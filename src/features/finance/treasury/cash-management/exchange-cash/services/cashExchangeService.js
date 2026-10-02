import { apiClient, ENDPOINTS } from "@/services";

const cashExchangeService = {
  createCashExchange(payload) {
    return apiClient.post(ENDPOINTS.CASH_EXCHANGE.CREATE, payload);
  },

  getCashExchanges(params = {}) {
    return apiClient.get(ENDPOINTS.CASH_EXCHANGE.LIST, { params });
  },

  getCashExchangeById(cashExchangeId) {
    return apiClient.get(ENDPOINTS.CASH_EXCHANGE.BY_ID(cashExchangeId));
  },

  cancelCashExchange(cashExchangeId, payload) {
    return apiClient.post(
      ENDPOINTS.CASH_EXCHANGE.CANCEL(cashExchangeId),
      payload,
    );
  },
};

export default cashExchangeService;
