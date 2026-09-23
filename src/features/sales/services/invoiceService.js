import { apiClient, ENDPOINTS } from "@/services";

const invoiceService = {
  getAllCustomerSales(params = {}) {
    return apiClient.get(ENDPOINTS.SALES.INVOICES.ALL, { params });
  },

  getCustomerSales(customerId, params = {}) {
    return apiClient.get(ENDPOINTS.SALES.INVOICES.BY_CUSTOMER(customerId), { params });
  },

  recordCustomerSale(customerId, payload) {
    return apiClient.post(ENDPOINTS.SALES.INVOICES.BY_CUSTOMER(customerId), payload);
  },
};

export default invoiceService;
