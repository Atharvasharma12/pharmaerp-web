export const selectBankTransaction = (state) => state.bankTransaction;

export const selectBankTransactions = (state) =>
  state.bankTransaction.bankTransactions;

export const selectCurrentBankTransaction = (state) =>
  state.bankTransaction.currentBankTransaction;

// Used for details page
export const selectManagedBankTransaction = (state) =>
  state.bankTransaction.managedBankTransaction;

export const selectBankTransactionStatus = (state) =>
  state.bankTransaction.status;

export const selectBankTransactionError = (state) =>
  state.bankTransaction.error;

export const selectBankTransactionMessage = (state) =>
  state.bankTransaction.message;

export const selectCreateBankTransactionStatus = (state) =>
  state.bankTransaction.createBankTransactionStatus;

export const selectGetBankTransactionsStatus = (state) =>
  state.bankTransaction.getBankTransactionsStatus;

export const selectGetBankTransactionStatus = (state) =>
  state.bankTransaction.getBankTransactionStatus;

export const selectCancelBankTransactionStatus = (state) =>
  state.bankTransaction.cancelBankTransactionStatus;
