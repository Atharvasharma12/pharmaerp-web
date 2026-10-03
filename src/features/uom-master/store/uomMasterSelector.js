// ---------------------
// Data
// ---------------------

export const selectUomMasters = (state) => state.uomMaster.uomMasters;

export const selectCurrentUomMaster = (state) =>
  state.uomMaster.currentUomMaster;

// ---------------------
// Global State
// ---------------------

export const selectUomMasterStatus = (state) => state.uomMaster.status;

export const selectUomMasterError = (state) => state.uomMaster.error;

export const selectUomMasterMessage = (state) => state.uomMaster.message;

// ---------------------
// List Status
// ---------------------

export const selectGetUomMastersStatus = (state) =>
  state.uomMaster.getUomMastersStatus;

// ---------------------
// Details Status
// ---------------------

export const selectGetUomMasterStatus = (state) =>
  state.uomMaster.getUomMasterStatus;

// ---------------------
// Pagination
// ---------------------

export const selectUomMasterPagination = (state) => ({
  total: state.uomMaster.total,
  page: state.uomMaster.page,
  limit: state.uomMaster.limit,
  totalPages: state.uomMaster.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectUomMasterList = (state) => state.uomMaster.uomMasters || [];

export const selectUomMasterById = (uomId) => (state) =>
  state.uomMaster.uomMasters.find((uom) => uom._id === uomId);

export const selectUomMasterByName = (name) => (state) =>
  state.uomMaster.uomMasters.find(
    (uom) => uom.name?.toLowerCase() === name?.toLowerCase(),
  );

export const selectUomMasterByAbbreviation = (abbreviation) => (state) =>
  state.uomMaster.uomMasters.find(
    (uom) => uom.abbreviation?.toLowerCase() === abbreviation?.toLowerCase(),
  );
