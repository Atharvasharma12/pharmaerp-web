// src/features/workspace-products/services/workspaceProductService.js

import { apiClient, ENDPOINTS } from "@/services";

const workspaceProductService = {
  /**
   * Search Before Create
   * GET /catalog/products/search
   *
   * Query Params:
   * {
   *   name,
   *   productType
   * }
   */
  searchBeforeCreateWorkspaceProduct(params = {}) {
    return apiClient.get(ENDPOINTS.WORKSPACE_PRODUCTS.SEARCH_BEFORE_CREATE, {
      params,
    });
  },

  /**
   * Create Workspace Product
   * POST /catalog/products
   */
  createWorkspaceProduct(payload) {
    return apiClient.post(ENDPOINTS.WORKSPACE_PRODUCTS.CREATE, payload);
  },

  /**
   * Get Workspace Products
   * GET /catalog/products
   *
   * Query Params:
   * {
   *   status,
   *   productType,
   *   search,
   *   page,
   *   limit
   * }
   */
  getWorkspaceProducts(params = {}) {
    return apiClient.get(ENDPOINTS.WORKSPACE_PRODUCTS.LIST, {
      params,
    });
  },

  /**
   * Get Workspace Product By Id
   * GET /catalog/products/:productId
   */
  getWorkspaceProductById(productId) {
    return apiClient.get(ENDPOINTS.WORKSPACE_PRODUCTS.BY_ID(productId));
  },

  /**
   * Get Workspace Product By Code
   * GET /catalog/products/code/:productCode
   */
  getWorkspaceProductByCode(productCode) {
    return apiClient.get(ENDPOINTS.WORKSPACE_PRODUCTS.BY_CODE(productCode));
  },

  /**
   * Update Workspace Product
   * PATCH /catalog/products/:productId
   */
  updateWorkspaceProduct(productId, payload) {
    return apiClient.patch(
      ENDPOINTS.WORKSPACE_PRODUCTS.BY_ID(productId),
      payload,
    );
  },

  /**
   * Delete Workspace Product
   * DELETE /catalog/products/:productId
   */
  deleteWorkspaceProduct(productId) {
    return apiClient.delete(ENDPOINTS.WORKSPACE_PRODUCTS.BY_ID(productId));
  },
};

export default workspaceProductService;
