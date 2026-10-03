// src/features/marketplace/products/services/marketplaceProductService.js

import { apiClient, ENDPOINTS } from "@/services";

const marketplaceProductService = {
  /**
   * Get Marketplace Products
   * GET /marketplace/products
   */
  getMarketplaceProducts(params = {}) {
    return apiClient.get(ENDPOINTS.MARKETPLACE_PRODUCT.LIST, {
      params,
    });
  },

  /**
   * Enable Marketplace Product (Create)
   * POST /marketplace/products
   */
  enableMarketplaceProduct(payload) {
    return apiClient.post(ENDPOINTS.MARKETPLACE_PRODUCT.CREATE, payload);
  },

  /**
   * Get Marketplace Product By ID
   * GET /marketplace/products/:productId
   */
  getMarketplaceProductById(productId) {
    return apiClient.get(ENDPOINTS.MARKETPLACE_PRODUCT.BY_ID(productId));
  },

  /**
   * Update Marketplace Product
   * PATCH /marketplace/products/:productId
   */
  updateMarketplaceProduct(productId, payload) {
    return apiClient.patch(
      ENDPOINTS.MARKETPLACE_PRODUCT.BY_ID(productId),
      payload,
    );
  },

  /**
   * Disable Marketplace Product (Delete)
   * DELETE /marketplace/products/:productId
   */
  disableMarketplaceProduct(productId) {
    return apiClient.delete(ENDPOINTS.MARKETPLACE_PRODUCT.BY_ID(productId));
  },
};

export default marketplaceProductService;
