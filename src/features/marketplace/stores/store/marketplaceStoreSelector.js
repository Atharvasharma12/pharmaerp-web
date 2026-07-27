// src/features/marketplace/stores/store/marketplaceStoreSelector.js

export const selectMarketplaceStores = (state) =>
  state.marketplaceStore?.stores || [];

export const selectCurrentMarketplaceStore = (state) =>
  state.marketplaceStore?.currentStore || null;

export const selectMarketplaceStorePagination = (state) => ({
  total: state.marketplaceStore?.total || 0,
  page: state.marketplaceStore?.page || 1,
  limit: state.marketplaceStore?.limit || 20,
  totalPages: state.marketplaceStore?.totalPages || 0,
});

export const selectMarketplaceStoreStatus = (state) =>
  state.marketplaceStore?.status;

export const selectMarketplaceStoreError = (state) =>
  state.marketplaceStore?.error;

export const selectMarketplaceStoreMessage = (state) =>
  state.marketplaceStore?.message;

export const selectGetMarketplaceStoresStatus = (state) =>
  state.marketplaceStore?.getMarketplaceStoresStatus;

export const selectGetMarketplaceStoreStatus = (state) =>
  state.marketplaceStore?.getMarketplaceStoreStatus;

export const selectCreateMarketplaceStoreStatus = (state) =>
  state.marketplaceStore?.createMarketplaceStoreStatus;

export const selectUpdateMarketplaceStoreStatus = (state) =>
  state.marketplaceStore?.updateMarketplaceStoreStatus;

export const selectDeleteMarketplaceStoreStatus = (state) =>
  state.marketplaceStore?.deleteMarketplaceStoreStatus;

export const selectStatusToggleStatus = (state) =>
  state.marketplaceStore?.statusToggleStatus;
