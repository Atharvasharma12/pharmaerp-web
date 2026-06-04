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
