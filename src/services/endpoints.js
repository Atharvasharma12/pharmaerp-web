export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/core/auth/register",
    LOGIN: "/core/auth/login",
    LOGOUT: "/core/auth/logout",

    FORGOT_PASSWORD: "/core/auth/forgot-password",
    RESET_PASSWORD: "/core/auth/reset-password",
    CHANGE_PASSWORD: "/core/auth/change-password",

    SEND_EMAIL_OTP: "/core/auth/send-email-otp",
    VERIFY_EMAIL_OTP: "/core/auth/verify-email-otp",
  },

  USER: {
    PROFILE: "/core/users/me",

    UPDATE_PROFILE: "/core/users/me",

    UPDATE_AVATAR: "/core/users/me/avatar",
    DELETE_AVATAR: "/core/users/me/avatar",

    ACTIVE_CONTEXT: "/core/users/me/active-context",

    DEACTIVATE_ACCOUNT: "/core/users/me",
  },

  WORKSPACE: {
    CREATE: "/organization/workspaces",

    LIST: "/organization/workspaces",

    BY_ID: (workspaceId) => `/organization/workspaces/${workspaceId}`,

    // Members
    MEMBERS: (workspaceId) => `/organization/workspaces/${workspaceId}/members`,

    MEMBER_STATUS: (workspaceId, memberUserId) =>
      `/organization/workspaces/${workspaceId}/members/${memberUserId}/status`,

    MEMBER_BY_USER_ID: (workspaceId, memberUserId) =>
      `/organization/workspaces/${workspaceId}/members/${memberUserId}`,

    // Invitations
    INVITATIONS: (workspaceId) =>
      `/organization/workspaces/${workspaceId}/invitations`,

    CANCEL_INVITATION: (workspaceId, invitationId) =>
      `/organization/workspaces/${workspaceId}/invitations/${invitationId}/cancel`,

    ACCEPT_INVITATION: (token) =>
      `/organization/workspaces/invitations/${token}/accept`,

    // --- NEW USER PROFILE INCOMING INVITATIONS ENDPOINT MAP ---
    USER_INBOX_INVITATIONS: "/organization/workspaces/user-inbox/invitations",
  },

  COMPANY: {
    CREATE: "/organization/companies",

    LIST: "/organization/companies",

    BY_ID: (companyId) => `/organization/companies/${companyId}`,
  },

  BRANCH: {
    CREATE: "/organization/branches",

    LIST: "/organization/branches",

    WORKSPACE_LIST: "/organization/branches/workspace/all",

    BY_ID: (branchId) => `/organization/branches/${branchId}`,
  },

  CUSTOMER: {
    CREATE: "/parties/customers",

    LIST: "/parties/customers",

    BY_ID: (customerId) => `/parties/customers/${customerId}`,

    LEDGER: (customerId) => `/parties/customers/${customerId}/ledger`,

    OUTSTANDING: (customerId) => `/parties/customers/${customerId}/outstanding`,

    SALES: (customerId) => `/parties/customers/${customerId}/sales`,

    PAYMENTS: (customerId) => `/parties/customers/${customerId}/payments`,
  },

  SUPPLIER: {
    CREATE: "/parties/suppliers",

    LIST: "/parties/suppliers",

    BY_ID: (supplierId) => `/parties/suppliers/${supplierId}`,

    LEDGER: (supplierId) => `/parties/suppliers/${supplierId}/ledger`,

    OUTSTANDING: (supplierId) => `/parties/suppliers/${supplierId}/outstanding`,

    PURCHASES: (supplierId) => `/parties/suppliers/${supplierId}/purchases`,

    PAYMENTS: (supplierId) => `/parties/suppliers/${supplierId}/payments`,
  },

  ACCOUNT_GROUP: {
    CREATE: "/finance/chart-of-accounts/account-groups",

    LIST: "/finance/chart-of-accounts/account-groups",

    BY_ID: (accountGroupId) =>
      `/finance/chart-of-accounts/account-groups/${accountGroupId}`,
  },

  ACCOUNT: {
    CREATE: "/finance/chart-of-accounts/accounts",

    LIST: "/finance/chart-of-accounts/accounts",

    BY_ID: (accountId) => `/finance/chart-of-accounts/accounts/${accountId}`,
  },

  OPENING_BALANCE: {
    ACCOUNT: "/finance/opening-balances/account",

    CUSTOMER: "/finance/opening-balances/customer",

    SUPPLIER: "/finance/opening-balances/supplier",

    BANK_ACCOUNT: "/finance/opening-balances/bank-account",

    CASH_ACCOUNT: "/finance/opening-balances/cash-account",
  },

  ACCOUNT_BALANCE: {
    LIST: "/finance/account-balances",

    BY_ACCOUNT_ID: (accountId) => `/finance/account-balances/${accountId}`,

    RECALCULATE: (accountId) =>
      `/finance/account-balances/${accountId}/recalculate`,
  },

  FINANCIAL_PERIOD: {
    CREATE: "/finance/financial-periods",

    LIST: "/finance/financial-periods",

    CURRENT: "/finance/financial-periods/current",

    UPDATE_STATUS: (periodId) =>
      `/finance/financial-periods/${periodId}/status`,
  },

  LEDGER: {
    LIST: "/finance/ledger",

    RECALCULATE: "/finance/ledger/recalculate",
  },

  REPORTS: {
    TRIAL_BALANCE: "/finance/reports/trial-balance",
    GENERAL_LEDGER: "/finance/reports/general-ledger",
    CUSTOMER_LEDGER: "/finance/reports/customer-ledger",
    SUPPLIER_LEDGER: "/finance/reports/supplier-ledger",
    CASH_BOOK: "/finance/reports/cash-book",
    BANK_BOOK: "/finance/reports/bank-book",
    PROFIT_LOSS: "/finance/reports/profit-loss",
    BALANCE_SHEET: "/finance/reports/balance-sheet",
    GST_REPORT: "/finance/reports/gst-report",
  },

  JOURNAL_VOUCHER: {
    CREATE: "/finance/journal-vouchers",

    LIST: "/finance/journal-vouchers",

    BY_ID: (voucherId) => `/finance/journal-vouchers/${voucherId}`,

    POST: (voucherId) => `/finance/journal-vouchers/${voucherId}/post`,

    CANCEL: (voucherId) => `/finance/journal-vouchers/${voucherId}/cancel`,

    SUBMIT_APPROVAL: (voucherId) =>
      `/finance/journal-vouchers/${voucherId}/submit-approval`,

    APPROVE: (voucherId) => `/finance/journal-vouchers/${voucherId}/approve`,

    REVERSE: (voucherId) => `/finance/journal-vouchers/${voucherId}/reverse`,
  },

  BANK_ACCOUNT: {
    CREATE: "/finance/treasury/bank-accounts",

    LIST: "/finance/treasury/bank-accounts",

    BY_ID: (bankAccountId) =>
      `/finance/treasury/bank-accounts/${bankAccountId}`,

    SET_PRIMARY: (bankAccountId) =>
      `/finance/treasury/bank-accounts/${bankAccountId}/set-primary`,
  },

  BANK_TRANSACTION: {
    CREATE: "/finance/treasury/bank-transactions",

    LIST: "/finance/treasury/bank-transactions",

    BY_ID: (bankTransactionId) =>
      `/finance/treasury/bank-transactions/${bankTransactionId}`,

    CANCEL: (bankTransactionId) =>
      `/finance/treasury/bank-transactions/${bankTransactionId}/cancel`,
  },

  BANK_SLIP: {
    CREATE: "/finance/treasury/bank-slips",

    LIST: "/finance/treasury/bank-slips",

    BY_ID: (bankSlipId) => `/finance/treasury/bank-slips/${bankSlipId}`,

    SUBMIT: (bankSlipId) => `/finance/treasury/bank-slips/${bankSlipId}/submit`,

    CONFIRM: (bankSlipId) =>
      `/finance/treasury/bank-slips/${bankSlipId}/confirm`,

    REJECT: (bankSlipId) => `/finance/treasury/bank-slips/${bankSlipId}/reject`,

    CANCEL: (bankSlipId) => `/finance/treasury/bank-slips/${bankSlipId}/cancel`,
  },

  CASH_ACCOUNT: {
    CREATE: "/finance/treasury/cash-accounts",

    LIST: "/finance/treasury/cash-accounts",

    BY_ID: (cashAccountId) =>
      `/finance/treasury/cash-accounts/${cashAccountId}`,

    SET_PRIMARY: (cashAccountId) =>
      `/finance/treasury/cash-accounts/${cashAccountId}/set-primary`,
  },

  CASH_TRANSACTION: {
    CREATE: "/finance/treasury/cash-transactions",

    LIST: "/finance/treasury/cash-transactions",

    BY_ID: (cashTransactionId) =>
      `/finance/treasury/cash-transactions/${cashTransactionId}`,

    CANCEL: (cashTransactionId) =>
      `/finance/treasury/cash-transactions/${cashTransactionId}/cancel`,
  },

  CASH_DENOMINATION: {
    CREATE: "/finance/treasury/cash-denominations",

    LIST: "/finance/treasury/cash-denominations",

    BY_ID: (cashDenominationId) =>
      `/finance/treasury/cash-denominations/${cashDenominationId}`,

    CONFIRM: (cashDenominationId) =>
      `/finance/treasury/cash-denominations/${cashDenominationId}/confirm`,

    CANCEL: (cashDenominationId) =>
      `/finance/treasury/cash-denominations/${cashDenominationId}/cancel`,
  },

  FUND_TRANSFER: {
    CREATE: "/finance/treasury/fund-transfers",

    LIST: "/finance/treasury/fund-transfers",

    BY_ID: (fundTransferId) =>
      `/finance/treasury/fund-transfers/${fundTransferId}`,

    CANCEL: (fundTransferId) =>
      `/finance/treasury/fund-transfers/${fundTransferId}/cancel`,
  },

  PAYMENT_QR: {
    CREATE: "/finance/treasury/payment-qr",

    LIST: "/finance/treasury/payment-qr",

    BY_ID: (paymentQrId) => `/finance/treasury/payment-qr/${paymentQrId}`,

    SET_PRIMARY: (paymentQrId) =>
      `/finance/treasury/payment-qr/${paymentQrId}/set-primary`,
  },

  CHEQUE: {
    CREATE: "/finance/treasury/cheques",

    LIST: "/finance/treasury/cheques",

    BY_ID: (chequeId) => `/finance/treasury/cheques/${chequeId}`,

    DEPOSIT: (chequeId) => `/finance/treasury/cheques/${chequeId}/deposit`,

    CLEAR: (chequeId) => `/finance/treasury/cheques/${chequeId}/clear`,

    BOUNCE: (chequeId) => `/finance/treasury/cheques/${chequeId}/bounce`,

    CANCEL: (chequeId) => `/finance/treasury/cheques/${chequeId}/cancel`,
  },

  WORKSPACE_PRODUCTS: {
    // Search before creating a workspace product
    SEARCH_BEFORE_CREATE: "/catalog/products/search",

    // Create product
    CREATE: "/catalog/products",

    // List products
    LIST: "/catalog/products",

    // Get product by id
    BY_ID: (productId) => `/catalog/products/${productId}`,

    // Get product by code
    BY_CODE: (productCode) => `/catalog/products/code/${productCode}`,
  },

  GLOBAL_PRODUCTS: {
    LIST: "/catalog/global-products",

    BY_ID: (productId) => `/catalog/global-products/${productId}`,

    BY_CODE: (productCode) => `/catalog/global-products/code/${productCode}`,
  },

  HSN_MASTER: {
    LIST: "/catalog/hsn-master",

    BY_ID: (hsnId) => `/catalog/hsn-master/${hsnId}`,

    BY_CODE: (hsnCode) => `/catalog/hsn-master/code/${hsnCode}`,
  },

  MANUFACTURER_MASTER: {
    LIST: "/catalog/manufacturer-master",

    BY_ID: (manufacturerId) => `/catalog/manufacturer-master/${manufacturerId}`,

    BY_NAME: (name) =>
      `/catalog/manufacturer-master/name/${encodeURIComponent(name)}`,
  },

  UOM_MASTER: {
    LIST: "/catalog/uom-master",

    BY_ID: (uomId) => `/catalog/uom-master/${uomId}`,
  },

  CATEGORY_MASTER: {
    LIST: "/catalog/category-master",

    BY_ID: (categoryId) => `/catalog/category-master/${categoryId}`,

    BY_SLUG: (slug) =>
      `/catalog/category-master/slug/${encodeURIComponent(slug)}`,
  },

  PRODUCT_FORM_MASTER: {
    LIST: "/catalog/product-form-master",

    BY_ID: (formId) => `/catalog/product-form-master/${formId}`,
  },

  SALT_MASTER: {
    LIST: "/catalog/salt-master",

    BY_ID: (saltId) => `/catalog/salt-master/${saltId}`,

    BY_NAME: (name) => `/catalog/salt-master/name/${encodeURIComponent(name)}`,
  },

  BANK_MASTER: {
    LIST: "/catalog/bank-master",

    BY_ID: (bankId) => `/catalog/bank-master/${bankId}`,

    BY_NAME: (name) => `/catalog/bank-master/name/${encodeURIComponent(name)}`,
  },

  ACCESS_CONTROL: {
    // Permissions
    PERMISSIONS: "/core/access-control/permissions",

    // Roles
    ROLES: "/core/access-control/roles",

    ROLE_BY_ID: (roleId) => `/core/access-control/roles/${roleId}`,

    ASSIGN_ROLE_TO_MEMBER: (memberUserId) =>
      `/core/access-control/members/${memberUserId}/role`,

    // Member Access
    MEMBER_ACCESS: "/core/access-control/member-access",

    MEMBER_ACCESS_BY_USER_ID: (memberUserId) =>
      `/core/access-control/member-access/${memberUserId}`,

    // Access Checks
    CHECK_COMPANY: (companyId) =>
      `/core/access-control/check/company/${companyId}`,

    CHECK_BRANCH: (branchId) => `/core/access-control/check/branch/${branchId}`,
  },

  PLAN: {
    LIST: "/subscription/plans",
    ACTIVE: "/subscription/plans/active",
    BY_ID: (planId) => `/subscription/plans/${planId}`,

    // Admin write endpoints
    CREATE: "/subscription/plans",
    UPDATE: (planId) => `/subscription/plans/${planId}`,
    ARCHIVE: (planId) => `/subscription/plans/${planId}/archive`,
    RESTORE: (planId) => `/subscription/plans/${planId}/restore`,
    DELETE: (planId) => `/subscription/plans/${planId}`,
  },

  SUBSCRIPTION: {
    RENEW: "/subscription/subscriptions/renew",
    UPGRADE: "/subscription/subscriptions/upgrade",
    DOWNGRADE: "/subscription/subscriptions/downgrade",
    CHANGE_SEATS: "/subscription/subscriptions/change-seats",
    CANCEL: "/subscription/subscriptions/cancel",

    BY_ID: (subscriptionId) => `/subscription/subscriptions/${subscriptionId}`,

    WORKSPACE_CURRENT: (workspaceId) =>
      `/subscription/subscriptions/workspace/${workspaceId}/current`,

    WORKSPACE_HISTORY: (workspaceId) =>
      `/subscription/subscriptions/workspace/${workspaceId}/history`,

    SYNC_SEATS: (workspaceId) =>
      `/subscription/subscriptions/workspace/${workspaceId}/sync-seats`,

    CHECK_SEATS: (workspaceId) =>
      `/subscription/subscriptions/workspace/${workspaceId}/check-seats`,
  },
};

export default ENDPOINTS;
