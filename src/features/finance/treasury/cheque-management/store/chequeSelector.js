export const selectCheque = (state) => state.cheque;

export const selectCheques = (state) => state.cheque.cheques;

export const selectCurrentCheque = (state) => state.cheque.currentCheque;

// Used for details page
export const selectManagedCheque = (state) => state.cheque.managedCheque;

export const selectChequeStatus = (state) => state.cheque.status;

export const selectChequeError = (state) => state.cheque.error;

export const selectChequeMessage = (state) => state.cheque.message;

export const selectCreateChequeStatus = (state) =>
  state.cheque.createChequeStatus;

export const selectGetChequesStatus = (state) => state.cheque.getChequesStatus;

export const selectGetChequeStatus = (state) => state.cheque.getChequeStatus;

export const selectDepositChequeStatus = (state) =>
  state.cheque.depositChequeStatus;

export const selectClearChequeStatus = (state) =>
  state.cheque.clearChequeStatus;

export const selectBounceChequeStatus = (state) =>
  state.cheque.bounceChequeStatus;

export const selectCancelChequeStatus = (state) =>
  state.cheque.cancelChequeStatus;
