export const selectLedger = (state) => state.ledger;

export const selectLedgerEntries = (state) => state.ledger.ledgerEntries;

export const selectLedgerStatus = (state) => state.ledger.status;

export const selectLedgerError = (state) => state.ledger.error;

export const selectLedgerMessage = (state) => state.ledger.message;

export const selectGetLedgerStatus = (state) => state.ledger.getLedgerStatus;

export const selectRecalculateLedgerStatus = (state) =>
  state.ledger.recalculateLedgerStatus;
