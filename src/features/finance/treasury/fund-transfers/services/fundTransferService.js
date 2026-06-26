import { apiClient, ENDPOINTS } from "@/services";

const fundTransferService = {
  createFundTransfer(payload) {
    return apiClient.post(ENDPOINTS.FUND_TRANSFER.CREATE, payload);
  },

  getFundTransfers(params = {}) {
    return apiClient.get(ENDPOINTS.FUND_TRANSFER.LIST, {
      params,
    });
  },

  getFundTransferById(fundTransferId) {
    return apiClient.get(ENDPOINTS.FUND_TRANSFER.BY_ID(fundTransferId));
  },

  cancelFundTransfer(fundTransferId, payload) {
    return apiClient.post(
      ENDPOINTS.FUND_TRANSFER.CANCEL(fundTransferId),
      payload,
    );
  },
};

export default fundTransferService;
