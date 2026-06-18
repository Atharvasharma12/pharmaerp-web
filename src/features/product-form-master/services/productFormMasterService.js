import { apiClient, ENDPOINTS } from "@/services";

const productFormMasterService = {
  /**
   * Get Product Form Masters (List)
   * GET /catalog/product-form-master
   *
   * Query Params:
   * {
   *   isActive,
   *   search,
   *   page,
   *   limit
   * }
   */
  getProductFormMasters(params = {}) {
    return apiClient.get(ENDPOINTS.PRODUCT_FORM_MASTER.LIST, {
      params,
    });
  },

  /**
   * Get Product Form Master By Id
   * GET /catalog/product-form-master/:formId
   */
  getProductFormMasterById(formId) {
    return apiClient.get(ENDPOINTS.PRODUCT_FORM_MASTER.BY_ID(formId));
  },
};

export default productFormMasterService;
