export const selectJournalVoucher = (state) => state.journalVoucher;

export const selectJournalVouchers = (state) =>
  state.journalVoucher.journalVouchers;

export const selectCurrentJournalVoucher = (state) =>
  state.journalVoucher.currentJournalVoucher;

// Used for details/edit page
export const selectManagedJournalVoucher = (state) =>
  state.journalVoucher.managedJournalVoucher;

export const selectJournalVoucherStatus = (state) =>
  state.journalVoucher.status;

export const selectJournalVoucherError = (state) => state.journalVoucher.error;

export const selectJournalVoucherMessage = (state) =>
  state.journalVoucher.message;

export const selectCreateJournalVoucherStatus = (state) =>
  state.journalVoucher.createJournalVoucherStatus;

export const selectGetJournalVouchersStatus = (state) =>
  state.journalVoucher.getJournalVouchersStatus;

export const selectGetJournalVoucherStatus = (state) =>
  state.journalVoucher.getJournalVoucherStatus;

export const selectUpdateJournalVoucherStatus = (state) =>
  state.journalVoucher.updateJournalVoucherStatus;

export const selectPostJournalVoucherStatus = (state) =>
  state.journalVoucher.postJournalVoucherStatus;

export const selectCancelJournalVoucherStatus = (state) =>
  state.journalVoucher.cancelJournalVoucherStatus;

export const selectSubmitJournalVoucherApprovalStatus = (state) =>
  state.journalVoucher.submitJournalVoucherApprovalStatus;

export const selectApproveJournalVoucherStatus = (state) =>
  state.journalVoucher.approveJournalVoucherStatus;

export const selectReverseJournalVoucherStatus = (state) =>
  state.journalVoucher.reverseJournalVoucherStatus;
