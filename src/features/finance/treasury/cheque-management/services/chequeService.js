import { apiClient, ENDPOINTS } from "@/services";

const chequeService = {
  createCheque(payload) {
    return apiClient.post(ENDPOINTS.CHEQUE.CREATE, payload);
  },

  getCheques(params = {}) {
    return apiClient.get(ENDPOINTS.CHEQUE.LIST, {
      params,
    });
  },

  getChequeById(chequeId) {
    return apiClient.get(ENDPOINTS.CHEQUE.BY_ID(chequeId));
  },

  depositCheque(chequeId) {
    return apiClient.post(ENDPOINTS.CHEQUE.DEPOSIT(chequeId));
  },

  clearCheque(chequeId, payload) {
    return apiClient.post(ENDPOINTS.CHEQUE.CLEAR(chequeId), payload);
  },

  bounceCheque(chequeId, payload) {
    return apiClient.post(ENDPOINTS.CHEQUE.BOUNCE(chequeId), payload);
  },

  cancelCheque(chequeId, payload) {
    return apiClient.post(ENDPOINTS.CHEQUE.CANCEL(chequeId), payload);
  },
};

export default chequeService;
