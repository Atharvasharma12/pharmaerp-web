export const selectFundTransfer = (state) => state.fundTransfer;

export const selectFundTransfers = (state) => state.fundTransfer.fundTransfers;

export const selectCurrentFundTransfer = (state) =>
  state.fundTransfer.currentFundTransfer;

// Used for details page
export const selectManagedFundTransfer = (state) =>
  state.fundTransfer.managedFundTransfer;

export const selectFundTransferStatus = (state) => state.fundTransfer.status;

export const selectFundTransferError = (state) => state.fundTransfer.error;

export const selectFundTransferMessage = (state) => state.fundTransfer.message;

export const selectCreateFundTransferStatus = (state) =>
  state.fundTransfer.createFundTransferStatus;

export const selectGetFundTransfersStatus = (state) =>
  state.fundTransfer.getFundTransfersStatus;

export const selectGetFundTransferStatus = (state) =>
  state.fundTransfer.getFundTransferStatus;

export const selectCancelFundTransferStatus = (state) =>
  state.fundTransfer.cancelFundTransferStatus;
