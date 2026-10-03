// ---------------------
// Data
// ---------------------

export const selectCategoryMasters = (state) =>
  state.categoryMaster.categoryMasters;

export const selectCurrentCategoryMaster = (state) =>
  state.categoryMaster.currentCategoryMaster;

// ---------------------
// Global State
// ---------------------

export const selectCategoryMasterStatus = (state) =>
  state.categoryMaster.status;

export const selectCategoryMasterError = (state) => state.categoryMaster.error;

export const selectCategoryMasterMessage = (state) =>
  state.categoryMaster.message;

// ---------------------
// List Status
// ---------------------

export const selectGetCategoryMastersStatus = (state) =>
  state.categoryMaster.getCategoryMastersStatus;

// ---------------------
// Details Status
// ---------------------

export const selectGetCategoryMasterStatus = (state) =>
  state.categoryMaster.getCategoryMasterStatus;

// ---------------------
// Pagination
// ---------------------

export const selectCategoryMasterPagination = (state) => ({
  total: state.categoryMaster.total,
  page: state.categoryMaster.page,
  limit: state.categoryMaster.limit,
  totalPages: state.categoryMaster.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectCategoryMasterList = (state) =>
  state.categoryMaster.categoryMasters || [];

export const selectCategoryMasterById = (categoryId) => (state) =>
  state.categoryMaster.categoryMasters.find(
    (category) => category._id === categoryId,
  );

export const selectCategoryMasterBySlug = (slug) => (state) =>
  state.categoryMaster.categoryMasters.find(
    (category) => category.slug?.toLowerCase() === slug?.toLowerCase(),
  );
