// ---------------------
// Data
// ---------------------

export const selectBankMasters = (state) => state.bankMaster.bankMasters;

export const selectCurrentBankMaster = (state) =>
  state.bankMaster.currentBankMaster;

// ---------------------
// Global State
// ---------------------

export const selectBankMasterStatus = (state) => state.bankMaster.status;

export const selectBankMasterError = (state) => state.bankMaster.error;

export const selectBankMasterMessage = (state) => state.bankMaster.message;

// ---------------------
// List Status
// ---------------------

export const selectGetBankMastersStatus = (state) =>
  state.bankMaster.getBankMastersStatus;

// ---------------------
// Details Status
// ---------------------

export const selectGetBankMasterStatus = (state) =>
  state.bankMaster.getBankMasterStatus;

// ---------------------
// Pagination
// ---------------------

export const selectBankMasterPagination = (state) => ({
  total: state.bankMaster.total,
  page: state.bankMaster.page,
  limit: state.bankMaster.limit,
  totalPages: state.bankMaster.totalPages,
});

// ---------------------
// Helpers
// ---------------------

export const selectBankMasterList = (state) =>
  state.bankMaster.bankMasters || [];

export const selectBankMasterById = (bankId) => (state) =>
  state.bankMaster.bankMasters.find((bank) => bank._id === bankId);

export const selectBankMasterByName = (name) => (state) =>
  state.bankMaster.bankMasters.find(
    (bank) => bank.name?.toLowerCase() === name?.toLowerCase(),
  );
