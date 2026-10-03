export const selectCashTransaction = (state) => state.cashTransaction;

export const selectCashTransactions = (state) =>
  state.cashTransaction.cashTransactions;

export const selectCurrentCashTransaction = (state) =>
  state.cashTransaction.currentCashTransaction;

// Used for details page
export const selectManagedCashTransaction = (state) =>
  state.cashTransaction.managedCashTransaction;

export const selectCashTransactionStatus = (state) =>
  state.cashTransaction.status;

export const selectCashTransactionError = (state) =>
  state.cashTransaction.error;

export const selectCashTransactionMessage = (state) =>
  state.cashTransaction.message;

export const selectCreateCashTransactionStatus = (state) =>
  state.cashTransaction.createCashTransactionStatus;

export const selectGetCashTransactionsStatus = (state) =>
  state.cashTransaction.getCashTransactionsStatus;

export const selectGetCashTransactionStatus = (state) =>
  state.cashTransaction.getCashTransactionStatus;

export const selectCancelCashTransactionStatus = (state) =>
  state.cashTransaction.cancelCashTransactionStatus;
