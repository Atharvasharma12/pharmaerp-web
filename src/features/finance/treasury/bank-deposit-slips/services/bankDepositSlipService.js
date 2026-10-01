import { apiClient, ENDPOINTS } from "@/services";

const bankDepositSlipService = {
  createBankDepositSlip(payload) {
    return apiClient.post(ENDPOINTS.BANK_DEPOSIT_SLIP.CREATE, payload);
  },

  getBankDepositSlips(params = {}) {
    return apiClient.get(ENDPOINTS.BANK_DEPOSIT_SLIP.LIST, {
      params,
    });
  },

  getBankDepositSlipById(slipId) {
    return apiClient.get(ENDPOINTS.BANK_DEPOSIT_SLIP.BY_ID(slipId));
  },

  confirmDeposit(slipId, payload) {
    return apiClient.post(ENDPOINTS.BANK_DEPOSIT_SLIP.CONFIRM_DEPOSIT(slipId), payload);
  },

  cancelBankDepositSlip(slipId, payload) {
    return apiClient.post(ENDPOINTS.BANK_DEPOSIT_SLIP.CANCEL(slipId), payload);
  },
};

export default bankDepositSlipService;
