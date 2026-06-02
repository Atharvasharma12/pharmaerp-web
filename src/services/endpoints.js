// src/services/endpoints.js

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
    PROFILE: "/core/users/profile",

    UPDATE_PROFILE: "/core/users/profile",

    UPDATE_AVATAR: "/core/users/avatar",
    DELETE_AVATAR: "/core/users/avatar",

    DEACTIVATE_ACCOUNT: "/core/users/deactivate",
  },

  WORKSPACE: {
    CREATE: "/organization/workspaces",

    LIST: "/organization/workspaces",

    BY_ID: (workspaceId) => `/organization/workspaces/${workspaceId}`,

    MEMBERS: (workspaceId) => `/organization/workspaces/${workspaceId}/members`,

    MEMBER_STATUS: (workspaceId, memberUserId) =>
      `/organization/workspaces/${workspaceId}/members/${memberUserId}/status`,

    MEMBER_BY_USER_ID: (workspaceId, memberUserId) =>
      `/organization/workspaces/${workspaceId}/members/${memberUserId}`,
  },

  COMPANY: {
    CREATE: "/organization/companies",

    LIST: "/organization/companies",

    BY_ID: (companyId) => `/organization/companies/${companyId}`,
  },

  BRANCH: {
    CREATE: "/organization/branches",

    LIST: "/organization/branches",

    BY_ID: (branchId) => `/organization/branches/${branchId}`,
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
