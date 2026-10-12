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

  /*
  |--------------------------------------------------------------------------
  | Import
  |--------------------------------------------------------------------------
  */
  
  previewImport(formData) {
    return apiClient.post(ENDPOINTS.CUSTOMER.IMPORT_PREVIEW, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  confirmImport(customers, importType = "b2b") {
    return apiClient.post(ENDPOINTS.CUSTOMER.IMPORT_CONFIRM, { customers, importType });
  },

  importChunk(payload) {
    return apiClient.post(ENDPOINTS.CUSTOMER.IMPORT_CHUNK, payload, { timeout: 120000 });
  },

  /*
  |--------------------------------------------------------------------------
  | Advance & Credit
  |--------------------------------------------------------------------------
  */

  receiveAdvance(customerId, payload) {
    return apiClient.post(ENDPOINTS.CUSTOMER.ADVANCE_RECEIVE(customerId), payload);
  },

  getAdvanceBalance(customerId) {
    return apiClient.get(ENDPOINTS.CUSTOMER.ADVANCE_BALANCE(customerId));
  },

  settleCredit(customerId, payload) {
    return apiClient.post(ENDPOINTS.CUSTOMER.CREDIT_SETTLE(customerId), payload);
  },

  getCreditOutstanding(customerId, params = {}) {
    return apiClient.get(ENDPOINTS.CUSTOMER.CREDIT_OUTSTANDING(customerId), { params });
  },

  getCustomerTransactions(customerId, params = {}) {
    return apiClient.get(ENDPOINTS.CUSTOMER.TRANSACTIONS(customerId), { params });
  },

  getCustomerStatement(customerId, params = {}) {
    return apiClient.get(ENDPOINTS.CUSTOMER.STATEMENT(customerId), { params });
  },

  getAllPendingCredits(params = {}) {
    return apiClient.get(ENDPOINTS.CUSTOMER.CREDITS_PENDING_ALL, { params });
  },
};

export default customerService;
