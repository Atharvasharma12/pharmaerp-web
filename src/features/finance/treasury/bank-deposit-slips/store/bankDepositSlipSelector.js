export const selectBankDepositSlip = (state) => state.bankDepositSlip;

export const selectBankDepositSlips = (state) => state.bankDepositSlip.bankDepositSlips;

export const selectCurrentBankDepositSlip = (state) =>
  state.bankDepositSlip.currentBankDepositSlip;

// Used for details page
export const selectManagedBankDepositSlip = (state) =>
  state.bankDepositSlip.managedBankDepositSlip;

export const selectBankDepositSlipStatus = (state) => state.bankDepositSlip.status;

export const selectBankDepositSlipError = (state) => state.bankDepositSlip.error;

export const selectBankDepositSlipMessage = (state) => state.bankDepositSlip.message;

export const selectCreateBankDepositSlipStatus = (state) =>
  state.bankDepositSlip.createBankDepositSlipStatus;

export const selectGetBankDepositSlipsStatus = (state) =>
  state.bankDepositSlip.getBankDepositSlipsStatus;

export const selectGetBankDepositSlipStatus = (state) =>
  state.bankDepositSlip.getBankDepositSlipStatus;

export const selectConfirmDepositStatus = (state) =>
  state.bankDepositSlip.confirmDepositStatus;

export const selectCancelBankDepositSlipStatus = (state) =>
  state.bankDepositSlip.cancelBankDepositSlipStatus;
