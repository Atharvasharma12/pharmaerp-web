import { apiClient, ENDPOINTS } from "@/services";

const bankDepositSlipService = {
  createBankDepositSlip(payload) {
    return apiClient.post(ENDPOINTS.BANK_DEPOSIT_SLIP.CREATE, payload);
  },

  getBankDepositSlips(params = {}) {
    return apiClient.get(ENDPOINTS.BANK_DEPOSIT_SLIP.LIST, { params });
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

  /**
   * Partial withdrawal from a PREPARED BDS.
   * @param {string} slipId
   * @param {{ amount, denominations, narration? }} payload
   */
  withdrawFromBankDepositSlip(slipId, payload) {
    return apiClient.post(ENDPOINTS.BANK_DEPOSIT_SLIP.WITHDRAW_FROM_SLIP(slipId), payload);
  },

  /**
   * Company-scope read of all PREPARED slips (Cash In Transit view).
   * @param {{ branchId?, page?, limit? }} params
   */
  getCashInTransit(params = {}) {
    return apiClient.get(ENDPOINTS.BANK_DEPOSIT_SLIP.CASH_IN_TRANSIT, { params });
  },
};

export default bankDepositSlipService;

