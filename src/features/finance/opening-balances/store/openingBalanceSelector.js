export const selectOpeningBalance = (state) => state.openingBalance;

export const selectOpeningBalanceResult = (state) =>
  state.openingBalance.result;

export const selectOpeningBalanceStatus = (state) =>
  state.openingBalance.status;

export const selectOpeningBalanceError = (state) => state.openingBalance.error;

export const selectOpeningBalanceMessage = (state) =>
  state.openingBalance.message;

export const selectSetAccountOpeningBalanceStatus = (state) =>
  state.openingBalance.setAccountOpeningBalanceStatus;

export const selectSetCustomerOpeningBalanceStatus = (state) =>
  state.openingBalance.setCustomerOpeningBalanceStatus;

export const selectSetSupplierOpeningBalanceStatus = (state) =>
  state.openingBalance.setSupplierOpeningBalanceStatus;

export const selectSetBankAccountOpeningBalanceStatus = (state) =>
  state.openingBalance.setBankAccountOpeningBalanceStatus;

export const selectSetCashAccountOpeningBalanceStatus = (state) =>
  state.openingBalance.setCashAccountOpeningBalanceStatus;
