// ---------------------
// Data
// ---------------------

export const selectSaltMasters = (state) => state.saltMaster.saltMasters;

export const selectCurrentSaltMaster = (state) =>
  state.saltMaster.currentSaltMaster;

// ---------------------
// Global State
// ---------------------

export const selectSaltMasterStatus = (state) => state.saltMaster.status;

export const selectSaltMasterError = (state) => state.saltMaster.error;

export const selectSaltMasterMessage = (state) => state.saltMaster.message;

// ---------------------
// List Status
// ---------------------

export const selectGetSaltMastersStatus = (state) =>
  state.saltMaster.getSaltMastersStatus;

// ---------------------
// Details Status
// ---------------------

export const selectGetSaltMasterStatus = (state) =>
  state.saltMaster.getSaltMasterStatus;

// ---------------------
// Pagination
// ---------------------

export const selectSaltMasterPagination = (state) => ({
  total: state.saltMaster.total,
  page: state.saltMaster.page,
  limit: state.saltMaster.limit,
  totalPages: state.saltMaster.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectSaltMasterList = (state) =>
  state.saltMaster.saltMasters || [];

export const selectSaltMasterById = (saltId) => (state) =>
  state.saltMaster.saltMasters.find((salt) => salt._id === saltId);

export const selectSaltMasterByName = (name) => (state) =>
  state.saltMaster.saltMasters.find(
    (salt) => salt.name?.toLowerCase() === name?.toLowerCase(),
  );
