// src/features/global-products/services/globalProductService.js

import { apiClient, ENDPOINTS } from "@/services";

const globalProductService = {
  /**
   * Get Global Products
   * GET /catalog/global-products
   *
   * Query Params:
   * {
   *   status,
   *   productType,
   *   dataSource,
   *   search,
   *   page,
   *   limit
   * }
   */
  getGlobalProducts(params = {}) {
    return apiClient.get(ENDPOINTS.GLOBAL_PRODUCTS.LIST, {
      params,
    });
  },

  /**
   * Get Global Product By Id
   * GET /catalog/global-products/:productId
   */
  getGlobalProductById(productId) {
    return apiClient.get(ENDPOINTS.GLOBAL_PRODUCTS.BY_ID(productId));
  },

  /**
   * Get Global Product By Code
   * GET /catalog/global-products/code/:productCode
   */
  getGlobalProductByCode(productCode) {
    return apiClient.get(ENDPOINTS.GLOBAL_PRODUCTS.BY_CODE(productCode));
  },
};

export default globalProductService;
