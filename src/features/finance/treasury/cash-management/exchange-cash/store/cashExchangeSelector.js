export const selectCashExchange = (state) => state.cashExchange;

export const selectCashExchanges = (state) => state.cashExchange.cashExchanges;

export const selectCurrentCashExchange = (state) =>
  state.cashExchange.currentCashExchange;

// Used for details page
export const selectManagedCashExchange = (state) =>
  state.cashExchange.managedCashExchange;

export const selectCashExchangeStatus = (state) => state.cashExchange.status;

export const selectCashExchangeError = (state) => state.cashExchange.error;

export const selectCashExchangeMessage = (state) => state.cashExchange.message;

export const selectCreateCashExchangeStatus = (state) =>
  state.cashExchange.createCashExchangeStatus;

export const selectGetCashExchangesStatus = (state) =>
  state.cashExchange.getCashExchangesStatus;

export const selectGetCashExchangeStatus = (state) =>
  state.cashExchange.getCashExchangeStatus;

export const selectCancelCashExchangeStatus = (state) =>
  state.cashExchange.cancelCashExchangeStatus;
