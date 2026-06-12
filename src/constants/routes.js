// src/constants/routes.js

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

  // Fallback
  NOT_FOUND: "*",

  // Welcome
  WELCOME: "/welcome",
};
