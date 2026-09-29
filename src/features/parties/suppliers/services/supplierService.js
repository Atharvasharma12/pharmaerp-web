import { apiClient, ENDPOINTS } from "@/services";

const supplierService = {
  /*
  |--------------------------------------------------------------------------
  | CRUD
  |--------------------------------------------------------------------------
  */

  createSupplier(payload) {
    return apiClient.post(ENDPOINTS.SUPPLIER.CREATE, payload);
  },

  getSuppliers(params = {}) {
    return apiClient.get(ENDPOINTS.SUPPLIER.LIST, {
      params,
    });
  },

  getSupplierById(supplierId) {
    return apiClient.get(ENDPOINTS.SUPPLIER.BY_ID(supplierId));
  },

  updateSupplier(supplierId, payload) {
    return apiClient.patch(ENDPOINTS.SUPPLIER.BY_ID(supplierId), payload);
  },

  deleteSupplier(supplierId) {
    return apiClient.delete(ENDPOINTS.SUPPLIER.BY_ID(supplierId));
  },

  /*
  |--------------------------------------------------------------------------
  | Financial
  |--------------------------------------------------------------------------
  */

  getSupplierLedger(supplierId, params = {}) {
    return apiClient.get(ENDPOINTS.SUPPLIER.LEDGER(supplierId), { params });
  },

  getSupplierOutstanding(supplierId) {
    return apiClient.get(ENDPOINTS.SUPPLIER.OUTSTANDING(supplierId));
  },

  getSupplierPurchases(supplierId, params = {}) {
    return apiClient.get(ENDPOINTS.SUPPLIER.PURCHASES(supplierId), { params });
  },

  getSupplierPayments(supplierId) {
    return apiClient.get(ENDPOINTS.SUPPLIER.PAYMENTS(supplierId));
  },
};

export default supplierService;
