import { apiClient, ENDPOINTS } from "@/services";

const gstLedgerService = {
  getGstr1Ledger(params = {}) {
    return apiClient.get(ENDPOINTS.GST_LEDGER.GSTR1, {
      params,
    });
  },

  getGstr1Summary(params = {}) {
    return apiClient.get(ENDPOINTS.GST_LEDGER.GSTR1_SUMMARY, {
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

  getGstr3bSummary(params = {}) {
    return apiClient.get(ENDPOINTS.GST_LEDGER.GSTR3B_SUMMARY, {
      params,
    });
  },
};

export default gstLedgerService;
