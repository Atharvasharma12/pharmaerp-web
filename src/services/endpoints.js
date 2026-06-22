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
  },

  SUBSCRIPTION: {
    PURCHASE: "/subscription/subscriptions/purchase",

    TRIAL: "/subscription/subscriptions/trial",

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
