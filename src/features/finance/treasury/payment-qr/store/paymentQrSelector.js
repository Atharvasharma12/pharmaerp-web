export const selectPaymentQr = (state) => state.paymentQr;

export const selectPaymentQrs = (state) => state.paymentQr.paymentQrs;

export const selectCurrentPaymentQr = (state) =>
  state.paymentQr.currentPaymentQr;

// Used for details/edit page
export const selectManagedPaymentQr = (state) =>
  state.paymentQr.managedPaymentQr;

export const selectPaymentQrStatus = (state) => state.paymentQr.status;

export const selectPaymentQrError = (state) => state.paymentQr.error;

export const selectPaymentQrMessage = (state) => state.paymentQr.message;

export const selectCreatePaymentQrStatus = (state) =>
  state.paymentQr.createPaymentQrStatus;

export const selectGetPaymentQrsStatus = (state) =>
  state.paymentQr.getPaymentQrsStatus;

export const selectGetPaymentQrStatus = (state) =>
  state.paymentQr.getPaymentQrStatus;

export const selectUpdatePaymentQrStatus = (state) =>
  state.paymentQr.updatePaymentQrStatus;

export const selectDeletePaymentQrStatus = (state) =>
  state.paymentQr.deletePaymentQrStatus;

export const selectSetPrimaryPaymentQrStatus = (state) =>
  state.paymentQr.setPrimaryPaymentQrStatus;
