// src/features/marketplace/stores/services/marketplaceStoreService.js

import { apiClient, ENDPOINTS } from "@/services";

const marketplaceStoreService = {
  /**
   * Get Marketplace Stores
   * GET /marketplace/stores
   */
  getMarketplaceStores(params = {}) {
    return apiClient.get(ENDPOINTS.MARKETPLACE_STORE.LIST, {
      params,
    });
  },

  /**
   * Create Marketplace Store
   * POST /marketplace/stores
   */
  createMarketplaceStore(payload) {
    return apiClient.post(ENDPOINTS.MARKETPLACE_STORE.CREATE, payload);
  },

  /**
   * Get Marketplace Store By ID
   * GET /marketplace/stores/:storeId
   */
  getMarketplaceStoreById(storeId) {
    return apiClient.get(ENDPOINTS.MARKETPLACE_STORE.BY_ID(storeId));
  },

  /**
   * Update Marketplace Store
   * PATCH /marketplace/stores/:storeId
   */
  updateMarketplaceStore(storeId, payload) {
    return apiClient.patch(
      ENDPOINTS.MARKETPLACE_STORE.BY_ID(storeId),
      payload,
    );
  },

  /**
   * Delete Marketplace Store
   * DELETE /marketplace/stores/:storeId
   */
  deleteMarketplaceStore(storeId) {
    return apiClient.delete(ENDPOINTS.MARKETPLACE_STORE.BY_ID(storeId));
  },

  /**
   * Go Online
   * PATCH /marketplace/stores/:storeId/go-online
   */
  goOnline(storeId) {
    return apiClient.patch(ENDPOINTS.MARKETPLACE_STORE.GO_ONLINE(storeId));
  },

  /**
   * Go Offline
   * PATCH /marketplace/stores/:storeId/go-offline
   */
  goOffline(storeId) {
    return apiClient.patch(ENDPOINTS.MARKETPLACE_STORE.GO_OFFLINE(storeId));
  },

  /**
   * Pause Store
   * PATCH /marketplace/stores/:storeId/pause
   */
  pauseStore(storeId) {
    return apiClient.patch(ENDPOINTS.MARKETPLACE_STORE.PAUSE(storeId));
  },

  /**
   * Resume Store
   * PATCH /marketplace/stores/:storeId/resume
   */
  resumeStore(storeId) {
    return apiClient.patch(ENDPOINTS.MARKETPLACE_STORE.RESUME(storeId));
  },
};

export default marketplaceStoreService;
