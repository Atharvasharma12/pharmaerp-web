// ---------------------
// Data
// ---------------------

export const selectProductFormMasters = (state) =>
  state.productFormMaster.productFormMasters;

export const selectCurrentProductFormMaster = (state) =>
  state.productFormMaster.currentProductFormMaster;

// ---------------------
// Global State
// ---------------------

export const selectProductFormMasterStatus = (state) =>
  state.productFormMaster.status;

export const selectProductFormMasterError = (state) =>
  state.productFormMaster.error;

export const selectProductFormMasterMessage = (state) =>
  state.productFormMaster.message;

// ---------------------
// List Status
// ---------------------

export const selectGetProductFormMastersStatus = (state) =>
  state.productFormMaster.getProductFormMastersStatus;

// ---------------------
// Details Status
// ---------------------

export const selectGetProductFormMasterStatus = (state) =>
  state.productFormMaster.getProductFormMasterStatus;

// ---------------------
// Pagination
// ---------------------

export const selectProductFormMasterPagination = (state) => ({
  total: state.productFormMaster.total,
  page: state.productFormMaster.page,
  limit: state.productFormMaster.limit,
  totalPages: state.productFormMaster.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectProductFormMasterList = (state) =>
  state.productFormMaster.productFormMasters || [];

export const selectProductFormMasterById = (formId) => (state) =>
  state.productFormMaster.productFormMasters.find(
    (form) => form._id === formId,
  );

export const selectProductFormMasterByName = (name) => (state) =>
  state.productFormMaster.productFormMasters.find(
    (form) => form.name?.toLowerCase() === name?.toLowerCase(),
  );
