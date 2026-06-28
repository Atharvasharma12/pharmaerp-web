export const ROUTES = {
  HOME: "/",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Onboarding
  CREATE_WORKSPACE: "/onboarding/create-workspace",
  CHOOSE_PLAN: "/onboarding/choose-plan",
  TRIAL_ACTIVATED: "/onboarding/trial-activated",
  SUBSCRIPTION_SUCCESS: "/onboarding/subscription-success",

  // Workspace
  WORKSPACE: "/workspace",
  EDIT_WORKSPACE: "/workspace/edit",
  WORKSPACE_DETAILS: "/workspace/details",
  WORKSPACE_MEMBERS: "/workspace/members",
  WORKSPACE_INVITATIONS: "/workspace/invitations",
  INVITE_WORKSPACE_MEMBER: "/workspace/members/invite",

  // Company
  COMPANIES: "/companies",
  CREATE_COMPANY: "/companies/create",
  EDIT_COMPANY: "/companies/:companyId/edit",
  COMPANY_DETAILS: "/companies/:companyId",
  COMPANY_SETTINGS: "/companies/:companyId/settings",

  // Branch
  BRANCHES: "/branches",
  CREATE_BRANCH: "/branches/create",
  EDIT_BRANCH: "/branches/:branchId/edit",
  BRANCH_DETAILS: "/branches/:branchId",
  BRANCH_SETTINGS: "/branches/:branchId/settings",

  // Access Control
  ACCESS_CONTROL: "/access-control",
  ROLES: "/access-control/roles",
  CREATE_ROLE: "/access-control/roles/create",
  EDIT_ROLE: "/access-control/roles/:roleId/edit",
  ROLE_DETAILS: "/access-control/roles/:roleId",
  MEMBER_ACCESS: "/access-control/member-access",
  ASSIGN_ACCESS: "/access-control/member-access/assign",
  ASSIGN_ROLE: "/access-control/roles/assign",
  EDIT_ACCESS: "/access-control/member-access/:memberId/edit",
  PERMISSIONS: "/access-control/permissions",

  // Parties
  PARTIES: "/parties",

  // Parties - Customers
  CUSTOMERS: "/parties/customers",

  CREATE_CUSTOMER: "/parties/customers/create",

  CUSTOMER_DETAILS: (customerId = ":customerId") =>
    `/parties/customers/${customerId}`,

  EDIT_CUSTOMER: (customerId = ":customerId") =>
    `/parties/customers/${customerId}/edit`,

  // Parties - Suppliers
  SUPPLIERS: "/parties/suppliers",

  CREATE_SUPPLIER: "/parties/suppliers/create",

  SUPPLIER_DETAILS: (supplierId = ":supplierId") =>
    `/parties/suppliers/${supplierId}`,

  EDIT_SUPPLIER: (supplierId = ":supplierId") =>
    `/parties/suppliers/${supplierId}/edit`,

  // Finance
  FINANCE: "/finance",

  // Finance - Chart Of Accounts
  CHART_OF_ACCOUNTS: "/finance/chart-of-accounts",

  // Finance - Chart Of Accounts - Account Groups

  ACCOUNT_GROUPS: "/finance/chart-of-accounts/account-groups",

  CREATE_ACCOUNT_GROUP: "/finance/chart-of-accounts/account-groups/create",

  ACCOUNT_GROUP_DETAILS: (groupId = ":groupId") =>
    `/finance/chart-of-accounts/account-groups/${groupId}`,

  EDIT_ACCOUNT_GROUP: (groupId = ":groupId") =>
    `/finance/chart-of-accounts/account-groups/${groupId}/edit`,

  // Finance - Chart Of Accounts - Accounts

  ACCOUNTS: "/finance/chart-of-accounts/accounts",

  CREATE_ACCOUNT: "/finance/chart-of-accounts/accounts/create",

  ACCOUNT_DETAILS: (accountId = ":accountId") =>
    `/finance/chart-of-accounts/accounts/${accountId}`,

  EDIT_ACCOUNT: (accountId = ":accountId") =>
    `/finance/chart-of-accounts/accounts/${accountId}/edit`,

  // Finance - Journal Vouchers

  JOURNAL_VOUCHERS: "/finance/journal-vouchers",

  CREATE_JOURNAL_VOUCHER: "/finance/journal-vouchers/create",

  JOURNAL_VOUCHER_DETAILS: (voucherId = ":voucherId") =>
    `/finance/journal-vouchers/${voucherId}`,

  EDIT_JOURNAL_VOUCHER: (voucherId = ":voucherId") =>
    `/finance/journal-vouchers/${voucherId}/edit`,

  // Treasury
  TREASURY: "/finance/treasury",

  // Finance - Treasury - Bank Accounts

  BANK_ACCOUNTS: "/finance/treasury/bank-accounts",

  CREATE_BANK_ACCOUNT: "/finance/treasury/bank-accounts/create",

  BANK_ACCOUNT_DETAILS: (bankAccountId = ":bankAccountId") =>
    `/finance/treasury/bank-accounts/${bankAccountId}`,

  EDIT_BANK_ACCOUNT: (bankAccountId = ":bankAccountId") =>
    `/finance/treasury/bank-accounts/${bankAccountId}/edit`,

  // Finance - Treasury - Cash Accounts

  CASH_ACCOUNTS: "/finance/treasury/cash-accounts",

  CREATE_CASH_ACCOUNT: "/finance/treasury/cash-accounts/create",

  CASH_ACCOUNT_DETAILS: (cashAccountId = ":cashAccountId") =>
    `/finance/treasury/cash-accounts/${cashAccountId}`,

  EDIT_CASH_ACCOUNT: (cashAccountId = ":cashAccountId") =>
    `/finance/treasury/cash-accounts/${cashAccountId}/edit`,

  // Finance - Treasury - Payment QR

  PAYMENT_QRS: "/finance/treasury/payment-qrs",

  CREATE_PAYMENT_QR: "/finance/treasury/payment-qrs/create",

  PAYMENT_QR_DETAILS: (paymentQrId = ":paymentQrId") =>
    `/finance/treasury/payment-qrs/${paymentQrId}`,

  EDIT_PAYMENT_QR: (paymentQrId = ":paymentQrId") =>
    `/finance/treasury/payment-qrs/${paymentQrId}/edit`,

  // Finance - Treasury - Bank Slips

  BANK_SLIPS: "/finance/treasury/bank-slips",

  CREATE_BANK_SLIP: "/finance/treasury/bank-slips/create",

  BANK_SLIP_DETAILS: (bankSlipId = ":bankSlipId") =>
    `/finance/treasury/bank-slips/${bankSlipId}`,

  // Finance - Treasury - Bank Transactions

  BANK_TRANSACTIONS: "/finance/treasury/bank-transactions",

  CREATE_BANK_TRANSACTION: "/finance/treasury/bank-transactions/create",

  BANK_TRANSACTION_DETAILS: (bankTransactionId = ":bankTransactionId") =>
    `/finance/treasury/bank-transactions/${bankTransactionId}`,

  // Finance - Treasury - Cash Transactions

  CASH_TRANSACTIONS: "/finance/treasury/cash-transactions",

  CREATE_CASH_TRANSACTION: "/finance/treasury/cash-transactions/create",

  CASH_TRANSACTION_DETAILS: (cashTransactionId = ":cashTransactionId") =>
    `/finance/treasury/cash-transactions/${cashTransactionId}`,

  // Catalog
  CATALOG: "/catalog",

  // Catalog - Global Products
  GLOBAL_PRODUCTS: "/catalog/global-products",
  GLOBAL_PRODUCT_DETAILS: "/catalog/global-products/:productId",

  // Catalog - Workspace Products
  WORKSPACE_PRODUCTS: "/workspace-products",
  CREATE_WORKSPACE_PRODUCT: "/workspace-products/create",
  EDIT_WORKSPACE_PRODUCT: "/workspace-products/:productId/edit",
  WORKSPACE_PRODUCT_DETAILS: "/workspace-products/:productId",
  WORKSPACE_PRODUCT_IMPORT: "/workspace-products/import",
  WORKSPACE_PRODUCT_SEARCH: "/workspace-products/search",

  // Catalog - HSN Master (Read-Only Workspace View)
  HSN_MASTER: "/catalog/hsn-master",

  // Catalog - Manufacturer Master
  MANUFACTURER_MASTER: "/catalog/manufacturer-master",

  // Catalog - UOM Master
  UOM_MASTER: "/catalog/uom-master",

  // Catalog - Category Master
  CATEGORY_MASTER: "/catalog/category-master",

  // Catalog - Product Form Master
  PRODUCT_FORM_MASTER: "/catalog/product-form-master",

  // Catalog - Salt Master
  SALT_MASTER: "/catalog/salt-master",

  BANK_MASTER: "/catalog/bank-master",

  // Setup
  SETUP_CENTER: "/setup",

  // Dashboard
  DASHBOARD: "/dashboard",

  // User Profile
  PROFILE: "/me",

  // Settings
  SETTINGS: "/settings",

  // Management
  USERS: "/users",

  // Welcome
  WELCOME: "/welcome",

  // Fallback
  NOT_FOUND: "*",
};
