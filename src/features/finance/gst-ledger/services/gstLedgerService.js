import { apiClient, ENDPOINTS } from "@/services";

const gstLedgerService = {
  getGstr1Ledger(params = {}) {
    return apiClient.get(ENDPOINTS.GST_LEDGER.GSTR1, {
      params,
    });
  },

  getGstr2Ledger(params = {}) {
    return apiClient.get(ENDPOINTS.GST_LEDGER.GSTR2, {
      params,
    });
  },

  createGstr1Ledger(payload) {
    return apiClient.post(ENDPOINTS.GST_LEDGER.GSTR1, payload);
  },

  createGstr2Ledger(payload) {
    return apiClient.post(ENDPOINTS.GST_LEDGER.GSTR2, payload);
  },
};

export default gstLedgerService;
