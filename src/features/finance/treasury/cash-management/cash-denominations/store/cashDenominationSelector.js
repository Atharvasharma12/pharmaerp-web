export const selectCashDenomination = (state) => state.cashDenomination;

export const selectCashDenominations = (state) =>
  state.cashDenomination.cashDenominations;

export const selectCurrentCashDenomination = (state) =>
  state.cashDenomination.currentCashDenomination;

// Used for details page
export const selectManagedCashDenomination = (state) =>
  state.cashDenomination.managedCashDenomination;

export const selectCashDenominationStatus = (state) =>
  state.cashDenomination.status;

export const selectCashDenominationError = (state) =>
  state.cashDenomination.error;

export const selectCashDenominationMessage = (state) =>
  state.cashDenomination.message;

export const selectCreateCashDenominationStatus = (state) =>
  state.cashDenomination.createCashDenominationStatus;

export const selectGetCashDenominationsStatus = (state) =>
  state.cashDenomination.getCashDenominationsStatus;

export const selectGetCashDenominationStatus = (state) =>
  state.cashDenomination.getCashDenominationStatus;

export const selectConfirmCashDenominationStatus = (state) =>
  state.cashDenomination.confirmCashDenominationStatus;

export const selectCancelCashDenominationStatus = (state) =>
  state.cashDenomination.cancelCashDenominationStatus;
