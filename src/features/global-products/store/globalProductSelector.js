// src/features/global-products/store/globalProductSelector.js

// ---------------------
// Data
// ---------------------

export const selectGlobalProducts = (state) => state.globalProduct.products;

export const selectCurrentGlobalProduct = (state) =>
  state.globalProduct.currentProduct;

// ---------------------
// Global State
// ---------------------

export const selectGlobalProductStatus = (state) => state.globalProduct.status;

export const selectGlobalProductError = (state) => state.globalProduct.error;

export const selectGlobalProductMessage = (state) =>
  state.globalProduct.message;

// ---------------------
// List
// ---------------------

export const selectGetGlobalProductsStatus = (state) =>
  state.globalProduct.getGlobalProductsStatus;

// ---------------------
// Details
// ---------------------

export const selectGetGlobalProductStatus = (state) =>
  state.globalProduct.getGlobalProductStatus;

// ---------------------
// Pagination
// ---------------------

export const selectGlobalProductPagination = (state) => ({
  total: state.globalProduct.total,
  page: state.globalProduct.page,
  limit: state.globalProduct.limit,
  totalPages: state.globalProduct.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectGlobalProductList = (state) =>
  state.globalProduct.products || [];

export const selectGlobalProductById = (productId) => (state) =>
  state.globalProduct.products.find((product) => product._id === productId);

export const selectGlobalProductByCode = (productCode) => (state) =>
  state.globalProduct.products.find(
    (product) => product.globalProductCode === productCode,
  );
