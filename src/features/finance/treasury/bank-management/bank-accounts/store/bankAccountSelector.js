export const selectBankAccount = (state) => state.bankAccount;

export const selectBankAccounts = (state) => state.bankAccount.bankAccounts;

export const selectCurrentBankAccount = (state) =>
  state.bankAccount.currentBankAccount;

// Used for details/edit page
export const selectManagedBankAccount = (state) =>
  state.bankAccount.managedBankAccount;

export const selectBankAccountStatus = (state) => state.bankAccount.status;

export const selectBankAccountError = (state) => state.bankAccount.error;

export const selectBankAccountMessage = (state) => state.bankAccount.message;

export const selectCreateBankAccountStatus = (state) =>
  state.bankAccount.createBankAccountStatus;

export const selectGetBankAccountsStatus = (state) =>
  state.bankAccount.getBankAccountsStatus;

export const selectGetBankAccountStatus = (state) =>
  state.bankAccount.getBankAccountStatus;

export const selectUpdateBankAccountStatus = (state) =>
  state.bankAccount.updateBankAccountStatus;

export const selectDeleteBankAccountStatus = (state) =>
  state.bankAccount.deleteBankAccountStatus;

export const selectSetPrimaryBankAccountStatus = (state) =>
  state.bankAccount.setPrimaryBankAccountStatus;
