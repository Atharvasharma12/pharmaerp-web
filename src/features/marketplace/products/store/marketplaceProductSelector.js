// src/features/marketplace/products/store/marketplaceProductSelector.js

export const selectMarketplaceProducts = (state) =>
  state.marketplaceProduct.products;

export const selectCurrentMarketplaceProduct = (state) =>
  state.marketplaceProduct.currentProduct;

export const selectMarketplaceProductStatus = (state) =>
  state.marketplaceProduct.status;

export const selectMarketplaceProductError = (state) =>
  state.marketplaceProduct.error;

export const selectMarketplaceProductMessage = (state) =>
  state.marketplaceProduct.message;

export const selectEnableMarketplaceProductStatus = (state) =>
  state.marketplaceProduct.enableMarketplaceProductStatus;

export const selectGetMarketplaceProductsStatus = (state) =>
  state.marketplaceProduct.getMarketplaceProductsStatus;

export const selectGetMarketplaceProductStatus = (state) =>
  state.marketplaceProduct.getMarketplaceProductStatus;

export const selectUpdateMarketplaceProductStatus = (state) =>
  state.marketplaceProduct.updateMarketplaceProductStatus;

export const selectDisableMarketplaceProductStatus = (state) =>
  state.marketplaceProduct.disableMarketplaceProductStatus;

export const selectMarketplaceProductPagination = (state) => ({
  total: state.marketplaceProduct.total,
  page: state.marketplaceProduct.page,
  limit: state.marketplaceProduct.limit,
  totalPages: state.marketplaceProduct.totalPages,
});
