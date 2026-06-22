export const selectCustomers = (state) => state.customer.customers;

export const selectCurrentCustomer = (state) => state.customer.currentCustomer;

export const selectCustomerLedger = (state) => state.customer.ledger;

export const selectCustomerOutstanding = (state) => state.customer.outstanding;

export const selectCustomerSales = (state) => state.customer.sales;

export const selectCustomerPayments = (state) => state.customer.payments;

export const selectCustomerTotal = (state) => state.customer.total;

export const selectCustomerPage = (state) => state.customer.page;

export const selectCustomerLimit = (state) => state.customer.limit;

export const selectCustomerStatus = (state) => state.customer.status;

export const selectCustomerError = (state) => state.customer.error;

export const selectCustomerMessage = (state) => state.customer.message;

/*
|--------------------------------------------------------------------------
| CRUD Status
|--------------------------------------------------------------------------
*/

export const selectCreateCustomerStatus = (state) =>
  state.customer.createCustomerStatus;

export const selectGetCustomersStatus = (state) =>
  state.customer.getCustomersStatus;

export const selectGetCustomerStatus = (state) =>
  state.customer.getCustomerStatus;

export const selectUpdateCustomerStatus = (state) =>
  state.customer.updateCustomerStatus;

export const selectDeleteCustomerStatus = (state) =>
  state.customer.deleteCustomerStatus;

/*
|--------------------------------------------------------------------------
| Financial Status
|--------------------------------------------------------------------------
*/

export const selectGetCustomerLedgerStatus = (state) =>
  state.customer.getCustomerLedgerStatus;

export const selectGetCustomerOutstandingStatus = (state) =>
  state.customer.getCustomerOutstandingStatus;

export const selectGetCustomerSalesStatus = (state) =>
  state.customer.getCustomerSalesStatus;

export const selectGetCustomerPaymentsStatus = (state) =>
  state.customer.getCustomerPaymentsStatus;
