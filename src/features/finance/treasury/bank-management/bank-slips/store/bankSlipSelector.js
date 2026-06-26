export const selectBankSlip = (state) => state.bankSlip;

export const selectBankSlips = (state) => state.bankSlip.bankSlips;

export const selectCurrentBankSlip = (state) => state.bankSlip.currentBankSlip;

// Used for details page
export const selectManagedBankSlip = (state) => state.bankSlip.managedBankSlip;

export const selectBankSlipStatus = (state) => state.bankSlip.status;

export const selectBankSlipError = (state) => state.bankSlip.error;

export const selectBankSlipMessage = (state) => state.bankSlip.message;

export const selectCreateBankSlipStatus = (state) =>
  state.bankSlip.createBankSlipStatus;

export const selectGetBankSlipsStatus = (state) =>
  state.bankSlip.getBankSlipsStatus;

export const selectGetBankSlipStatus = (state) =>
  state.bankSlip.getBankSlipStatus;

export const selectSubmitBankSlipStatus = (state) =>
  state.bankSlip.submitBankSlipStatus;

export const selectConfirmBankSlipStatus = (state) =>
  state.bankSlip.confirmBankSlipStatus;

export const selectRejectBankSlipStatus = (state) =>
  state.bankSlip.rejectBankSlipStatus;

export const selectCancelBankSlipStatus = (state) =>
  state.bankSlip.cancelBankSlipStatus;
