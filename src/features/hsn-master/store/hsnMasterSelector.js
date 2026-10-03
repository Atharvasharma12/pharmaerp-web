// ---------------------
// Data
// ---------------------

export const selectHsnMasters = (state) => state.hsnMaster.hsnMasters;

export const selectCurrentHsnMaster = (state) =>
  state.hsnMaster.currentHsnMaster;

// ---------------------
// Global State
// ---------------------

export const selectHsnMasterStatus = (state) => state.hsnMaster.status;

export const selectHsnMasterError = (state) => state.hsnMaster.error;

export const selectHsnMasterMessage = (state) => state.hsnMaster.message;

// ---------------------
// List
// ---------------------

export const selectGetHsnMastersStatus = (state) =>
  state.hsnMaster.getHsnMastersStatus;

// ---------------------
// Details
// ---------------------

export const selectGetHsnMasterStatus = (state) =>
  state.hsnMaster.getHsnMasterStatus;

// ---------------------
// Pagination
// ---------------------

export const selectHsnMasterPagination = (state) => ({
  total: state.hsnMaster.total,
  page: state.hsnMaster.page,
  limit: state.hsnMaster.limit,
  totalPages: state.hsnMaster.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectHsnMasterList = (state) => state.hsnMaster.hsnMasters || [];

export const selectHsnMasterById = (hsnId) => (state) =>
  state.hsnMaster.hsnMasters.find((hsn) => hsn._id === hsnId);

export const selectHsnMasterByCode = (hsnCode) => (state) =>
  state.hsnMaster.hsnMasters.find((hsn) => hsn.code === hsnCode);
