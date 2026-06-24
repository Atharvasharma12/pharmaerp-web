export const selectCashAccount = (state) => state.cashAccount;

export const selectCashAccounts = (state) => state.cashAccount.cashAccounts;

export const selectCurrentCashAccount = (state) =>
  state.cashAccount.currentCashAccount;

// Used for details/edit page
export const selectManagedCashAccount = (state) =>
  state.cashAccount.managedCashAccount;

export const selectCashAccountStatus = (state) => state.cashAccount.status;

export const selectCashAccountError = (state) => state.cashAccount.error;

export const selectCashAccountMessage = (state) => state.cashAccount.message;

export const selectCreateCashAccountStatus = (state) =>
  state.cashAccount.createCashAccountStatus;

export const selectGetCashAccountsStatus = (state) =>
  state.cashAccount.getCashAccountsStatus;

export const selectGetCashAccountStatus = (state) =>
  state.cashAccount.getCashAccountStatus;

export const selectUpdateCashAccountStatus = (state) =>
  state.cashAccount.updateCashAccountStatus;

export const selectDeleteCashAccountStatus = (state) =>
  state.cashAccount.deleteCashAccountStatus;

export const selectSetPrimaryCashAccountStatus = (state) =>
  state.cashAccount.setPrimaryCashAccountStatus;
