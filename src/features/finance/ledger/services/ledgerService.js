import { apiClient, ENDPOINTS } from "@/services";

const ledgerService = {
  getLedger(params = {}) {
    return apiClient.get(ENDPOINTS.LEDGER.LIST, {
      params,
    });
  },

  recalculateLedger(payload) {
    return apiClient.post(ENDPOINTS.LEDGER.RECALCULATE, payload);
  },
};

export default ledgerService;
