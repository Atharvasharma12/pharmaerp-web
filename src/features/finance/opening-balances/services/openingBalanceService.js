import { apiClient, ENDPOINTS } from "@/services";

const openingBalanceService = {
  setAccountOpeningBalance(payload) {
    return apiClient.post(ENDPOINTS.OPENING_BALANCE.ACCOUNT, payload);
  },

  setCustomerOpeningBalance(payload) {
    return apiClient.post(ENDPOINTS.OPENING_BALANCE.CUSTOMER, payload);
  },

  setSupplierOpeningBalance(payload) {
    return apiClient.post(ENDPOINTS.OPENING_BALANCE.SUPPLIER, payload);
  },
};

export default openingBalanceService;
