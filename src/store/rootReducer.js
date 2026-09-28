import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/store/authSlice";
import userReducer from "@/features/user/store/userSlice";

import workspaceReducer from "@/features/workspace/store/workspaceSlice";
import companyReducer from "@/features/company/store/companySlice";
import branchReducer from "@/features/branch/store/branchSlice";

import accessControlReducer from "@/features/access-control/store/accessControlSlice";

import customerReducer from "@/features/parties/customers/store/customerSlice";
import supplierReducer from "@/features/parties/suppliers/store/supplierSlice";

import accountGroupReducer from "@/features/finance/chart-of-accounts/account-groups/store/accountGroupSlice";
import accountReducer from "@/features/finance/chart-of-accounts/accounts/store/accountSlice";
import openingBalanceReducer from "@/features/finance/opening-balances/store/openingBalanceSlice";
import accountBalanceReducer from "@/features/finance/account-balances/store/accountBalanceSlice";
import financialPeriodReducer from "@/features/finance/financial-periods/store/financialPeriodSlice";
import ledgerReducer from "@/features/finance/ledger/store/ledgerSlice";
import journalVoucherReducer from "@/features/finance/journal-vouchers/store/journalVoucherSlice";
import reportsReducer from "@/features/finance/reports/store/reportsSlice";

import bankAccountReducer from "@/features/finance/treasury/bank-management/bank-accounts/store/bankAccountSlice";
import bankTransactionReducer from "@/features/finance/treasury/bank-management/bank-transactions/store/bankTransactionSlice";
import bankSlipReducer from "@/features/finance/treasury/bank-management/bank-slips/store/bankSlipSlice";

import cashAccountReducer from "@/features/finance/treasury/cash-management/cash-accounts/store/cashAccountSlice";
import cashTransactionReducer from "@/features/finance/treasury/cash-management/cash-transactions/store/cashTransactionSlice";
import cashDenominationReducer from "@/features/finance/treasury/cash-management/cash-denominations/store/cashDenominationSlice";

import fundTransferReducer from "@/features/finance/treasury/fund-transfers/store/fundTransferSlice";
import paymentQrReducer from "@/features/finance/treasury/payment-qr/store/paymentQrSlice";
import chequeReducer from "@/features/finance/treasury/cheque-management/store/chequeSlice";

import planReducer from "@/features/subscription/plans/store/planSlice";
import subscriptionReducer from "@/features/subscription/subscriptions/store/subscriptionSlice";

// Catalog
import workspaceProductReducer from "@/features/workspace-products/store/workspaceProductSlice";
import globalProductReducer from "@/features/global-products/store/globalProductSlice";
import hsnMasterReducer from "@/features/hsn-master/store/hsnMasterSlice";
import manufacturerMasterReducer from "@/features/manufacturer-master/store/manufacturerMasterSlice";
import uomMasterReducer from "@/features/uom-master/store/uomMasterSlice";
import categoryMasterReducer from "@/features/category-master/store/categoryMasterSlice";
import productFormMasterReducer from "@/features/product-form-master/store/productFormMasterSlice";
import saltMasterReducer from "@/features/salt-master/store/saltMasterSlice";
import bankMasterReducer from "@/features/bank-master/store/bankMasterSlice";

import marketplaceStoreReducer from "@/features/marketplace/stores/store/marketplaceStoreSlice";
import marketplaceProductReducer from "@/features/marketplace/products/store/marketplaceProductSlice";

// Operations
import shiftReducer from "@/features/operations/shifts/store/shiftSlice";
import dayClosingReducer from "@/features/operations/day-closings/store/dayClosingSlice";

// ---------------------
// App Reducer
// ---------------------

const appReducer = combineReducers({
  // Core
  auth: authReducer,
  user: userReducer,

  // Organization
  workspace: workspaceReducer,
  company: companyReducer,
  branch: branchReducer,

  // Access Control
  accessControl: accessControlReducer,

  // Parties
  customer: customerReducer,
  supplier: supplierReducer,

  // Finance
  accountGroup: accountGroupReducer,
  account: accountReducer,
  openingBalance: openingBalanceReducer,
  accountBalance: accountBalanceReducer,
  financialPeriod: financialPeriodReducer,
  ledger: ledgerReducer,
  journalVoucher: journalVoucherReducer,
  reports: reportsReducer,

  // Treasury
  bankAccount: bankAccountReducer,
  bankTransaction: bankTransactionReducer,
  bankSlip: bankSlipReducer,

  cashAccount: cashAccountReducer,
  cashTransaction: cashTransactionReducer,
  cashDenomination: cashDenominationReducer,

  fundTransfer: fundTransferReducer,
  paymentQr: paymentQrReducer,
  cheque: chequeReducer,

  // Subscription
  plan: planReducer,
  subscription: subscriptionReducer,

  // Catalog
  workspaceProduct: workspaceProductReducer,
  globalProduct: globalProductReducer,
  hsnMaster: hsnMasterReducer,
  manufacturerMaster: manufacturerMasterReducer,
  uomMaster: uomMasterReducer,
  categoryMaster: categoryMasterReducer,
  productFormMaster: productFormMasterReducer,
  saltMaster: saltMasterReducer,
  bankMaster: bankMasterReducer,

  // Marketplace
  marketplaceStore: marketplaceStoreReducer,
  marketplaceProduct: marketplaceProductReducer,

  // Operations
  shift: shiftReducer,
  dayClosing: dayClosingReducer,
});

/**
 * Root Reducer Wrapper
 *
 * Intercepts global actions.
 * When logout succeeds,
 * resetting state to undefined
 * causes every slice to return
 * to its initial state.
 */
const rootReducer = (state, action) => {
  if (action.type === "auth/logout/fulfilled") {
    state = undefined;
  }

  if (action.type === "APP/RESET_STATE") {
    // Keep core states: auth, user, workspace, company, branch
    state = {
      auth: state?.auth,
      user: state?.user,
      workspace: state?.workspace,
      company: state?.company,
      branch: state?.branch,
    };
  }

  return appReducer(state, action);
};

export default rootReducer;
