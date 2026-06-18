// ---------------------
// Data
// ---------------------

export const selectManufacturerMasters = (state) =>
  state.manufacturerMaster.manufacturerMasters;

export const selectCurrentManufacturerMaster = (state) =>
  state.manufacturerMaster.currentManufacturerMaster;

// ---------------------
// Global State
// ---------------------

export const selectManufacturerMasterStatus = (state) =>
  state.manufacturerMaster.status;

export const selectManufacturerMasterError = (state) =>
  state.manufacturerMaster.error;

export const selectManufacturerMasterMessage = (state) =>
  state.manufacturerMaster.message;

// ---------------------
// List Status
// ---------------------

export const selectGetManufacturerMastersStatus = (state) =>
  state.manufacturerMaster.getManufacturerMastersStatus;

// ---------------------
// Details Status
// ---------------------

export const selectGetManufacturerMasterStatus = (state) =>
  state.manufacturerMaster.getManufacturerMasterStatus;

// ---------------------
// Pagination
// ---------------------

export const selectManufacturerMasterPagination = (state) => ({
  total: state.manufacturerMaster.total,
  page: state.manufacturerMaster.page,
  limit: state.manufacturerMaster.limit,
  totalPages: state.manufacturerMaster.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectManufacturerMasterList = (state) =>
  state.manufacturerMaster.manufacturerMasters || [];

export const selectManufacturerMasterById = (manufacturerId) => (state) =>
  state.manufacturerMaster.manufacturerMasters.find(
    (manufacturer) => manufacturer._id === manufacturerId,
  );

export const selectManufacturerMasterByName = (name) => (state) =>
  state.manufacturerMaster.manufacturerMasters.find(
    (manufacturer) => manufacturer.name?.toLowerCase() === name?.toLowerCase(),
  );
