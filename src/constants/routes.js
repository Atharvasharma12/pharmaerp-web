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

  // Dashboard
  DASHBOARD: "/dashboard",

  // User
  PROFILE: "/profile",

  // Settings
  SETTINGS: "/settings",

  // Management
  USERS: "/users",

  // Fallback
  NOT_FOUND: "*",

  // Welcome
  WELCOME: "/welcome",
};
