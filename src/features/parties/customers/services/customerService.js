import { apiClient, ENDPOINTS } from "@/services";

const customerService = {
  /*
  |--------------------------------------------------------------------------
  | CRUD
  |--------------------------------------------------------------------------
  */

  createCustomer(payload) {
    return apiClient.post(ENDPOINTS.CUSTOMER.CREATE, payload);
  },

  getCustomers(params = {}) {
    return apiClient.get(ENDPOINTS.CUSTOMER.LIST, {
      params,
    });
  },

  getCustomerById(customerId) {
    return apiClient.get(ENDPOINTS.CUSTOMER.BY_ID(customerId));
  },

  updateCustomer(customerId, payload) {
    return apiClient.patch(ENDPOINTS.CUSTOMER.BY_ID(customerId), payload);
  },

  deleteCustomer(customerId) {
    return apiClient.delete(ENDPOINTS.CUSTOMER.BY_ID(customerId));
  },

  /*
  |--------------------------------------------------------------------------
  | Ledger
  |--------------------------------------------------------------------------
  */

  getCustomerLedger(customerId, params = {}) {
    return apiClient.get(ENDPOINTS.CUSTOMER.LEDGER(customerId), { params });
  },

  /*
  |--------------------------------------------------------------------------
  | Outstanding
  |--------------------------------------------------------------------------
  */

  getCustomerOutstanding(customerId) {
    return apiClient.get(ENDPOINTS.CUSTOMER.OUTSTANDING(customerId));
  },


  /*
  |--------------------------------------------------------------------------
  | Payments
  |--------------------------------------------------------------------------
  */

  getCustomerPayments(customerId) {
    return apiClient.get(ENDPOINTS.CUSTOMER.PAYMENTS(customerId));
  },

  /*
  |--------------------------------------------------------------------------
  | Sales
  |--------------------------------------------------------------------------
  */

  getCustomerSales(customerId, params = {}) {
    return apiClient.get(ENDPOINTS.CUSTOMER.SALES(customerId), { params });
  },
};

export default customerService;
