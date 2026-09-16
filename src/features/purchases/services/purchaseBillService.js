import { apiClient, ENDPOINTS } from "@/services";

const purchaseBillService = {
  createPurchaseBill(payload) {
    return apiClient.post(ENDPOINTS.PURCHASE_BILL.CREATE, payload);
  },

  getPurchaseBills(params = {}) {
    return apiClient.get(ENDPOINTS.PURCHASE_BILL.LIST, { params });
  },

  getPurchaseBillById(billId) {
    return apiClient.get(ENDPOINTS.PURCHASE_BILL.BY_ID(billId));
  },

  updatePurchaseBill(billId, payload) {
    return apiClient.put(ENDPOINTS.PURCHASE_BILL.BY_ID(billId), payload);
  },
};

export default purchaseBillService;
