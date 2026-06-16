// src/features/workspace-products/store/workspaceProductSelector.js

// ---------------------
// Data
// ---------------------

export const selectWorkspaceProducts = (state) =>
  state.workspaceProduct.products;

export const selectCurrentWorkspaceProduct = (state) =>
  state.workspaceProduct.currentProduct;

export const selectSearchBeforeCreateResult = (state) =>
  state.workspaceProduct.searchBeforeCreateResult;

// ---------------------
// Global State
// ---------------------

export const selectWorkspaceProductStatus = (state) =>
  state.workspaceProduct.status;

export const selectWorkspaceProductError = (state) =>
  state.workspaceProduct.error;

export const selectWorkspaceProductMessage = (state) =>
  state.workspaceProduct.message;

// ---------------------
// Search Before Create
// ---------------------

export const selectSearchBeforeCreateStatus = (state) =>
  state.workspaceProduct.searchBeforeCreateStatus;

// ---------------------
// Create
// ---------------------

export const selectCreateWorkspaceProductStatus = (state) =>
  state.workspaceProduct.createWorkspaceProductStatus;

// ---------------------
// List
// ---------------------

export const selectGetWorkspaceProductsStatus = (state) =>
  state.workspaceProduct.getWorkspaceProductsStatus;

// ---------------------
// Details
// ---------------------

export const selectGetWorkspaceProductStatus = (state) =>
  state.workspaceProduct.getWorkspaceProductStatus;

// ---------------------
// Update
// ---------------------

export const selectUpdateWorkspaceProductStatus = (state) =>
  state.workspaceProduct.updateWorkspaceProductStatus;

// ---------------------
// Delete
// ---------------------

export const selectDeleteWorkspaceProductStatus = (state) =>
  state.workspaceProduct.deleteWorkspaceProductStatus;

// ---------------------
// Pagination
// ---------------------

export const selectWorkspaceProductPagination = (state) => ({
  total: state.workspaceProduct.total,
  page: state.workspaceProduct.page,
  limit: state.workspaceProduct.limit,
  totalPages: state.workspaceProduct.totalPages,
});

// ---------------------
// Search Helpers
// ---------------------

export const selectWorkspaceProductList = (state) =>
  state.workspaceProduct.products || [];

export const selectWorkspaceProductById = (productId) => (state) =>
  state.workspaceProduct.products.find((product) => product._id === productId);

export const selectWorkspaceProductByCode = (productCode) => (state) =>
  state.workspaceProduct.products.find(
    (product) => product.workspaceProductCode === productCode,
  );

// ---------------------
// Search Before Create Helpers
// ---------------------

export const selectSearchBeforeCreateSuggestions = (state) =>
  state.workspaceProduct.searchBeforeCreateResult?.suggestions || [];

export const selectSearchBeforeCreateMatched = (state) =>
  state.workspaceProduct.searchBeforeCreateResult?.matched || false;

export const selectSearchBeforeCreateConfidence = (state) =>
  state.workspaceProduct.searchBeforeCreateResult?.confidence || 0;

export const selectSearchBeforeCreateProductSource = (state) =>
  state.workspaceProduct.searchBeforeCreateResult?.productSource || null;

export const selectSearchBeforeCreateProductId = (state) =>
  state.workspaceProduct.searchBeforeCreateResult?.productId || null;
