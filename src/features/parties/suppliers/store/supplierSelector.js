export const selectSuppliers = (state) => state.supplier.suppliers;

export const selectCurrentSupplier = (state) => state.supplier.currentSupplier;

export const selectSupplierLedger = (state) => state.supplier.ledger;

export const selectSupplierOutstanding = (state) => state.supplier.outstanding;

export const selectSupplierPurchases = (state) => state.supplier.purchases;

export const selectSupplierPayments = (state) => state.supplier.payments;

export const selectSupplierTotal = (state) => state.supplier.total;

export const selectSupplierPage = (state) => state.supplier.page;

export const selectSupplierLimit = (state) => state.supplier.limit;

export const selectSupplierStats = (state) => state.supplier.stats;

export const selectSupplierStatus = (state) => state.supplier.status;

export const selectSupplierError = (state) => state.supplier.error;

export const selectSupplierMessage = (state) => state.supplier.message;

/*
|--------------------------------------------------------------------------
| CRUD Status
|--------------------------------------------------------------------------
*/

export const selectCreateSupplierStatus = (state) =>
  state.supplier.createSupplierStatus;

export const selectGetSuppliersStatus = (state) =>
  state.supplier.getSuppliersStatus;

export const selectGetSupplierStatus = (state) =>
  state.supplier.getSupplierStatus;

export const selectUpdateSupplierStatus = (state) =>
  state.supplier.updateSupplierStatus;

export const selectDeleteSupplierStatus = (state) =>
  state.supplier.deleteSupplierStatus;

/*
|--------------------------------------------------------------------------
| Financial Status
|--------------------------------------------------------------------------
*/

export const selectGetSupplierLedgerStatus = (state) =>
  state.supplier.getSupplierLedgerStatus;

export const selectGetSupplierOutstandingStatus = (state) =>
  state.supplier.getSupplierOutstandingStatus;

export const selectGetSupplierPurchasesStatus = (state) =>
  state.supplier.getSupplierPurchasesStatus;

export const selectGetSupplierPaymentsStatus = (state) =>
  state.supplier.getSupplierPaymentsStatus;
