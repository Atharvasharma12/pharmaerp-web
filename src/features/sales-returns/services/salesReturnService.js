import { apiClient } from "@/services";

const salesReturnService = {
  getAllSalesReturns(params = {}) {
    return apiClient.get("/sales/returns", { params });
  },

  getSalesReturnById(returnId) {
    return apiClient.get(`/sales/returns/${returnId}`);
  },

  recordSalesReturn(payload, customerId = null) {
    const url = customerId ? `/sales/returns/customer/${customerId}` : "/sales/returns";
    return apiClient.post(url, payload);
  },

  getNextReturnNumber(params = {}) {
    return apiClient.get("/sales/returns/next-number", { params });
  },
};

export default salesReturnService;
