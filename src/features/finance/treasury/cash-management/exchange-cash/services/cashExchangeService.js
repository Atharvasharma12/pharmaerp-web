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


};

export default cashExchangeService;
