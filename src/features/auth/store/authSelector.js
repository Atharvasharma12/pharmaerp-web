// src/features/auth/store/authSelector.js

export const selectAuth = (state) => state.auth;

export const selectAuthUser = (state) => state.auth.user;

export const selectAuthToken = (state) => state.auth.token;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthStatus = (state) => state.auth.status;

export const selectAuthError = (state) => state.auth.error;

export const selectAuthMessage = (state) => state.auth.message;

export const selectForgotPasswordStatus = (state) =>
  state.auth.forgotPasswordStatus;

export const selectResetPasswordStatus = (state) =>
  state.auth.resetPasswordStatus;

export const selectChangePasswordStatus = (state) =>
  state.auth.changePasswordStatus;
