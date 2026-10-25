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

  updateCustomerSale(customerId, invoiceId, payload) {
    return apiClient.put(`${ENDPOINTS.SALES.INVOICES.BY_CUSTOMER(customerId)}/${invoiceId}`, payload);
  },

  cancelCustomerSale(invoiceId, payload = {}) {
    return apiClient.put(`/sales/invoices/${invoiceId}/cancel`, payload);
  },

  getNextInvoiceNumber(params = {}) {
    return apiClient.get("/sales/invoices/next-number", { params });
  },

  getInvoiceById(invoiceId) {
    return apiClient.get(`/sales/invoices/${invoiceId}`);
  },

  recordCustomerReturn(customerId, payload) {
    const url = customerId ? `/sales/returns/customer/${customerId}` : `/sales/returns`;
    return apiClient.post(url, payload);
  },

  getNextReturnNumber(params = {}) {
    return apiClient.get("/sales/returns/next-number", { params });
  },

  getAllCustomerReturns(params = {}) {
    return apiClient.get("/sales/returns", { params });
  },

  getReturnById(returnId) {
    return apiClient.get(`/sales/returns/${returnId}`);
  },
};

export default invoiceService;

