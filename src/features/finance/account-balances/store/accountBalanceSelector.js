export const selectAccountBalance = (state) => state.accountBalance;

export const selectAccountBalances = (state) =>
  state.accountBalance.accountBalances;

export const selectCurrentAccountBalance = (state) =>
  state.accountBalance.currentAccountBalance;

export const selectAccountBalanceStatus = (state) =>
  state.accountBalance.status;

export const selectAccountBalanceError = (state) => state.accountBalance.error;

export const selectAccountBalanceMessage = (state) =>
  state.accountBalance.message;

export const selectGetAccountBalancesStatus = (state) =>
  state.accountBalance.getAccountBalancesStatus;

export const selectGetAccountBalanceStatus = (state) =>
  state.accountBalance.getAccountBalanceStatus;

export const selectRecalculateAccountBalanceStatus = (state) =>
  state.accountBalance.recalculateAccountBalanceStatus;
