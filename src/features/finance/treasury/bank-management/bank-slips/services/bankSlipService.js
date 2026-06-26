import { apiClient, ENDPOINTS } from "@/services";

const bankSlipService = {
  createBankSlip(payload) {
    return apiClient.post(ENDPOINTS.BANK_SLIP.CREATE, payload);
  },

  getBankSlips(params = {}) {
    return apiClient.get(ENDPOINTS.BANK_SLIP.LIST, {
      params,
    });
  },

  getBankSlipById(bankSlipId) {
    return apiClient.get(ENDPOINTS.BANK_SLIP.BY_ID(bankSlipId));
  },

  submitBankSlip(bankSlipId, payload) {
    return apiClient.post(ENDPOINTS.BANK_SLIP.SUBMIT(bankSlipId), payload);
  },

  confirmBankSlip(bankSlipId, payload) {
    return apiClient.post(ENDPOINTS.BANK_SLIP.CONFIRM(bankSlipId), payload);
  },

  rejectBankSlip(bankSlipId, payload) {
    return apiClient.post(ENDPOINTS.BANK_SLIP.REJECT(bankSlipId), payload);
  },

  cancelBankSlip(bankSlipId, payload) {
    return apiClient.post(ENDPOINTS.BANK_SLIP.CANCEL(bankSlipId), payload);
  },
};

export default bankSlipService;
